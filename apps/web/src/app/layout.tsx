import type { Metadata } from "next";
import type { ReactNode } from "react";
import StyledComponentsRegistry from "./lib/styled-components-registry";
import { GlobalStyles } from "./styles";

export const metadata: Metadata = {
  title: {
    default: "Tech News Hub — tecnologia em contexto",
    template: "%s | Tech News Hub"
  },
  description:
    "As principais notícias de tecnologia, inteligência artificial e inovação, reunidas de fontes confiáveis e do Hacker News.",
  applicationName: "Tech News Hub"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
