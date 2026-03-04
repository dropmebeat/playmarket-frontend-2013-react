import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ActionButton } from "../common/ActionButton";
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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  overflow-y: auto;
  padding: 10px;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 560px) {
    align-items: flex-start;
    padding: 8px;
  }
`;

const ModalCard = styled.div`
  width: min(560px, 100%);
  max-height: calc(100dvh - 20px);
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  padding: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  overflow-y: auto;

  @media (max-width: 560px) {
    width: 100%;
    max-height: calc(100dvh - 16px);
    padding: 12px;
  }
`;

const ModalTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: var(--text-main);
  font-size: 24px;
  font-weight: 400;

  @media (max-width: 560px) {
    font-size: 20px;
  }
`;

const CloseBtn = styled.button`
  border: 0;
  background: transparent;
  color: var(--text-soft);
  font-size: 20px;
  width: 32px;
  height: 32px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  cursor: pointer;
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
  color: var(--text-muted);
  font-size: 12px;
`;

const Input = styled.input`
  height: 34px;
  border: 1px solid var(--border-main);
  background: var(--bg-input);
  color: var(--text-main);
  padding: 0 10px;
  font-size: 13px;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  @media (max-width: 560px) {
    height: 38px;
    font-size: 16px;
  }
`;

const Textarea = styled.textarea`
  min-height: 120px;
  border: 1px solid var(--border-main);
  background: var(--bg-input);
  color: var(--text-main);
  padding: 8px 10px;
  font-size: 13px;
  line-height: 1.45;
  resize: vertical;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  @media (max-width: 560px) {
    min-height: 140px;
    font-size: 16px;
  }
`;

const StarsRow = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 12px;

  @media (max-width: 560px) {
    gap: 6px;
  }
`;

const StarBtn = styled.button<{ $active: boolean }>`
  border: 0;
  background: transparent;
  color: ${({ $active }) =>
    $active
      ? "color-mix(in srgb, var(--brand-accent) 55%, #ffb347 45%)"
      : "var(--text-soft)"};
  font-size: 24px;
  line-height: 1;
  padding: 0;
  min-width: 32px;
  min-height: 32px;
  cursor: pointer;

  @media (max-width: 560px) {
    font-size: 28px;
    min-width: 36px;
    min-height: 36px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;

  @media (max-width: 560px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const ModalActionButton = styled(ActionButton)`
  @media (max-width: 560px) {
    width: 100%;
    min-width: 0;
    height: 36px;
  }
`;

function starsByScore(score: number) {
  const rounded = Math.round(score);
  return "\u2605\u2605\u2605\u2605\u2605".slice(0, rounded).padEnd(5, "\u2606");
}

export function ReviewsBlock({ app }: ReviewsBlockProps) {
  const initialReviews = useMemo(
    () => (Array.isArray(app.reviews) ? app.reviews : []),
    [app.reviews],
  );
  const [reviews, setReviews] = useState(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftAuthor, setDraftAuthor] = useState("");
  const [draftText, setDraftText] = useState("");
  const [draftStars, setDraftStars] = useState(5);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  useEffect(() => {
    if (!isModalOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isModalOpen]);

  const handleSubmitReview = () => {
    const author = draftAuthor.trim() || "Пользователь";
    const text = draftText.trim();
    if (!text) return;

    setReviews((current) => [
      {
        id: `custom-${Date.now()}`,
        author,
        text,
        stars: draftStars,
        avatar: "/assets/top-developer.svg",
      },
      ...current,
    ]);
    setDraftText("");
    setDraftAuthor(author);
    setDraftStars(5);
    setIsModalOpen(false);
  };

  return (
    <Section>
      <ReviewsTop>
        <H2>{"\u041E\u0442\u0437\u044B\u0432\u044B"}</H2>
        <ReviewBtn type="button" onClick={() => setIsModalOpen(true)}>
          {
            "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043E\u0442\u0437\u044B\u0432"
          }
        </ReviewBtn>
      </ReviewsTop>
      <ReviewsGrid>
        <ScoreCard>
          <ScoreValue>{app.ratingValue.toFixed(1)}</ScoreValue>
          <Stars>{starsByScore(app.ratingValue)}</Stars>
          <div style={{ marginTop: 6 }}>
            {app.ratingCountText} {"\u0432\u0441\u0435\u0433\u043E"}
          </div>
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
          {reviews.length > 0 ? (
            reviews.map((review) => (
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
            ))
          ) : (
            <ReviewCard>
              <div>
                {
                  "\u041E\u0442\u0437\u044B\u0432\u044B \u043F\u043E\u043A\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B."
                }
              </div>
            </ReviewCard>
          )}
        </ReviewsList>
      </ReviewsGrid>
      {isModalOpen ? (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTop>
              <ModalTitle>Новый отзыв</ModalTitle>
              <CloseBtn
                type="button"
                aria-label="Закрыть"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </CloseBtn>
            </ModalTop>

            <Field>
              Имя
              <Input
                type="text"
                value={draftAuthor}
                onChange={(event) => setDraftAuthor(event.target.value)}
                placeholder="Ваше имя"
              />
            </Field>

            <Field>Оценка</Field>
            <StarsRow>
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                return (
                  <StarBtn
                    key={starValue}
                    type="button"
                    $active={starValue <= draftStars}
                    onClick={() => setDraftStars(starValue)}
                    aria-label={`Оценка ${starValue}`}
                  >
                    ★
                  </StarBtn>
                );
              })}
            </StarsRow>

            <Field>
              Текст отзыва
              <Textarea
                value={draftText}
                onChange={(event) => setDraftText(event.target.value)}
                placeholder="Расскажите, что понравилось или не понравилось"
              />
            </Field>

            <ModalActions>
              <ModalActionButton
                type="button"
                ariaLabel="Отмена"
                onClick={() => setIsModalOpen(false)}
              >
                Отмена
              </ModalActionButton>
              <ModalActionButton
                type="button"
                ariaLabel="Отправить"
                variant="primary"
                onClick={handleSubmitReview}
              >
                Отправить
              </ModalActionButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      ) : null}
    </Section>
  );
}
