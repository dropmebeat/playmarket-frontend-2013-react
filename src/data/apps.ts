import type { StoreItem } from "../storeData";

export type AppReview = {
  id: string;
  author: string;
  text: string;
  stars: number;
  avatar: string;
};

export type AppData = StoreItem & {
  subtitle: string;
  category: string;
  updatedAt: string;
  size: string;
  installs: string;
  version: string;
  requiresAndroid: string;
  contentRating: string;
  website?: string;
  privacyPolicy?: string;
  description: string[];
  whatsNew: string[];
  trailerImage?: string;
  trailerUrl?: string;
  screenshots: string[];
  ratingValue: number;
  ratingCountText: string;
  reviews: AppReview[] | number;
  similarIds: string[];
  moreFromDeveloperIds: string[];
};

let appsCache: AppData[] | null = null;
let appsByIdCache: Map<string, AppData> | null = null;
let loadingPromise: Promise<AppData[]> | null = null;

function buildIndexes(data: AppData[]) {
  appsCache = data;
  appsByIdCache = new Map(data.map((app) => [app.id, app]));
  return data;
}

export async function loadStoreApps(): Promise<AppData[]> {
  if (appsCache) return appsCache;
  if (loadingPromise) return loadingPromise;

  loadingPromise = import("./apps.generated")
    .then((module) => buildIndexes(module.generatedStoreApps as AppData[]))
    .catch((error) => {
      console.error("Failed to load apps.generated.ts:", error);
      return buildIndexes([]);
    })
    .finally(() => {
      loadingPromise = null;
    });

  return loadingPromise;
}

export function getCachedStoreApps() {
  return appsCache ?? [];
}

export function getCachedAppById(id?: string) {
  const data = appsCache;
  if (!data || data.length === 0) return undefined;
  if (!id) return data[0];
  return appsByIdCache?.get(id) ?? data[0];
}
