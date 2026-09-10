import { pageMetadata } from "@/lib/metadata";
import { PageIntro, TextLink } from "@/components/editorial";
import { ContactForm } from "@/components/contact-form";
export const metadata = pageMetadata(
  "Contact",
  "A place to begin a conversation about space. Explore the local demonstration inquiry form.",
  "/contact/",
  "fallback",
);
export default function Contact() {
  return (
    <div className="wrap utility-page">
      <PageIntro
        title="Let’s begin with an idea."
        description="A new space, an existing building, a question worth exploring. Tell us where you would like to start."
      />
      <div className="contact-layout">
        <aside className="contact-info">
          <div>
            <h2>Start a conversation</h2>
            <p>
              For a more considered starting point, our brief builder takes you
              through context, priorities and references.
            </p>
            <TextLink href="/start-a-project/">Shape a project brief</TextLink>
          </div>
          <div>
            <p className="example-email">hello@section-office.example</p>
            <p className="small muted">
              Illustrative contact only. SECTION OFFICE is a fictional portfolio
              concept. Use this in-page demo to explore an inquiry.
            </p>
          </div>
        </aside>
        <ContactForm />
      </div>
    </div>
  );
}
