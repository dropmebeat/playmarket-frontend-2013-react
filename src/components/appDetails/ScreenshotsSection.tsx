import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styled from "styled-components";
import { PlayOverlay, SlideBox, SlideImg } from "../../styles/appDetailsStyles";

type ScreenshotsSectionProps = {
  screenshots: string[];
  trailerImage?: string;
  trailerUrl?: string;
  appName: string;
};

type ShotOrientation = "landscape" | "portrait" | "square";

const TRAILER_RATIO = 475 / 355;
const MIN_PORTRAIT_RATIO = 1 / TRAILER_RATIO;

const ScreenshotsWrap = styled.div`
  position: relative;

  .details-section-body {
    position: relative;
  }

  .expand-pages-container {
    margin: 0 58px;
  }

  .swiper {
    width: 100%;
  }

  .swiper-wrapper {
    align-items: stretch;
  }

  .swiper-slide {
    --slide-height: 286px;
    width: calc(var(--slide-height) * var(--slide-ratio, ${TRAILER_RATIO}));
  }

  .thumbnails {
    height: 100%;
  }

  .thumbnails > div {
    height: var(--slide-height);
  }

  .expand-next,
  .expand-prev {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 56px;
    border: 1px solid var(--border-main);
    background: var(--bg-panel);
    z-index: 5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-main);
    font-size: 64px;
    font-weight: 300;
    line-height: 1;
    padding: 0;
    transition: background-color 120ms ease;
  }

  .expand-next:hover,
  .expand-prev:hover {
    background: var(--bg-hover);
  }

  .expand-next {
    right: 0;
  }

  .expand-prev {
    left: 0;
  }

  @media (max-width: 900px) {
    .expand-pages-container {
      margin: 0 50px;
    }

    .swiper-slide {
      --slide-height: 240px;
    }
  }

  @media (max-width: 650px) {
    .expand-pages-container {
      margin: 0 42px;
    }

    .swiper-slide {
      --slide-height: 200px;
    }

    .expand-next,
    .expand-prev {
      width: 40px;
      font-size: 52px;
    }
  }
`;

const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
`;

const FullscreenImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
`;

const FullscreenGallery = styled.div`
  width: min(1400px, 100%);
  height: 100%;

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const FullscreenVideoWrap = styled.div`
  width: min(1200px, 100%);
  aspect-ratio: 16 / 9;
  background: #050607;
`;

const FullscreenVideo = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
`;

const FullscreenClose = styled.button`
  position: absolute;
  top: 12px;
  right: 14px;
  width: 36px;
  height: 36px;
  border: 0;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 28px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

function getClampedRatio(ratio: number, orientation: ShotOrientation) {
  if (orientation === "portrait") {
    return Math.max(ratio, MIN_PORTRAIT_RATIO);
  }

  return ratio;
}

export function ScreenshotsSection({
  screenshots,
  trailerImage,
  trailerUrl,
  appName,
}: ScreenshotsSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [orientations, setOrientations] = useState<
    Record<string, ShotOrientation>
  >({});
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<
    number | null
  >(null);
  const [isTrailerFullscreen, setIsTrailerFullscreen] = useState(false);

  const slides = useMemo(
    () => [
      {
        src: trailerImage ?? screenshots[0] ?? "/assets/apps/1.png",
        isTrailer: true,
      },
      ...screenshots.map((src) => ({ src, isTrailer: false })),
    ],
    [screenshots, trailerImage],
  );

  const onImageLoad = useCallback(
    (src: string, width: number, height: number) => {
      const next: ShotOrientation =
        width === height ? "square" : width > height ? "landscape" : "portrait";
      const baseRatio =
        width > 0 && height > 0 ? width / height : TRAILER_RATIO;
      const nextRatio = getClampedRatio(baseRatio, next);

      setOrientations((prev) =>
        prev[src] === next ? prev : { ...prev, [src]: next },
      );
      setRatios((prev) =>
        prev[src] === nextRatio ? prev : { ...prev, [src]: nextRatio },
      );
    },
    [],
  );

  const goToNext = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || slides.length <= 1) return;

    const hasTrailer = Boolean(slides[0]?.isTrailer);
    const firstImageIndex = hasTrailer ? 1 : 0;
    const lastImageIndex = slides.length - 1;

    if (hasTrailer && swiper.activeIndex === 0) {
      swiper.slideTo(firstImageIndex);
      return;
    }

    if (swiper.activeIndex >= lastImageIndex) {
      swiper.slideTo(firstImageIndex);
      return;
    }

    swiper.slideTo(swiper.activeIndex + 1);
  }, [slides]);

  const goToPrev = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || slides.length <= 1) return;

    const hasTrailer = Boolean(slides[0]?.isTrailer);
    const firstImageIndex = hasTrailer ? 1 : 0;
    const lastImageIndex = slides.length - 1;

    if (swiper.activeIndex <= firstImageIndex) {
      swiper.slideTo(lastImageIndex);
      return;
    }

    swiper.slideTo(swiper.activeIndex - 1);
  }, [slides]);

  const trailerVideoUrl = useMemo(() => {
    const query = encodeURIComponent(`${appName} trailer`);
    const fallback = `https://www.youtube.com/embed?listType=search&list=${query}&autoplay=1&rel=0`;
    const raw = String(trailerUrl ?? "").trim();
    if (!raw) return fallback;

    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      return fallback;
    }

    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") {
      const id = parsed.pathname.replace(/^\/+/, "").split("/")[0];
      return id
        ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
        : fallback;
    }

    if (!host.endsWith("youtube.com")) return fallback;

    const watchId = parsed.searchParams.get("v");
    if (watchId)
      return `https://www.youtube.com/embed/${watchId}?autoplay=1&rel=0`;

    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts[0] === "embed" && pathParts[1]) {
      return `https://www.youtube.com/embed/${pathParts[1]}?autoplay=1&rel=0`;
    }

    if (pathParts[0] === "results") {
      const searchQuery = parsed.searchParams.get("search_query");
      if (!searchQuery) return fallback;
      return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}&autoplay=1&rel=0`;
    }

    return fallback;
  }, [appName, trailerUrl]);

  const fullscreenImages = useMemo(
    () =>
      screenshots.length ? screenshots : [trailerImage ?? "/assets/apps/1.png"],
    [screenshots, trailerImage],
  );

  const openImageFullscreen = useCallback(
    (src: string) => {
      setIsTrailerFullscreen(false);
      const index = fullscreenImages.findIndex((item) => item === src);
      setFullscreenImageIndex(index >= 0 ? index : 0);
    },
    [fullscreenImages],
  );

  const openTrailerFullscreen = useCallback(() => {
    setIsTrailerFullscreen(true);
    setFullscreenImageIndex(null);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenImageIndex(null);
    setIsTrailerFullscreen(false);
  }, []);

  const isFullscreenOpen = isTrailerFullscreen || fullscreenImageIndex !== null;

  useEffect(() => {
    if (!isFullscreenOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullscreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [closeFullscreen, isFullscreenOpen]);

  return (
    <>
      <div className="details-section screenshots">
        <div className="details-section-contents">
          <div className="details-section-body expandable">
            <ScreenshotsWrap>
              <div className="expand-pages-container">
                <Swiper
                  spaceBetween={8}
                  slidesPerView={"auto"}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                >
                  {slides.map((slide, index) => {
                    const orientation = slide.isTrailer
                      ? "landscape"
                      : (orientations[slide.src] ?? "landscape");
                    const slideClass = [
                      slide.isTrailer ? "is-trailer" : "",
                      orientation === "portrait" ? "is-portrait" : "",
                      orientation === "square" ? "is-square" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    const ratio = slide.isTrailer
                      ? TRAILER_RATIO
                      : getClampedRatio(
                          ratios[slide.src] ?? TRAILER_RATIO,
                          orientation,
                        );

                    return (
                      <SwiperSlide
                        key={`${slide.src}-${index}`}
                        className={slideClass || undefined}
                        style={{ "--slide-ratio": ratio } as CSSProperties}
                      >
                        <div
                          className="thumbnails"
                          data-expand-target="thumbnails"
                        >
                          <SlideBox>
                            <SlideImg
                              className="screenshot clickable"
                              src={slide.src}
                              alt={`${appName} - скриншот`}
                              itemProp="screenshot"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onClick={() =>
                                slide.isTrailer
                                  ? openTrailerFullscreen()
                                  : openImageFullscreen(slide.src)
                              }
                              onError={(event) => {
                                event.currentTarget.src = "/assets/apps/1.png";
                              }}
                              onLoad={(event) =>
                                onImageLoad(
                                  slide.src,
                                  event.currentTarget.naturalWidth,
                                  event.currentTarget.naturalHeight,
                                )
                              }
                            />
                            {slide.isTrailer ? (
                              <PlayOverlay
                                type="button"
                                onClick={openTrailerFullscreen}
                                aria-label="Открыть изображение в полноэкранном режиме"
                              >
                                ▶
                              </PlayOverlay>
                            ) : null}
                          </SlideBox>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              <button
                className="expand-button expand-prev"
                type="button"
                aria-label="Предыдущий"
                onClick={goToPrev}
              >
                &#8249;
              </button>
              <button
                className="expand-button expand-next"
                type="button"
                aria-label="Следующий"
                onClick={goToNext}
              >
                &#8250;
              </button>
            </ScreenshotsWrap>
          </div>
        </div>
        <div className="details-section-divider" />
      </div>
      {isFullscreenOpen ? (
        <FullscreenOverlay onClick={closeFullscreen}>
          <FullscreenClose
            type="button"
            aria-label="Закрыть"
            onClick={closeFullscreen}
          >
            ×
          </FullscreenClose>
          {isTrailerFullscreen ? (
            <FullscreenVideoWrap onClick={(event) => event.stopPropagation()}>
              <FullscreenVideo
                src={trailerVideoUrl}
                title={`${appName} - трейлер`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </FullscreenVideoWrap>
          ) : (
            <FullscreenGallery onClick={(event) => event.stopPropagation()}>
              <Swiper
                slidesPerView={1}
                spaceBetween={0}
                initialSlide={fullscreenImageIndex ?? 0}
                onSlideChange={(swiper) => {
                  setFullscreenImageIndex(swiper.activeIndex);
                }}
              >
                {fullscreenImages.map((src, index) => (
                  <SwiperSlide key={`${src}-${index}`}>
                    <FullscreenImage
                      src={src}
                      alt={`${appName} - полноэкранный скриншот ${index + 1}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </FullscreenGallery>
          )}
        </FullscreenOverlay>
      ) : null}
    </>
  );
}
