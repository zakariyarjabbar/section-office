import { pageMetadata } from "@/lib/metadata";
import { PageIntro, TextLink } from "@/components/editorial";
export const metadata = pageMetadata(
  "Privacy",
  "How this local portfolio demonstration stores saved projects, drafts and demo inquiries in your browser.",
  "/privacy/",
  "fallback",
);
export default function Privacy() {
  return (
    <div className="wrap">
      <PageIntro
        title="Your browser. Your data."
        description="A small demonstration with a deliberately simple approach to privacy."
      />
      <div className="privacy-copy">
        <h2>What stays in this browser</h2>
        <p>
          Saved project IDs, your preferred index view, draft briefs, submitted
          demo briefs, contact inquiries, local review statuses and notes are
          stored under the SECTION OFFICE localStorage key. Use the sample data
          if you would rather not enter personal information. Please do not
          enter sensitive site documents, passwords or payment details.
        </p>
        <h2>What is sent</h2>
        <p>
          Forms send no email and make no external submission. There is no
          account, database, tracking or analytics code. The static host still
          receives ordinary requests for pages and assets and may retain its own
          access logs under its hosting policy.
        </p>
        <h2>Who can see local records</h2>
        <p>
          Anyone using this browser profile on this site can open the local
          brief list and demo inbox. The inbox is a public interface
          demonstration, not an authenticated admin area. Browser storage is
          user-editable and is not a security boundary.
        </p>
        <h2>How long records remain</h2>
        <p>
          Records remain until you delete them, reset this demo or clear the
          browser’s site data. They do not follow you to another browser, device
          or site origin. Tabs in the same profile and origin can reflect local
          changes; there is no multi-user synchronization.
        </p>
        <h2>Removal and temporary use</h2>
        <p>
          You can remove individual projects, drafts and submissions. The demo
          page can reset this site’s data after confirmation. If storage is
          unavailable, an explicit temporary-session option keeps changes only
          until refresh or close.
        </p>
        <TextLink href="/demo/">Manage demo data</TextLink>
        <h2>Sharing links</h2>
        <p>
          Project links are public page addresses. Sharing a saved-project or
          local-brief page address does not transfer your selections or records
          to someone else. Personal fields are kept out of URLs and social
          metadata.
        </p>
      </div>
    </div>
  );
}
