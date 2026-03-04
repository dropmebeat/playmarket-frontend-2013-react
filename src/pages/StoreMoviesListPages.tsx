import { useEffect, useMemo, useRef, useState } from "react";
import { AppCard, AppCardSkeleton } from "../components/AppCard";
import { AppSearch } from "../components/store/AppSearch";
import { ArrowRail, Grid, StoreLayout } from "../components/storeStyles";
import {
  fetchAllTimePopularMoviesPage,
  fetchNowPlayingMoviesPage,
  getPosterUrl,
  type TmdbMovie,
} from "../data/tmdb";
import type { StoreItem } from "../storeData";

const INITIAL_SKELETON_COUNT = 18;

type MovieCard = StoreItem & {
  ratingValue: number;
  to: string;
};

type PagedMoviesResult = {
  results: TmdbMovie[];
  page: number;
  hasNextPage: boolean;
};

async function mapTmdbToCards(items: TmdbMovie[]): Promise<MovieCard[]> {
  return Promise.all(
    items.map(async (movie) => {
      const poster = await getPosterUrl(movie.poster_path);
      return {
        id: `tmdb-${movie.id}`,
        name: movie.title || movie.original_title || `Фильм ${movie.id}`,
        publisher: movie.release_date || "Дата выхода неизвестна",
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

function mergeUniqueMovies(prev: MovieCard[], next: MovieCard[]) {
  const byId = new Map(prev.map((item) => [item.id, item]));
  for (const item of next) {
    if (!byId.has(item.id)) byId.set(item.id, item);
  }
  return Array.from(byId.values());
}

function MoviesListPage({
  title,
  subtitle,
  topTab,
  loadMovies,
  loadMoviesPage,
}: {
  title: string;
  subtitle: string;
  topTab: "top" | "new";
  loadMovies?: () => Promise<TmdbMovie[]>;
  loadMoviesPage?: (page: number) => Promise<PagedMoviesResult>;
}) {
  const [movies, setMovies] = useState<MovieCard[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(Boolean(loadMoviesPage));
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setErrorText("");
    setPage(1);
    setHasNextPage(Boolean(loadMoviesPage));

    const initialPromise = loadMoviesPage
      ? loadMoviesPage(1)
      : loadMovies
        ? loadMovies()
        : Promise.resolve([]);

    Promise.resolve(initialPromise)
      .then(async (payload) => {
        if (!active) return;
        if (loadMoviesPage) {
          const paged = payload as PagedMoviesResult;
          const cards = await mapTmdbToCards(paged.results);
          if (!active) return;
          setMovies(cards);
          setPage(paged.page);
          setHasNextPage(paged.hasNextPage);
        } else {
          const list = payload as TmdbMovie[];
          const cards = await mapTmdbToCards(list);
          if (!active) return;
          setMovies(cards);
        }
      })
      .catch((error) => {
        if (!active) return;
        setErrorText(
          error instanceof Error
            ? error.message
            : "Не удалось загрузить фильмы.",
        );
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadMovies, loadMoviesPage]);

  const filteredMovies = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return movies;
    return movies.filter((item) => {
      const haystack =
        `${item.name} ${item.publisher} ${item.id}`.toLowerCase();
      return haystack.includes(value);
    });
  }, [movies, query]);

  useEffect(() => {
    if (!loadMoviesPage) return;
    if (isLoading || isLoadingMore) return;
    if (!hasNextPage) return;

    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        setIsLoadingMore(true);
        loadMoviesPage(page + 1)
          .then(async (payload) => {
            const cards = await mapTmdbToCards(payload.results);
            setMovies((prev) => mergeUniqueMovies(prev, cards));
            setPage(payload.page);
            setHasNextPage(payload.hasNextPage);
          })
          .catch((error) => {
            setErrorText(
              error instanceof Error
                ? error.message
                : "Не удалось подгрузить фильмы.",
            );
          })
          .finally(() => {
            setIsLoadingMore(false);
          });
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isLoading, isLoadingMore, loadMoviesPage, page]);

  return (
    <StoreLayout
      sectionTitle={title}
      variant="apps"
      brandContentType="movies"
      accentTone="movies"
      topTab={topTab}
      topTabLinks={{
        home: "/store/movies",
        top: "/movies/popular",
        new: "/movies/new",
      }}
      hideSideSectionOnMobile
    >
      <ArrowRail>?</ArrowRail>
      <AppSearch
        value={query}
        onChange={setQuery}
        placeholder="Искать фильмы"
      />
      <div
        style={{
          width: "100%",
          marginBottom: "10px",
          color: "var(--text-soft)",
          fontSize: "12px",
        }}
      >
        {subtitle}
        {errorText ? ` • ${errorText}` : ""}
      </div>
      <Grid>
        {isLoading
          ? Array.from({ length: INITIAL_SKELETON_COUNT }).map((_, i) => (
              <AppCardSkeleton key={`movies-list-${i}`} mode="movie" />
            ))
          : filteredMovies.map((item) => (
              <AppCard key={item.id} item={item} mode="movie" to={item.to} />
            ))}
      </Grid>
      {isLoadingMore ? (
        <div
          style={{
            width: "100%",
            marginTop: "12px",
            color: "var(--text-soft)",
            fontSize: "12px",
          }}
        >
          Подгружаем ещё фильмы...
        </div>
      ) : null}
      {!isLoading && hasNextPage ? (
        <div ref={loadMoreRef} style={{ height: "1px", width: "100%" }} />
      ) : null}
    </StoreLayout>
  );
}

export function StoreMoviesPopularPage() {
  return (
    <MoviesListPage
      title="Популярные фильмы"
      subtitle="Все популярные фильмы за всё время"
      topTab="top"
      loadMoviesPage={(page) => fetchAllTimePopularMoviesPage(page)}
    />
  );
}

export function StoreMoviesNewPage() {
  return (
    <MoviesListPage
      title="Новые релизы"
      subtitle="Фильмы, которые сейчас в прокате"
      topTab="new"
      loadMoviesPage={(page) => fetchNowPlayingMoviesPage(page)}
    />
  );
}
