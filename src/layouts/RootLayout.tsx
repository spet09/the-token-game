import { Helmet } from '@dr.pogodin/react-helmet';
import { type ReactElement, useEffect } from 'react';
import { ScrollRestoration } from "react-router";
import Footer from '@/layouts/parts/Footer';
import Header from '@/layouts/parts/Header';
import Website from '@/layouts/Website';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { CartProvider } from '@/contexts/cart-context';
import PlayerMenu from '@/components/player/PlayerMenu';

interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Load the Tienko Collection SDK once per page load
  useEffect(() => {
    if (window.Tienko) return;

    const script = document.createElement('script');
    script.src = 'https://tienko.app/tienko-sdk.js';
    script.onload = () => {
      if (window.Tienko) {
        window.Tienko.init({ site: 'the-token-game' });
        console.log('[Tienko] SDK loaded');
      }
    };
    script.onerror = () => {
      console.warn('[Tienko] SDK failed to load');
    };
    document.head.appendChild(script);
  }, []);

  const BASE = 'https://thetokengame.xyz';
  const defaultTitle = 'The Token Game';
  const defaultDesc = '1,080 collectibles. 10 editions. One calendar of stories.';
  const defaultOgImage = `${BASE}/api/og?title=The+Token+Game&description=108+coins.+365+days.`;

  return (
    <CartProvider>
      <Website>
        <GoogleAnalytics />
        <Helmet>
          <title>{defaultTitle}</title>
          <meta name="description" content={defaultDesc} />
          <meta property="og:site_name" content="The Token Game" />
          <meta property="og:title" content={defaultTitle} />
          <meta property="og:description" content={defaultDesc} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={BASE} />
          <meta property="og:image" content={defaultOgImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@thetokengame" />
          <meta name="twitter:title" content={defaultTitle} />
          <meta name="twitter:description" content={defaultDesc} />
          <meta name="twitter:image" content={defaultOgImage} />
        </Helmet>
        <ScrollRestoration />
        <Header />
        <PlayerMenu />
        {children}
        <Footer />
      </Website>
    </CartProvider>
  );
}