import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import type { StoreItem } from "../storeData";
import { AppGlyph } from "./storeStyles";

type AppCardProps = {
  item: StoreItem & { ratingValue?: number };
  priceText?: string;
  mode?: "app" | "movie";
  to?: string;
};

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

const CardRoot = styled.article.attrs({
  className: "card apps square-cover tiny no-rationale",
})`
  position: relative;
  background: var(--bg-panel);
  border: 1px solid var(--border-soft);
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

const CardTop = styled.div<{ $mode: "app" | "movie" }>`
  margin: -8px -8px 8px;
  padding: ${({ $mode }) => ($mode === "movie" ? "0" : "8px")};
  border-radius: 2px;
  transition: background-color 140ms ease;

  ${CardRoot}:hover &,
  ${CardRoot}:focus-within & {
    background: var(--bg-card-hover);
  }
`;

const Cover = styled.div.attrs({ className: "cover" })<{
  $mode: "app" | "movie";
}>`
  position: relative;
  background: transparent;
  border-radius: ${({ $mode }) => ($mode === "movie" ? "0" : "2px")};
  padding: ${({ $mode }) => ($mode === "movie" ? "0" : "8px")};
  margin-bottom: ${({ $mode }) => ($mode === "movie" ? "0" : "8px")};
`;

const CoverImageContainer = styled.div.attrs({
  className: "cover-image-container",
})`
  width: 100%;
`;

const CoverOuterAlign = styled.div.attrs({ className: "cover-outer-align" })<{
  $mode: "app" | "movie";
}>`
  display: flex;
  justify-content: ${({ $mode }) => ($mode === "movie" ? "stretch" : "center")};
`;

const CoverInnerAlign = styled.div.attrs({ className: "cover-inner-align" })<{
  $mode: "app" | "movie";
}>`
  width: 100%;
  max-width: ${({ $mode }) => ($mode === "movie" ? "none" : "126px")};
`;

const CoverImage = styled.div.attrs({ className: "cover-image" })<{
  $color: string;
  $mode: "app" | "movie";
}>`
  width: 100%;
  aspect-ratio: ${({ $mode }) => ($mode === "movie" ? "2 / 3" : "1 / 1")};
  border-radius: ${({ $mode }) => ($mode === "movie" ? "0" : "12px")};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: var(--text-muted);
  overflow: hidden;
`;

const CoverImg = styled.img<{ $mode: "app" | "movie" }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: ${({ $mode }) => ($mode === "movie" ? "scale(1.035)" : "none")};
  transform-origin: center;
  display: block;
`;

const Details = styled.div.attrs({ className: "details" })`
  position: relative;
  z-index: 6;
`;

const TitleLink = styled(Link).attrs({ className: "title" })`
  display: block;
  color: var(--text-main);
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
  color: var(--text-soft);
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
  color: color-mix(in srgb, var(--text-soft) 72%, #fff 28%);

  &::before {
    content: "★★★★★";
  }
`;

const CurrentRating = styled.div.attrs({ className: "current-rating" })<{
  $width: number;
}>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${({ $width }) => `${$width}%`};
  overflow: hidden;
  color: var(--text-muted);
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
    color: var(--brand-accent);
    font-size: 11px;
    white-space: nowrap;
  }
`;

const SkeletonCover = styled(SkeletonBlock)`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
`;

const SkeletonTitle = styled(SkeletonBlock)`
  height: 12px;
  width: 92%;
  border-radius: 3px;
  margin-bottom: 6px;
`;

const SkeletonSubtitle = styled(SkeletonBlock)`
  height: 10px;
  width: 62%;
  border-radius: 3px;
`;

const SkeletonMeta = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const SkeletonStars = styled(SkeletonBlock)`
  height: 10px;
  width: 56px;
  border-radius: 3px;
`;

const SkeletonPrice = styled(SkeletonBlock)`
  height: 10px;
  width: 42px;
  border-radius: 3px;
`;

export function AppCard({ item, priceText, mode = "app", to }: AppCardProps) {
  const cardTo = to ?? `/app/${item.id}`;
  const ratingValue =
    typeof item.ratingValue === "number" ? item.ratingValue : 0;
  const ratingWidth = Math.max(0, Math.min(ratingValue, 5)) * 20;
  const rawPrice = priceText ?? item.price;
  const normalizedPrice = rawPrice
    .replace(/\s*ДОЛЛАРА/gi, "$")
    .replace(/\s*ДОЛЛАРОВ/gi, "$");
  const isFree = /^(free|бесплатно|libre)$/i.test(normalizedPrice.trim());
  const priceLabel = isFree ? "БЕСПЛАТНО" : normalizedPrice;

  return (
    <CardRoot
      data-docid={item.id}
      data-original-classes="card apps square-cover small no-rationale"
      data-short-classes="card apps square-cover tiny no-rationale"
    >
      <CardContent data-uitype="500">
        <CardClickTarget to={cardTo} aria-label={item.name} />

        <CardTop $mode={mode}>
          <Cover $mode={mode}>
            <CoverImageContainer>
              <CoverOuterAlign $mode={mode}>
                <CoverInnerAlign $mode={mode}>
                  <CoverImage $color={item.color} $mode={mode}>
                    {item.image ? (
                      <CoverImg
                        $mode={mode}
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.src =
                            "/assets/theme/app_icon.png";
                        }}
                      />
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
          <TitleLink to={cardTo} title={item.name}>
            {item.name}
            <span className="paragraph-end" />
          </TitleLink>
          <SubtitleContainer>
            <SubtitleLink to={cardTo} title={item.publisher}>
              {item.publisher}
            </SubtitleLink>
          </SubtitleContainer>
        </Details>

        <ReasonSet>
          <StarsContainer>
            <ReasonSetStarRating>
              <TinyStar>
                <CurrentRating $width={ratingWidth} />
              </TinyStar>
            </ReasonSetStarRating>
            <PriceContainer>
              <BuyButtonContainer data-docid={item.id}>
                <span className="price buy">
                  <span>{priceLabel}</span>
                </span>
              </BuyButtonContainer>
            </PriceContainer>
          </StarsContainer>
        </ReasonSet>
      </CardContent>
    </CardRoot>
  );
}

export function AppCardSkeleton({ mode = "app" }: { mode?: "app" | "movie" }) {
  const isMovie = mode === "movie";
  return (
    <CardRoot aria-hidden="true">
      <CardContent>
        <CardTop $mode={mode}>
          <Cover $mode={mode}>
            <CoverImageContainer>
              <CoverOuterAlign $mode={mode}>
                <CoverInnerAlign $mode={mode}>
                  <SkeletonCover
                    style={
                      isMovie
                        ? { aspectRatio: "2 / 3", borderRadius: 0 }
                        : undefined
                    }
                  />
                </CoverInnerAlign>
              </CoverOuterAlign>
            </CoverImageContainer>
          </Cover>
        </CardTop>
        <Details>
          <SkeletonTitle />
          <SkeletonSubtitle />
        </Details>
        <SkeletonMeta>
          <SkeletonStars />
          <SkeletonPrice />
        </SkeletonMeta>
      </CardContent>
    </CardRoot>
  );
}

export default AppCard;
