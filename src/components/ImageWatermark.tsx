import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Eye, ShieldCheck } from 'lucide-react';
import agozaLogoImg from '../assets/images/agoza_logo.svg';

interface ImageWatermarkProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  allowZoom?: boolean;
  sellerName?: string;
  itemTitle?: string;
  size?: 'sm' | 'md' | 'lg';
  showOverlayPattern?: boolean;
  watermarkLabel?: string;
  onImageClick?: (e: React.MouseEvent) => void;
}

export const ImageWatermark: React.FC<ImageWatermarkProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  allowZoom = true,
  onImageClick,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (onImageClick) {
      onImageClick(e);
      return;
    }
    if (allowZoom) {
      e.stopPropagation();
      setZoomLevel(1);
      setIsLightboxOpen(true);
    }
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.35, 2.5));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.35, 0.8));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1);
  };

  return (
    <>
      <div
        className={`relative ${aspectRatio} overflow-hidden group select-none ${className}`}
        onClick={handleContainerClick}
      >
        {/* Actual Image - Clean without center overlay stacking */}
        {!imageError ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-[#1a1d29] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[#1b5e20]/15 dark:bg-[#c5a059]/15 flex items-center justify-center text-[#1b5e20] dark:text-[#c5a059] font-cinzel font-bold text-sm mb-1">
              AG
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Agoza</span>
          </div>
        )}

        {/* Official "Agoza Marketplace" Image Footer Stamp (Only at the bottom of the image) */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-4 pb-2 px-3 flex items-center justify-between text-white pointer-events-none select-none z-10">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden shrink-0 border border-amber-400 bg-amber-50">
              <img
                src={agozaLogoImg}
                alt="Agoza"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <span className="font-cinzel text-[10px] sm:text-xs font-bold tracking-wider text-white drop-shadow-sm">
              Agoza Marketplace
            </span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/60 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono text-emerald-300 backdrop-blur-xs font-semibold">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>

        {/* Click to Open / Zoom Indicator */}
        {allowZoom && !onImageClick && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel(1);
              setIsLightboxOpen(true);
            }}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-xs text-white p-1.5 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-semibold border border-white/20 hover:bg-black/90 shadow-md z-10"
            title="Inspect full image"
          >
            <Eye className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Inspect</span>
          </button>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL WHEN IMAGE IS OPENED */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-5"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[94vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Control Bar with Brand & Zoom Buttons */}
            <div className="w-full flex items-center justify-between text-white mb-2.5 px-3 py-1.5 bg-black/60 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400 shrink-0 bg-white/10">
                  <img src={agozaLogoImg} alt="Agoza" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-cinzel font-bold text-sm text-white tracking-wider">Agoza</span>
                  <span className="font-serif text-amber-400 font-bold text-xs">አጎዛ</span>
                </div>
              </div>

              {/* Zoom & Close Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors text-xs font-mono px-2"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-5 bg-white/20 mx-1" />

                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700 text-white cursor-pointer transition-colors"
                  title="Close viewer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photo Canvas Container */}
            <div className="relative overflow-hidden rounded-2xl bg-black/90 border border-white/15 max-h-[75vh] flex items-center justify-center">
              <img
                src={src}
                alt={alt}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="max-h-[75vh] w-auto max-w-full object-contain select-none"
              />

              {/* Modal Image Footer Stamp */}
              <div className="absolute bottom-0 inset-x-0 py-2.5 px-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between text-white text-xs select-none pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-amber-400 bg-amber-50">
                    <img src={agozaLogoImg} alt="Agoza" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-cinzel font-bold text-amber-300">Agoza Marketplace</span>
                  <span className="text-slate-300 text-[10px] font-mono hidden sm:inline">· Verified Authentication</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold bg-black/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>100% Protected Handshake</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
