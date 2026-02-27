import { useEffect } from "react";
import styled from "styled-components";
import { StoreLayout } from "../components/storeStyles";
import { ActionButton } from "../components/common/ActionButton";

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
  background: #f3f3f3;
  border: 1px solid #d4d4d4;
  padding: 22px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);

  @media (max-width: 700px) {
    padding: 14px;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: #4e4e4e;
  font-size: 34px;
  font-weight: 300;
  line-height: 1.1;

  @media (max-width: 700px) {
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  color: #7a7a7a;
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
  color: #666;
  font-size: 12px;
`;

const Input = styled.input`
  height: 34px;
  border: 1px solid #c9c9c9;
  background: #fff;
  color: #4f4f4f;
  padding: 0 10px;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #9dbc36;
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
  color: #8a8a8a;
  font-size: 12px;
`;

const LinkBtn = styled.button`
  border: 0;
  background: transparent;
  color: #5f89c9;
  padding: 0;
  font-size: 12px;

  &:hover {
    color: #4a6fa8;
    text-decoration: underline;
  }
`;

const PrimaryAction = styled(ActionButton)`
  min-width: 128px;
`;

export function AuthPage() {
  useEffect(() => {
    document.title =
      "\u0047\u006f\u006f\u0067\u006c\u0065\u0020\u0050\u006c\u0061\u0079\u0020\u041c\u0430\u0440\u043a\u0435\u0442";
  }, []);

  return (
    <StoreLayout variant="apps" topTab="home" hideSideSectionOnMobile>
      <AuthWrap>
        <AuthCard>
          <Title>{"\u0412\u043E\u0439\u0442\u0438 \u0432 Google Play"}</Title>
          <Subtitle>
            {
              "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 Google, \u0447\u0442\u043E\u0431\u044B \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E\u043A\u0443\u043F\u043A\u0438 \u0438 \u0441\u043F\u0438\u0441\u043E\u043A \u0436\u0435\u043B\u0430\u043D\u0438\u0439."
            }
          </Subtitle>

          <Form onSubmit={(event) => event.preventDefault()}>
            <Label>
              {"Email"}
              <Input type="email" placeholder="example@gmail.com" />
            </Label>
            <Label>
              {"\u041F\u0430\u0440\u043E\u043B\u044C"}
              <Input type="password" placeholder="********" />
            </Label>

            <Row>
              <PrimaryAction
                type="submit"
                ariaLabel={"\u0412\u043E\u0439\u0442\u0438"}
                variant="primary"
              >
                {"\u0412\u043E\u0439\u0442\u0438"}
              </PrimaryAction>
              <ActionButton
                type="button"
                ariaLabel={
                  "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442"
                }
              >
                {
                  "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442"
                }
              </ActionButton>
            </Row>
          </Form>

          <Hint>
            {
              "\u0417\u0430\u0431\u044B\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C? "
            }
            <LinkBtn
              type="button"
              aria-label={
                "\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C"
              }
            >
              {
                "\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C"
              }
            </LinkBtn>
          </Hint>
        </AuthCard>
      </AuthWrap>
    </StoreLayout>
  );
}
