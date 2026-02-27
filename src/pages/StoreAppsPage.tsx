import { useEffect, useMemo, useState } from "react";
import { ArrowRail, Grid, StoreLayout } from "../components/storeStyles";
import { AppCard } from "../components/AppCard";
import { AppSearch } from "../components/store/AppSearch";
import { storeApps } from "../data/apps";

const ALL_CATEGORIES_LABEL =
  "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438";

export function StoreAppsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES_LABEL);

  useEffect(() => {
    document.title =
      "\u0047\u006f\u006f\u0067\u006c\u0065\u0020\u0050\u006c\u0061\u0079\u0020\u041c\u0430\u0440\u043a\u0435\u0442";
  }, []);

  const categoryOptions = useMemo(
    () => [
      ALL_CATEGORIES_LABEL,
      ...Array.from(new Set(storeApps.map((item) => item.category))).sort(
        (a, b) => a.localeCompare(b),
      ),
    ],
    [],
  );

  const filteredApps = useMemo(() => {
    const value = query.trim().toLowerCase();
    return storeApps.filter((item) => {
      const categoryMatch =
        category === ALL_CATEGORIES_LABEL || item.category === category;
      if (!categoryMatch) return false;
      if (!value) return true;
      const haystack =
        `${item.name} ${item.publisher} ${item.id}`.toLowerCase();
      return haystack.includes(value);
    });
  }, [category, query]);

  return (
    <StoreLayout
      sectionTitle={
        "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F"
      }
      variant="apps"
      topTab="new"
      hideSideSectionOnMobile
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
        {filteredApps.map((item) => (
          <AppCard key={item.id} item={item} />
        ))}
      </Grid>
    </StoreLayout>
  );
}
