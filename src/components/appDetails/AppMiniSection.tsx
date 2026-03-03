import type { AppData } from "../../data/apps";
import { AppCard } from "../AppCard";
import { H2, Section } from "../../styles/appDetailsStyles";
import styled from "styled-components";

type AppMiniSectionProps = {
  title: string;
  apps: AppData[];
  limit?: number;
};

const ExistingCardsGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(146px, 1fr));
  gap: 10px;
`;

export function AppMiniSection({ title, apps, limit }: AppMiniSectionProps) {
  if (!apps.length) return null;
  const visibleApps = typeof limit === "number" ? apps.slice(0, limit) : apps;

  return (
    <Section>
      <H2>{title}</H2>
      <ExistingCardsGrid>
        {visibleApps.map((app) => (
          <AppCard key={app.id} item={app} />
        ))}
      </ExistingCardsGrid>
    </Section>
  );
}
