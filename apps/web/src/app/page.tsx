import styled from "styled-components";
import { Eyebrow, PageContainer } from "@tech-news-hub/ui";
import NewsDashboard from "./ui/news-dashboard";

const Header = styled.header`
  border-bottom: 1px solid #e8eef5;
  background: rgba(255, 255, 255, 0.9);
`;

const HeaderInner = styled(PageContainer)`
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 11px;
  font-size: 1.04rem;
  font-weight: 800;
  letter-spacing: -0.035em;
`;

const BrandMark = styled.span`
  display: grid;
  width: 37px;
  height: 37px;
  place-items: center;
  border-radius: 12px;
  color: #fff;
  background: #2563eb;
  font-size: 1.05rem;
  font-weight: 800;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.2);
`;

const HeaderNote = styled.span`
  color: #64748b;
  font-size: 0.83rem;

  @media (max-width: 520px) {
    display: none;
  }
`;

const Main = styled.main`
  padding: 68px 0 80px;

  @media (max-width: 640px) {
    padding-top: 44px;
  }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  align-items: end;
  gap: 32px;
  padding-bottom: 34px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Headline = styled.h1`
  max-width: 720px;
  margin: 14px 0 12px;
  font-size: clamp(2.4rem, 6vw, 4.35rem);
  font-weight: 780;
  letter-spacing: -0.065em;
  line-height: 1.03;

  span {
    color: #2563eb;
  }
`;

const Intro = styled.p`
  max-width: 610px;
  margin: 0;
  color: #64748b;
  font-size: 1.03rem;
  line-height: 1.7;
`;

const HeroCard = styled.aside`
  padding: 19px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #fff;

  @media (max-width: 720px) {
    display: none;
  }
`;

const HeroCardLabel = styled.div`
  margin-bottom: 8px;
  color: #64748b;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const HeroCardText = styled.p`
  margin: 0;
  color: #334155;
  font-size: 0.88rem;
  line-height: 1.55;
`;

const Footer = styled.footer`
  padding: 22px 0;
  border-top: 1px solid #e8eef5;
  color: #64748b;
  font-size: 0.8rem;
`;

const FooterInner = styled(PageContainer)`
  display: flex;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

export default function Home() {
  return (
    <>
      <Header>
        <HeaderInner>
          <Brand href="/" aria-label="Tech News Hub, página inicial">
            <BrandMark aria-hidden="true">T</BrandMark>
            Tech News Hub
          </Brand>
          <HeaderNote>O que está acontecendo no mundo tech</HeaderNote>
        </HeaderInner>
      </Header>
      <Main>
        <PageContainer>
          <Hero>
            <div>
              <Eyebrow>Radar de tecnologia <span aria-hidden="true">✳</span></Eyebrow>
              <Headline>
                O futuro acontece <span>agora.</span>
              </Headline>
              <Intro>
                As conversas e notícias que estão movimentando a tecnologia, reunidas em um só
                lugar.
              </Intro>
            </div>
            <HeroCard>
              <HeroCardLabel>Uma leitura melhor</HeroCardLabel>
              <HeroCardText>
                Notícias de fontes independentes e da comunidade Hacker News, organizadas por
                atualidade.
              </HeroCardText>
            </HeroCard>
          </Hero>
          <NewsDashboard />
        </PageContainer>
      </Main>
      <Footer>
        <FooterInner>
          <span>Tech News Hub — tecnologia em contexto.</span>
          <span>Conteúdo atualizado a partir de feeds públicos.</span>
        </FooterInner>
      </Footer>
    </>
  );
}
