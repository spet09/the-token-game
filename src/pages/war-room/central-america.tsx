import { Helmet } from '@dr.pogodin/react-helmet';
import NationPage from '@/components/NationPage';
import { getNationBySlug } from '@/data/nations';
const nation = getNationBySlug('central-america')!;
const SITE = 'https://thetokengame.xyz';
const url = `${SITE}/war-room/${nation.slug}`;
export default function CentralAmericaWarRoomPage() {
  return (<><Helmet>
    <title>{nation.name} — War Room — The Token Game</title>
    <meta name="description" content={`Join the ${nation.name} nation in The Token Game War Room. Compete, earn nation coins, and climb the global rankings.`} />
    <link rel="canonical" href={url} />
    <meta property="og:title" content={`${nation.name} — War Room — The Token Game`} />
    <meta property="og:description" content={`Join the ${nation.name} nation in The Token Game War Room.`} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={`${SITE}/og-image.png`} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={`${nation.name} — War Room — The Token Game`} />
    <meta name="twitter:description" content={`Join the ${nation.name} nation in The Token Game War Room.`} />
    <meta name="twitter:image" content={`${SITE}/og-image.png`} />
    <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#webpage`, name: `${nation.name} War Room`, url, isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': `${SITE}/#organization` } })}</script>
  </Helmet><h1 className="sr-only">{nation.name} War Room</h1><NationPage nation={nation} /></>);
}
