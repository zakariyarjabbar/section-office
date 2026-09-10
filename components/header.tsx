"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Icon } from "./icons";
const links = [
  ["Work", "/work/"],
  ["Studio", "/studio/"],
  ["Process", "/process/"],
  ["Journal", "/journal/"],
];
export function Header() {
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  function close() {
    dialog.current?.close();
    setOpen(false);
    opener.current?.focus();
  }
  return (
    <header className="header">
      <Link className="wordmark" href="/" aria-label="SECTION OFFICE home">
        SECTION <span>/</span> OFFICE
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([text, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={
              path.startsWith(href.slice(0, -1)) ? "page" : undefined
            }
          >
            {text}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <Link className="saved-nav" href="/saved/" aria-label="Saved projects">
          <Icon name="bookmark" />
        </Link>
        <Link className="header-cta" href="/start-a-project/">
          Start a project <Icon name="diagonal" />
        </Link>
        <button
          ref={opener}
          className="mobile-menu icon-button"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => {
            dialog.current?.showModal();
            setOpen(true);
          }}
        >
          <Icon name="menu" />
        </button>
      </div>
      <dialog ref={dialog} className="nav-dialog" onCancel={close}>
        <div className="nav-dialog-head">
          <span className="wordmark">SECTION / OFFICE</span>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Close navigation"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {[
            ...links,
            ["Saved projects", "/saved/"],
            ["My brief", "/my-brief/"],
            ["Contact", "/contact/"],
            ["Start a project", "/start-a-project/"],
          ].map(([text, href]) => (
            <Link key={href} onClick={close} href={href}>
              {text}
              <Icon name="diagonal" />
            </Link>
          ))}
        </nav>
        <p className="small">Architecture · Interiors · Spatial Research</p>
      </dialog>
    </header>
  );
}
