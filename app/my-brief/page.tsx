import { Suspense } from "react";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/editorial";
import { BriefRecords } from "@/components/brief-records";
export const metadata = pageMetadata(
  "My brief",
  "Review local drafts and submitted demo briefs, or download a text summary from this browser.",
  "/my-brief/",
  "fallback",
);
export default function MyBrief() {
  return (
    <div className="wrap utility-page">
      <PageIntro
        title="Ideas, taking shape."
        description="Your saved drafts and demo briefs. Return to a thought, review your starting points, or keep a copy."
      />
      <Suspense fallback={<p>Opening your local records…</p>}>
        <BriefRecords />
      </Suspense>
    </div>
  );
}
