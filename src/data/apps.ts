import { generatedStoreApps } from "./apps.generated";
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
  screenshots: string[];
  ratingValue: number;
  ratingCountText: string;
  reviews: AppReview[] | number;
  similarIds: string[];
  moreFromDeveloperIds: string[];
};

export const storeApps: AppData[] = generatedStoreApps;

export const appsById = new Map(storeApps.map((app) => [app.id, app]));

export function getAppById(id?: string) {
  if (!id) return storeApps[0];
  return appsById.get(id) ?? storeApps[0];
}
