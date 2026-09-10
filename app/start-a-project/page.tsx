import { Suspense } from "react";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/editorial";
import { BriefBuilder } from "@/components/brief-builder";
export const metadata = pageMetadata(
  "Start a project",
  "Shape a starting brief for a home, interior or shared space. A five-step local demonstration with no email delivery.",
  "/start-a-project/",
  "fallback",
);
export default function StartProject() {
  return (
    <div className="wrap utility-page">
      <PageIntro
        title="Every space starts somewhere."
        description="A few thoughtful questions to give your idea a shape. Begin with what you know; leave room for what you don’t."
      />
      <Suspense fallback={<p>Opening the brief builder…</p>}>
        <BriefBuilder />
      </Suspense>
    </div>
  );
}
