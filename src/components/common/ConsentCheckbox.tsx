import styled from "styled-components";

type ConsentCheckboxProps = {
  name: string;
  label: string;
  required?: boolean;
  defaultChecked?: boolean;
  className?: string;
};

const Field = styled.label`
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.35;
  cursor: pointer;
  user-select: none;
`;

const Input = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const Box = styled.span`
  width: 16px;
  height: 16px;
  margin-top: 1px;
  border: 1px solid var(--border-main);
  border-radius: 3px;
  background: linear-gradient(var(--bg-input), var(--bg-panel));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;

  &::after {
    content: "";
    width: 8px;
    height: 4px;
    border-left: 2px solid transparent;
    border-bottom: 2px solid transparent;
    transform: rotate(-45deg) translateY(-1px);
    transition: border-color 0.15s ease;
  }
`;

const Text = styled.span`
  flex: 1;
`;

const Root = styled.span`
  position: relative;
  display: inline-flex;

  ${Input}:checked + ${Box} {
    border-color: var(--brand-accent-strong);
    background: linear-gradient(
      color-mix(in srgb, var(--brand-accent) 86%, #fff 14%),
      var(--brand-accent)
    );
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }

  ${Input}:checked + ${Box}::after {
    border-left-color: #ffffff;
    border-bottom-color: #ffffff;
  }

  ${Input}:focus-visible + ${Box} {
    border-color: var(--brand-accent);
    box-shadow: 0 0 0 2px rgba(157, 188, 54, 0.35);
  }
`;

export function ConsentCheckbox({
  name,
  label,
  required = false,
  defaultChecked,
  className,
}: ConsentCheckboxProps) {
  return (
    <Field className={className}>
      <Root>
        <Input
          name={name}
          type="checkbox"
          required={required}
          defaultChecked={defaultChecked}
        />
        <Box aria-hidden="true" />
      </Root>
      <Text>{label}</Text>
    </Field>
  );
}
