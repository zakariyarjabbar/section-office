import Link from "next/link";
import { Icon } from "@/components/icons";
export default function NotFound() {
  return (
    <div className="wrap not-found">
      <p className="mono">404 / OUTSIDE THE PLAN</p>
      <h1>This space isn’t here.</h1>
      <p>
        The page may have moved, or the address may be incomplete. There is
        still plenty to explore.
      </p>
      <Link className="button" href="/work/">
        Explore the work <Icon name="arrow" />
      </Link>
      <Link className="button button-outline" href="/">
        Back to the beginning
      </Link>
    </div>
  );
}
