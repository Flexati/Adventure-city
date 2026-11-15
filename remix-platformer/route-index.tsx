import { createFileRoute } from "@tanstack/react-router";
import { ChronosGame } from "@/components/ChronosGame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chronos Adventure: Nox & Lulú — Remix" },
      { name: "description", content: "Platform d'azione a Vanta: due eroi, il potere di rallentare il tempo e Archon da sconfiggere." },
      { property: "og:title", content: "Chronos Adventure: Nox & Lulú — Remix" },
      { property: "og:description", content: "Salta, combatti e piega il tempo con Nox e Lulú." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChronosGame,
});
