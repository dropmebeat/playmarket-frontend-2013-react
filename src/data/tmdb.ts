export type TmdbMovie = {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
};

export type TmdbTvShow = {
  id: number;
  name: string;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
};

export type TmdbMovieDetails = TmdbMovie & {
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  homepage?: string;
  production_companies?: Array<{ id: number; name: string }>;
  tagline?: string;
  status?: string;
  spoken_languages?: Array<{ english_name: string; name: string }>;
};

type TmdbListResponse = {
  page?: number;
  total_pages?: number;
  results?: TmdbMovie[];
};

type TmdbTvListResponse = {
  page?: number;
  total_pages?: number;
  results?: TmdbTvShow[];
};

type TmdbConfigResponse = {
  images?: {
    secure_base_url?: string;
    poster_sizes?: string[];
  };
};

type FetchMoviesParams = {
  language?: string;
  region?: string;
};

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const DEFAULT_LANG = import.meta.env.VITE_TMDB_LANG ?? "ru-RU";
const DEFAULT_REGION = import.meta.env.VITE_TMDB_REGION ?? "RU";
const DEFAULT_POSTER_SIZE = import.meta.env.VITE_TMDB_POSTER_SIZE ?? "w342";

const bearerToken = import.meta.env.VITE_TMDB_BEARER_TOKEN as
  | string
  | undefined;
const apiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined;

let imageBaseUrlCache: string | null = null;

function ensureAuth() {
  if (!bearerToken && !apiKey) {
    throw new Error(
      "TMDB credentials are missing. Set VITE_TMDB_BEARER_TOKEN or VITE_TMDB_API_KEY.",
    );
  }
}

function withAuth(params: URLSearchParams) {
  if (apiKey) params.set("api_key", apiKey);
  return params;
}

async function requestJson<T>(
  path: string,
  params: URLSearchParams,
): Promise<T> {
  ensureAuth();
  const search = withAuth(params);
  const headers = bearerToken
    ? { Authorization: `Bearer ${bearerToken}` }
    : undefined;
  const response = await fetch(`${TMDB_API_BASE}${path}?${search.toString()}`, {
    headers,
  });
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

async function getImageBaseUrl() {
  if (imageBaseUrlCache) return imageBaseUrlCache;

  try {
    const params = new URLSearchParams();
    const config = await requestJson<TmdbConfigResponse>(
      "/configuration",
      params,
    );
    const base = config.images?.secure_base_url;
    imageBaseUrlCache = base ?? "https://image.tmdb.org/t/p/";
    return imageBaseUrlCache;
  } catch {
    imageBaseUrlCache = "https://image.tmdb.org/t/p/";
    return imageBaseUrlCache;
  }
}

async function fetchMovieList(
  endpoint: "/movie/popular" | "/movie/now_playing",
  { language = DEFAULT_LANG, region = DEFAULT_REGION }: FetchMoviesParams = {},
  page = 1,
) {
  const params = new URLSearchParams({
    language,
    region,
    page: String(page),
  });
  const data = await requestJson<TmdbListResponse>(endpoint, params);
  return Array.isArray(data.results) ? data.results : [];
}

async function discoverMovies(
  { language = DEFAULT_LANG, region = DEFAULT_REGION }: FetchMoviesParams = {},
  page = 1,
  sortBy = "vote_count.desc",
) {
  const params = new URLSearchParams({
    language,
    region,
    page: String(page),
    include_adult: "false",
    include_video: "false",
    sort_by: sortBy,
    "vote_count.gte": "2000",
  });
  return requestJson<TmdbListResponse>("/discover/movie", params);
}

async function fetchMovieListById(
  endpoint: `/movie/${string}/similar`,
  { language = DEFAULT_LANG, region = DEFAULT_REGION }: FetchMoviesParams = {},
) {
  const params = new URLSearchParams({
    language,
    region,
    page: "1",
  });
  const data = await requestJson<TmdbListResponse>(endpoint, params);
  return Array.isArray(data.results) ? data.results : [];
}

export async function fetchPopularMovies(params?: FetchMoviesParams) {
  return fetchMovieList("/movie/popular", params);
}

export async function fetchNowPlayingMovies(params?: FetchMoviesParams) {
  return fetchMovieList("/movie/now_playing", params);
}

export async function fetchPopularTvShows({
  language = DEFAULT_LANG,
}: FetchMoviesParams = {}) {
  const params = new URLSearchParams({
    language,
    page: "1",
  });
  const data = await requestJson<TmdbTvListResponse>("/tv/popular", params);
  return Array.isArray(data.results) ? data.results : [];
}

export async function fetchNowPlayingMoviesPage(
  page: number,
  params?: FetchMoviesParams,
) {
  const { language = DEFAULT_LANG, region = DEFAULT_REGION } = params ?? {};
  const query = new URLSearchParams({
    language,
    region,
    page: String(page),
  });
  const data = await requestJson<TmdbListResponse>("/movie/now_playing", query);
  const results = Array.isArray(data.results) ? data.results : [];
  const currentPage = data.page ?? page;
  const totalPages = data.total_pages ?? currentPage;
  return {
    results,
    page: currentPage,
    hasNextPage: currentPage < totalPages,
  };
}

export async function fetchAllTimePopularMovies(params?: FetchMoviesParams) {
  const data = await discoverMovies(params, 1, "vote_count.desc");
  return Array.isArray(data.results) ? data.results : [];
}

export async function fetchAllTimePopularMoviesPage(
  page: number,
  params?: FetchMoviesParams,
) {
  const data = await discoverMovies(params, page, "vote_count.desc");
  const results = Array.isArray(data.results) ? data.results : [];
  const currentPage = data.page ?? page;
  const totalPages = data.total_pages ?? currentPage;
  return {
    results,
    page: currentPage,
    hasNextPage: currentPage < totalPages,
  };
}

export async function fetchMovieDetails(
  movieId: string | number,
  { language = DEFAULT_LANG }: FetchMoviesParams = {},
) {
  const params = new URLSearchParams({ language });
  return requestJson<TmdbMovieDetails>(`/movie/${movieId}`, params);
}

export async function fetchSimilarMovies(
  movieId: string | number,
  params?: FetchMoviesParams,
) {
  return fetchMovieListById(`/movie/${movieId}/similar`, params);
}

export async function getPosterUrl(
  posterPath: string | null,
  size = DEFAULT_POSTER_SIZE,
) {
  if (!posterPath) return undefined;
  const imageBase = await getImageBaseUrl();
  return `${imageBase}${size}${posterPath}`;
}

export async function getBackdropUrl(
  backdropPath: string | null,
  size = "w780",
) {
  if (!backdropPath) return undefined;
  const imageBase = await getImageBaseUrl();
  return `${imageBase}${size}${backdropPath}`;
}
