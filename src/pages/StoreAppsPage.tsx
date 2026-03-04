import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRail, Grid, StoreLayout } from "../components/storeStyles";
import { AppCard, AppCardSkeleton } from "../components/AppCard";
import { AppSearch } from "../components/store/AppSearch";
import { loadStoreApps, type AppData } from "../data/apps";
import { playCategories } from "../data/playCategories";

const ALL_CATEGORIES_LABEL = "Категории";
const CONTENT_APPS = "Приложения";
const CONTENT_GAMES = "Игры";
const APPS_BATCH_SIZE = 40;
const INITIAL_SKELETON_COUNT = 18;

function toUpdatedTimestamp(value?: string) {
  const parsed = Date.parse(String(value ?? ""));
  return Number.isNaN(parsed) ? 0 : parsed;
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

function byUpdatedAtDesc(a: AppData, b: AppData) {
  const diff =
    toUpdatedTimestamp(b.updatedAt) - toUpdatedTimestamp(a.updatedAt);
  if (diff !== 0) return diff;
  const installDiff =
    parseInstallFloor(b.installs) - parseInstallFloor(a.installs);
  if (installDiff !== 0) return installDiff;
  const ratingDiff = (b.ratingValue ?? 0) - (a.ratingValue ?? 0);
  if (ratingDiff !== 0) return ratingDiff;
  return a.name.localeCompare(b.name, "ru");
}

type StoreAppsPageProps = {
  initialContentType?: "apps" | "games";
};

export function StoreAppsPage({
  initialContentType = "apps",
}: StoreAppsPageProps) {
  const defaultContentType =
    initialContentType === "games" ? CONTENT_GAMES : CONTENT_APPS;
  const [appsData, setAppsData] = useState<AppData[]>([]);
  const [query, setQuery] = useState("");
  const [contentType, setContentType] = useState(defaultContentType);
  const [category, setCategory] = useState(ALL_CATEGORIES_LABEL);
  const [visibleCount, setVisibleCount] = useState(APPS_BATCH_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "Google Play Маркет";
  }, []);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
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
    setContentType(defaultContentType);
    setCategory(ALL_CATEGORIES_LABEL);
  }, [defaultContentType]);

  const categoryLabelToId = useMemo(() => {
    return new Map(playCategories.map((item) => [item.label, item.id]));
  }, []);

  const appCategories = useMemo(
    () => playCategories.filter((item) => !item.id.startsWith("GAME_")),
    [],
  );
  const gameCategories = useMemo(
    () => playCategories.filter((item) => item.id.startsWith("GAME_")),
    [],
  );

  const categoryOptions = useMemo(() => {
    const list = contentType === CONTENT_GAMES ? gameCategories : appCategories;
    return [ALL_CATEGORIES_LABEL, ...list.map((item) => item.label)];
  }, [appCategories, contentType, gameCategories]);

  const filteredApps = useMemo(() => {
    const value = query.trim().toLowerCase();
    const selectedCategoryId =
      category === ALL_CATEGORIES_LABEL
        ? null
        : (categoryLabelToId.get(category) ?? category);
    const selectedGameType = contentType === CONTENT_GAMES;

    return appsData
      .filter((item) => {
        const isGame = item.category.startsWith("GAME_");
        if (isGame !== selectedGameType) return false;

        const categoryMatch =
          selectedCategoryId === null || item.category === selectedCategoryId;
        if (!categoryMatch) return false;
        if (!value) return true;
        const haystack =
          `${item.name} ${item.publisher} ${item.id}`.toLowerCase();
        return haystack.includes(value);
      })
      .sort(byUpdatedAtDesc);
  }, [appsData, category, categoryLabelToId, contentType, query]);

  useEffect(() => {
    setCategory(ALL_CATEGORIES_LABEL);
  }, [contentType]);

  useEffect(() => {
    setVisibleCount(APPS_BATCH_SIZE);
  }, [query, category, contentType]);

  useEffect(() => {
    if (isLoading) return;

    const node = loadMoreRef.current;
    if (!node) return;
    if (visibleCount >= filteredApps.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisibleCount((current) =>
          Math.min(current + APPS_BATCH_SIZE, filteredApps.length),
        );
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [filteredApps.length, isLoading, visibleCount]);

  const visibleApps = filteredApps.slice(0, visibleCount);

  return (
    <StoreLayout
      sectionTitle={contentType}
      variant="apps"
      brandContentType={contentType === CONTENT_GAMES ? "games" : "apps"}
      topTab="new"
      hideSideSectionOnMobile
      categoryFilter={{
        value: category,
        options: categoryOptions,
        onChange: setCategory,
      }}
    >
      <ArrowRail>?</ArrowRail>
      <AppSearch value={query} onChange={setQuery} placeholder="Искать" />
      <Grid>
        {isLoading
          ? Array.from({ length: INITIAL_SKELETON_COUNT }).map((_, index) => (
              <AppCardSkeleton key={`apps-skeleton-${index}`} />
            ))
          : visibleApps.map((item) => <AppCard key={item.id} item={item} />)}
      </Grid>
      {!isLoading && visibleCount < filteredApps.length ? (
        <div ref={loadMoreRef} style={{ height: "1px", width: "100%" }} />
      ) : null}
    </StoreLayout>
  );
}
