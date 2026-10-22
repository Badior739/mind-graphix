import { LangProvider } from "./LangProvider";
import { QuoteProvider } from "./QuoteProvider";
import Header from "./Header";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";
import Cursor from "./Cursor";
import WhatsAppFab from "./WhatsAppFab";
import Track from "./Track";
import AccessGate from "./AccessGate";
import { content } from "@/lib/content";

export default function PageShell({ lang, overrides = null, children }) {
  return (
    <LangProvider lang={lang} overrides={overrides}>
      <QuoteProvider>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
        >
          {content[lang].skip}
        </a>
        <Track lang={lang} />
        <SmoothScroll />
        <Cursor />
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <WhatsAppFab />
        <AccessGate />
      </QuoteProvider>
    </LangProvider>
  );
}
