import { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { AppData } from "../../data/apps";
import { AppCard } from "../AppCard";
import { H2, Section } from "../../styles/appDetailsStyles";
import styled from "styled-components";

type AppMiniSectionProps = {
  title: string;
  apps: AppData[];
  limit?: number;
  framed?: boolean;
  showAllDesktop?: boolean;
};

const ExistingCardsGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(146px, 1fr));
  gap: 10px;
`;

const DesktopOnly = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: block;
  }
`;

const MobileCarousel = styled.div`
  .swiper {
    width: 100%;
    overflow: visible;
  }
`;

const SectionFrame = styled.div`
  border: 1px solid var(--border-main);
  background: var(--bg-panel-soft);
  padding: 10px;
  overflow: hidden;
`;

const CARD_WIDTH = 146;
const CARD_GAP = 10;

export function AppMiniSection({
  title,
  apps,
  limit,
  framed = false,
  showAllDesktop = false,
}: AppMiniSectionProps) {
  const [cardsPerRow, setCardsPerRow] = useState(7);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const list = useMemo(
    () => (typeof limit === "number" ? apps.slice(0, limit) : apps),
    [apps, limit],
  );
  const hasItems = list.length > 0;

  useEffect(() => {
    if (showAllDesktop) return;

    const host = hostRef.current;
    if (!host) return;

    const updateCardsPerRow = (width: number) => {
      const next = Math.max(
        1,
        Math.floor((width + CARD_GAP) / (CARD_WIDTH + CARD_GAP)),
      );
      setCardsPerRow((prev) => (prev === next ? prev : next));
    };

    updateCardsPerRow(host.clientWidth);

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (!width) return;
      updateCardsPerRow(width);
    });

    observer.observe(host);
    return () => observer.disconnect();
  }, [showAllDesktop]);

  if (!hasItems) return null;

  const desktopApps = showAllDesktop ? list : list.slice(0, cardsPerRow);
  const sectionBody = (
    <>
      <DesktopOnly>
        <ExistingCardsGrid>
          {desktopApps.map((app) => (
            <AppCard key={app.id} item={app} />
          ))}
        </ExistingCardsGrid>
      </DesktopOnly>
      <MobileOnly>
        <MobileCarousel>
          <Swiper
            spaceBetween={10}
            slidesPerView={2.2}
            breakpoints={{
              480: { slidesPerView: 2.6 },
              700: { slidesPerView: 3.6 },
            }}
          >
            {list.map((app) => (
              <SwiperSlide key={app.id}>
                <AppCard item={app} />
              </SwiperSlide>
            ))}
          </Swiper>
        </MobileCarousel>
      </MobileOnly>
    </>
  );

  return (
    <Section ref={hostRef}>
      <H2>{title}</H2>
      {framed ? <SectionFrame>{sectionBody}</SectionFrame> : sectionBody}
    </Section>
  );
}
