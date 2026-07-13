"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Move, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useA11ySettings } from "@/components/accessibility/accessibility-store";
import { useHasMounted } from "@/lib/use-has-mounted";

const ZOOM_STEP = 1.25;
const MAX_ZOOM_FACTOR = 2.5;

type ViewState = { scale: number; x: number; y: number };
type Size = { w: number; h: number };

function clampOffset(state: ViewState, viewportSize: Size, naturalSize: Size) {
  const scaledW = naturalSize.w * state.scale;
  const scaledH = naturalSize.h * state.scale;
  const maxX = Math.max(0, (scaledW - viewportSize.w) / 2);
  const maxY = Math.max(0, (scaledH - viewportSize.h) / 2);
  return {
    ...state,
    x: Math.min(maxX, Math.max(-maxX, state.x)),
    y: Math.min(maxY, Math.max(-maxY, state.y)),
  };
}

export function PanoramaViewer({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const mounted = useHasMounted();
  const settings = useA11ySettings();
  const reduceMotion = settings.reduceMotion || settings.pauseAnimations;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View 360 degree panorama: ${alt}`}
        className="group absolute bottom-24 right-5 z-10 flex items-center gap-2 rounded-full bg-black/40 py-2 pl-3 pr-4 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-black/55"
      >
        <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
          <Move className={`h-3.5 w-3.5 ${reduceMotion ? "" : "panorama-badge-pulse"}`} />
        </span>
        360&deg; &middot; Explore
      </button>

      {mounted && createPortal(open && <PanoramaModal src={src} alt={alt} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}

function PanoramaModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const settings = useA11ySettings();
  const reduceMotion = settings.reduceMotion || settings.pauseAnimations;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const baseScaleRef = useRef(1);
  const naturalSizeRef = useRef<Size>({ w: 1, h: 1 });
  const [view, setView] = useState<ViewState>({ scale: 1, x: 0, y: 0 });
  const viewRef = useRef(view);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const dragStart = useRef<{ x: number; y: number; viewX: number; viewY: number } | null>(null);
  const autoPanRef = useRef<number | null>(null);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const stopAutoPan = useCallback(() => {
    if (autoPanRef.current !== null) {
      cancelAnimationFrame(autoPanRef.current);
      autoPanRef.current = null;
    }
  }, []);

  const setupView = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const { w: naturalW, h: naturalH } = naturalSizeRef.current;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const cover = Math.max(vw / naturalW, vh / naturalH);
    const base = cover * 1.12;
    baseScaleRef.current = base;
    setView(clampOffset({ scale: base, x: 0, y: 0 }, { w: vw, h: vh }, { w: naturalW, h: naturalH }));
    setReady(true);
  }, []);

  useEffect(() => {
    const hideHint = window.setTimeout(() => setShowHint(false), 4200);
    return () => window.clearTimeout(hideHint);
  }, []);

  useEffect(() => {
    if (!ready || reduceMotion) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    let direction = 1;
    function step() {
      setView((prev) => {
        const { w: naturalW, h: naturalH } = naturalSizeRef.current;
        if (!viewport) return prev;
        const vw = viewport.clientWidth;
        const vh = viewport.clientHeight;
        const next = clampOffset(
          { ...prev, x: prev.x + direction * 0.35 },
          { w: vw, h: vh },
          { w: naturalW, h: naturalH }
        );
        if (next.x === prev.x) direction *= -1;
        return next;
      });
      autoPanRef.current = requestAnimationFrame(step);
    }
    const delay = window.setTimeout(() => {
      autoPanRef.current = requestAnimationFrame(step);
    }, 900);
    return () => {
      window.clearTimeout(delay);
      stopAutoPan();
    };
  }, [ready, reduceMotion, stopAutoPan]);

  const zoomBy = useCallback((factor: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    stopAutoPan();
    const { w: naturalW, h: naturalH } = naturalSizeRef.current;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    setView((prev) => {
      const base = baseScaleRef.current;
      const nextScale = Math.min(base * MAX_ZOOM_FACTOR, Math.max(base, prev.scale * factor));
      return clampOffset({ scale: nextScale, x: prev.x, y: prev.y }, { w: vw, h: vh }, { w: naturalW, h: naturalH });
    });
  }, [stopAutoPan]);

  const reset = useCallback(() => {
    stopAutoPan();
    setupView();
  }, [setupView, stopAutoPan]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    stopAutoPan();
    setShowHint(false);
    (e.target as Element).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, viewX: viewRef.current.x, viewY: viewRef.current.y };
    setDragging(true);
  }, [stopAutoPan]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const { w: naturalW, h: naturalH } = naturalSizeRef.current;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setView((prev) =>
      clampOffset(
        { scale: prev.scale, x: dragStart.current!.viewX + dx, y: dragStart.current!.viewY + dy },
        { w: vw, h: vh },
        { w: naturalW, h: naturalH }
      )
    );
  }, []);

  const endDrag = useCallback(() => {
    dragStart.current = null;
    setDragging(false);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const pan = 40;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") { stopAutoPan(); setShowHint(false); setView((p) => ({ ...p, x: p.x + pan })); }
      else if (e.key === "ArrowRight") { stopAutoPan(); setShowHint(false); setView((p) => ({ ...p, x: p.x - pan })); }
      else if (e.key === "ArrowUp") { stopAutoPan(); setShowHint(false); setView((p) => ({ ...p, y: p.y + pan })); }
      else if (e.key === "ArrowDown") { stopAutoPan(); setShowHint(false); setView((p) => ({ ...p, y: p.y - pan })); }
      else if (e.key === "+" || e.key === "=") zoomBy(ZOOM_STEP);
      else if (e.key === "-") zoomBy(1 / ZOOM_STEP);
    }
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, zoomBy, stopAutoPan]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="360 degree panorama viewer"
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="text-xs font-medium tracking-wide text-white/60">{alt}</p>
        <button
          type="button"
          aria-label="Close panorama viewer"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-3 pb-6 sm:px-8">
        <div
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          className="relative mx-auto h-full w-full max-w-6xl touch-none select-none overflow-hidden rounded-[1.5rem] border border-white/10"
          style={{ cursor: dragging ? "grabbing" : "grab" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            draggable={false}
            onLoad={(e) => {
              const img = e.currentTarget;
              naturalSizeRef.current = { w: img.naturalWidth, h: img.naturalHeight };
              setupView();
            }}
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={
              ready
                ? {
                    transform: `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
                    transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                  }
                : { opacity: 0 }
            }
          />

          {showHint && ready && (
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 bottom-6 flex justify-center ${reduceMotion ? "" : "panorama-hint-fade"}`}
            >
              <span className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur-md">
                <Move className="h-3.5 w-3.5" /> Drag to look around
              </span>
            </div>
          )}
        </div>

        <div className="absolute bottom-9 right-6 flex flex-col gap-2 sm:bottom-12 sm:right-11">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => zoomBy(ZOOM_STEP)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => zoomBy(1 / ZOOM_STEP)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Reset view"
            onClick={reset}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
