import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { StoreLayout } from "../components/storeStyles";
import { ActionButton } from "../components/common/ActionButton";
import { ConsentCheckbox } from "../components/common/ConsentCheckbox";
import { getAuthUser, setAuthUser } from "../auth/session";

const RegisterWrap = styled.section`
  width: min(1240px, 100%);
  min-height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
`;

const RegisterCard = styled.article`
  width: min(520px, 100%);
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
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
  min-width: 160px;
`;

type CountryOption = { code: string; name: string };

function getAllCountries(locale: string): CountryOption[] {
  const displayNames = new Intl.DisplayNames([locale], { type: "region" });
  const countries: CountryOption[] = [];

  for (let first = 65; first <= 90; first += 1) {
    for (let second = 65; second <= 90; second += 1) {
      const code = String.fromCharCode(first, second);
      const name = displayNames.of(code);
      if (!name || name === code) continue;
      countries.push({ code, name });
    }
  }

  return countries.sort((a, b) => a.name.localeCompare(b.name, locale));
}

export function RegisterPage() {
  const navigate = useNavigate();
  const countries = useMemo(() => getAllCountries("ru-RU"), []);

  useEffect(() => {
    document.title = "Регистрация - Google Play Маркет";
    if (getAuthUser()) {
      navigate("/user", { replace: true });
    }
  }, [navigate]);

  return (
    <StoreLayout variant="apps" topTab="home" hideSideSectionOnMobile>
      <RegisterWrap>
        <RegisterCard>
          <Title>Создать аккаунт</Title>
          <Subtitle>
            Зарегистрируйтесь, чтобы сохранять приложения, отзывы и список
            желаний.
          </Subtitle>

          <Form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const firstName = String(formData.get("firstName") ?? "").trim();
              const lastName = String(formData.get("lastName") ?? "").trim();
              const email = String(formData.get("email") ?? "").trim();
              const accepted = formData.get("accept") === "on";
              if (!email || !accepted) return;

              const name = [firstName, lastName]
                .filter(Boolean)
                .join(" ")
                .trim();
              setAuthUser({
                name: name || "Пользователь",
                email,
                createdAt: new Date().toISOString(),
              });
              navigate("/user");
            }}
          >
            <FormGrid>
              <Label>
                Имя
                <Input
                  name="firstName"
                  type="text"
                  placeholder="Иван"
                  autoComplete="given-name"
                />
              </Label>
              <Label>
                Фамилия
                <Input
                  name="lastName"
                  type="text"
                  placeholder="Петров"
                  autoComplete="family-name"
                />
              </Label>
            </FormGrid>

            <Label>
              Email
              <Input
                name="email"
                type="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                required
              />
            </Label>
            <Label>
              Страна
              <Input as="select" name="country" defaultValue="" required>
                <option value="" disabled>
                  Выберите страну
                </option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </Input>
            </Label>

            <FormGrid>
              <Label>
                Пароль
                <Input
                  name="password"
                  type="password"
                  placeholder="Минимум 8 символов"
                  autoComplete="new-password"
                  required
                />
              </Label>
              <Label>
                Подтверждение пароля
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Повторите пароль"
                  autoComplete="new-password"
                  required
                />
              </Label>
            </FormGrid>

            <ConsentCheckbox
              name="accept"
              required
              label="Я принимаю условия использования и политику конфиденциальности"
            />

            <Row>
              <PrimaryAction
                type="submit"
                ariaLabel="Зарегистрироваться"
                variant="primary"
              >
                Зарегистрироваться
              </PrimaryAction>
              <ActionButton
                type="button"
                ariaLabel="У меня уже есть аккаунт"
                onClick={() => navigate("/auth")}
              >
                У меня уже есть аккаунт
              </ActionButton>
            </Row>
          </Form>

          <Hint>
            Уже зарегистрированы?{" "}
            <LinkBtn type="button" onClick={() => navigate("/auth")}>
              Войти
            </LinkBtn>
          </Hint>
        </RegisterCard>
      </RegisterWrap>
    </StoreLayout>
  );
}
