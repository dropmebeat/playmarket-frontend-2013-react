import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { StoreLayout } from "../components/storeStyles";
import { ActionButton } from "../components/common/ActionButton";
import { getAuthUser, setAuthUser } from "../auth/session";

const AuthWrap = styled.section`
  width: min(1240px, 100%);
  min-height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
`;

const AuthCard = styled.article`
  width: min(460px, 100%);
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  padding: 22px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);

  @media (max-width: 700px) {
    padding: 14px;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: var(--text-main);
  font-size: 34px;
  font-weight: 300;
  line-height: 1.1;

  @media (max-width: 700px) {
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  color: var(--text-soft);
  font-size: 13px;
`;

const Form = styled.form`
  margin-top: 16px;
  display: grid;
  gap: 10px;
`;

const Label = styled.label`
  display: grid;
  gap: 5px;
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
    border-color: var(--brand-accent);
    box-shadow: 0 0 0 1px rgba(157, 188, 54, 0.2);
  }
`;

const Row = styled.div`
  margin-top: 2px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Hint = styled.p`
  margin: 6px 0 0;
  color: var(--text-soft);
  font-size: 12px;
`;

const LinkBtn = styled.button`
  border: 0;
  background: transparent;
  color: color-mix(in srgb, var(--button-primary-bg) 72%, #fff 28%);
  padding: 0;
  font-size: 12px;

  &:hover {
    color: var(--button-primary-bg);
    text-decoration: underline;
  }
`;

const PrimaryAction = styled(ActionButton)`
  min-width: 128px;
`;

export function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Google Play Маркет";
    if (getAuthUser()) {
      navigate("/user", { replace: true });
    }
  }, [navigate]);

  return (
    <StoreLayout variant="apps" topTab="home" hideSideSectionOnMobile>
      <AuthWrap>
        <AuthCard>
          <Title>Войти в Google Play</Title>
          <Subtitle>
            Используйте аккаунт Google, чтобы синхронизировать покупки и список
            желаний.
          </Subtitle>

          <Form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const email = String(formData.get("email") ?? "").trim();
              if (!email) return;
              const nameFromEmail = email.split("@")[0] ?? "Пользователь";
              const name =
                nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

              setAuthUser({ name, email, createdAt: new Date().toISOString() });
              navigate("/user");
            }}
          >
            <Label>
              Email
              <Input
                name="email"
                type="email"
                placeholder="example@gmail.com"
                required
              />
            </Label>
            <Label>
              Пароль
              <Input
                name="password"
                type="password"
                placeholder="********"
                required
              />
            </Label>

            <Row>
              <PrimaryAction type="submit" ariaLabel="Войти" variant="primary">
                Войти
              </PrimaryAction>
              <ActionButton
                type="button"
                ariaLabel="Создать аккаунт"
                onClick={() => navigate("/register")}
              >
                Создать аккаунт
              </ActionButton>
            </Row>
          </Form>

          <Hint>
            Забыли пароль?{" "}
            <LinkBtn type="button" aria-label="Восстановить">
              Восстановить
            </LinkBtn>
          </Hint>
        </AuthCard>
      </AuthWrap>
    </StoreLayout>
  );
}
