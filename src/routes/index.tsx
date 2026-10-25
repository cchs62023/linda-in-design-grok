import { createFileRoute } from "@tanstack/react-router";
import { Dossier } from "@/components/dossier";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Dossier />;
}
