import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styled from "styled-components";
import {
  CardsRow,
  SectionHeader,
  SectionSubtitle,
  StoreLayout,
} from "../components/storeStyles";
import { AppCard, AppCardSkeleton } from "../components/AppCard";
import {
  fetchAllTimePopularMovies,
  fetchNowPlayingMovies,
  getPosterUrl,
  type TmdbMovie,
} from "../data/tmdb";
import type { StoreItem } from "../storeData";

const CARD_WIDTH = 146;
const CARD_GAP = 10;
const MOBILE_SECTION_LIMIT = 20;

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

type MovieCard = StoreItem & {
  ratingValue: number;
  to: string;
};

function releaseLabel(value: string) {
  if (!value) return "Дата выхода неизвестна";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toLocaleDateString("ru-RU");
}

async function mapTmdbToCards(items: TmdbMovie[]): Promise<MovieCard[]> {
  return Promise.all(
    items.map(async (movie) => {
      const poster = await getPosterUrl(movie.poster_path);
      return {
        id: `tmdb-${movie.id}`,
        name: movie.title || movie.original_title || `Фильм ${movie.id}`,
        publisher: releaseLabel(movie.release_date),
        price: "БЕСПЛАТНО",
        color: "hsl(12 62% 48%)",
        icon: "video",
        image: poster,
        ratingValue: Number(movie.vote_average ?? 0) / 2,
        to: `/movie/${movie.id}`,
      };
    }),
  );
}

export function StoreMoviesPage() {
  const navigate = useNavigate();
  const [popularMovies, setPopularMovies] = useState<MovieCard[]>([]);
  const [newMovies, setNewMovies] = useState<MovieCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [cardsPerRow, setCardsPerRow] = useState(6);
  const rowWidthRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "Google Play Фильмы";
  }, []);

  useEffect(() => {
    let isActive = true;

    Promise.all([fetchAllTimePopularMovies(), fetchNowPlayingMovies()])
      .then(async ([popular, fresh]) => {
        if (!isActive) return;
        const [popularCards, freshCards] = await Promise.all([
          mapTmdbToCards(popular),
          mapTmdbToCards(fresh),
        ]);
        if (!isActive) return;
        setPopularMovies(popularCards);
        setNewMovies(freshCards);
      })
      .catch((error) => {
        if (!isActive) return;
        setErrorText(
          error instanceof Error
            ? error.message
            : "Не удалось загрузить фильмы из TMDB.",
        );
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

  const visiblePopular = useMemo(
    () => popularMovies.slice(0, cardsPerRow),
    [popularMovies, cardsPerRow],
  );
  const visibleNew = useMemo(
    () => newMovies.slice(0, cardsPerRow),
    [newMovies, cardsPerRow],
  );
  const mobilePopular = popularMovies.slice(0, MOBILE_SECTION_LIMIT);
  const mobileNew = newMovies.slice(0, MOBILE_SECTION_LIMIT);

  return (
    <StoreLayout variant="store-main" topTab="top" accentTone="movies">
      <div ref={rowWidthRef} style={{ width: "100%" }}>
        <SectionHeader>
          <h3>Популярные фильмы</h3>
          <button type="button" onClick={() => navigate("/movies/popular")}>
            Смотреть больше
          </button>
        </SectionHeader>
        <SectionSubtitle>
          Самые популярные фильмы за всё время
          {errorText ? ` • ${errorText}` : ""}
        </SectionSubtitle>
        <DesktopOnly>
          <CardsRow>
            {isLoading
              ? Array.from({ length: cardsPerRow }).map((_, index) => (
                  <AppCardSkeleton
                    key={`movies-popular-skeleton-${index}`}
                    mode="movie"
                  />
                ))
              : visiblePopular.map((item) => (
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
              {isLoading
                ? Array.from({ length: MOBILE_SECTION_LIMIT }).map(
                    (_, index) => (
                      <SwiperSlide
                        key={`movies-popular-mobile-skeleton-${index}`}
                      >
                        <AppCardSkeleton mode="movie" />
                      </SwiperSlide>
                    ),
                  )
                : mobilePopular.map((item) => (
                    <SwiperSlide key={item.id}>
                      <AppCard item={item} mode="movie" to={item.to} />
                    </SwiperSlide>
                  ))}
            </Swiper>
          </MobileCarousel>
        </MobileOnly>

        <SectionHeader>
          <h3>Новые релизы</h3>
          <button type="button" onClick={() => navigate("/movies/new")}>
            Смотреть больше
          </button>
        </SectionHeader>
        <SectionSubtitle>С большого экрана на ваш</SectionSubtitle>
        <DesktopOnly>
          <CardsRow>
            {isLoading
              ? Array.from({ length: cardsPerRow }).map((_, index) => (
                  <AppCardSkeleton
                    key={`movies-new-skeleton-${index}`}
                    mode="movie"
                  />
                ))
              : visibleNew.map((item) => (
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
              {isLoading
                ? Array.from({ length: MOBILE_SECTION_LIMIT }).map(
                    (_, index) => (
                      <SwiperSlide key={`movies-new-mobile-skeleton-${index}`}>
                        <AppCardSkeleton mode="movie" />
                      </SwiperSlide>
                    ),
                  )
                : mobileNew.map((item) => (
                    <SwiperSlide key={item.id}>
                      <AppCard item={item} mode="movie" to={item.to} />
                    </SwiperSlide>
                  ))}
            </Swiper>
          </MobileCarousel>
        </MobileOnly>
      </div>
    </StoreLayout>
  );
}
