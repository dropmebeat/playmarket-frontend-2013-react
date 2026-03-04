import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&family=Poppins:wght@300;400;500;700&display=swap");

  :root {
    --bg-page: #d9d9d9;
    --bg-panel: #f3f3f3;
    --bg-panel-soft: #efefef;
    --bg-header: #f2f2f2;
    --bg-input: #ffffff;
    --bg-hover: #ececec;
    --bg-card-hover: #c7c7c7;
    --text-main: #3a3a3a;
    --text-muted: #666666;
    --text-soft: #8a8a8a;
    --border-main: #d0d0d0;
    --border-soft: #d8d8d8;
    --brand-accent: #a8c52e;
    --brand-accent-strong: #7d931b;
    --brand-dark: #3a3a3a;
    --button-primary-bg: #4b86e8;
    --button-primary-border: #3e6fbe;
    --button-primary-hover: #3f73c7;
    --button-primary-hover-border: #345fa3;
  }

  body[data-theme="dark"] {
    --bg-page: #11161c;
    --bg-panel: #1c222a;
    --bg-panel-soft: #222b35;
    --bg-header: #161d24;
    --bg-input: #12181f;
    --bg-hover: #2a3340;
    --bg-card-hover: #313c4b;
    --text-main: #e6edf5;
    --text-muted: #b8c1cc;
    --text-soft: #9aa6b4;
    --border-main: #2b3643;
    --border-soft: #354252;
    --brand-accent: #9bbf31;
    --brand-accent-strong: #6b8720;
    --brand-dark: #10161d;
    --button-primary-bg: #3a78de;
    --button-primary-border: #3265ba;
    --button-primary-hover: #326ac6;
    --button-primary-hover-border: #2a5aa9;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Poppins", "Montserrat", Arial, Helvetica, sans-serif;
    background: var(--bg-page);
    color: var(--text-main);
    transition: background-color 160ms ease, color 160ms ease;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
  }

  input,
  select,
  textarea,
  button {
    color: inherit;
  }

  input,
  select,
  textarea {
    background: var(--bg-input);
    border-color: var(--border-main);
  }

  body[data-theme="dark"] .details-wrapper,
  body[data-theme="dark"] .details-section,
  body[data-theme="dark"] .card,
  body[data-theme="dark"] article,
  body[data-theme="dark"] section {
    border-color: var(--border-main);
  }

  body[data-theme="dark"] .details-wrapper {
    background: var(--bg-panel);
    color: var(--text-main);
  }

  body[data-theme="dark"] .details-wrapper .details-info,
  body[data-theme="dark"] .details-wrapper .details-section.screenshots,
  body[data-theme="dark"] .details-wrapper .details-section.description,
  body[data-theme="dark"] .details-wrapper .details-actions,
  body[data-theme="dark"] .details-wrapper .wishlist-container .wishlist-content {
    background: var(--bg-panel);
    color: var(--text-main);
  }

  body[data-theme="dark"] .details-wrapper .document-title,
  body[data-theme="dark"] .details-wrapper .heading,
  body[data-theme="dark"] .details-wrapper .text-body,
  body[data-theme="dark"] .details-wrapper .document-subtitle,
  body[data-theme="dark"] .details-wrapper .document-subtitle.primary,
  body[data-theme="dark"] .details-wrapper .document-subtitle.category {
    color: var(--text-main);
  }

  body[data-theme="dark"] .details-wrapper .buy-button-container.play-button .price.buy {
    background: var(--brand-accent);
    color: #fff;
  }

  body[data-theme="dark"] .details-wrapper .wishlist-container .wishlist-content {
    border: 1px solid var(--border-main);
  }

  body[data-theme="light"] .details-wrapper.movie-details .details-info {
    background: var(--bg-page);
  }
`;
