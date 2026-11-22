"use server";

import { readContact, validateContact, type ContactState } from "@/lib/contact";

/* Envoi simulé : on valide, on attend comme un vrai service, on répond.
   Aucun e-mail n'est réellement envoyé. Le champ « website » est un piège à
   robots (invisible pour les humains). */
export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = readContact(form);
  const errors = validateContact(values);
  if (Object.keys(errors).length) return { status: "invalid", errors, values };

  await new Promise((r) => setTimeout(r, 900));

  if (String(form.get("website") ?? "")) return { status: "success", id: "ignored" };
  // Démo de l'état d'erreur serveur : un message qui contient « #echec ».
  if (values.message.includes("#echec")) return { status: "error", values };

  return { status: "success", id: crypto.randomUUID() };
}
