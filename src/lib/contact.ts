import { CONTACT } from "@/lib/site";

export type ContactField = "name" | "email" | "subject" | "message";
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors; values: ContactValues }
  | { status: "error"; values: ContactValues }
  | { status: "success"; id: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Même validation côté client (au blur / à l'envoi) et côté serveur. */
export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  const E = CONTACT.errors;
  const name = v.name.trim();
  const email = v.email.trim();
  const message = v.message.trim();
  if (!name) e.name = E.nameRequired;
  else if (name.length > 80) e.name = E.nameLong;
  if (!email) e.email = E.emailRequired;
  else if (!EMAIL.test(email)) e.email = E.emailInvalid;
  if (message.length < 20) e.message = E.messageShort;
  else if (message.length > 2000) e.message = E.messageLong;
  return e;
}

export function readContact(form: FormData): ContactValues {
  const get = (k: string) => String(form.get(k) ?? "");
  return { name: get("name"), email: get("email"), subject: get("subject"), message: get("message") };
}
