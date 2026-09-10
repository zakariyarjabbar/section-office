import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/editorial";
import { Inbox } from "@/components/inbox";
export const metadata = pageMetadata(
  "Local studio inbox",
  "An openly accessible browser-only demonstration of inquiry review, statuses and local notes. No account or real messages.",
  "/demo/inbox/",
  "fallback",
);
export default function InboxPage() {
  return (
    <div className="wrap utility-page">
      <PageIntro
        title="On the studio table."
        description="A public demonstration of local inquiry review. These records exist in this browser only. This is not a protected admin system."
      />
      <Inbox />
    </div>
  );
}
