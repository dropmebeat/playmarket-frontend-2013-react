import styled, { css } from "styled-components";
import type { MouseEventHandler, ReactNode } from "react";

type ActionButtonVariant = "neutral" | "primary";

type ActionButtonProps = {
  type?: "button" | "submit" | "reset";
  ariaLabel: string;
  children: ReactNode;
  variant?: ActionButtonVariant;
  square?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Base = styled.button<{ $variant: ActionButtonVariant; $square: boolean }>`
  height: 30px;
  border: 1px solid var(--border-main);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  line-height: 1;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;

  ${({ $square }) =>
    $square
      ? css`
          width: 30px;
          padding: 0;
        `
      : css`
          min-width: 72px;
          padding: 0 12px;
        `}

  ${({ $variant }) =>
    $variant === "primary"
      ? css`
          border-color: var(--button-primary-border);
          background: var(--button-primary-bg);
          color: #fff;

          &:hover {
            background: var(--button-primary-hover);
            border-color: var(--button-primary-hover-border);
          }
        `
      : css`
          background: var(--bg-panel);
          color: var(--text-main);

          &:hover {
            background: var(--bg-hover);
            border-color: var(--border-soft);
          }
        `}

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(120, 120, 120, 0.25);
  }
`;

export function ActionButton({
  type = "button",
  ariaLabel,
  children,
  variant = "neutral",
  square = false,
  className,
  onClick,
}: ActionButtonProps) {
  return (
    <Base
      type={type}
      aria-label={ariaLabel}
      $variant={variant}
      $square={square}
      className={className}
      onClick={onClick}
    >
      {children}
    </Base>
  );
}
