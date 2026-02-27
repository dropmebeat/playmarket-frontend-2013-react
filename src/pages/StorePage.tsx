import { useEffect } from "react";
import {
  CardsRow,
  Hero,
  HeroText,
  HeroVisual,
  SectionHeader,
  SectionSubtitle,
  StoreLayout,
} from "../components/storeStyles";
import { AppCard } from "../components/AppCard";
import { storeApps } from "../data/apps";

export function StorePage() {
  useEffect(() => {
    document.title =
      "\u0047\u006f\u006f\u0067\u006c\u0065\u0020\u0050\u006c\u0061\u0079\u0020\u041c\u0430\u0440\u043a\u0435\u0442";
  }, []);

  return (
    <StoreLayout variant="store-main" topTab="top">
      <Hero>
        <HeroVisual>
          <div className="tile t1">{"\uD83C\uDFB8"}</div>
          <div className="tile t2">{"\uD83C\uDF7F"}</div>
          <div className="tile t3">{"\uD83D\uDDA5\uFE0F"}</div>
          <div className="tile t4">{"\uD83D\uDCF0"}</div>
          <div className="tile t5">{"\uD83D\uDCD6"}</div>
          <div className="tile t6">{"\uD83D\uDD79\uFE0F"}</div>
        </HeroVisual>
        <HeroText>
          <h2>
            {
              "\u041C\u044B \u043A\u043E\u0435-\u0447\u0442\u043E \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0438..."
            }
          </h2>
          <p>
            {
              "\u0412 Google Play \u043F\u043E\u044F\u0432\u0438\u043B\u0441\u044F \u043D\u043E\u0432\u044B\u0439 \u0434\u0438\u0437\u0430\u0439\u043D, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0443\u043F\u0440\u043E\u0449\u0430\u0435\u0442 \u043F\u043E\u0438\u0441\u043A \u0438 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043B\u0435\u0433\u043A\u043E \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u044C \u043D\u043E\u0432\u044B\u0435 \u043B\u044E\u0431\u0438\u043C\u044B\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F."
            }
          </p>
        </HeroText>
      </Hero>

      <SectionHeader>
        <h3>
          {
            "\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439"
          }
        </h3>
        <button type="button">
          {
            "\u0421\u043C\u043E\u0442\u0440\u0438\u0442\u0435 \u0431\u043E\u043B\u044C\u0448\u0435"
          }
        </button>
      </SectionHeader>
      <SectionSubtitle>
        {
          "\u0418\u0433\u0440\u044B \u0438\u0437 \u044D\u0442\u043E\u0433\u043E \u043C\u0438\u0440\u0430"
        }
      </SectionSubtitle>

      <CardsRow>
        {storeApps.map((item) => (
          <AppCard key={item.id} item={item} />
        ))}
      </CardsRow>
    </StoreLayout>
  );
}
