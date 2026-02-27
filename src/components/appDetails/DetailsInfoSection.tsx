import type { AppData } from "../../data/apps";

type DetailsInfoSectionProps = {
  app: AppData;
};

export function DetailsInfoSection({ app }: DetailsInfoSectionProps) {
  const ratingWidth = Math.max(0, Math.min(100, (app.ratingValue / 5) * 100));

  return (
    <div className="details-info">
      <div className="cover-container">
        <img
          className="cover-image"
          src={app.image ?? "/assets/apps/1.png"}
          alt="Обложка"
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
          <div className="document-subtitle">- {app.updatedAt}</div>
        </div>
        <div>
          <a className="document-subtitle category" href="#">
            <span itemProp="genre">{app.category}</span>
          </a>
        </div>

        <div className="details-actions">
          <span
            className="buy-button-container apps medium play-button"
            data-docid={app.id}
          >
            <span className="price buy">
              <span>{`${app.price} Купить`}</span>
            </span>
          </span>
          <div className="wishlist-container">
            <div
              className="play-button wishlist-content wishlist-yet-to-add"
              data-docid={app.id}
            >
              <div className="wishlist-text">
                <div className="wishlist-text-default wishlist-text-add">
                  В список желаний
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
          <div>
            <span className="badge">
              <img src="/assets/top-developer.svg" alt="Топ разработчик" />
              <span className="badge-title">Топ разработчик</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
