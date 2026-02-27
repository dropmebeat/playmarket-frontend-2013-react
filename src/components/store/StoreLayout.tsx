import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { ReactNode } from "react";
import { StoreSidebar } from "./StoreSidebar";
import { ActionButton } from "../common/ActionButton";

export type LayoutVariant = "store-main" | "apps";

type StoreLayoutProps = {
  sectionTitle?: string;
  variant: LayoutVariant;
  topTab?: "home" | "top" | "new";
  hideSideSectionOnMobile?: boolean;
  categoryFilter?: {
    value: string;
    options: string[];
    onChange: (value: string) => void;
  };
  children: ReactNode;
};

const Page = styled.div`
  min-height: 100vh;
  background: #d6d6d6;
  color: #4a4a4a;
`;

const Upper = styled.div`
  width: 100%;
  height: 46px;
  position: sticky;
  top: 0;
  z-index: 30;
  background: #f2f2f2;
  border-bottom: 1px solid #d0d0d0;
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
  background: ${({ $dark }) => ($dark ? "#3a3a3a" : "#a8c52e")};
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
  color: ${({ $active }) => ($active ? "#454545" : "#666")};
  border-bottom: 3px solid
    ${({ $active }) => ($active ? "#a8c52e" : "transparent")};
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
  border: 1px solid #c9c9c9;
  background: #f5f5f5;
  color: #555;
  font-size: 12px;
  padding: 0 26px 0 10px;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #9dbc36;
    box-shadow: 0 0 0 1px rgba(157, 188, 54, 0.2);
  }
`;

const CategoryArrow = styled.span`
  pointer-events: none;
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 11px;
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

  @media (max-width: 1200px) {
    padding: 24px 20px 24px;
  }

  @media (max-width: 700px) {
    padding: 14px 10px 18px;
  }
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 44px;
  font-weight: 500;
  color: #3f3f3f;

  @media (max-width: 900px) {
    font-size: 30px;
    margin-bottom: 10px;
  }
`;

export function StoreLayout({
  sectionTitle,
  variant,
  topTab = "home",
  hideSideSectionOnMobile = false,
  categoryFilter,
  children,
}: StoreLayoutProps) {
  const darkBrand = variant === "store-main";
  const navigate = useNavigate();

  return (
    <Page>
      <Upper>
        <Brand to={darkBrand ? "/store" : "/store/apps"} $dark={darkBrand}>
          <BrandIcon src="/assets/theme/main_icon.png" alt="" aria-hidden="true" />
          {darkBrand
            ? "\u041C\u0430\u0433\u0430\u0437\u0438\u043D"
            : "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F"}
        </Brand>
        <TopTabs>
          <TopTabLink to="/store/apps" $active={topTab === "home"}>
            {"\u0413\u043B\u0430\u0432\u043D\u0430\u044F"}
          </TopTabLink>
          <TopTabLink to="/store" $active={topTab === "top"}>
            {"\u0422\u043E\u043F"}
          </TopTabLink>
          <TopTabLink to="/store/apps" $active={topTab === "new"}>
            {"\u041D\u043E\u0432\u043E\u0435"}
          </TopTabLink>
          {categoryFilter ? (
            <CategoryFilterWrap>
              <CategorySelect
                aria-label={"\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438"}
                value={categoryFilter.value}
                onChange={(event) => categoryFilter.onChange(event.target.value)}
              >
                {categoryFilter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </CategorySelect>
              <CategoryArrow>v</CategoryArrow>
            </CategoryFilterWrap>
          ) : null}
        </TopTabs>
        <UpperIcons>
          <ActionButton type="button" ariaLabel="help" square>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </ActionButton>
          <ActionButton type="button" ariaLabel="settings" square>
            <FontAwesomeIcon icon={faCog} />
          </ActionButton>
          <ActionButton
            type="button"
            ariaLabel={"\u0412\u043E\u0439\u0442\u0438"}
            variant="primary"
            onClick={() => navigate("/auth")}
          >
            {"\u0412\u043E\u0439\u0442\u0438"}
          </ActionButton>
        </UpperIcons>
      </Upper>

      <Body>
        <StoreSidebar darkBrand={darkBrand} hideSideSectionOnMobile={hideSideSectionOnMobile} />
        <Content>
          {sectionTitle ? <Title>{sectionTitle}</Title> : null}
          {children}
        </Content>
      </Body>
    </Page>
  );
}