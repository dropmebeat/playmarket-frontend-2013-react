import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { ApkDownloadSection } from "../components/appDetails/ApkDownloadSection";
import { AppMiniSection } from "../components/appDetails/AppMiniSection";
import { DescriptionSection } from "../components/appDetails/DescriptionSection";
import { DetailsInfoSection } from "../components/appDetails/DetailsInfoSection";
import { ReviewsBlock } from "../components/appDetails/ReviewsBlock";
import { ScreenshotsSection } from "../components/appDetails/ScreenshotsSection";
import { AppCardSkeleton } from "../components/AppCard";
import { loadStoreApps, type AppData } from "../data/apps";
import { StoreLayout } from "../components/storeStyles";
import {
  DetailsPageWrap,
  DetailsWrapper,
  H2,
  InfoGrid,
  InfoTitle,
  Section,
  TextList,
} from "../styles/appDetailsStyles";

const shimmer = keyframes`
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
`;

const SkeletonBlock = styled.div`
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bg-panel) 82%, #000 18%) 0%,
    var(--bg-panel) 50%,
    color-mix(in srgb, var(--bg-panel) 82%, #000 18%) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.3s ease-in-out infinite;
`;

const SkeletonInfo = styled.section`
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 16px;
  padding: 10px 0 14px;
  border-bottom: 1px solid var(--border-main);
  background: var(--bg-panel-soft);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonCover = styled(SkeletonBlock)`
  width: 210px;
  height: 210px;
  border-radius: 22px;

  @media (max-width: 760px) {
    width: 140px;
    height: 140px;
  }
`;

const SkeletonColumn = styled.div`
  min-width: 0;
`;

const SkeletonTitle = styled(SkeletonBlock)`
  height: 40px;
  width: min(520px, 100%);
  border-radius: 6px;
  margin-bottom: 12px;
`;

const SkeletonLine = styled(SkeletonBlock)<{ $width?: string }>`
  height: 14px;
  width: ${({ $width }) => $width ?? "100%"};
  border-radius: 4px;
  margin-bottom: 8px;
`;

const SkeletonGallery = styled.section`
  border-top: 1px solid var(--border-main);
  border-bottom: 1px solid var(--border-main);
  background: var(--bg-panel);
  padding: 12px 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonShot = styled(SkeletonBlock)`
  height: 240px;
  border-radius: 3px;
`;

const SkeletonCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(146px, 1fr));
  gap: 10px;
`;

function DetailsPageSkeleton() {
  return (
    <DetailsPageWrap>
      <DetailsWrapper>
        <SkeletonInfo>
          <SkeletonCover />
          <SkeletonColumn>
            <SkeletonTitle />
            <SkeletonLine $width="44%" />
            <SkeletonLine $width="28%" />
            <SkeletonLine $width="38%" />
            <SkeletonLine $width="65%" />
          </SkeletonColumn>
        </SkeletonInfo>

        <SkeletonGallery>
          <SkeletonShot />
          <SkeletonShot />
          <SkeletonShot />
        </SkeletonGallery>

        <Section>
          <H2>Описание</H2>
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine $width="88%" />
          <SkeletonLine />
          <SkeletonLine $width="75%" />
        </Section>

        <Section>
          <H2>Отзывы</H2>
          <SkeletonLine $width="36%" />
          <SkeletonLine />
          <SkeletonLine $width="70%" />
        </Section>

        <Section>
          <H2>Дополнительная информация</H2>
          <InfoGrid>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={`details-skeleton-info-${index}`}>
                <InfoTitle>
                  <SkeletonLine $width="70%" />
                </InfoTitle>
                <SkeletonLine $width="95%" />
              </div>
            ))}
          </InfoGrid>
        </Section>

        <Section>
          <H2>Похожие</H2>
          <SkeletonCardsGrid>
            {Array.from({ length: 7 }).map((_, index) => (
              <AppCardSkeleton key={`details-skeleton-card-${index}`} />
            ))}
          </SkeletonCardsGrid>
        </Section>
      </DetailsWrapper>
    </DetailsPageWrap>
  );
}

function resolveAppById(apps: AppData[], id?: string) {
  if (!apps.length) return undefined;
  if (!id) return apps[0];
  return apps.find((entry) => entry.id === id) ?? apps[0];
}

export function AppDetailsPage() {
  const { id } = useParams();
  const [appsData, setAppsData] = useState<AppData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const apkSectionRef = useRef<HTMLElement | null>(null);

  const handleDownloadClick = useCallback(() => {
    apkSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  const app = useMemo(() => resolveAppById(appsData, id), [appsData, id]);
  const isGameApp = Boolean(app?.category?.startsWith("GAME_"));

  const similarApps = useMemo(() => {
    if (!app) return [];
    const byId = new Map(appsData.map((entry) => [entry.id, entry]));
    const direct = app.similarIds
      .map((similarId) => byId.get(similarId))
      .filter((entry): entry is AppData => Boolean(entry));
    if (direct.length >= 10) return direct.slice(0, 10);

    const used = new Set(direct.map((entry) => entry.id));
    used.add(app.id);
    const sameCategory = appsData.filter(
      (entry) => entry.category === app.category && !used.has(entry.id),
    );
    const filled = [...direct];
    for (const entry of sameCategory) {
      if (filled.length >= 10) break;
      used.add(entry.id);
      filled.push(entry);
    }

    if (filled.length < 10) {
      for (const entry of appsData) {
        if (filled.length >= 10) break;
        if (used.has(entry.id)) continue;
        used.add(entry.id);
        filled.push(entry);
      }
    }

    return filled.slice(0, 10);
  }, [app, appsData]);

  const moreFromDeveloper = useMemo(() => {
    if (!app) return [];
    const byId = new Map(appsData.map((entry) => [entry.id, entry]));
    return app.moreFromDeveloperIds
      .map((moreId) => byId.get(moreId))
      .filter((entry): entry is AppData => Boolean(entry));
  }, [app, appsData]);

  useEffect(() => {
    if (!app) {
      document.title = "Google Play Маркет";
      return;
    }
    document.title = `${app.name} - Google Play Маркет`;
  }, [app]);

  if (isLoading || !app) {
    return (
      <StoreLayout
        variant="apps"
        brandContentType={isGameApp ? "games" : "apps"}
        topTab="home"
        hideSideSectionOnMobile
      >
        <DetailsPageSkeleton />
      </StoreLayout>
    );
  }

  const formattedUpdatedAt = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${app.updatedAt}T00:00:00`));

  return (
    <StoreLayout
      variant="apps"
      brandContentType={isGameApp ? "games" : "apps"}
      topTab="home"
      hideSideSectionOnMobile
    >
      <DetailsPageWrap>
        <DetailsWrapper data-docid={app.id}>
          <DetailsInfoSection app={app} onDownloadClick={handleDownloadClick} />
          <ScreenshotsSection
            screenshots={app.screenshots}
            trailerImage={app.trailerImage}
            trailerUrl={app.trailerUrl}
            appName={app.name}
          />
          <DescriptionSection description={app.description} />
          <ApkDownloadSection app={app} sectionRef={apkSectionRef} />

          <ReviewsBlock app={app} />

          <Section>
            <H2>Что нового</H2>
            <TextList>
              {app.whatsNew.map((item) => (
                <p key={item}>- {item}</p>
              ))}
            </TextList>
          </Section>

          <Section>
            <H2>Дополнительная информация</H2>
            <InfoGrid>
              <div>
                <InfoTitle>Обновлено</InfoTitle>
                <div>{formattedUpdatedAt}</div>
              </div>
              <div>
                <InfoTitle>Размер</InfoTitle>
                <div>{app.size}</div>
              </div>
              <div>
                <InfoTitle>Установок</InfoTitle>
                <div>{app.installs}</div>
              </div>
              <div>
                <InfoTitle>Текущая версия</InfoTitle>
                <div>{app.version}</div>
              </div>
              <div>
                <InfoTitle>Требуется Android</InfoTitle>
                <div>{app.requiresAndroid}</div>
              </div>
              <div>
                <InfoTitle>Возрастной рейтинг</InfoTitle>
                <div>{app.contentRating}</div>
              </div>
              <div>
                <InfoTitle>Разработчик</InfoTitle>
                <div>{app.website ?? "Сайт разработчика"}</div>
                <div>{app.privacyPolicy ?? "Политика конфиденциальности"}</div>
              </div>
            </InfoGrid>
          </Section>

          <AppMiniSection
            title="Похожие"
            apps={similarApps}
            limit={10}
            framed
            showAllDesktop
          />
          <AppMiniSection
            title="Ещё от разработчика"
            apps={moreFromDeveloper}
            framed
          />
        </DetailsWrapper>
      </DetailsPageWrap>
    </StoreLayout>
  );
}
