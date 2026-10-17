import { Helmet } from '@dr.pogodin/react-helmet';
import EditionPage from '@/components/EditionPage';
import { getEdition } from '@/data/editionCoins';

const SITE = 'https://thetokengame.xyz';
const title = 'Central America Edition — The Token Game | 96 Seasonal Crypto Coins';
const description = '96 seasonal crypto collectible coins celebrating Central American culture, Day of the Dead, and Mesoamerican traditions. From $CATRINA to $QUETZAL — collect on Solana.';
const url = `${SITE}/centralamerica`;
const ogImage = `${SITE}/og-image.png`;

export default function CentralAmericaPage() {
  const edition = getEdition('centralamerica')!;
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url,
          isPartOf: { '@id': `${SITE}/#website` },
          about: { '@id': `${SITE}/#organization` },
        })}</script>
      </Helmet>
      <h1 className="sr-only">{title}</h1>
      <EditionPage edition={edition} />
    </>
  );
}
