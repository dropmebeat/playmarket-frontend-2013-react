import { ArrowRail, CardsRow, SectionHeader, StoreLayout } from "../components/storeStyles";
import { AppCard } from "../components/AppCard";
import { classTools, playerChoice } from "../storeData";

export function HomePage() {
  return (
    <StoreLayout variant="apps" topTab="home">
      <ArrowRail>?</ArrowRail>

      <SectionHeader>
        <h3>{"\u0412\u044b\u0431\u043e\u0440 \u0438\u0433\u0440\u043e\u043a\u043e\u0432"}</h3>
      </SectionHeader>
      <CardsRow>
        {playerChoice.map((item) => (
          <AppCard key={item.id} item={item} />
        ))}
      </CardsRow>

      <SectionHeader>
        <h3>{"\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b \u0434\u043b\u044f \u043a\u043b\u0430\u0441\u0441\u0430"}</h3>
        <button type="button">{"\u0421\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0431\u043e\u043b\u044c\u0448\u0435"}</button>
      </SectionHeader>
      <CardsRow>
        {classTools.map((item) => (
          <AppCard key={item.id} item={item} />
        ))}
      </CardsRow>
    </StoreLayout>
  );
}
