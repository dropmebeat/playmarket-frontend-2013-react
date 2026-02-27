import { Link } from "react-router-dom";
import styled from "styled-components";
import type { StoreItem } from "../storeData";
import { AppGlyph } from "./storeStyles";

type AppCardProps = {
  item: StoreItem;
  priceText?: string;
};

const CardRoot = styled.article.attrs({
  className: "card apps square-cover tiny no-rationale",
})`
  position: relative;
  background: #f3f3f3;
  border: 1px solid #d8d8d8;
  padding: 8px;
  overflow: hidden;
`;

const CardContent = styled.div.attrs({
  className: "card-content track-click track-impression",
})`
  position: relative;
`;

const CardClickTarget = styled(Link).attrs({ className: "card-click-target" })`
  position: absolute;
  inset: 0;
  z-index: 5;
`;

const CardTop = styled.div`
  margin: -8px -8px 8px;
  padding: 8px;
  border-radius: 2px;
  transition: background-color 140ms ease;

  ${CardRoot}:hover &,
  ${CardRoot}:focus-within & {
    background: #c7c7c7;
  }
`;

const Cover = styled.div.attrs({ className: "cover" })`
  position: relative;
  background: transparent;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
`;

const CoverImageContainer = styled.div.attrs({
  className: "cover-image-container",
})`
  width: 100%;
`;

const CoverOuterAlign = styled.div.attrs({ className: "cover-outer-align" })`
  display: flex;
  justify-content: center;
`;

const CoverInnerAlign = styled.div.attrs({ className: "cover-inner-align" })`
  width: 100%;
  max-width: 126px;
`;

const CoverImage = styled.div.attrs({ className: "cover-image" })<{
  $color: string;
}>`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #666;
  overflow: hidden;
`;

const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Details = styled.div.attrs({ className: "details" })`
  position: relative;
  z-index: 6;
`;

const TitleLink = styled(Link).attrs({ className: "title" })`
  display: block;
  color: #4b4b4b;
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubtitleContainer = styled.div.attrs({ className: "subtitle-container" })`
  margin-top: 1px;
`;

const SubtitleLink = styled(Link).attrs({ className: "subtitle" })`
  display: block;
  color: #999;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReasonSet = styled.div.attrs({ className: "reason-set" })`
  position: relative;
  z-index: 6;
  margin-top: 8px;
`;

const StarsContainer = styled.span.attrs({ className: "stars-container" })`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
`;

const ReasonSetStarRating = styled.div.attrs({
  className: "reason-set-star-rating",
})``;

const TinyStar = styled.div.attrs({
  className: "tiny-star star-rating-non-editable-container",
})`
  position: relative;
  font-size: 11px;
  line-height: 1;
  color: #b8b8b8;

  &::before {
    content: "★★★★★";
  }
`;

const CurrentRating = styled.div.attrs({ className: "current-rating" })`
  position: absolute;
  left: 0;
  top: 0;
  width: 82%;
  overflow: hidden;
  color: #7a7a7a;
  white-space: nowrap;

  &::before {
    content: "★★★★★";
  }
`;

const PriceContainer = styled.span.attrs({ className: "price-container" })``;

const BuyButtonContainer = styled.span.attrs({
  className: "buy-button-container apps is-price-tag",
})`
  .price.buy {
    color: #94b629;
    font-size: 11px;
    white-space: nowrap;
  }
`;

export function AppCard({ item, priceText }: AppCardProps) {
  const to = `/app/${item.id}`;
  const rawPrice = priceText ?? item.price;
  const normalizedPrice = rawPrice
    .replace(/\s*\u0414\u041e\u041b\u041b\u0410\u0420\u0410/gi, "$")
    .replace(/\s*\u0414\u041e\u041b\u041b\u0410\u0420\u041e\u0412/gi, "$");

  return (
    <CardRoot
      data-docid={item.id}
      data-original-classes="card apps square-cover small no-rationale"
      data-short-classes="card apps square-cover tiny no-rationale"
    >
      <CardContent data-uitype="500">
        <CardClickTarget to={to} aria-label={item.name} />

        <CardTop>
          <Cover>
            <CoverImageContainer>
              <CoverOuterAlign>
                <CoverInnerAlign>
                  <CoverImage $color={item.color}>
                    {item.image ? (
                      <CoverImg src={item.image} alt={item.name} />
                    ) : (
                      <AppGlyph name={item.icon} />
                    )}
                  </CoverImage>
                </CoverInnerAlign>
              </CoverOuterAlign>
            </CoverImageContainer>
          </Cover>
        </CardTop>

        <Details>
          <TitleLink to={to} title={item.name}>
            {item.name}
            <span className="paragraph-end" />
          </TitleLink>
          <SubtitleContainer>
            <SubtitleLink to={to} title={item.publisher}>
              {item.publisher}
            </SubtitleLink>
          </SubtitleContainer>
        </Details>

        <ReasonSet>
          <StarsContainer>
            <ReasonSetStarRating>
              <TinyStar>
                <CurrentRating />
              </TinyStar>
            </ReasonSetStarRating>
            <PriceContainer>
              <BuyButtonContainer data-docid={item.id}>
                <span className="price buy">
                  <span>{normalizedPrice}</span>
                </span>
              </BuyButtonContainer>
            </PriceContainer>
          </StarsContainer>
        </ReasonSet>
      </CardContent>
    </CardRoot>
  );
}
