"use client";
import { useRef, useState } from "react";
import { ProjectImage } from "@/lib/content";
import { Photo } from "./photo";
import { Icon } from "./icons";
export function Gallery({
  images,
  name,
  start = 0,
  end = images.length,
}: {
  images: ProjectImage[];
  name: string;
  start?: number;
  end?: number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  function open(i: number) {
    restore.current = document.activeElement as HTMLElement;
    setIndex(i);
    setZoom(false);
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
  }
  function close() {
    dialog.current?.close();
    document.body.style.overflow = "";
    setZoom(false);
    restore.current?.focus();
  }
  function move(n: number) {
    setIndex((v) => (v + n + images.length) % images.length);
    setZoom(false);
  }
  return (
    <>
      <div className={`project-gallery count-${end - start}`}>
        {images.slice(start, end).map((im, offset) => {
          const i = offset + start;
          return (
            <figure
              className={`gallery-item gallery-item-${offset}`}
              key={im.src}
            >
              <button
                className="gallery-open image-link"
                onClick={() => open(i)}
                aria-label={`Open image ${i + 1}: ${im.caption}`}
              >
                <Photo
                  image={im}
                  priority={i === 0}
                  sizes={i === 0 ? "100vw" : "(max-width:700px) 100vw, 65vw"}
                />
                <span className="image-open">
                  <Icon name="plus" />
                </span>
              </button>
              <figcaption>
                <span className="mono">{String(i + 1).padStart(2, "0")} /</span>
                <span>{im.caption}</span>
                <span className="image-credit">Generated concept visualization</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${name} image gallery`}
        onCancel={close}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
      >
        <div className="lightbox-top">
          <span>
            {name}{" "}
            <span className="mono">
              / {index + 1} OF {images.length}
            </span>
          </span>
          <div>
            <button
              className="icon-button"
              aria-label={zoom ? "Zoom out" : "Zoom in"}
              aria-pressed={zoom}
              onClick={() => setZoom(!zoom)}
            >
              <Icon name={zoom ? "minus" : "plus"} />
            </button>
            <button
              className="icon-button"
              onClick={close}
              aria-label="Close gallery"
            >
              <Icon name="close" />
            </button>
          </div>
        </div>
        <div
          className={`lightbox-image ${zoom ? "zoomed" : ""}`}
          tabIndex={zoom ? 0 : undefined}
        >
          <img
            src={images[index].src}
            alt={images[index].alt}
            width={images[index].width}
            height={images[index].height}
          />
        </div>
        <div className="lightbox-bottom">
          <button
            className="icon-button"
            onClick={() => move(-1)}
            aria-label="Previous image"
          >
            <Icon name="arrow" style={{ transform: "rotate(180deg)" }} />
          </button>
          <p aria-live="polite">
            {images[index].caption}
            <span>Generated concept visualization</span>
          </p>
          <button
            className="icon-button"
            onClick={() => move(1)}
            aria-label="Next image"
          >
            <Icon name="arrow" />
          </button>
        </div>
      </dialog>
    </>
  );
}
