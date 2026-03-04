import type { RefObject } from "react";
import styled from "styled-components";
import type { AppData } from "../../data/apps";

type ApkDownloadSectionProps = {
  app: AppData;
  sectionRef: RefObject<HTMLElement | null>;
};

const Section = styled.section`
  margin-top: 0;
  border-top: 1px solid var(--border-main);
  border-bottom: 1px solid var(--border-main);
  background: linear-gradient(var(--bg-panel), var(--bg-panel-soft));
  padding: 10px;
`;

const Heading = styled.h2`
  margin: 0 0 10px;
  font-size: 41px;
  font-weight: 300;
  color: var(--text-main);
  line-height: 1.1;

  @media (max-width: 760px) {
    font-size: 30px;
  }
`;

const Card = styled.div`
  border: 1px solid var(--border-main);
  background: var(--bg-panel);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Meta = styled.div`
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.5;

  strong {
    color: var(--text-main);
  }
`;

const DownloadButton = styled.a`
  align-self: center;
  justify-self: end;
  border: 0;
  background: var(--brand-accent);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 9px 16px;
  text-decoration: none;
  transition:
    background-color 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    background: color-mix(in srgb, var(--brand-accent) 86%, #fff 14%);
    box-shadow: inset 0 -3px 0 var(--brand-accent-strong);
  }

  @media (max-width: 700px) {
    justify-self: start;
  }
`;

const Note = styled.p`
  margin: 8px 0 0;
  color: var(--text-soft);
  font-size: 12px;
`;

export function ApkDownloadSection({
  app,
  sectionRef,
}: ApkDownloadSectionProps) {
  const fallbackUrl = `https://play.google.com/store/apps/details?id=${encodeURIComponent(app.id)}`;
  const downloadUrl = app.website ?? fallbackUrl;

  return (
    <Section ref={sectionRef} id="apk-download">
      <Heading>
        {"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 APK"}
      </Heading>
      <Card>
        <Meta>
          <div>
            <strong>{app.name}</strong>
          </div>
          <div>
            {"\u0412\u0435\u0440\u0441\u0438\u044f"}: {app.version}
          </div>
          <div>
            {"\u0420\u0430\u0437\u043c\u0435\u0440"}: {app.size}
          </div>
          <div>
            {"\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f Android"}:{" "}
            {app.requiresAndroid}
          </div>
        </Meta>
        <DownloadButton href={downloadUrl} target="_blank" rel="noreferrer">
          {"\u0421\u043a\u0430\u0447\u0430\u0442\u044c APK"}
        </DownloadButton>
      </Card>
      <Note>
        {
          "\u041f\u0435\u0440\u0435\u0434 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u043e\u0439 \u0443\u0431\u0435\u0434\u0438\u0442\u0435\u0441\u044c, \u0447\u0442\u043e \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a \u0444\u0430\u0439\u043b\u0430 APK \u0434\u043e\u0432\u0435\u0440\u0435\u043d\u043d\u044b\u0439."
        }
      </Note>
    </Section>
  );
}
