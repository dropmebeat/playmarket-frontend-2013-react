import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import gplay from "google-play-scraper";

const COUNTRY = process.env.PLAY_COUNTRY ?? "us";
const LANG = process.env.PLAY_LANG ?? "en";
const FEED_SIZE = Number.parseInt(process.env.PLAY_FEED_SIZE ?? "500", 10);
const FEED_CONCURRENCY = Number.parseInt(process.env.PLAY_FEED_CONCURRENCY ?? "4", 10);
const DETAIL_CONCURRENCY = Number.parseInt(process.env.PLAY_DETAIL_CONCURRENCY ?? "12", 10);
const BATCH_SIZE = Number.parseInt(process.env.PLAY_BATCH_SIZE ?? "1000", 10);
const MAX_NEW_APPS = Number.parseInt(process.env.PLAY_MAX_NEW_APPS ?? "0", 10);

const OUT_APPS_FILE = path.resolve("src/data/apps.generated.ts");
const OUT_CATEGORIES_FILE = path.resolve("src/data/playCategories.generated.ts");

const fallbackReviewAvatar = "/assets/users/unnamed.png";
const defaultReviews = [
  {
    id: "r1",
    author: "Alex",
    text: "Works well and stays stable after recent updates.",
    stars: 4,
    avatar: fallbackReviewAvatar,
  },
  {
    id: "r2",
    author: "Sam",
    text: "Good app overall, but there is room for polish.",
    stars: 4,
    avatar: fallbackReviewAvatar,
  },
];

function stripHtml(input) {
  return String(input ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function toTimestamp(value) {
  if (!value && value !== 0) return 0;
  if (typeof value === "number") return value;
  const parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDate(value) {
  if (value === null || value === undefined || value === "") return "Unknown";
  if (typeof value === "number") return new Date(value).toISOString().slice(0, 10);
  const parsed = Date.parse(String(value));
  if (Number.isNaN(parsed)) return String(value);
  return new Date(parsed).toISOString().slice(0, 10);
}

function categoryLabelFromId(id) {
  return id
    .replace(/^GAME_/g, "GAME ")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bAnd\b/g, "&");
}

function chooseIcon(genreId) {
  const g = String(genreId ?? "").toLowerCase();
  if (g.includes("music")) return "music";
  if (g.includes("video")) return "video";
  if (g.includes("photo") || g.includes("camera")) return "camera";
  if (g.includes("news")) return "newspaper";
  if (g.includes("book")) return "file";
  if (g.includes("sport")) return "heartbeat";
  if (g.includes("social")) return "wifi";
  if (g.includes("map") || g.includes("travel")) return "rotate";
  if (g.includes("shopping")) return "cart";
  if (g.includes("game")) return "gamepad";
  return "gamepad";
}

function chooseColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return `hsl(${hue} 45% 45%)`;
}

function formatInstalls(min, max) {
  const format = (n) => (n ? Number(n).toLocaleString("en-US") : "");
  if (min && max) return `${format(min)} - ${format(max)}`;
  if (min) return `${format(min)}+`;
  return "Unknown";
}

function formatPrice(app) {
  if (app.free || Number(app.price) === 0) return "FREE";
  const currency = app.currency ? `${app.currency} ` : "$";
  const numeric = Number(app.price);
  if (Number.isNaN(numeric)) return `${currency}${app.price}`;
  return `${currency}${numeric.toFixed(2)}`;
}

async function mapWithConcurrency(items, limit, mapper) {
  const result = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      result[current] = await mapper(items[current], current);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return result;
}

function getCollections() {
  const allCollections = Object.values(gplay.collection);
  const fromEnv = (process.env.PLAY_COLLECTIONS ?? "").trim();
  if (!fromEnv) return allCollections;
  const selected = fromEnv.split(",").map((value) => value.trim()).filter(Boolean);
  return selected.filter((value) => allCollections.includes(value));
}

function getCategoryIds() {
  const allCategoryIds = Object.values(gplay.category).filter((value) => typeof value === "string");
  const fromEnv = (process.env.PLAY_CATEGORIES ?? "ALL").trim();
  if (fromEnv === "ALL") return allCategoryIds;
  const selected = fromEnv.split(",").map((value) => value.trim()).filter(Boolean);
  return selected.filter((value) => allCategoryIds.includes(value));
}

function parseGeneratedArray(sourceText, exportName) {
  const marker = `export const ${exportName}`;
  const markerIndex = sourceText.indexOf(marker);
  if (markerIndex < 0) return [];

  const start = sourceText.indexOf("[", markerIndex);
  const end = sourceText.lastIndexOf("];");
  if (start < 0 || end < 0 || end <= start) return [];

  const json = sourceText.slice(start, end + 1);
  return JSON.parse(json);
}

async function readExistingApps() {
  try {
    const text = await readFile(OUT_APPS_FILE, "utf8");
    const parsed = parseGeneratedArray(text, "generatedStoreApps");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function fetchFeedAppIds() {
  const collections = getCollections();
  const categoryIds = getCategoryIds();

  const feedJobs = [];
  for (const collection of collections) {
    for (const category of categoryIds) {
      feedJobs.push({ collection, category });
    }
  }

  console.log(
    `Fetching feeds: ${feedJobs.length} combinations, ${FEED_SIZE} apps/feed (${COUNTRY}/${LANG})...`,
  );

  const feedResults = await mapWithConcurrency(feedJobs, FEED_CONCURRENCY, async (job) => {
    try {
      const apps = await gplay.list({
        collection: job.collection,
        category: job.category,
        num: FEED_SIZE,
        country: COUNTRY,
        lang: LANG,
      });
      return { ...job, apps };
    } catch {
      return { ...job, apps: [] };
    }
  });

  const byAppId = new Map();
  for (const feed of feedResults) {
    for (const app of feed.apps) {
      if (!app?.appId) continue;
      const ts = toTimestamp(app.released) || toTimestamp(app.updated);
      const existing = byAppId.get(app.appId);
      if (!existing || ts > existing._ts) {
        byAppId.set(app.appId, {
          ...app,
          genreId: app.genreId ?? feed.category,
          _ts: ts,
        });
      }
    }
  }

  return Array.from(byAppId.values()).sort((a, b) => (b._ts ?? 0) - (a._ts ?? 0));
}

async function fetchAppDetails(feedApps) {
  return mapWithConcurrency(feedApps, DETAIL_CONCURRENCY, async (item) => {
    try {
      const full = await gplay.app({
        appId: item.appId,
        country: COUNTRY,
        lang: LANG,
      });
      return { ...item, ...full, _ts: item._ts };
    } catch {
      return item;
    }
  });
}

function normalizeApps(rawApps) {
  return rawApps.map((app) => {
    const categoryId = app.genreId || app.category || "APPLICATION";
    const descriptionText = stripHtml(app.description || app.summary);
    const recentChanges = stripHtml(app.recentChanges);
    const screenshots = (app.screenshots ?? []).slice(0, 8);

    return {
      id: app.appId ?? app.id,
      name: app.title ?? app.name ?? app.appId ?? app.id,
      publisher: app.developer ?? app.publisher ?? "Unknown developer",
      subtitle: `${app.developer ?? app.publisher ?? "Unknown developer"} - ${formatDate(app.released ?? app.updated ?? app.updatedAt)}`,
      category: categoryId,
      price: formatPrice(app),
      color: app.color ?? chooseColor(app.appId ?? app.id),
      icon: app.icon ?? chooseIcon(categoryId),
      image: app.iconUrl ?? app.image ?? app.icon,
      updatedAt: formatDate(app.updated ?? app.released ?? app.updatedAt),
      size: app.size ?? "Varies with device",
      installs: formatInstalls(app.minInstalls, app.maxInstalls) || app.installs || "Unknown",
      version: app.version ?? "Varies with device",
      requiresAndroid: app.androidVersionText ?? app.requiresAndroid ?? "Varies with device",
      contentRating: app.contentRating ?? "Everyone",
      website: app.developerWebsite || app.website || undefined,
      privacyPolicy: app.privacyPolicy || undefined,
      description: descriptionText ? [descriptionText] : app.description ?? ["No description provided."],
      whatsNew: recentChanges ? [recentChanges] : app.whatsNew ?? ["Data refreshed from Google Play."],
      trailerImage: app.headerImage || app.trailerImage || undefined,
      screenshots: screenshots.length ? screenshots : app.screenshots ?? [app.icon].filter(Boolean),
      ratingValue: Number(app.score ?? app.ratingValue ?? 0),
      ratingCountText: app.ratingCountText ?? `(${Number(app.ratings ?? 0).toLocaleString("en-US")})`,
      reviews: app.reviews ?? defaultReviews,
      similarIds: [],
      moreFromDeveloperIds: [],
    };
  }).filter((item) => Boolean(item.id));
}

function addRelations(apps) {
  const ids = apps.map((app) => app.id);
  const byPublisher = new Map();
  for (const app of apps) {
    const list = byPublisher.get(app.publisher) ?? [];
    list.push(app.id);
    byPublisher.set(app.publisher, list);
  }

  return apps.map((app, index) => {
    const similarIds = [];
    for (let i = 1; similarIds.length < 3 && i < ids.length; i += 1) {
      const candidate = ids[(index + i) % ids.length];
      if (candidate !== app.id) similarIds.push(candidate);
    }

    const moreFromDeveloperIds = (byPublisher.get(app.publisher) ?? [])
      .filter((id) => id !== app.id)
      .slice(0, 3);

    return { ...app, similarIds, moreFromDeveloperIds };
  });
}

function mergeById(existingApps, newApps) {
  const merged = [...existingApps];
  const existingIds = new Set(existingApps.map((app) => app.id));
  for (const app of newApps) {
    if (existingIds.has(app.id)) continue;
    existingIds.add(app.id);
    merged.push(app);
  }
  return merged;
}

function buildCategoriesFromApps(apps) {
  const unique = Array.from(new Set(apps.map((app) => app.category).filter(Boolean)));
  const categories = unique.map((id) => ({
    id,
    label: categoryLabelFromId(id),
  }));
  categories.sort((a, b) => a.label.localeCompare(b.label));
  return categories;
}

function asAppsModule(apps) {
  return `import type { AppData } from "./apps";

// AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
// Generated at: ${new Date().toISOString()}
// Source: Google Play (${COUNTRY}/${LANG}), incremental sync.

export const generatedStoreApps: AppData[] = ${JSON.stringify(apps, null, 2)};
`;
}

function asCategoriesModule(categories) {
  return `export type PlayCategory = { id: string; label: string };

// AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
// Generated at: ${new Date().toISOString()}

export const generatedPlayCategories: PlayCategory[] = ${JSON.stringify(categories, null, 2)};
`;
}

async function persist(apps) {
  const normalized = addRelations(apps);
  const categories = buildCategoriesFromApps(normalized);
  await writeFile(OUT_APPS_FILE, asAppsModule(normalized), "utf8");
  await writeFile(OUT_CATEGORIES_FILE, asCategoriesModule(categories), "utf8");
}

async function main() {
  const existingApps = await readExistingApps();
  const existingIds = new Set(existingApps.map((app) => app.id));
  console.log(`Existing apps in DB: ${existingIds.size}`);

  const feedApps = await fetchFeedAppIds();
  const newFeedApps = feedApps.filter((app) => !existingIds.has(app.appId));
  const queued = MAX_NEW_APPS > 0 ? newFeedApps.slice(0, MAX_NEW_APPS) : newFeedApps;

  console.log(`Found ${feedApps.length} unique from feed, new to add: ${queued.length}`);
  if (!queued.length) {
    await persist(existingApps);
    console.log("No new apps. Categories refreshed.");
    return;
  }

  let currentApps = [...existingApps];
  for (let index = 0; index < queued.length; index += BATCH_SIZE) {
    const chunk = queued.slice(index, index + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(index / BATCH_SIZE) + 1}: ${chunk.length} apps...`);
    const details = await fetchAppDetails(chunk);
    const normalizedChunk = normalizeApps(details);
    currentApps = mergeById(currentApps, normalizedChunk);
    await persist(currentApps);
    console.log(`Saved total apps: ${currentApps.length}`);
  }

  console.log(`Sync complete. Total apps: ${currentApps.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
