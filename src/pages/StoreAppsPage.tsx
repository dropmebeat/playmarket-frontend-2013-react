import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRail, Grid, StoreLayout } from "../components/storeStyles";
import { AppCard } from "../components/AppCard";
import { AppSearch } from "../components/store/AppSearch";
import { storeApps } from "../data/apps";
import { playCategories } from "../data/playCategories";

const ALL_CATEGORIES_LABEL =
  "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438";
const CONTENT_APPS =
  "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F";
const CONTENT_GAMES = "\u0418\u0433\u0440\u044B";
const APPS_BATCH_SIZE = 40;

export function StoreAppsPage() {
  const [query, setQuery] = useState("");
  const [contentType, setContentType] = useState(CONTENT_APPS);
  const [category, setCategory] = useState(ALL_CATEGORIES_LABEL);
  const [visibleCount, setVisibleCount] = useState(APPS_BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title =
      "\u0047\u006f\u006f\u0067\u006c\u0065\u0020\u0050\u006c\u0061\u0079\u0020\u041c\u0430\u0440\u043a\u0435\u0442";
  }, []);

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

    return storeApps.filter((item) => {
      const isGame = item.category.startsWith("GAME_");
      if (isGame !== selectedGameType) return false;

      const categoryMatch =
        selectedCategoryId === null || item.category === selectedCategoryId;
      if (!categoryMatch) return false;
      if (!value) return true;
      const haystack =
        `${item.name} ${item.publisher} ${item.id}`.toLowerCase();
      return haystack.includes(value);
    });
  }, [category, categoryLabelToId, contentType, query]);

  useEffect(() => {
    setCategory(ALL_CATEGORIES_LABEL);
  }, [contentType]);

  useEffect(() => {
    setVisibleCount(APPS_BATCH_SIZE);
  }, [query, category, contentType]);

  useEffect(() => {
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
  }, [filteredApps.length, visibleCount]);

  const visibleApps = filteredApps.slice(0, visibleCount);

  return (
    <StoreLayout
      sectionTitle={contentType}
      variant="apps"
      topTab="new"
      hideSideSectionOnMobile
      typeFilter={{
        value: contentType,
        options: [CONTENT_APPS, CONTENT_GAMES],
        onChange: setContentType,
      }}
      categoryFilter={{
        value: category,
        options: categoryOptions,
        onChange: setCategory,
      }}
    >
      <ArrowRail>?</ArrowRail>
      <AppSearch
        value={query}
        onChange={setQuery}
        placeholder={"\u0418\u0441\u043A\u0430\u0442\u044C"}
      />
      <Grid>
        {visibleApps.map((item) => (
          <AppCard key={item.id} item={item} />
        ))}
      </Grid>
      {visibleCount < filteredApps.length ? (
        <div ref={loadMoreRef} style={{ height: "1px", width: "100%" }} />
      ) : null}
    </StoreLayout>
  );
}
