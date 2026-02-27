type DescriptionSectionProps = {
  description: string[];
};

export function DescriptionSection({ description }: DescriptionSectionProps) {
  return (
    <div className="details-section description simple contains-text-link">
      <div className="details-section-contents show-more-container all">
        <div className="heading">Описание</div>
        <div className="show-more-content text-body" itemProp="description">
          <div className="app-orig-desc">
            {description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="show-more-end" />
        </div>
      </div>
      <div className="details-section-divider" />
    </div>
  );
}
