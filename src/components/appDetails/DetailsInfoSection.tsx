import type { AppData } from "../../data/apps";
import { playCategories } from "../../data/playCategories";

type DetailsInfoSectionProps = {
  app: AppData;
  onDownloadClick?: () => void;
  actionLabel?: string;
  showTopDeveloperBadge?: boolean;
};

const categoryLabelById = new Map(
  playCategories.map((category) => [category.id, category.label]),
);

function formatAppDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizePrice(value: string) {
  return value
    .replace(/\bUSD\s*([\d.,]+)/gi, "$$$1")
    .replace(/([\d.,]+)\s*USD\b/gi, "$$$1")
    .replace(/\s*\u0414\u041E\u041B\u041B\u0410\u0420\u0410/gi, "$")
    .replace(/\s*\u0414\u041E\u041B\u041B\u0410\u0420\u041E\u0412/gi, "$")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function DetailsInfoSection({
  app,
  onDownloadClick,
  actionLabel = "Загрузить",
  showTopDeveloperBadge = true,
}: DetailsInfoSectionProps) {
  const ratingWidth = Math.max(0, Math.min(100, (app.ratingValue / 5) * 100));
  const normalizedPrice = normalizePrice(app.price);
  const categoryLabel = categoryLabelById.get(app.category) ?? app.category;
  const formattedUpdatedAt = formatAppDate(app.updatedAt);

  return (
    <div className="details-info">
      <div className="cover-container">
        <img
          className="cover-image"
          src={app.image ?? "/assets/apps/1.png"}
          alt={"\u041E\u0431\u043B\u043E\u0436\u043A\u0430"}
          itemProp="image"
        />
      </div>
      <div className="info-container">
        <div className="document-title" itemProp="name">
          <div>{app.name}</div>
        </div>
        <div
          itemProp="author"
          itemScope
          itemType="http://schema.org/Organization"
        >
          <a className="document-subtitle primary" href="#" itemProp="name">
            {app.publisher}
          </a>
          <div className="document-subtitle">- {formattedUpdatedAt}</div>
        </div>
        <div>
          <a className="document-subtitle category" href="#">
            <span itemProp="genre">{categoryLabel}</span>
          </a>
        </div>

        <div className="details-actions">
          <span
            className="buy-button-container apps medium play-button"
            data-docid={app.id}
          >
            <button
              type="button"
              className="price buy"
              onClick={onDownloadClick}
            >
              <span>
                {actionLabel}
                {normalizedPrice &&
                !/^(free|\u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E|libre)$/i.test(
                  normalizedPrice.trim(),
                )
                  ? ` (${normalizedPrice})`
                  : ""}
              </span>
            </button>
          </span>
          <div className="wishlist-container">
            <div
              className="play-button wishlist-content wishlist-yet-to-add"
              data-docid={app.id}
            >
              <div className="wishlist-text">
                <div className="wishlist-text-default wishlist-text-add">
                  {
                    "\u0412 \u0441\u043F\u0438\u0441\u043E\u043A \u0436\u0435\u043B\u0430\u043D\u0438\u0439"
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="details-info-divider" />

        <div className="header-star-badge">
          <div className="stars-container">
            <div className="tiny-star star-rating-non-editable-container">
              <div
                className="current-rating"
                style={{ width: `${ratingWidth}%` }}
              />
            </div>
          </div>
          <div className="stars-count">
            (<span className="reviewers-small" />
            {app.ratingCountText.replace(/[()]/g, "")})
          </div>
          {showTopDeveloperBadge ? (
            <div>
              <span className="badge">
                <img
                  src="/assets/top-developer.svg"
                  alt={
                    "\u0422\u043E\u043F \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A"
                  }
                />
                <span className="badge-title">
                  {
                    "\u0422\u043E\u043F \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A"
                  }
                </span>
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
