import { useState, useRef } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import AdminLayout from '@/layouts/AdminLayout';

type CoinUploadEntry = {
  ticker: string;
  name: string;
  edition: string;
  slug: string;
};

// All editions and their seasonal coins
const ALL_COINS: CoinUploadEntry[] = [
  // AFRICA
  ...([
    ['$UBUNTU','Ubuntu'],['$SAVANNA2','Savanna 2'],['$BAOBAB','Baobab'],['$ACACIA','Acacia'],
    ['$SERENGETI','Serengeti'],['$MIGRATION','Migration'],['$WILDEBEEST','Wildebeest'],['$ZEBRA','Zebra'],
    ['$LION','Lion'],['$ELEPHANT2','Elephant 2'],['$GIRAFFE','Giraffe'],['$RHINO','Rhino'],
    ['$LEOPARD','Leopard'],['$BUFFALO','Buffalo'],['$CHEETAH','Cheetah'],['$HIPPO','Hippo'],
    ['$MANDELA','Mandela'],['$FREEDOM2','Freedom 2'],['$RAINBOW','Rainbow Nation'],['$UBUNTU2','Ubuntu 2'],
    ['$INDABA','Indaba'],['$IMPI','Impi'],['$SANGOMA','Sangoma'],['$LOBOLA','Lobola'],
    ['$FREEDOMDAY','Freedom Day'],['$LIBERATION','Liberation'],['$KENTE','Kente'],['$DASHIKI','Dashiki'],
    ['$DJEMBE','Djembe'],['$KORA','Kora'],['$MBIRA','Mbira'],['$BALAFON','Balafon'],
    ['$AFRICADAY','Africa Day'],['$PANAFRICANISM','Pan Africanism'],['$NILERIVER','Nile River'],['$SAHARA','Sahara'],
    ['$KILIMANJARO','Kilimanjaro'],['$VICTORIA','Victoria Falls'],['$OKAVANGO','Okavango'],['$CONGO','Congo'],
    ['$YOUTHDAY','Youth Day'],['$SOWETO','Soweto'],['$JOLLOF','Jollof Rice'],['$FUFU','Fufu'],
    ['$INJERA','Injera'],['$SUYA','Suya'],['$BOBOTIE','Bobotie'],['$BILTONG','Biltong'],
    ['$MANDELADAY','Mandela Day'],['$UBUNTU3','Ubuntu 3'],['$MAASAI','Maasai'],['$ZULU','Zulu'],
    ['$YORUBA','Yoruba'],['$HAUSA','Hausa'],['$IGBO','Igbo'],['$ASHANTI','Ashanti'],
    ['$WOMENDAY','Women Day'],['$MATRIARCH','Matriarch'],['$QUEEN','Queen'],['$MOTHERAFRICA','Mother Africa'],
    ['$FERTILITY','Fertility'],['$HARVEST4','Harvest 4'],['$RAIN','Rain'],['$THUNDER','Thunder'],
    ['$HERITAGEDAY','Heritage Day'],['$BRAAI','Braai'],['$SHISA','Shisa Nyama'],['$PAP','Pap'],
    ['$CHAKALAKA','Chakalaka'],['$UMQOMBOTHI','Umqombothi'],['$ROOIBOS','Rooibos'],['$HONEYBUSH','Honeybush'],
    ['$HARVEST5','Harvest 5'],['$MOONSEASON','Moon Season'],['$MASQUERADE2','Masquerade 2'],['$EGUNGUN','Egungun'],
    ['$VOODOO2','Voodoo 2'],['$ANCESTOR','Ancestor'],['$SPIRIT','Spirit'],['$RITUAL','Ritual'],
    ['$DIWALI2','Diwali 2'],['$EIDMUBARAK','Eid Mubarak'],['$RAMADAN','Ramadan'],['$IFTAR','Iftar'],
    ['$MOSQUE','Mosque'],['$MINARET','Minaret'],['$CRESCENT','Crescent'],['$STAR2','Star 2'],
    ['$KWANZAA2','Kwanzaa 2'],['$UMOJA','Umoja'],['$KUJICHAGULIA','Kujichagulia'],['$UJIMA','Ujima'],
    ['$UJAMAA','Ujamaa'],['$NIA','Nia'],['$KUUMBA','Kuumba'],['$IMANI','Imani'],
  ] as [string,string][]).map(([ticker, name]) => ({
    ticker, name, edition: 'Africa', slug: 'africa',
  })),

  // EUROPE
  ...([
    ['$CARNIVAL','Carnival'],['$EPIPHANY','Epiphany'],['$THREEKINGS','Three Kings'],['$GALETTE','Galette'],
    ['$MULLEDWINE','Mulled Wine'],['$SCHNAPPS','Schnapps'],['$FONDUE','Fondue'],['$RACLETTE','Raclette'],
    ['$VENICECARNI','Venice Carnival'],['$MASQUERADE','Masquerade'],['$MARDI2','Mardi 2'],['$CREPE','Crepe'],
    ['$CHANDELEUR','Chandeleur'],['$STROOPWAFEL','Stroopwafel'],['$WAFFLE','Waffle'],['$SPECULOOS','Speculoos'],
    ['$STPATRICK2','St Patrick 2'],['$HOLI2','Holi 2'],['$TULIP','Tulip'],['$WINDMILL','Windmill'],
    ['$BEERSTEIN','Beer Stein'],['$PRETZEL','Pretzel'],['$LEDERHOSEN','Lederhosen'],['$DIRNDL','Dirndl'],
    ['$EASTER3','Easter 3'],['$EASTERMARKET','Easter Market'],['$TULIPFIELD','Tulip Field'],['$KEUKENHOF','Keukenhof'],
    ['$SPRINGFEST','Spring Fest'],['$MAYPOLE','Maypole'],['$BELTANE','Beltane'],['$WALPURGIS','Walpurgis'],
    ['$EUROVISION','Eurovision'],['$CHAMPAGNE','Champagne'],['$CROISSANT','Croissant'],['$BAGUETTE','Baguette'],
    ['$ESCARGOT','Escargot'],['$FOIEGRAS','Foie Gras'],['$BORDEAUX','Bordeaux'],['$CAMEMBERT','Camembert'],
    ['$MIDSOMMAR','Midsommar'],['$SOLSTICE2','Solstice 2'],['$MAYPOLE2','Maypole 2'],['$HERRING','Herring'],
    ['$AQUAVIT','Aquavit'],['$SAUNA','Sauna'],['$FJORD','Fjord'],['$AURORA','Aurora'],
    ['$BASTILLEDAY','Bastille Day'],['$TOURDEFRANCE','Tour de France'],['$GELATO','Gelato'],['$PIAZZA','Piazza'],
    ['$COLOSSEUM','Colosseum'],['$GONDOLA','Gondola'],['$FLAMENCO','Flamenco'],['$PAELLA','Paella'],
    ['$OKTOBERFEST','Oktoberfest'],['$BRATWURST','Bratwurst'],['$SAUERKRAUT','Sauerkraut'],['$SCHNITZEL','Schnitzel'],
    ['$STRUDEL','Strudel'],['$SACHERTORTE','Sachertorte'],['$WIENER','Wiener'],['$KAISERSCHMARRN','Kaiserschmarrn'],
    ['$HARVEST2','Harvest 2'],['$VENDANGE','Vendange'],['$GRAPEPICK','Grape Pick'],['$TRUFFLE','Truffle'],
    ['$MUSHROOMHUNT','Mushroom Hunt'],['$CHESTNUT','Chestnut'],['$CIDER','Cider'],['$CALVADOS','Calvados'],
    ['$OKTOBERFEST2','Oktoberfest 2'],['$HALLOWEEN3','Halloween 3'],['$ALLSAINTS','All Saints'],['$DAYOFTHEDEAD2','Day of Dead 2'],
    ['$BONFIRE','Bonfire'],['$GUYFAWKES','Guy Fawkes'],['$PUMPKIN2','Pumpkin 2'],['$HARVEST3','Harvest 3'],
    ['$ARMISTICE','Armistice'],['$REMEMBRANCE','Remembrance'],['$SINTERKLAAS','Sinterklaas'],['$BLACKPETE','Black Pete'],
    ['$STMARTIN','St Martin'],['$LANTERNFEST','Lantern Fest'],['$BEAUJOLAIS','Beaujolais'],['$TRUFFLESEASON','Truffle Season'],
    ['$CHRISTMASMARKET','Christmas Market'],['$GLUHWEIN','Gluhwein'],['$STNICOLAS','St Nicolas'],['$ADVENT','Advent'],
    ['$YULE2','Yule 2'],['$SOLSTICE3','Solstice 3'],['$HOGMANAY','Hogmanay'],['$NEWYEAREUR','New Year EUR'],
  ] as [string,string][]).map(([ticker, name]) => ({
    ticker, name, edition: 'Europe', slug: 'europe',
  })),

  // RUSSIA
  ...([
    ['$DEDMOROZ','Ded Moroz'],['$SNEGUROCHKA','Snegurochka'],['$BANYA','Banya'],['$VALENKI','Valenki'],
    ['$USHANKA','Ushanka'],['$SAMOVAR','Samovar'],['$BLINI','Blini'],['$CAVIAR','Caviar'],
  ] as [string,string][]).map(([ticker, name]) => ({
    ticker, name, edition: 'Russia', slug: 'russia',
  })),
];

type UploadState = 'idle' | 'uploading' | 'done' | 'error';

function CoinUploadRow({ coin }: { coin: CoinUploadEntry }) {
  const [state, setState] = useState<UploadState>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const coinKey = coin.ticker.replace('$', '').toLowerCase();
  const slotPath = `coins/${coin.slug}/${coinKey}`;

  async function handleFile(file: File) {
    setState('uploading');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('slot', slotPath);

    try {
      const res = await fetch('/api/upload-coin', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setState('done');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border transition-colors"
      style={{
        borderColor: state === 'done' ? '#9fff5f44' : state === 'error' ? '#ff5f5f44' : '#ffffff11',
        background: state === 'done' ? '#9fff5f08' : '#ffffff05',
      }}
    >
      {/* Preview / placeholder */}
      <div
        className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
        style={{ background: '#1a0f2e', border: '1px solid #BF5FFF44' }}
      >
        {preview ? (
          <img src={preview} alt={coin.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[8px] font-mono text-center leading-tight px-1" style={{ color: '#BF5FFF' }}>
            {coinKey.toUpperCase().slice(0, 6)}
          </span>
        )}
      </div>

      {/* Name + slot */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{coin.name}</p>
        <p className="text-[10px] font-mono truncate" style={{ color: '#BF5FFF88' }}>
          {slotPath}
        </p>
      </div>

      {/* Status */}
      <div className="flex-shrink-0 w-20 text-right">
        {state === 'done' && <span className="text-xs font-bold" style={{ color: '#9fff5f' }}>✓ Uploaded</span>}
        {state === 'error' && <span className="text-xs font-bold" style={{ color: '#ff5f5f' }}>✗ Failed</span>}
        {state === 'uploading' && <span className="text-xs" style={{ color: '#BF5FFF' }}>Uploading…</span>}
      </div>

      {/* Upload button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={state === 'uploading'}
        className="flex-shrink-0 px-3 py-1.5 rounded text-xs font-bold transition-all"
        style={{
          background: state === 'done' ? '#9fff5f22' : '#BF5FFF22',
          color: state === 'done' ? '#9fff5f' : '#BF5FFF',
          border: `1px solid ${state === 'done' ? '#9fff5f44' : '#BF5FFF44'}`,
          cursor: state === 'uploading' ? 'not-allowed' : 'pointer',
        }}
      >
        {state === 'done' ? 'Replace' : 'Upload'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}

export default function UploadCoinsPage() {
  const editions = [...new Set(ALL_COINS.map((c) => c.edition))];
  const [activeEdition, setActiveEdition] = useState(editions[0]);
  const [search, setSearch] = useState('');

  const filtered = ALL_COINS.filter(
    (c) =>
      c.edition === activeEdition &&
      (search === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.ticker.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout title="Upload Coins">
      <Helmet>
        <title>Upload Coin Images — Admin</title>
        <meta name="description" content="Admin tool for uploading pixel-art coin images to edition slots." />
        <link rel="canonical" href="https://thetokengame.xyz/admin/upload-coins" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-black mb-1" style={{ color: '#BF5FFF', fontFamily: 'Righteous, sans-serif' }}>
            Coin Image Upload
          </h1>
          <p className="text-sm mb-8" style={{ color: '#ffffff66' }}>
            Upload images directly to each coin slot. Images are saved immediately.
          </p>

          {/* Edition tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {editions.map((ed) => (
              <button
                key={ed}
                onClick={() => { setActiveEdition(ed); setSearch(''); }}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all"
                style={{
                  background: activeEdition === ed ? '#BF5FFF' : '#BF5FFF22',
                  color: activeEdition === ed ? '#fff' : '#BF5FFF',
                  border: '1px solid #BF5FFF44',
                }}
              >
                {ed}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search coins…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-lg text-sm outline-none"
            style={{
              background: '#ffffff0a',
              border: '1px solid #BF5FFF33',
              color: '#fff',
            }}
          />

          {/* Count */}
          <p className="text-xs mb-4" style={{ color: '#ffffff44' }}>
            {filtered.length} coins in {activeEdition}
          </p>

          {/* Coin list */}
          <div className="flex flex-col gap-2">
            {filtered.map((coin) => (
              <CoinUploadRow key={`${coin.slug}-${coin.ticker}`} coin={coin} />
            ))}
          </div>
        </div>
    </AdminLayout>
  );
}
