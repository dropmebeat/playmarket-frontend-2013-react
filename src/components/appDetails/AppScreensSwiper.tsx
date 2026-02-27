import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import {
  GallerySection,
  PlayOverlay,
  SlideBox,
  SlideImg,
} from "../../styles/appDetailsStyles";
import styled from "styled-components";

type AppScreensSwiperProps = {
  screenshots: string[];
  alt: string;
};

const SwiperWrap = styled.div`
  position: relative;

  .swiper-button-prev,
  .swiper-button-next {
    color: #4f4f4f;
    background: #f7f7f7;
    width: 56px;
    height: 180px;
    margin-top: -90px;
    border: 1px solid #c4c4c4;
    border-radius: 2px;
    box-shadow: none;
  }

  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: 44px;
    font-weight: 700;
  }

  .swiper-button-prev {
    left: 8px;
  }

  .swiper-button-next {
    right: 8px;
  }

  .swiper-button-disabled {
    opacity: 0;
    pointer-events: none;
  }
`;

export function AppScreensSwiper({ screenshots, alt }: AppScreensSwiperProps) {
  return (
    <GallerySection>
      <SwiperWrap>
        <Swiper
          modules={[Navigation]}
          navigation
          loop={screenshots.length > 1}
          spaceBetween={8}
          slidesPerView={1.02}
          breakpoints={{
            700: { slidesPerView: 2.08 },
            1000: { slidesPerView: 3.04 },
          }}
        >
          {screenshots.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`}>
              <SlideBox>
                <SlideImg src={src} alt={`${alt} screenshot ${index + 1}`} />
                {index === 0 ? (
                  <PlayOverlay type="button">▶</PlayOverlay>
                ) : null}
              </SlideBox>
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperWrap>
    </GallerySection>
  );
}
