import { Link } from "react-router-dom";
import styled from "styled-components";

type StoreSidebarProps = {
  darkBrand: boolean;
  hideSideSectionOnMobile?: boolean;
};

const Side = styled.aside`
  position: sticky;
  top: 46px;
  align-self: start;
  max-height: calc(100vh - 46px);
  overflow: auto;
  background: var(--bg-panel-soft);
  border-right: 1px solid var(--border-main);

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: static;
    top: auto;
    max-height: none;
    overflow: visible;
    border-right: 0;
    border-bottom: 1px solid var(--border-main);
  }
`;

const SideSection = styled.div<{ $hideOnMobile?: boolean }>`
  padding: 10px 8px;

  @media (max-width: 900px) {
    display: ${({ $hideOnMobile }) => ($hideOnMobile ? "none" : "block")};
  }
`;

const SideItem = styled(Link)<{ $active?: boolean }>`
  display: block;
  color: ${({ $active }) =>
    $active ? "var(--brand-accent)" : "var(--text-muted)"};
  font-size: 14px;
  line-height: 1.25;
  padding: 5px 0;
`;

const SideDivider = styled.div`
  height: 1px;
  background: var(--border-soft);
  margin: 8px 0;
`;

const ColorNav = styled.div`
  display: grid;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
`;

const ColorItem = styled(Link)<{ $bg: string }>`
  height: 44px;
  color: #fff;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.22) 0%,
      rgba(255, 255, 255, 0.22) 28%,
      transparent 28%
    ),
    linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.14) 0%,
      rgba(255, 255, 255, 0.14) 16%,
      transparent 16%
    ),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.1)),
    ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  font-size: 14px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    right: -14px;
    top: -16px;
    width: 56px;
    height: 56px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.22),
      rgba(255, 255, 255, 0)
    );
    transform: rotate(45deg);
    pointer-events: none;
  }
`;

const ColorIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
`;

export function StoreSidebar({
  darkBrand,
  hideSideSectionOnMobile = false,
}: StoreSidebarProps) {
  return (
    <Side>
      {darkBrand ? (
        <>
          <ColorNav>
            <ColorItem $bg="#a8c52e" to="/store/apps">
              <ColorIcon
                src="/assets/theme/app_icon.png"
                alt=""
                aria-hidden="true"
              />
              {"\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F"}
            </ColorItem>
            <ColorItem $bg="#ee6e2f" to="/store/movies">
              <ColorIcon
                src="/assets/theme/movie_icon.png"
                alt=""
                aria-hidden="true"
              />
              {"\u0424\u0438\u043B\u044C\u043C\u044B \u0438 \u0422\u0412"}
            </ColorItem>
            <ColorItem $bg="#f0a30d" to="/store">
              <ColorIcon
                src="/assets/theme/music_icon.png"
                alt=""
                aria-hidden="true"
              />
              {"\u041C\u0443\u0437\u044B\u043A\u0430"}
            </ColorItem>
            <ColorItem $bg="#2f8fd2" to="/store">
              <ColorIcon
                src="/assets/theme/book_icon.png"
                alt=""
                aria-hidden="true"
              />
              {"\u041A\u043D\u0438\u0433\u0438"}
            </ColorItem>
            <ColorItem $bg="#6d83d5" to="/store">
              <ColorIcon
                src="/assets/theme/magazine_icon.png"
                alt=""
                aria-hidden="true"
              />
              {"\u0416\u0443\u0440\u043D\u0430\u043B\u044B"}
            </ColorItem>
            <ColorItem $bg="#7f98ab" to="/store">
              <ColorIcon
                src="/assets/theme/device_icon.png"
                alt=""
                aria-hidden="true"
              />
              {"\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430"}
            </ColorItem>
          </ColorNav>
          <SideSection $hideOnMobile>
            <SideItem to="/store">
              {
                "\u041C\u043E\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0436\u0435\u043B\u0430\u043D\u0438\u0439"
              }
            </SideItem>
            <SideItem to="/store">
              {"\u0412\u044B\u043A\u0443\u043F\u0430\u0442\u044C"}
            </SideItem>
            <SideItem to="/store">
              {
                "\u041A\u0443\u043F\u0438\u0442\u044C \u043F\u043E\u0434\u0430\u0440\u043E\u0447\u043D\u0443\u044E \u043A\u0430\u0440\u0442\u0443"
              }
            </SideItem>
            <SideItem to="/store">
              {
                "\u041A\u0443\u043F\u0438\u0442\u044C \u043A\u0440\u0435\u0434\u0438\u0442\u044B Google Play"
              }
            </SideItem>
          </SideSection>
        </>
      ) : (
        <SideSection $hideOnMobile={hideSideSectionOnMobile}>
          <SideItem to="/store/apps">
            {
              "\u041C\u043E\u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F"
            }
          </SideItem>
          <SideItem to="/store/apps" $active>
            {"\u041C\u0430\u0433\u0430\u0437\u0438\u043D"}
          </SideItem>
          <SideDivider />
          <SideItem to="/store/games">{"\u0418\u0433\u0440\u044B"}</SideItem>
          <SideItem to="/store/apps">
            {
              "\u0412\u044B\u0431\u043E\u0440 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u0438"
            }
          </SideItem>
        </SideSection>
      )}
    </Side>
  );
}
