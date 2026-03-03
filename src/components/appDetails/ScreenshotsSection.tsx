import { useCallback, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styled from "styled-components";
import { PlayOverlay, SlideBox, SlideImg } from "../../styles/appDetailsStyles";

type ScreenshotsSectionProps = {
  screenshots: string[];
  trailerImage?: string;
  appName: string;
};

type ShotOrientation = "landscape" | "portrait" | "square";
const TRAILER_RATIO = 475 / 355;

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
    border: 1px solid #cfcfcf;
    background: #f3f3f3;
    z-index: 5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #505050;
    font-size: 64px;
    font-weight: 300;
    line-height: 1;
    padding: 0;
    transition: background-color 120ms ease;
  }

  .expand-next:hover,
  .expand-prev:hover {
    background: #fff;
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

export function ScreenshotsSection({
  screenshots,
  trailerImage,
  appName,
}: ScreenshotsSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [orientations, setOrientations] = useState<
    Record<string, ShotOrientation>
  >({});
  const [ratios, setRatios] = useState<Record<string, number>>({});

  const slides = useMemo(
    () =>
      trailerImage
        ? [
            { src: trailerImage, isTrailer: true },
            ...screenshots.map((src) => ({ src, isTrailer: false })),
          ]
        : screenshots.map((src) => ({ src, isTrailer: false })),
    [screenshots, trailerImage],
  );

  const onImageLoad = useCallback(
    (src: string, width: number, height: number) => {
      const next: ShotOrientation =
        width === height ? "square" : width > height ? "landscape" : "portrait";
      const nextRatio =
        width > 0 && height > 0 ? width / height : TRAILER_RATIO;

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

    const hasTrailer = Boolean(trailerImage);
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
  }, [slides.length, trailerImage]);

  const goToPrev = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || slides.length <= 1) return;

    const hasTrailer = Boolean(trailerImage);
    const firstImageIndex = hasTrailer ? 1 : 0;
    const lastImageIndex = slides.length - 1;

    if (swiper.activeIndex <= firstImageIndex) {
      swiper.slideTo(lastImageIndex);
      return;
    }

    swiper.slideTo(swiper.activeIndex - 1);
  }, [slides.length, trailerImage]);

  return (
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
                {slides.map((slide, index) =>
                  (() => {
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
                      : (ratios[slide.src] ?? TRAILER_RATIO);

                    return (
                      <SwiperSlide
                        key={`${slide.src}-${index}`}
                        className={slideClass || undefined}
                        style={
                          { "--slide-ratio": ratio } as React.CSSProperties
                        }
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
                              <PlayOverlay type="button">▶</PlayOverlay>
                            ) : null}
                          </SlideBox>
                        </div>
                      </SwiperSlide>
                    );
                  })(),
                )}
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
  );
}
