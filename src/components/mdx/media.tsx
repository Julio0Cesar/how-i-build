"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * An image or video in the body opens, on click, in a dialog holding nothing
 * but the media at the size the screen allows. Escape and a click outside
 * close it — both are the native `<dialog>` behaviour, so there is no state
 * to keep in sync beyond "open or not".
 */
function Lightbox({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        // The dialog itself is the backdrop; the media is its only child.
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[92vh] max-w-[95vw] bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    >
      {open ? children : null}
    </dialog>
  );
}

const frame = "mt-6 block max-w-full cursor-zoom-in border border-rule";

export function Img({ src, alt = "", className }: { src?: string; alt?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  if (!src) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? `${alt} — expand` : "Expand image"}
        className={`${frame} ${className ?? ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- content images are static files under public/ */}
        <img src={src} alt={alt} className="block h-auto w-full" />
      </button>
      <Lightbox open={open} onClose={() => setOpen(false)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- same file, shown larger */}
        <img src={src} alt={alt} className="max-h-[92vh] max-w-[95vw] object-contain" />
      </Lightbox>
    </>
  );
}

export function Video({
  src,
  poster,
  className,
  "aria-label": ariaLabel,
}: {
  src?: string;
  poster?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  if (!src) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel ? `${ariaLabel} — expand` : "Expand video"}
        className={`block max-w-full cursor-zoom-in ${className ?? ""}`}
      >
        <video src={src} poster={poster} autoPlay muted loop playsInline className="block h-auto w-full" />
      </button>
      <Lightbox open={open} onClose={() => setOpen(false)}>
        <video
          src={src}
          poster={poster}
          autoPlay
          loop
          playsInline
          controls
          aria-label={ariaLabel}
          className="max-h-[92vh] max-w-[95vw]"
        />
      </Lightbox>
    </>
  );
}
