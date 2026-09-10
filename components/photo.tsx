import type { ProjectImage } from "@/lib/content";
export function Photo({
  image,
  priority = false,
  className = "",
  sizes = "(max-width: 700px) 100vw, 80vw",
}: {
  image: ProjectImage;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const stem = image.src.replace(".webp", "");
  return (
    <img
      className={`photo ${className}`}
      src={image.src}
      srcSet={`${stem}-640.webp 640w, ${stem}-960.webp 960w, ${image.src} ${image.width}w`}
      sizes={sizes}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      style={{ objectPosition: image.position }}
    />
  );
}
