type DescriptionSectionProps = {
  description: string[];
};

function normalizeDescription(paragraphs: string[]) {
  return paragraphs
    .flatMap((paragraph) => paragraph.split(/\n{2,}/g))
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  const blocks = normalizeDescription(description);

  return (
    <div className="details-section description simple contains-text-link">
      <div className="details-section-contents show-more-container all">
        <div className="heading">Описание</div>
        <div className="show-more-content text-body" itemProp="description">
          <div className="app-orig-desc">
            {blocks.map((paragraph) => (
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
