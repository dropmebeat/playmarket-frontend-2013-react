import styled from "styled-components";

export const DetailsPageWrap = styled.div`
  width: min(100%, clamp(1060px, calc(100vw - 230px), 1760px));
  margin: 0;
  background: var(--bg-panel);
`;

export const DetailsWrapper = styled.div.attrs({
  className: "details-wrapper apps square-cover",
})`
  .details-info {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px;
    padding: 10px 0 14px;
    border-bottom: 1px solid var(--border-main);
    background: var(--bg-panel-soft);
  }

  .cover-container {
    width: 210px;
    height: 210px;
  }

  .cover-image {
    width: 100%;
    height: 100%;
    border-radius: 22px;
    object-fit: cover;
    display: block;
  }

  .info-container {
    min-width: 0;
  }

  .document-title {
    color: var(--text-main);
    font-size: 43px;
    font-weight: 300;
    line-height: 1.04;
  }

  .document-subtitle {
    color: var(--text-soft);
    font-size: 16px;
    line-height: 1.3;
  }

  .document-subtitle.primary {
    color: var(--text-muted);
  }

  .document-subtitle.category {
    color: var(--text-muted);
  }

  .details-actions {
    margin-top: 10px;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .buy-button-container.play-button .price.buy {
    display: inline-block;
    background: var(--brand-accent);
    border: 0;
    color: #fff;
    font-size: 13px;
    font-family: inherit;
    font-weight: 700;
    padding: 8px 16px;
    text-decoration: none;
    transition:
      background-color 120ms ease,
      box-shadow 120ms ease;
    cursor: pointer;
  }

  .buy-button-container.play-button .price.buy:hover {
    background: color-mix(in srgb, var(--brand-accent) 86%, #fff 14%);
    box-shadow: inset 0 -3px 0 var(--brand-accent-strong);
  }

  .wishlist-container .wishlist-content {
    border: 1px solid var(--border-main);
    background: var(--bg-panel);
    color: var(--text-muted);
    font-size: 13px;
    padding: 8px 12px;
    transition:
      background-color 120ms ease,
      box-shadow 120ms ease;
    cursor: pointer;
  }

  .wishlist-container .wishlist-content:hover {
    background: var(--bg-hover);
    box-shadow: inset 0 -3px 0 var(--border-soft);
  }

  .details-info-divider {
    margin-top: 12px;
    border-top: 1px solid var(--border-main);
  }

  .header-star-badge {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-muted);
    font-size: 13px;
  }

  .tiny-star.star-rating-non-editable-container {
    position: relative;
    color: color-mix(in srgb, var(--text-soft) 72%, #fff 28%);
    letter-spacing: 1px;
    line-height: 1;
  }

  .tiny-star.star-rating-non-editable-container::before {
    content: "★★★★★";
  }

  .tiny-star .current-rating {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .tiny-star .current-rating::before {
    content: "★★★★★";
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--text-soft);
    font-size: 12px;
  }

  .badge img {
    width: 13px;
    height: 13px;
  }

  .details-section.screenshots,
  .details-section.description {
    margin-top: 0;
    border-top: 1px solid var(--border-main);
    border-bottom: 1px solid var(--border-main);
    background: var(--bg-panel);
    padding: 12px 0;
  }

  .details-section.description {
    margin-top: 0;
    padding: 10px;
  }

  .details-section.description .heading {
    margin: 0 0 10px;
    font-size: 41px;
    font-weight: 300;
    color: var(--text-main);
    line-height: 1.1;
  }

  .details-section.description .text-body {
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.6;
  }

  .details-section.description .app-orig-desc {
    width: 100%;
    max-width: clamp(72ch, 82vw, 148ch);
  }

  @media (max-width: 1200px) {
    .details-section.description .app-orig-desc {
      max-width: 100%;
    }
  }

  .details-section.description .app-orig-desc p {
    margin: 0 0 12px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .details-section.description .app-orig-desc p:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 760px) {
    .details-info {
      grid-template-columns: auto 1fr;
      align-items: start;
      gap: 6px;
      padding: 8px 0 10px;
    }

    .cover-container {
      width: 100%;
      max-width: 140px;
      height: auto;
      aspect-ratio: 1 / 1;
      justify-self: start;
    }

    .info-container {
      min-width: 0;
    }

    .document-title {
      font-size: 28px;
    }

    .details-section.description .heading {
      font-size: 30px;
    }
  }

  @media (max-width: 560px) {
    .details-info {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .cover-container,
    .info-container {
      grid-column: auto;
    }
  }
`;

export const TopInfo = styled.section`
  display: grid;
  grid-template-columns: 132px 1fr;
  align-items: start;
  gap: 16px;
  background: transparent;
  padding: 10px 0 14px;
  border-bottom: 1px solid var(--border-main);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const AppIconLarge = styled.img`
  width: 132px;
  height: 132px;
  border-radius: 22px;
  object-fit: cover;
  display: block;
`;

export const TopTitle = styled.h1`
  margin: 0;
  color: var(--text-main);
  font-size: 43px;
  font-weight: 300;
  line-height: 1.04;

  @media (max-width: 760px) {
    font-size: 32px;
  }
`;

export const TopMeta = styled.div`
  color: var(--text-soft);
  font-size: 16px;
  line-height: 1.28;
  margin-top: 5px;
`;

export const ActionRow = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const InstallBtn = styled.button`
  border: 0;
  background: var(--brand-accent);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 16px;
  cursor: pointer;
`;

export const WishBtn = styled.button`
  border: 1px solid var(--border-main);
  background: var(--bg-panel-soft);
  color: var(--text-muted);
  font-size: 13px;
  padding: 8px 12px;
  cursor: pointer;
`;

export const RatingLine = styled.div`
  margin-top: 14px;
  color: var(--text-muted);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TopDevLine = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-soft);
  font-size: 12px;
`;

export const TopDevIcon = styled.img`
  width: 13px;
  height: 13px;
`;

export const Stars = styled.span`
  color: var(--text-muted);
  letter-spacing: 1px;
`;

export const GallerySection = styled.section`
  margin-top: 14px;
  border-top: 1px solid var(--border-main);
  border-bottom: 1px solid var(--border-main);
  background: var(--bg-panel);
  padding: 12px 0;
`;

export const SlideBox = styled.div`
  position: relative;
  height: 286px;
  overflow: hidden;

  @media (max-width: 900px) {
    height: 240px;
  }

  @media (max-width: 650px) {
    height: 200px;
  }
`;

export const SlideImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const PlayOverlay = styled.button`
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 40px;
`;

export const Section = styled.section`
  margin-top: 0;
  padding-top: 10px;
  background: var(--bg-panel);
  border-top: 1px solid var(--border-main);
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 12px;
`;

export const H2 = styled.h2`
  margin: 0 0 10px;
  font-size: 41px;
  font-weight: 300;
  color: var(--text-main);
  line-height: 1.1;

  @media (max-width: 760px) {
    font-size: 30px;
  }
`;

export const TextList = styled.div`
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.45;
  p {
    margin: 0 0 6px;
  }
`;

export const ReviewsTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const ReviewBtn = styled.button`
  border: 1px solid var(--border-main);
  background: var(--bg-panel-soft);
  color: var(--text-muted);
  font-size: 12px;
  padding: 6px 10px;
`;

export const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: 228px 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ScoreCard = styled.div`
  border: 1px solid var(--border-main);
  background: var(--bg-panel-soft);
  padding: 12px;
  color: var(--text-muted);
`;

export const ScoreValue = styled.div`
  font-size: 58px;
  line-height: 1;
  color: var(--text-main);
`;

export const BarList = styled.div`
  margin-top: 8px;
  display: grid;
  gap: 3px;
`;

export const BarRow = styled.div`
  display: grid;
  grid-template-columns: 12px 1fr;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
`;

export const Bar = styled.div<{ $width: number; $color?: string }>`
  height: 12px;
  background: color-mix(in srgb, var(--bg-panel-soft) 82%, #fff 18%);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${({ $width }) => `${$width}%`};
    background: ${({ $color }) => $color ?? "#9fc34d"};
  }
`;

export const ReviewsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ReviewCard = styled.article`
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  color: var(--text-muted);
  font-size: 13px;
`;

export const Avatar = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ReviewAuthor = styled.div`
  margin-top: 4px;
  font-weight: 700;
  color: var(--text-main);
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(106px, 1fr));
  gap: 12px;
  color: var(--text-muted);
  font-size: 12px;
  width: 100%;

  > div {
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  > div > div {
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(110px, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(110px, 1fr));
  }
`;

export const InfoTitle = styled.div`
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 3px;
`;

export const AppMiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(108px, 1fr));
  gap: 10px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, minmax(108px, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(108px, 1fr));
  }
`;

export const MiniCard = styled.div`
  border: 1px solid var(--border-soft);
  background: var(--bg-panel);
  padding: 6px;
`;

export const MiniImg = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

export const MiniName = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MiniPublisher = styled.div`
  font-size: 11px;
  color: var(--text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
