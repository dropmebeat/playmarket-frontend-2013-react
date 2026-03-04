import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppCard, AppCardSkeleton } from "../components/AppCard";
import { DescriptionSection } from "../components/appDetails/DescriptionSection";
import { DetailsInfoSection } from "../components/appDetails/DetailsInfoSection";
import { ScreenshotsSection } from "../components/appDetails/ScreenshotsSection";
import { Grid, StoreLayout } from "../components/storeStyles";
import type { AppData } from "../data/apps";
import {
  fetchMovieDetails,
  fetchSimilarMovies,
  getBackdropUrl,
  getPosterUrl,
  type TmdbMovie,
  type TmdbMovieDetails,
} from "../data/tmdb";
import {
  DetailsPageWrap,
  DetailsWrapper,
  H2,
  InfoGrid,
  InfoTitle,
  Section,
} from "../styles/appDetailsStyles";
import type { StoreItem } from "../storeData";

type MovieCard = StoreItem & {
  ratingValue: number;
  to: string;
};

function formatDate(value?: string) {
  if (!value) return "Неизвестно";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatRuntime(minutes?: number) {
  if (!minutes || minutes <= 0) return "Неизвестно";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} мин`;
  if (!m) return `${h} ч`;
  return `${h} ч ${m} мин`;
}

async function mapMovieCard(movie: TmdbMovie): Promise<MovieCard> {
  const image = await getPosterUrl(movie.poster_path, "w342");
  return {
    id: `tmdb-${movie.id}`,
    name: movie.title || movie.original_title || `Фильм ${movie.id}`,
    publisher: movie.release_date || "Дата выхода неизвестна",
    price: "БЕСПЛАТНО",
    color: "hsl(12 62% 48%)",
    icon: "video",
    image,
    ratingValue: Number(movie.vote_average ?? 0) / 2,
    to: `/movie/${movie.id}`,
  };
}

export function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<TmdbMovieDetails | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | undefined>();
  const [screens, setScreens] = useState<string[]>([]);
  const [similar, setSimilar] = useState<MovieCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!id) return;
    let active = true;
    setIsLoading(true);
    setErrorText("");

    Promise.all([fetchMovieDetails(id), fetchSimilarMovies(id)])
      .then(async ([details, similarMovies]) => {
        if (!active) return;
        const [poster, backdrop] = await Promise.all([
          getPosterUrl(details.poster_path, "w500"),
          getBackdropUrl(details.backdrop_path, "w780"),
        ]);
        if (!active) return;

        const similarCards = await Promise.all(
          similarMovies.slice(0, 10).map((item) => mapMovieCard(item)),
        );
        if (!active) return;

        setMovie(details);
        setPosterUrl(poster);
        setScreens([backdrop, poster].filter((v): v is string => Boolean(v)));
        setSimilar(similarCards);
      })
      .catch((error) => {
        if (!active) return;
        setErrorText(
          error instanceof Error
            ? error.message
            : "Не удалось загрузить страницу фильма.",
        );
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (movie?.title) {
      document.title = `${movie.title} - Google Play Фильмы`;
      return;
    }
    document.title = "Google Play Фильмы";
  }, [movie]);

  const movieAsApp = useMemo<AppData | null>(() => {
    if (!movie) return null;
    const categoryLabel =
      (movie.genres ?? []).map((item) => item.name).join(", ") || "Фильмы";
    return {
      id: `tmdb-${movie.id}`,
      name: movie.title,
      publisher: movie.production_companies?.[0]?.name ?? "The Movie Database",
      subtitle: `${movie.title} - ${formatDate(movie.release_date)}`,
      category: categoryLabel,
      price: "БЕСПЛАТНО",
      color: "hsl(12 62% 48%)",
      icon: "video",
      image: posterUrl,
      updatedAt: movie.release_date || "",
      size: "Не указано",
      installs: "Не указано",
      version: "Не указано",
      requiresAndroid: "Не требуется",
      contentRating: "16+",
      website: movie.homepage || `https://www.themoviedb.org/movie/${movie.id}`,
      privacyPolicy: undefined,
      description: [movie.overview || "Описание фильма отсутствует."],
      whatsNew: ["Данные синхронизированы с TMDB."],
      trailerImage: screens[0],
      trailerUrl: undefined,
      screenshots: screens,
      ratingValue: Number(movie.vote_average ?? 0) / 2,
      ratingCountText: `(${movie.vote_count ?? 0})`,
      reviews: [],
      similarIds: [],
      moreFromDeveloperIds: [],
    };
  }, [movie, posterUrl, screens]);

  if (isLoading) {
    return (
      <StoreLayout
        variant="store-main"
        topTab="top"
        accentTone="movies"
        hideSideSectionOnMobile
      >
        <DetailsPageWrap>
          <DetailsWrapper>
            <Section>
              <H2>Загрузка фильма...</H2>
              <Grid>
                {Array.from({ length: 6 }).map((_, i) => (
                  <AppCardSkeleton key={`movie-loading-${i}`} mode="movie" />
                ))}
              </Grid>
            </Section>
          </DetailsWrapper>
        </DetailsPageWrap>
      </StoreLayout>
    );
  }

  if (!movie) {
    return (
      <StoreLayout
        variant="store-main"
        topTab="top"
        accentTone="movies"
        hideSideSectionOnMobile
      >
        <DetailsPageWrap>
          <DetailsWrapper>
            <Section>
              <H2>Фильм не найден</H2>
              <div>{errorText || "Попробуйте открыть карточку заново."}</div>
            </Section>
          </DetailsWrapper>
        </DetailsPageWrap>
      </StoreLayout>
    );
  }

  const genres = (movie.genres ?? []).map((item) => item.name).join(", ");
  const studios = (movie.production_companies ?? [])
    .map((item) => item.name)
    .join(", ");
  const langs = (movie.spoken_languages ?? [])
    .map((item) => item.name || item.english_name)
    .join(", ");

  return (
    <StoreLayout
      variant="store-main"
      topTab="top"
      accentTone="movies"
      hideSideSectionOnMobile
    >
      <DetailsPageWrap>
        <DetailsWrapper
          className="movie-details"
          data-docid={`movie-${movie.id}`}
        >
          {movieAsApp ? (
            <DetailsInfoSection
              app={movieAsApp}
              actionLabel="Смотреть"
              showTopDeveloperBadge={false}
              onDownloadClick={() => {
                window.open(
                  `https://www.themoviedb.org/movie/${movie.id}`,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            />
          ) : null}

          <ScreenshotsSection
            screenshots={screens}
            trailerImage={screens[0]}
            appName={movie.title}
          />

          <DescriptionSection
            description={[movie.overview || "Описание фильма отсутствует."]}
          />

          <Section>
            <H2>Дополнительная информация</H2>
            <InfoGrid>
              <div>
                <InfoTitle>Дата выхода</InfoTitle>
                <div>{formatDate(movie.release_date)}</div>
              </div>
              <div>
                <InfoTitle>Длительность</InfoTitle>
                <div>{formatRuntime(movie.runtime)}</div>
              </div>
              <div>
                <InfoTitle>Статус</InfoTitle>
                <div>{movie.status || "Неизвестно"}</div>
              </div>
              <div>
                <InfoTitle>Жанры</InfoTitle>
                <div>{genres || "Не указаны"}</div>
              </div>
              <div>
                <InfoTitle>Студии</InfoTitle>
                <div>{studios || "Не указаны"}</div>
              </div>
              <div>
                <InfoTitle>Языки</InfoTitle>
                <div>{langs || "Не указаны"}</div>
              </div>
              <div>
                <InfoTitle>Сайт</InfoTitle>
                <div>{movie.homepage || "Отсутствует"}</div>
              </div>
            </InfoGrid>
          </Section>

          <Section>
            <H2>Похожие фильмы</H2>
            <Grid>
              {similar.map((item) => (
                <AppCard key={item.id} item={item} mode="movie" to={item.to} />
              ))}
            </Grid>
          </Section>
        </DetailsWrapper>
      </DetailsPageWrap>
    </StoreLayout>
  );
}
