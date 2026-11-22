"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendContact } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactState,
  type ContactValues,
} from "@/lib/contact";
import { CONTACT } from "@/lib/site";
import { cn } from "@/lib/utils";

const F = CONTACT.form;
const EMPTY: ContactValues = { name: "", email: "", subject: F.subject.options[0].value, message: "" };

const fieldClass = cn(
  "w-full rounded-lg border border-input bg-card px-4 text-base text-foreground",
  "placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-(--duration-ui) ease-out",
  "hover:border-foreground/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15",
);

function Field({
  id,
  label,
  error,
  children,
}: {
  id: ContactField;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-start gap-1.5 text-sm text-destructive"
          >
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = React.useActionState<ContactState, FormData>(sendContact, {
    status: "idle",
  });
  const [values, setValues] = React.useState<ContactValues>(EMPTY);
  const [clientErrors, setClientErrors] = React.useState<ContactErrors>({});
  const [touched, setTouched] = React.useState<Partial<Record<ContactField, boolean>>>({});
  const [dismissed, setDismissed] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const reduce = useReducedMotion();

  // Les erreurs serveur s'affichent tant que l'utilisateur n'a pas retouché le champ.
  const serverErrors = state.status === "invalid" ? state.errors : {};
  const errors: ContactErrors = { ...serverErrors, ...clientErrors };

  const lastToast = React.useRef<ContactState | null>(null);
  React.useEffect(() => {
    if (state === lastToast.current) return;
    lastToast.current = state;
    if (state.status === "success" && state.id !== "ignored") {
      toast.success(F.successTitle, { description: F.successText });
    }
    if (state.status === "error") toast.error(F.serverError);
  }, [state]);

  const update = (field: ContactField, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field] || errors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: validateContact(next)[field] }));
    }
  };

  const blur = (field: ContactField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setClientErrors((prev) => ({ ...prev, [field]: validateContact(values)[field] }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const found = validateContact(values);
    setClientErrors(found);
    setTouched({ name: true, email: true, message: true });
    const first = (Object.keys(found) as ContactField[])[0];
    if (first) {
      e.preventDefault();
      formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
    }
  };

  const success = state.status === "success" && dismissed !== state.id;

  const describe = (id: ContactField) => (errors[id] ? `${id}-error` : undefined);
  const swap = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
      };

  return (
    <div className="relative">
      <AnimatePresence mode="popLayout" initial={false}>
        {success ? (
          <motion.div
            key="success"
            {...swap}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-start gap-5 rounded-lg border border-border bg-card p-8"
            role="status"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check aria-hidden className="size-5" />
            </span>
            <div>
              <p className="font-heading text-3xl tracking-tight">{F.successTitle}</p>
              <p className="mt-2 text-muted-foreground">{F.successText}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (state.status === "success") setDismissed(state.id);
                setValues(EMPTY);
                setTouched({});
                setClientErrors({});
              }}
            >
              {F.again}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            {...swap}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            action={action}
            onSubmit={onSubmit}
            noValidate
            aria-busy={pending}
            className="grid gap-6 rounded-lg border border-border bg-card p-6 sm:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="name" label={F.name.label} error={errors.name}>
                <input
                  id="name"
                  name="name"
                  autoComplete={F.name.autoComplete}
                  placeholder={F.name.placeholder}
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => blur("name")}
                  aria-invalid={!!errors.name || undefined}
                  aria-describedby={describe("name")}
                  maxLength={120}
                  className={cn(fieldClass, "h-12")}
                />
              </Field>
              <Field id="email" label={F.email.label} error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete={F.email.autoComplete}
                  placeholder={F.email.placeholder}
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => blur("email")}
                  aria-invalid={!!errors.email || undefined}
                  aria-describedby={describe("email")}
                  className={cn(fieldClass, "h-12")}
                />
              </Field>
            </div>
            <Field id="subject" label={F.subject.label}>
              <select
                id="subject"
                name="subject"
                value={values.subject}
                onChange={(e) => update("subject", e.target.value)}
                className={cn(fieldClass, "h-12 appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10")}
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)",
                  backgroundPosition: "calc(100% - 1.25rem) 50%, calc(100% - 0.95rem) 50%",
                  backgroundSize: "0.3rem 0.3rem, 0.3rem 0.3rem",
                }}
              >
                {F.subject.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="message" label={F.message.label} error={errors.message}>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder={F.message.placeholder}
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                onBlur={() => blur("message")}
                aria-invalid={!!errors.message || undefined}
                aria-describedby={describe("message")}
                maxLength={2100}
                className={cn(fieldClass, "min-h-36 resize-y py-3")}
              />
            </Field>
            {/* Piège à robots : hors écran, hors tabulation. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Site web</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            {state.status === "error" && (
              <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
                {F.serverError}
              </p>
            )}

            <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {CONTACT.emailLabel}{" "}
                <a href={`mailto:${CONTACT.email}`} className="text-foreground underline decoration-border underline-offset-4 transition-colors duration-(--duration-ui) hover:decoration-foreground">
                  {CONTACT.email}
                </a>
              </p>
              <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
                {pending ? (
                  <>
                    <Loader2 aria-hidden className="animate-spin motion-reduce:animate-none" />
                    {F.sending}
                  </>
                ) : (
                  <>
                    {F.submit}
                    <ArrowRight aria-hidden data-icon="inline-end" />
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
