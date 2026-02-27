import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { AppMiniSection } from "../components/appDetails/AppMiniSection";
import { DescriptionSection } from "../components/appDetails/DescriptionSection";
import { DetailsInfoSection } from "../components/appDetails/DetailsInfoSection";
import { ReviewsBlock } from "../components/appDetails/ReviewsBlock";
import { ScreenshotsSection } from "../components/appDetails/ScreenshotsSection";
import { getAppById, storeApps, type AppData } from "../data/apps";
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

export function AppDetailsPage() {
  const { id } = useParams();
  const app = getAppById(id);
  const isAppData = (entry: AppData | undefined): entry is AppData =>
    Boolean(entry);

  const similarApps = useMemo(
    () =>
      app.similarIds
        .map((similarId) => storeApps.find((entry) => entry.id === similarId))
        .filter(isAppData),
    [app.similarIds],
  );
  const moreFromDeveloper = useMemo(
    () =>
      app.moreFromDeveloperIds
        .map((moreId) => storeApps.find((entry) => entry.id === moreId))
        .filter(isAppData),
    [app.moreFromDeveloperIds],
  );

  useEffect(() => {
    document.title = `${app.name} - \u0047\u006f\u006f\u0067\u006c\u0065\u0020\u0050\u006c\u0061\u0079\u0020\u041c\u0430\u0440\u043a\u0435\u0442`;
  }, [app.name]);

  return (
    <StoreLayout variant="apps" topTab="home" hideSideSectionOnMobile>
      <DetailsPageWrap>
        <DetailsWrapper data-docid={app.id}>
          <DetailsInfoSection app={app} />
          <ScreenshotsSection
            screenshots={app.screenshots}
            trailerImage={app.trailerImage}
            appName={app.name}
          />
          <DescriptionSection description={app.description} />

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
                <div>{app.updatedAt}</div>
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

          <AppMiniSection title="Похожие" apps={similarApps} />
          <AppMiniSection
            title="Ещё от разработчика"
            apps={moreFromDeveloper}
          />
        </DetailsWrapper>
      </DetailsPageWrap>
    </StoreLayout>
  );
}
