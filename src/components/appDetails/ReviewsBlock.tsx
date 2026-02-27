import type { AppData } from "../../data/apps";
import {
  Avatar,
  Bar,
  BarList,
  BarRow,
  H2,
  ReviewAuthor,
  ReviewBtn,
  ReviewCard,
  ReviewsGrid,
  ReviewsList,
  ReviewsTop,
  ScoreCard,
  ScoreValue,
  Section,
  Stars,
} from "../../styles/appDetailsStyles";

type ReviewsBlockProps = {
  app: AppData;
};

function starsByScore(score: number) {
  const rounded = Math.round(score);
  return "\u2605\u2605\u2605\u2605\u2605".slice(0, rounded).padEnd(5, "\u2606");
}

export function ReviewsBlock({ app }: ReviewsBlockProps) {
  return (
    <Section>
      <ReviewsTop>
        <H2>Отзывы</H2>
        <ReviewBtn type="button">Написать отзыв</ReviewBtn>
      </ReviewsTop>
      <ReviewsGrid>
        <ScoreCard>
          <ScoreValue>{app.ratingValue.toFixed(1)}</ScoreValue>
          <Stars>{starsByScore(app.ratingValue)}</Stars>
          <div style={{ marginTop: 6 }}>{app.ratingCountText} всего</div>
          <BarList>
            <BarRow>
              <span>5</span>
              <Bar $width={86} />
            </BarRow>
            <BarRow>
              <span>4</span>
              <Bar $width={42} />
            </BarRow>
            <BarRow>
              <span>3</span>
              <Bar $width={18} $color="#d4a34a" />
            </BarRow>
            <BarRow>
              <span>2</span>
              <Bar $width={10} $color="#d18f4a" />
            </BarRow>
            <BarRow>
              <span>1</span>
              <Bar $width={14} $color="#d36b4b" />
            </BarRow>
          </BarList>
        </ScoreCard>
        <ReviewsList>
          {app.reviews.map((review) => (
            <ReviewCard key={review.id}>
              <Avatar src={review.avatar} alt={review.author} />
              <div>
                <div>{review.text}</div>
                <ReviewAuthor>{review.author}</ReviewAuthor>
                <Stars>
                  {"\u2605\u2605\u2605\u2605\u2605"
                    .slice(0, review.stars)
                    .padEnd(5, "\u2606")}
                </Stars>
              </div>
            </ReviewCard>
          ))}
        </ReviewsList>
      </ReviewsGrid>
    </Section>
  );
}
