import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleHalfStroke,
  faCog,
  faGamepad,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { StoreSidebar } from "./StoreSidebar";
import { ActionButton } from "../common/ActionButton";
import { clearAuthUser, getAuthUser, subscribeAuth } from "../../auth/session";
import { useThemeMode } from "../../theme/useThemeMode";

export type LayoutVariant = "store-main" | "apps";

type StoreLayoutProps = {
  sectionTitle?: string;
  variant: LayoutVariant;
  brandContentType?: "apps" | "games" | "movies";
  accentTone?: "default" | "movies";
  topTab?: "home" | "top" | "new";
  topTabLinks?: {
    home: string;
    top: string;
    new: string;
  };
  hideSideSectionOnMobile?: boolean;
  typeFilter?: {
    value: string;
    options: string[];
    onChange: (value: string) => void;
  };
  categoryFilter?: {
    value: string;
    options: string[];
    onChange: (value: string) => void;
  };
  children: ReactNode;
};

const Page = styled.div<{ $accentTone: "default" | "movies" }>`
  min-height: 100vh;
  background: var(--bg-page);
  color: var(--text-main);

  ${({ $accentTone }) =>
    $accentTone === "movies"
      ? `
    --brand-accent: #d84a38;
    --brand-accent-strong: #a23326;
  `
      : ""}
`;

const Upper = styled.div`
  width: 100%;
  height: 46px;
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-main);
  display: grid;
  grid-template-columns: 182px 1fr auto;
  align-items: center;

  @media (max-width: 900px) {
    height: 42px;
    grid-template-columns: 150px 1fr auto;
  }
`;

const Brand = styled(Link)<{ $dark?: boolean }>`
  height: 100%;
  background: ${({ $dark }) =>
    $dark ? "var(--brand-dark)" : "var(--brand-accent)"};
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  font-size: 14px;
`;

const BrandIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
`;

const BrandFaIcon = styled(FontAwesomeIcon)`
  width: 18px;
  height: 18px;
  color: inherit;
`;

const TopTabs = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 2px;
  padding-left: 18px;
  min-width: 0;

  @media (max-width: 900px) {
    padding-left: 8px;
  }
`;

const TopTabLink = styled(NavLink)<{ $active?: boolean }>`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 14px;
  color: ${({ $active }) =>
    $active ? "var(--text-main)" : "var(--text-muted)"};
  border-bottom: 3px solid
    ${({ $active }) => ($active ? "var(--brand-accent)" : "transparent")};
  font-size: 14px;

  @media (max-width: 900px) {
    font-size: 12px;
    padding: 0 8px;
  }
`;

const CategoryFilterWrap = styled.div`
  margin-left: auto;
  margin-right: 12px;
  position: relative;
  min-width: 210px;

  @media (max-width: 900px) {
    min-width: 150px;
    margin-right: 6px;
  }
`;

const CategorySelect = styled.select`
  width: 100%;
  height: 30px;
  border: 1px solid var(--border-main);
  background: var(--bg-panel);
  color: var(--text-muted);
  font-size: 12px;
  padding: 0 26px 0 10px;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--brand-accent);
    box-shadow: 0 0 0 1px rgba(157, 188, 54, 0.2);
  }
`;

const CategoryArrow = styled.span`
  pointer-events: none;
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--text-muted);
`;

const UpperIcons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-right: 10px;
`;

const Body = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 182px 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Content = styled.main`
  padding: 36px 48px 28px;
  container-type: inline-size;
  container-name: store-content;

  @media (min-width: 901px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 1200px) {
    padding: 24px 20px 24px;
  }

  @media (max-width: 700px) {
    padding: 14px 10px 18px;
  }
`;

const ContentHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;

  @media (max-width: 900px) {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
  }
`;

const Title = styled.h1`
  width: 100%;
  text-align: left;
  margin: 0;
  font-size: 44px;
  font-weight: 500;
  color: var(--text-main);

  @media (max-width: 900px) {
    font-size: 30px;
  }
`;

const CategoryFilterInline = styled.div`
  position: relative;
  min-width: 230px;
  max-width: 340px;
  width: min(340px, 100%);

  @media (max-width: 900px) {
    min-width: 0;
    max-width: none;
    width: 100%;
  }
`;

export function StoreLayout({
  sectionTitle,
  variant,
  brandContentType = "apps",
  accentTone = "default",
  topTab = "home",
  topTabLinks,
  hideSideSectionOnMobile = false,
  typeFilter,
  categoryFilter,
  children,
}: StoreLayoutProps) {
  const darkBrand = variant === "store-main";
  const isGamesBrand = !darkBrand && brandContentType === "games";
  const isMoviesBrand = !darkBrand && brandContentType === "movies";
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeMode();
  const [authUser, setAuthUser] = useState(() => getAuthUser());

  useEffect(() => {
    return subscribeAuth(() => {
      setAuthUser(getAuthUser());
    });
  }, []);

  const tabs = topTabLinks ?? {
    home: "/store/apps",
    top: "/store",
    new: "/store/apps",
  };
  const brandLink = darkBrand
    ? "/store"
    : isGamesBrand
      ? "/store/games"
      : isMoviesBrand
        ? "/store/movies"
        : "/store/apps";

  return (
    <Page $accentTone={accentTone}>
      <Upper>
        <Brand to={brandLink} $dark={darkBrand}>
          {isGamesBrand ? (
            <BrandFaIcon icon={faGamepad} aria-hidden="true" />
          ) : isMoviesBrand ? (
            <BrandFaIcon icon={faVideo} aria-hidden="true" />
          ) : (
            <BrandIcon
              src="/assets/theme/main_icon.png"
              alt=""
              aria-hidden="true"
            />
          )}
          {darkBrand
            ? "Магазин"
            : isGamesBrand
              ? "Игры"
              : isMoviesBrand
                ? "Фильмы"
                : "Приложения"}
        </Brand>
        <TopTabs>
          <TopTabLink to={tabs.home} $active={topTab === "home"}>
            Главная
          </TopTabLink>
          <TopTabLink to={tabs.top} $active={topTab === "top"}>
            Топ
          </TopTabLink>
          <TopTabLink to={tabs.new} $active={topTab === "new"}>
            Новое
          </TopTabLink>
          {typeFilter ? (
            <CategoryFilterWrap>
              <CategorySelect
                aria-label="Тип контента"
                value={typeFilter.value}
                onChange={(event) => typeFilter.onChange(event.target.value)}
              >
                {typeFilter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </CategorySelect>
              <CategoryArrow aria-hidden="true" />
            </CategoryFilterWrap>
          ) : null}
        </TopTabs>
        <UpperIcons>
          <ActionButton
            type="button"
            ariaLabel={
              isDark ? "Включить светлую тему" : "Включить тёмную тему"
            }
            square
            onClick={toggleTheme}
          >
            <FontAwesomeIcon icon={faCircleHalfStroke} />
          </ActionButton>
          {authUser ? (
            <>
              <ActionButton type="button" ariaLabel="settings" square>
                <FontAwesomeIcon icon={faCog} />
              </ActionButton>
              <ActionButton
                type="button"
                ariaLabel={authUser.name}
                onClick={() => navigate("/user")}
              >
                {authUser.name}
              </ActionButton>
              <ActionButton
                type="button"
                ariaLabel="Выйти"
                variant="primary"
                onClick={() => {
                  clearAuthUser();
                  navigate("/auth");
                }}
              >
                Выйти
              </ActionButton>
            </>
          ) : (
            <ActionButton
              type="button"
              ariaLabel="Войти"
              variant="primary"
              onClick={() => navigate("/auth")}
            >
              Войти
            </ActionButton>
          )}
        </UpperIcons>
      </Upper>

      <Body>
        <StoreSidebar
          darkBrand={darkBrand}
          hideSideSectionOnMobile={hideSideSectionOnMobile}
        />
        <Content>
          {sectionTitle || categoryFilter ? (
            <ContentHeader>
              {sectionTitle ? <Title>{sectionTitle}</Title> : <div />}
              {categoryFilter ? (
                <CategoryFilterInline>
                  <CategorySelect
                    aria-label="Фильтр по категории"
                    value={categoryFilter.value}
                    onChange={(event) =>
                      categoryFilter.onChange(event.target.value)
                    }
                  >
                    {categoryFilter.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </CategorySelect>
                  <CategoryArrow aria-hidden="true" />
                </CategoryFilterInline>
              ) : null}
            </ContentHeader>
          ) : null}
          {children}
        </Content>
      </Body>
    </Page>
  );
}
