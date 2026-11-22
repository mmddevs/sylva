import { notFound } from "next/navigation";
import { BreakUi } from "./break-ui";

/* Outil de dev uniquement : 404 en production. */
export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <BreakUi />;
}
