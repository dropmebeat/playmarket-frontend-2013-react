import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ActionButton } from "../components/common/ActionButton";
import { AppCard, AppCardSkeleton } from "../components/AppCard";
import {
  CardsRow,
  SectionHeader,
  SectionSubtitle,
  StoreLayout,
} from "../components/storeStyles";
import { clearAuthUser, getAuthUser } from "../auth/session";
import { loadStoreApps, type AppData } from "../data/apps";

const ProfileWrap = styled.section`
  width: 100%;
`;

const ProfileCard = styled.article`
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  padding: 16px;
  margin-bottom: 16px;
`;

const ProfileName = styled.h2`
  margin: 0;
  font-size: 30px;
  font-weight: 300;
  color: var(--text-main);
`;

const ProfileInfo = styled.p`
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: 13px;
`;

const ProfileActions = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export function UserPage() {
  const navigate = useNavigate();
  const [appsData, setAppsData] = useState<AppData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = getAuthUser();

  useEffect(() => {
    document.title = "Профиль - Google Play Маркет";
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    let active = true;
    loadStoreApps()
      .then((data) => {
        if (!active) return;
        setAppsData(data);
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate, user]);

  const apps = useMemo(
    () =>
      appsData.filter((item) => !item.category.startsWith("GAME_")).slice(0, 7),
    [appsData],
  );
  const games = useMemo(
    () =>
      appsData.filter((item) => item.category.startsWith("GAME_")).slice(0, 7),
    [appsData],
  );

  if (!user) return null;

  return (
    <StoreLayout variant="apps" topTab="home" hideSideSectionOnMobile>
      <ProfileWrap>
        <ProfileCard>
          <ProfileName>{user.name}</ProfileName>
          <ProfileInfo>{user.email}</ProfileInfo>
          <ProfileInfo>
            Дата регистрации:{" "}
            {new Intl.DateTimeFormat("ru-RU", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(new Date(user.createdAt))}
          </ProfileInfo>
          <ProfileActions>
            <ActionButton
              type="button"
              ariaLabel="Перейти в приложения"
              onClick={() => navigate("/store/apps")}
            >
              Мои приложения
            </ActionButton>
            <ActionButton
              type="button"
              ariaLabel="Выйти из аккаунта"
              variant="primary"
              onClick={() => {
                clearAuthUser();
                navigate("/auth");
              }}
            >
              Выйти
            </ActionButton>
          </ProfileActions>
        </ProfileCard>

        <SectionHeader>
          <h3>Недавно просмотренные приложения</h3>
          <button type="button" onClick={() => navigate("/store/apps")}>
            Смотреть больше
          </button>
        </SectionHeader>
        <SectionSubtitle>Подборка для вашего профиля</SectionSubtitle>
        <CardsRow>
          {isLoading
            ? Array.from({ length: 7 }).map((_, index) => (
                <AppCardSkeleton key={`user-app-skeleton-${index}`} />
              ))
            : apps.map((item) => <AppCard key={item.id} item={item} />)}
        </CardsRow>

        <SectionHeader>
          <h3>Рекомендованные игры</h3>
          <button type="button" onClick={() => navigate("/store/games")}>
            Смотреть больше
          </button>
        </SectionHeader>
        <SectionSubtitle>На основе ваших интересов</SectionSubtitle>
        <CardsRow>
          {isLoading
            ? Array.from({ length: 7 }).map((_, index) => (
                <AppCardSkeleton key={`user-game-skeleton-${index}`} />
              ))
            : games.map((item) => <AppCard key={item.id} item={item} />)}
        </CardsRow>
      </ProfileWrap>
    </StoreLayout>
  );
}
