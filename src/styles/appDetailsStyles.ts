import styled from "styled-components";

export const DetailsPageWrap = styled.div`
  width: min(1060px, 100%);
  margin: 0;
  background: #fff;
`;

export const DetailsWrapper = styled.div.attrs({
  className: "details-wrapper apps square-cover",
})`
  .details-info {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px;
    padding: 10px 0 14px;
    border-bottom: 1px solid #cfcfcf;
    background: #d6d6d6;
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
    color: #4f4f4f;
    font-size: 43px;
    font-weight: 300;
    line-height: 1.04;
  }

  .document-subtitle {
    color: #8f8f8f;
    font-size: 16px;
    line-height: 1.3;
  }

  .document-subtitle.primary {
    color: #7f7f7f;
  }

  .document-subtitle.category {
    color: #7f7f7f;
  }

  .details-actions {
    margin-top: 10px;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .buy-button-container.play-button .price.buy {
    display: inline-block;
    background: #a8c52e;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    padding: 8px 16px;
    transition:
      background-color 120ms ease,
      box-shadow 120ms ease;
    cursor: pointer;
  }

  .buy-button-container.play-button .price.buy:hover {
    background: #b6d13a;
    box-shadow: inset 0 -3px 0 #7d931b;
  }

  .wishlist-container .wishlist-content {
    border: 1px solid #d4d4d4;
    background: #efefef;
    color: #666;
    font-size: 13px;
    padding: 8px 12px;
    transition:
      background-color 120ms ease,
      box-shadow 120ms ease;
    cursor: pointer;
  }

  .wishlist-container .wishlist-content:hover {
    background: #f7f7f7;
    box-shadow: inset 0 -3px 0 #bcbcbc;
  }

  .details-info-divider {
    margin-top: 12px;
    border-top: 1px solid #d3d3d3;
  }

  .header-star-badge {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #818181;
    font-size: 13px;
  }

  .tiny-star.star-rating-non-editable-container {
    position: relative;
    color: #b8b8b8;
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
    color: #7a7a7a;
    white-space: nowrap;
  }

  .tiny-star .current-rating::before {
    content: "★★★★★";
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #8ea7b2;
    font-size: 12px;
  }

  .badge img {
    width: 13px;
    height: 13px;
  }

  .details-section.screenshots,
  .details-section.description {
    margin-top: 0;
    border-top: 1px solid #d1d1d1;
    border-bottom: 1px solid #d1d1d1;
    background: #fff;
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
    color: #787878;
    line-height: 1.1;
  }

  .details-section.description .text-body {
    color: #646464;
    font-size: 13px;
    line-height: 1.45;
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
  border-bottom: 1px solid #cfcfcf;

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
  color: #4f4f4f;
  font-size: 43px;
  font-weight: 300;
  line-height: 1.04;

  @media (max-width: 760px) {
    font-size: 32px;
  }
`;

export const TopMeta = styled.div`
  color: #8f8f8f;
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
  background: #a8c52e;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 16px;
  cursor: pointer;
`;

export const WishBtn = styled.button`
  border: 1px solid #d4d4d4;
  background: #efefef;
  color: #666;
  font-size: 13px;
  padding: 8px 12px;
  cursor: pointer;
`;

export const RatingLine = styled.div`
  margin-top: 14px;
  color: #818181;
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
  color: #8ea7b2;
  font-size: 12px;
`;

export const TopDevIcon = styled.img`
  width: 13px;
  height: 13px;
`;

export const Stars = styled.span`
  color: #7b7b7b;
  letter-spacing: 1px;
`;

export const GallerySection = styled.section`
  margin-top: 14px;
  border-top: 1px solid #d1d1d1;
  border-bottom: 1px solid #d1d1d1;
  background: #fff;
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
  background: #fff;
  border-top: 1px solid #d2d2d2;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 12px;
`;

export const H2 = styled.h2`
  margin: 0 0 10px;
  font-size: 41px;
  font-weight: 300;
  color: #787878;
  line-height: 1.1;

  @media (max-width: 760px) {
    font-size: 30px;
  }
`;

export const TextList = styled.div`
  color: #646464;
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
  border: 1px solid #d4d4d4;
  background: #efefef;
  color: #666;
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
  border: 1px solid #d3d3d3;
  background: #f8f8f8;
  padding: 12px;
  color: #777;
`;

export const ScoreValue = styled.div`
  font-size: 58px;
  line-height: 1;
  color: #656565;
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
  color: #777;
`;

export const Bar = styled.div<{ $width: number; $color?: string }>`
  height: 12px;
  background: #ececec;
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
  color: #6f6f6f;
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
  color: #5f5f5f;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(106px, 1fr));
  gap: 12px;
  color: #666;
  font-size: 12px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(110px, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(110px, 1fr));
  }
`;

export const InfoTitle = styled.div`
  font-weight: 700;
  color: #555;
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
  border: 1px solid #d8d8d8;
  background: #f5f5f5;
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
  color: #626262;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MiniPublisher = styled.div`
  font-size: 11px;
  color: #8c8c8c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
