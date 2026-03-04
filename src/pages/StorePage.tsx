import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faDisplay,
  faGamepad,
  faMusic,
  faNewspaper,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styled from "styled-components";
import {
  CardsRow,
  Hero,
  HeroText,
  HeroVisual,
  SectionHeader,
  SectionSubtitle,
  StoreLayout,
} from "../components/storeStyles";
import { AppCard, AppCardSkeleton } from "../components/AppCard";
import { loadStoreApps, type AppData } from "../data/apps";
import {
  fetchAllTimePopularMovies,
  fetchPopularTvShows,
  getPosterUrl,
  type TmdbMovie,
  type TmdbTvShow,
} from "../data/tmdb";
import type { StoreItem } from "../storeData";

const CARD_WIDTH = 146;
const CARD_GAP = 10;
const MOBILE_SECTION_LIMIT = 20;

type MediaCard = StoreItem & {
  ratingValue: number;
  to: string;
};

function releaseLabel(value?: string) {
  if (!value) return "Дата выхода неизвестна";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toLocaleDateString("ru-RU");
}

async function mapMovieCards(items: TmdbMovie[]): Promise<MediaCard[]> {
  return Promise.all(
    items.map(async (item) => ({
      id: `tmdb-movie-${item.id}`,
      name: item.title || item.original_title || `Фильм ${item.id}`,
      publisher: releaseLabel(item.release_date),
      price: "БЕСПЛАТНО",
      color: "hsl(12 62% 48%)",
      icon: "video",
      image: await getPosterUrl(item.poster_path),
      ratingValue: Number(item.vote_average ?? 0) / 2,
      to: `/movie/${item.id}`,
    })),
  );
}

async function mapSeriesCards(items: TmdbTvShow[]): Promise<MediaCard[]> {
  return Promise.all(
    items.map(async (item) => ({
      id: `tmdb-tv-${item.id}`,
      name: item.name || item.original_name || `Сериал ${item.id}`,
      publisher: releaseLabel(item.first_air_date),
      price: "БЕСПЛАТНО",
      color: "hsl(205 58% 48%)",
      icon: "video",
      image: await getPosterUrl(item.poster_path),
      ratingValue: Number(item.vote_average ?? 0) / 2,
      to: "/movies",
    })),
  );
}

function parseInstallFloor(value?: string) {
  const text = String(value ?? "");
  if (!text) return 0;
  const rangeMatch = text.match(/(\d[\d,]*)\s*-\s*(\d[\d,]*)/);
  if (rangeMatch) {
    return Number.parseInt(rangeMatch[1].replace(/,/g, ""), 10) || 0;
  }

  const plusMatch = text.match(/(\d[\d,]*)\s*\+/);
  if (plusMatch) {
    return Number.parseInt(plusMatch[1].replace(/,/g, ""), 10) || 0;
  }

  const firstNumber = text.match(/\d[\d,]*/);
  return firstNumber
    ? Number.parseInt(firstNumber[0].replace(/,/g, ""), 10) || 0
    : 0;
}

function byPopularity(a: AppData, b: AppData) {
  const installDiff =
    parseInstallFloor(b.installs) - parseInstallFloor(a.installs);
  if (installDiff !== 0) return installDiff;
  const ratingDiff = (b.ratingValue ?? 0) - (a.ratingValue ?? 0);
  if (ratingDiff !== 0) return ratingDiff;
  return a.name.localeCompare(b.name, "ru");
}

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
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  .swiper {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .swiper-wrapper {
    align-items: stretch;
  }

  .swiper-slide {
    height: auto;
    min-width: 0;
  }
`;

const MovieAccentScope = styled.div`
  --brand-accent: #d84a38;
  --brand-accent-strong: #a23326;
`;

export function StorePage() {
  const [appsData, setAppsData] = useState<AppData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [moviesData, setMoviesData] = useState<MediaCard[]>([]);
  const [seriesData, setSeriesData] = useState<MediaCard[]>([]);
  const [cardsPerRow, setCardsPerRow] = useState(6);
  const rowWidthRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Google Play Маркет";
  }, []);

  useEffect(() => {
    let isActive = true;

    loadStoreApps()
      .then((data) => {
        if (!isActive) return;
        setAppsData(data);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    setMediaLoading(true);

    Promise.all([fetchAllTimePopularMovies(), fetchPopularTvShows()])
      .then(async ([movies, series]) => {
        if (!isActive) return;
        const [mappedMovies, mappedSeries] = await Promise.all([
          mapMovieCards(movies),
          mapSeriesCards(series),
        ]);
        if (!isActive) return;
        setMoviesData(mappedMovies);
        setSeriesData(mappedSeries);
      })
      .finally(() => {
        if (!isActive) return;
        setMediaLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const host = rowWidthRef.current;
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
  }, []);

  const apps = useMemo(
    () =>
      appsData
        .filter((item) => !item.category.startsWith("GAME_"))
        .sort(byPopularity),
    [appsData],
  );
  const games = useMemo(
    () =>
      appsData
        .filter((item) => item.category.startsWith("GAME_"))
        .sort(byPopularity),
    [appsData],
  );

  const visibleApps = apps.slice(0, cardsPerRow);
  const visibleGames = games.slice(0, cardsPerRow);
  const visibleMovies = moviesData.slice(0, cardsPerRow);
  const visibleSeries = seriesData.slice(0, cardsPerRow);
  const mobileApps = apps.slice(0, MOBILE_SECTION_LIMIT);
  const mobileGames = games.slice(0, MOBILE_SECTION_LIMIT);
  const mobileMovies = moviesData.slice(0, MOBILE_SECTION_LIMIT);
  const mobileSeries = seriesData.slice(0, MOBILE_SECTION_LIMIT);

  return (
    <StoreLayout variant="store-main" topTab="top">
      <Hero>
        <HeroVisual>
          <div className="tile t1">
            <FontAwesomeIcon icon={faMusic} />
          </div>
          <div className="tile t2">
            <FontAwesomeIcon icon={faVideo} />
          </div>
          <div className="tile t3">
            <FontAwesomeIcon icon={faDisplay} />
          </div>
          <div className="tile t4">
            <FontAwesomeIcon icon={faNewspaper} />
          </div>
          <div className="tile t5">
            <FontAwesomeIcon icon={faBookOpen} />
          </div>
          <div className="tile t6">
            <FontAwesomeIcon icon={faGamepad} />
          </div>
        </HeroVisual>
        <HeroText>
          <h2>Мы кое-что изменили...</h2>
          <p>
            В Google Play появился новый дизайн, который упрощает поиск и
            позволяет легко находить новые любимые приложения.
          </p>
        </HeroText>
      </Hero>

      <div ref={rowWidthRef} style={{ width: "100%" }}>
        <SectionHeader>
          <h3>Приложения</h3>
          <button type="button" onClick={() => navigate("/store/apps")}>
            Смотреть больше
          </button>
        </SectionHeader>
        <SectionSubtitle>Популярные приложения</SectionSubtitle>
        <DesktopOnly>
          <CardsRow>
            {isLoading
              ? Array.from({ length: cardsPerRow }).map((_, index) => (
                  <AppCardSkeleton key={`store-app-skeleton-${index}`} />
                ))
              : visibleApps.map((item) => (
                  <AppCard key={item.id} item={item} />
                ))}
          </CardsRow>
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
              {isLoading
                ? Array.from({ length: MOBILE_SECTION_LIMIT }).map(
                    (_, index) => (
                      <SwiperSlide key={`store-app-mobile-skeleton-${index}`}>
                        <AppCardSkeleton />
                      </SwiperSlide>
                    ),
                  )
                : mobileApps.map((item) => (
                    <SwiperSlide key={item.id}>
                      <AppCard item={item} />
                    </SwiperSlide>
                  ))}
            </Swiper>
          </MobileCarousel>
        </MobileOnly>

        <SectionHeader>
          <h3>Игры</h3>
          <button type="button" onClick={() => navigate("/store/games")}>
            Смотреть больше
          </button>
        </SectionHeader>
        <SectionSubtitle>Популярные игры</SectionSubtitle>
        <DesktopOnly>
          <CardsRow>
            {isLoading
              ? Array.from({ length: cardsPerRow }).map((_, index) => (
                  <AppCardSkeleton key={`store-game-skeleton-${index}`} />
                ))
              : visibleGames.map((item) => (
                  <AppCard key={item.id} item={item} />
                ))}
          </CardsRow>
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
              {isLoading
                ? Array.from({ length: MOBILE_SECTION_LIMIT }).map(
                    (_, index) => (
                      <SwiperSlide key={`store-game-mobile-skeleton-${index}`}>
                        <AppCardSkeleton />
                      </SwiperSlide>
                    ),
                  )
                : mobileGames.map((item) => (
                    <SwiperSlide key={item.id}>
                      <AppCard item={item} />
                    </SwiperSlide>
                  ))}
            </Swiper>
          </MobileCarousel>
        </MobileOnly>

        <MovieAccentScope>
          <SectionHeader>
            <h3>Фильмы</h3>
            <button type="button" onClick={() => navigate("/movies")}>
              Смотреть больше
            </button>
          </SectionHeader>
          <SectionSubtitle>Популярные фильмы</SectionSubtitle>
          <DesktopOnly>
            <CardsRow>
              {mediaLoading
                ? Array.from({ length: cardsPerRow }).map((_, index) => (
                    <AppCardSkeleton
                      key={`store-movie-skeleton-${index}`}
                      mode="movie"
                    />
                  ))
                : visibleMovies.map((item) => (
                    <AppCard
                      key={item.id}
                      item={item}
                      mode="movie"
                      to={item.to}
                    />
                  ))}
            </CardsRow>
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
                {mediaLoading
                  ? Array.from({ length: MOBILE_SECTION_LIMIT }).map(
                      (_, index) => (
                        <SwiperSlide
                          key={`store-movie-mobile-skeleton-${index}`}
                        >
                          <AppCardSkeleton mode="movie" />
                        </SwiperSlide>
                      ),
                    )
                  : mobileMovies.map((item) => (
                      <SwiperSlide key={item.id}>
                        <AppCard item={item} mode="movie" to={item.to} />
                      </SwiperSlide>
                    ))}
              </Swiper>
            </MobileCarousel>
          </MobileOnly>

          <SectionHeader>
            <h3>Сериалы</h3>
            <button type="button" onClick={() => navigate("/movies")}>
              Смотреть больше
            </button>
          </SectionHeader>
          <SectionSubtitle>Популярные сериалы</SectionSubtitle>
          <DesktopOnly>
            <CardsRow>
              {mediaLoading
                ? Array.from({ length: cardsPerRow }).map((_, index) => (
                    <AppCardSkeleton
                      key={`store-series-skeleton-${index}`}
                      mode="movie"
                    />
                  ))
                : visibleSeries.map((item) => (
                    <AppCard
                      key={item.id}
                      item={item}
                      mode="movie"
                      to={item.to}
                    />
                  ))}
            </CardsRow>
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
                {mediaLoading
                  ? Array.from({ length: MOBILE_SECTION_LIMIT }).map(
                      (_, index) => (
                        <SwiperSlide
                          key={`store-series-mobile-skeleton-${index}`}
                        >
                          <AppCardSkeleton mode="movie" />
                        </SwiperSlide>
                      ),
                    )
                  : mobileSeries.map((item) => (
                      <SwiperSlide key={item.id}>
                        <AppCard item={item} mode="movie" to={item.to} />
                      </SwiperSlide>
                    ))}
              </Swiper>
            </MobileCarousel>
          </MobileOnly>
        </MovieAccentScope>
      </div>
    </StoreLayout>
  );
}
