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
  border: 1px solid #d2d2d2;
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
          border-color: #3e6fbe;
          background: #4b86e8;
          color: #fff;

          &:hover {
            background: #3f73c7;
            border-color: #345fa3;
          }
        `
      : css`
          background: #f5f5f5;
          color: #333;

          &:hover {
            background: #ececec;
            border-color: #bdbdbd;
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