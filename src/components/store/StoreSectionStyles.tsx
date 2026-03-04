import { Link } from "react-router-dom";
import styled from "styled-components";

export const Hero = styled.section`
  width: min(930px, 100%);
  align-self: flex-start;
  height: 235px;
  background: #000;
  margin-bottom: 18px;
  display: grid;
  grid-template-columns: 55% 45%;
  align-items: stretch;
  overflow: hidden;

  @container store-content (max-width: 900px) {
    height: auto;
    min-height: 180px;
    grid-template-columns: 1fr;
  }
`;

export const HeroVisual = styled.div`
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);

  .tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 58px;
    line-height: 1;
    color: #fff;
  }

  .t1 {
    background: #f2b42c;
  }
  .t2 {
    background: #f65454;
  }
  .t3 {
    background: #748698;
  }
  .t4 {
    background: #5567c4;
  }
  .t5 {
    background: #33a0dc;
  }
  .t6 {
    background: #8ac170;
  }

  @container store-content (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 80px);

    .tile {
      font-size: 40px;
    }
  }
`;

export const HeroText = styled.div`
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
  color: #fff;
  padding: 38px 32px;
  h2 {
    margin: 0;
    font-size: 51px;
    font-weight: 300;
  }
  p {
    margin-top: 8px;
    font-size: 14px;
    line-height: 1.35;
  }

  @container store-content (max-width: 900px) {
    padding: 16px;

    h2 {
      font-size: 32px;
    }
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 6px;
  h3 {
    margin: 0;
    font-size: 43px;
    font-weight: 500;
    color: var(--text-main);
    font-style: normal;
  }
  button {
    background: var(--brand-accent);
    border: 0;
    color: #fff;
    font-size: 12px;
    padding: 7px 14px;
    transition:
      background-color 120ms ease,
      box-shadow 120ms ease;
    cursor: pointer;
  }

  button:hover {
    background: color-mix(in srgb, var(--brand-accent) 86%, #fff 14%);
    box-shadow: inset 0 -3px 0 var(--brand-accent-strong);
  }

  @container store-content (max-width: 900px) {
    h3 {
      font-size: 30px;
    }

    button {
      font-size: 11px;
      padding: 6px 10px;
    }
  }
`;

export const SectionSubtitle = styled.p`
  width: 100%;
  margin: 0 0 10px;
  color: var(--text-soft);
  font-size: 12px;
`;

export const CardsRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(146px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

export const Card = styled(Link)`
  background: var(--bg-panel);
  border: 1px solid var(--border-soft);
  padding: 10px 8px 8px;

  &:hover,
  &:focus-visible {
    background: #f3f3f3;
    color: inherit;
    text-decoration: none;
    filter: none;
    opacity: 1;
  }
`;

export const AppIcon = styled.div<{ $color: string }>`
  width: 118px;
  height: 118px;
  border-radius: 10px;
  background: ${({ $color }) => $color};
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: rgba(255, 255, 255, 0.93);
  transition: filter 140ms ease;
  opacity: 1;

  ${Card}:hover &,
  ${Card}:focus-visible & {
    filter: brightness(0.92);
    opacity: 1;
  }
`;

export const AppIconFrame = styled.div`
  width: 126px;
  height: 126px;
  margin: 0 auto 10px;
  padding: 4px;
  border-radius: 4px;
  background: #8f8f8f;
  box-shadow: inset 0 0 0 1px #7b7b7b;
  transition: filter 140ms ease;

  ${Card}:hover &,
  ${Card}:focus-visible & {
    filter: brightness(0.88);
  }

  ${AppIcon} {
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 2px;
    font-size: 48px;
  }
`;

export const AppName = styled.div`
  color: var(--text-main);
  font-size: 12px;
  margin-bottom: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Publisher = styled.div`
  color: var(--text-soft);
  font-size: 10px;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
`;

export const CardStars = styled.div`
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 1px;
`;

export const Price = styled.div`
  color: var(--brand-accent);
  font-size: 11px;
  white-space: nowrap;
`;

export const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(146px, 1fr));
  gap: 10px;
`;

export const DetailsTop = styled.section`
  display: grid;
  grid-template-columns: 196px 1fr;
  gap: 18px;
  margin-bottom: 20px;

  @container store-content (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const AppTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 36px;
  font-weight: 400;
  color: var(--text-main);
`;

export const Meta = styled.div`
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 12px;
`;

export const InstallButton = styled.button`
  border: 0;
  background: var(--brand-accent);
  color: #fff;
  font-size: 12px;
  padding: 7px 14px;
  margin-right: 8px;
`;

export const WishButton = styled.button`
  border: 1px solid var(--border-main);
  background: var(--bg-panel-soft);
  color: var(--text-muted);
  font-size: 12px;
  padding: 7px 12px;
`;

export const ScreenshotStrip = styled.section`
  border-top: 1px solid var(--border-main);
  padding-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 12px;

  @container store-content (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
  }

  @container store-content (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  @container store-content (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const Shot = styled.div<{ $color: string }>`
  height: 260px;
  border: 1px solid #cfcfcf;
  background: ${({ $color }) => $color};
`;

export const FooterBlock = styled.div`
  margin-top: 18px;
  border-top: 1px solid var(--border-main);
  padding-top: 18px;
`;

export const TranslateCard = styled.div`
  background: var(--bg-panel);
  border: 1px solid var(--border-soft);
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 12px;
    color: var(--text-muted);
  }
  button {
    border: 1px solid var(--border-main);
    background: var(--bg-input);
    color: var(--text-muted);
    font-size: 12px;
    padding: 6px 10px;
    cursor: pointer;
    transition:
      background-color 120ms ease,
      border-color 120ms ease,
      color 120ms ease,
      box-shadow 120ms ease;

    &:hover {
      background: var(--bg-hover);
      border-color: var(--border-soft);
      color: var(--text-main);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px rgba(120, 120, 120, 0.22);
    }
  }
`;

export const Rating = styled.div`
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 10px;
`;

export const SmallHint = styled.div`
  color: var(--text-muted);
  margin-top: 8px;
  font-size: 12px;
`;

export const ArrowRail = styled.div`
  position: fixed;
  left: 0;
  top: 190px;
  width: 20px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-soft);
  font-size: 26px;

  @media (max-width: 900px) {
    display: none;
  }
`;
