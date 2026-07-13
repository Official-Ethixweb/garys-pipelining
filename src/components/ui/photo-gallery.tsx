"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useA11ySettings } from "@/components/accessibility/accessibility-store";
import { useHasMounted } from "@/lib/use-has-mounted";

export type GalleryPhoto = { src: string; alt: string };

export function PhotoGallery({ photos, className = "" }: { photos: GalleryPhoto[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const mounted = useHasMounted();
  const settings = useA11ySettings();
  const reduceMotion = settings.reduceMotion || settings.pauseAnimations;

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, showPrev, showNext]);

  return (
    <>
      <div className={className}>
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`View photo: ${p.alt}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink">
                <Expand className="h-4 w-4" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {openIndex !== null && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Photo viewer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                onClick={close}
              >
                <button
                  type="button"
                  aria-label="Close photo viewer"
                  onClick={close}
                  className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>

                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous photo"
                      onClick={(e) => {
                        e.stopPropagation();
                        showPrev();
                      }}
                      className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next photo"
                      onClick={(e) => {
                        e.stopPropagation();
                        showNext();
                      }}
                      className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {openIndex !== null && (
                  <motion.div
                    key={openIndex}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className="relative h-[80vh] w-full max-w-4xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Image src={photos[openIndex].src} alt={photos[openIndex].alt} fill sizes="90vw" className="object-contain" priority />
                  </motion.div>
                )}

                {photos.length > 1 && (
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white">
                    {openIndex !== null ? openIndex + 1 : 0} / {photos.length}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
