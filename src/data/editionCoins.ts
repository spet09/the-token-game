import { PERMANENT_COINS, SEASONAL_YEAR_ONE, YEAR_TWO_GROUPS, FINALE_COINS, type Coin } from './coins';

// ─── Edition config ────────────────────────────────────────────────────────────
export type Edition = {
  id: string;
  name: string;
  flag: string;
  suffix: string;
  bgColor: string;
  rimText: string;
  accentColor: string;
  path: string;
  permanentCoins: Coin[];
  seasonalGroups: SeasonalGroup[];
};

export type SeasonalGroup = {
  label: string;
  coins: Coin[];
};

// Helper: build permanent coins for an edition by remapping images to suffix pattern
function buildPermanentCoins(_suffix: string): Coin[] {
  // Reuse the Global edition images for permanent coins across all editions —
  // no edition-specific permanent coin art exists yet, so fall back to the
  // real pixel-art images already placed on the Global page.
  return PERMANENT_COINS.map((c) => ({
    ...c,
    buyUrl: c.buyUrl ?? '#',
    status: c.status ?? ('coming-soon' as const),
  }));
}

// Suffix → edition slug map for image slot paths
const SUFFIX_TO_SLUG: Record<string, string> = {
  '_AUSTRALIA':    'australia',
  '_CHINA':        'china',
  '_USA':          'usa',
  '_EUROPA':       'europe',
  '_EUROPE':       'europe',
  '_AFRICA':       'africa',
  '_RUSSIA':       'russia',
  '_INDIA':        'india',
  '_JAPAN':        'japan',
  '_SA':           'southamerica',
  '_SOUTHAMERICA': 'southamerica',
  '_GLOBAL':       'global',
  '_ME':           'middleeast',
  '_MIDDLEEAST':   'middleeast',
  '_OC':           'oceania',
  '_OCEANIA':      'oceania',
  '_NA':           'northamerica',
  '_NORTHAMERICA': 'northamerica',
  '_CA':           'centralamerica',
  '_CENTRALAMERICA':'centralamerica',
  '_ARC':          'arctic',
  '_ARCTIC':       'arctic',
  '_ANT':          'antarctica',
  '_ANTARCTICA':   'antarctica',
};

// Helper: build a seasonal coin
function sc(ticker: string, name: string, suffix: string): Coin {
  const slug = SUFFIX_TO_SLUG[suffix];
  const coinKey = ticker.replace('$', '').toLowerCase();
  // Always generate a slot URL so the canvas Replace button knows which slot to write to.
  // The slot returns a 404 until an image is uploaded, but the <img> onError falls back
  // to placeholder.jpg visually — the slot identity is preserved for canvas Replace.
  const image = slug ? `/airo-assets/images/coins/${slug}/${coinKey}` : undefined;
  return {
    ticker,
    name,
    buyUrl: '#',
    permanent: false,
    image,
    status: 'coming-soon',
  };
}

// ─── AUSTRALIA ────────────────────────────────────────────────────────────────
const AUS = '_AUSTRALIA';
const australiaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$DROPBEAR',  'Drop Bear',        AUS),
    sc('$STRAYA',    'Straya',           AUS),
    sc('$THONG',     'Thong',            AUS),
    sc('$SNAG',      'Snag',             AUS),
    sc('$ARVO',      'Arvo',             AUS),
    sc('$SERVO',     'Servo',            AUS),
    sc('$BOGAN',     'Bogan',            AUS),
    sc('$MACCAS',    'Maccas',           AUS),
  ]},
  { label: 'February', coins: [
    sc('$VEGEMITE',  'Vegemite',         AUS),
    sc('$PAVLOVA',   'Pavlova',          AUS),
    sc('$LAMINGTON', 'Lamington',        AUS),
    sc('$TIMTAM',    'Tim Tam',          AUS),
    sc('$MEATPIE',   'Meat Pie',         AUS),
    sc('$SAUSROLL',  'Sausage Roll',     AUS),
    sc('$CHICKOROLL','Chicko Roll',      AUS),
    sc('$FAIRYBREAD','Fairy Bread',      AUS),
  ]},
  { label: 'March', coins: [
    sc('$KANGAROO',  'Kangaroo',         AUS),
    sc('$KOALA',     'Koala',            AUS),
    sc('$WOMBAT',    'Wombat',           AUS),
    sc('$ECHIDNA',   'Echidna',          AUS),
    sc('$PLATYPUS',  'Platypus',         AUS),
    sc('$QUOKKA',    'Quokka',           AUS),
    sc('$DINGO',     'Dingo',            AUS),
    sc('$CASSOWARY', 'Cassowary',        AUS),
  ]},
  { label: 'April', coins: [
    sc('$ANZAC',     'Anzac',            AUS),
    sc('$DIGGER',    'Digger',           AUS),
    sc('$SLOUCH',    'Slouch Hat',       AUS),
    sc('$GALLIPOLI', 'Gallipoli',        AUS),
    sc('$LESTWEFORGET','Lest We Forget', AUS),
    sc('$POPPYCOIN', 'Poppy Coin',       AUS),
    sc('$MATESHIP',  'Mateship',         AUS),
    sc('$COBBER',    'Cobber',           AUS),
  ]},
  { label: 'May', coins: [
    sc('$FOOTY',     'Footy',            AUS),
    sc('$AFL',       'AFL',              AUS),
    sc('$BARRACKER', 'Barracker',        AUS),
    sc('$TIPPING',   'Tipping',          AUS),
    sc('$PREMIERSHIP','Premiership',     AUS),
    sc('$SPECKY',    'Specky',           AUS),
    sc('$TORPEDO',   'Torpedo',          AUS),
    sc('$BEHIND',    'Behind',           AUS),
  ]},
  { label: 'June', coins: [
    sc('$MIDWINTER', 'Mid Winter',       AUS),
    sc('$WOOLLY',    'Woolly',           AUS),
    sc('$UGGBOOT',   'Ugg Boot',         AUS),
    sc('$FLANNELETTE','Flannelette',     AUS),
    sc('$HEATER',    'Heater',           AUS),
    sc('$HOTTIE',    'Hottie',           AUS),
    sc('$BLANKET',   'Blanket',          AUS),
    sc('$DOONA',     'Doona',            AUS),
  ]},
  { label: 'July', coins: [
    sc('$OUTBACK',   'Outback',          AUS),
    sc('$REDCENTRE', 'Red Centre',       AUS),
    sc('$ULURU',     'Uluru',            AUS),
    sc('$DUSTY',     'Dusty',            AUS),
    sc('$ROADTRAIN', 'Road Train',       AUS),
    sc('$FLYINGDOC', 'Flying Doctor',    AUS),
    sc('$STATION',   'Station',          AUS),
    sc('$STOCKMAN',  'Stockman',         AUS),
  ]},
  { label: 'August', coins: [
    sc('$CRICKET',   'Cricket',          AUS),
    sc('$ASHES',     'The Ashes',        AUS),
    sc('$BAGGYGREEN','Baggy Green',      AUS),
    sc('$SIXHITTER', 'Six Hitter',       AUS),
    sc('$YORKER',    'Yorker',           AUS),
    sc('$GOOGLY',    'Googly',           AUS),
    sc('$STICKY',    'Sticky Wicket',    AUS),
    sc('$HOWZAT',    'Howzat',           AUS),
  ]},
  { label: 'September', coins: [
    sc('$SPRINGTIME', 'Springtime',      AUS),
    sc('$WATTLE',    'Wattle',           AUS),
    sc('$JACARANDA', 'Jacaranda',        AUS),
    sc('$BLOSSOMCOIN','Blossom Coin',    AUS),
    sc('$MAGPIE',    'Magpie',           AUS),
    sc('$SWOOPING',  'Swooping Season',  AUS),
    sc('$HAYFEVER',  'Hay Fever',        AUS),
    sc('$POLLEN',    'Pollen',           AUS),
  ]},
  { label: 'October', coins: [
    sc('$MELBCUP',   'Melbourne Cup',    AUS),
    sc('$PUNTER',    'Punter',           AUS),
    sc('$EACHWAY',   'Each Way',         AUS),
    sc('$FASCINATA', 'Fascinator',       AUS),
    sc('$BARRIER',   'Barrier Draw',     AUS),
    sc('$SCRATCHIE', 'Scratchie',        AUS),
    sc('$ROUGHIE',   'Roughie',          AUS),
    sc('$TRIFECTA',  'Trifecta',         AUS),
  ]},
  { label: 'November', coins: [
    sc('$BUSHFIRE',  'Bushfire',         AUS),
    sc('$HAZARD',    'Hazard',           AUS),
    sc('$EMBER',     'Ember',            AUS),
    sc('$FIRETRUCK', 'Fire Truck',       AUS),
    sc('$VOLUNTEER', 'Volunteer',        AUS),
    sc('$HEATWAVE',  'Heatwave',         AUS),
    sc('$SUNSCREEN', 'Sunscreen',        AUS),
    sc('$SLIPSLOP',  'Slip Slop Slap',   AUS),
  ]},
  { label: 'December', coins: [
    sc('$XMASBARBIE','Xmas Barbie',      AUS),
    sc('$PAVLOVA2',  'Pavlova 2',        AUS),
    sc('$BEACHXMAS', 'Beach Xmas',       AUS),
    sc('$BONDI',     'Bondi',            AUS),
    sc('$PRAWNS',    'Prawns',           AUS),
    sc('$COLDONE',   'Cold One',         AUS),
    sc('$SUMMERFUN', 'Summer Fun',       AUS),
    sc('$NEWYEARSYD','New Year Sydney',  AUS),
  ]},
];

// ─── CHINA ────────────────────────────────────────────────────────────────────
const CHN = '_CHINA';
const chinaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$HONGBAO',   'Hong Bao',         CHN), sc('$DUMPLINGS', 'Dumplings',       CHN),
    sc('$LANTERN',   'Lantern',          CHN), sc('$FIRECRACKER','Firecracker',    CHN),
    sc('$DRAGON',    'Dragon',           CHN), sc('$REUNION',   'Reunion',         CHN),
    sc('$COUPLET',   'Couplet',          CHN), sc('$NOODLES',   'Noodles',         CHN),
  ]},
  { label: 'February', coins: [
    sc('$PLUMBLOSSOM','Plum Blossom',    CHN), sc('$QIXI',      'Qixi',            CHN),
    sc('$TANGYUAN',  'Tang Yuan',        CHN), sc('$MOONCAKE',  'Mooncake',        CHN),
    sc('$REDTHREAD', 'Red Thread',       CHN), sc('$MAGPIEBRIDGE','Magpie Bridge', CHN),
    sc('$DOUFU',     'Doufu',            CHN), sc('$BAOZI',     'Baozi',           CHN),
  ]},
  { label: 'March', coins: [
    sc('$QINGMING',  'Qingming',         CHN), sc('$TEALEAF',   'Tea Leaf',        CHN),
    sc('$JASMINE',   'Jasmine',          CHN), sc('$PANDA',     'Panda',           CHN),
    sc('$BAMBOO',    'Bamboo',           CHN), sc('$KITE',      'Kite',            CHN),
    sc('$WULONG',    'Wu Long',          CHN), sc('$PEONY',     'Peony',           CHN),
  ]},
  { label: 'April', coins: [
    sc('$MAHJONG',   'Mahjong',          CHN), sc('$WEIQI',     'Weiqi',           CHN),
    sc('$CALLIGRAPHY','Calligraphy',     CHN), sc('$INKSTONE',  'Ink Stone',       CHN),
    sc('$ABACUS',    'Abacus',           CHN), sc('$COMPASS',   'Compass',         CHN),
    sc('$GUNPOWDER', 'Gunpowder',        CHN), sc('$PAPERMAKING','Papermaking',    CHN),
  ]},
  { label: 'May', coins: [
    sc('$DRAGONBOAT','Dragon Boat',      CHN), sc('$ZONGZI',    'Zongzi',          CHN),
    sc('$REALGAR',   'Realgar',          CHN), sc('$WORMWOOD',  'Wormwood',        CHN),
    sc('$FIVEPOISON','Five Poison',      CHN), sc('$SACHETS',   'Sachets',         CHN),
    sc('$PADDLE',    'Paddle',           CHN), sc('$DRUMBEAT',  'Drumbeat',        CHN),
  ]},
  { label: 'June', coins: [
    sc('$GAOKAO',    'Gaokao',           CHN), sc('$STUDYHARD', 'Study Hard',      CHN),
    sc('$PENCILCASE','Pencil Case',      CHN), sc('$EXAM',      'Exam',            CHN),
    sc('$REDPEN',    'Red Pen',          CHN), sc('$SCOREBOARD','Scoreboard',      CHN),
    sc('$UNIVERSITY','University',       CHN), sc('$DIPLOMA',   'Diploma',         CHN),
  ]},
  { label: 'July', coins: [
    sc('$GREATWALL', 'Great Wall',       CHN), sc('$FORBIDDEN', 'Forbidden City',  CHN),
    sc('$TERRACOTTA','Terracotta',       CHN), sc('$SILKROAD',  'Silk Road',       CHN),
    sc('$YANGTZE',   'Yangtze',          CHN), sc('$YELLOWRIVER','Yellow River',   CHN),
    sc('$HIMALAYA',  'Himalaya',         CHN), sc('$GOBI',      'Gobi',            CHN),
  ]},
  { label: 'August', coins: [
    sc('$OLYMPICS',  'Olympics',         CHN), sc('$GOLDMEDAL', 'Gold Medal',      CHN),
    sc('$PINGPONG',  'Ping Pong',        CHN), sc('$BADMINTON', 'Badminton',       CHN),
    sc('$WUSHU',     'Wushu',            CHN), sc('$DIVING',    'Diving',          CHN),
    sc('$GYMNASTICS','Gymnastics',       CHN), sc('$TORCH',     'Torch',           CHN),
  ]},
  { label: 'September', coins: [
    sc('$MIDAUTUMN', 'Mid Autumn',       CHN), sc('$MOONCAKE2', 'Mooncake 2',      CHN),
    sc('$OSMANTHUS', 'Osmanthus',        CHN), sc('$RABBIT',    'Rabbit',          CHN),
    sc('$HARVEST',   'Harvest',          CHN), sc('$FULLMOON',  'Full Moon',       CHN),
    sc('$POMELO',    'Pomelo',           CHN), sc('$STARGAZING','Stargazing',      CHN),
  ]},
  { label: 'October', coins: [
    sc('$NATIONALDAY','National Day',    CHN), sc('$GOLDENWEEK','Golden Week',     CHN),
    sc('$TIANANMEN', 'Tiananmen',        CHN), sc('$PARADE',    'Parade',          CHN),
    sc('$FIREWORKS', 'Fireworks',        CHN), sc('$REDSTAR',   'Red Star',        CHN),
    sc('$UNITY',     'Unity',            CHN), sc('$PROSPERITY','Prosperity',      CHN),
  ]},
  { label: 'November', coins: [
    sc('$SINGLEDAY', 'Singles Day',      CHN), sc('$SHOPPING',  'Shopping',        CHN),
    sc('$CART',      'Cart',             CHN), sc('$COUPON',    'Coupon',          CHN),
    sc('$FLASHSALE', 'Flash Sale',       CHN), sc('$PARCEL',    'Parcel',          CHN),
    sc('$DELIVERY',  'Delivery',         CHN), sc('$RETURNS',   'Returns',         CHN),
  ]},
  { label: 'December', coins: [
    sc('$DONGZHI',   'Dongzhi',          CHN), sc('$HOTPOT',    'Hot Pot',         CHN),
    sc('$JIAOZI',    'Jiaozi',           CHN), sc('$WINTERSOLSTICE','Winter Solstice',CHN),
    sc('$TANGYUAN2', 'Tang Yuan 2',      CHN), sc('$FAMILY',    'Family',          CHN),
    sc('$REUNION2',  'Reunion 2',        CHN), sc('$NEWYEARBJ', 'New Year Beijing', CHN),
  ]},
];

// ─── USA ──────────────────────────────────────────────────────────────────────
const USA = '_USA';
const usaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$INAUGURATION','Inauguration',  USA), sc('$SUPERBOWL', 'Super Bowl',      USA),
    sc('$MLKDAY',    'MLK Day',         USA), sc('$RESOLUTION2','Resolution 2',   USA),
    sc('$COLDSNAP',  'Cold Snap',       USA), sc('$SNOWDAY',   'Snow Day',        USA),
    sc('$GROUNDHOG', 'Groundhog',       USA), sc('$TAXSEASON', 'Tax Season',      USA),
  ]},
  { label: 'February', coins: [
    sc('$VALENTINES','Valentines',      USA), sc('$PRESIDENTS','Presidents Day',  USA),
    sc('$MARDIGRAS', 'Mardi Gras',      USA), sc('$GROUNDHOG2','Groundhog 2',    USA),
    sc('$SWEETHEART','Sweetheart',      USA), sc('$CHOCOLATEBOX','Chocolate Box', USA),
    sc('$ROSES',     'Roses',           USA), sc('$CUPID2',    'Cupid 2',         USA),
  ]},
  { label: 'March', coins: [
    sc('$STPADDYS',  'St Paddys',       USA), sc('$MARCHMADNESS','March Madness', USA),
    sc('$SPRINGBREAK','Spring Break',   USA), sc('$SHAMROCK',  'Shamrock',        USA),
    sc('$GREENBEER', 'Green Beer',      USA), sc('$BRACKETBUST','Bracket Bust',   USA),
    sc('$OVERTIME',  'Overtime',        USA), sc('$BUZZERBEAT','Buzzer Beater',   USA),
  ]},
  { label: 'April', coins: [
    sc('$TAXDAY',    'Tax Day',         USA), sc('$EASTER2',   'Easter 2',        USA),
    sc('$EARTHDAY',  'Earth Day',       USA), sc('$APRILFOOL', 'April Fool',      USA),
    sc('$REFUND2',   'Refund 2',        USA), sc('$AUDIT2USA', 'Audit 2',         USA),
    sc('$EXTENSION2','Extension 2',     USA), sc('$TURBOTAX',  'Turbo Tax',       USA),
  ]},
  { label: 'May', coins: [
    sc('$MEMORIALDAY','Memorial Day',   USA), sc('$MOTHERSDAY','Mothers Day',     USA),
    sc('$CINCODEMAYO','Cinco de Mayo',  USA), sc('$BBQSEASON', 'BBQ Season',      USA),
    sc('$GRADSEASON','Grad Season',     USA), sc('$PROM',      'Prom',            USA),
    sc('$YARDSALE',  'Yard Sale',       USA), sc('$LEMONADE',  'Lemonade Stand',  USA),
  ]},
  { label: 'June', coins: [
    sc('$JUNETEENTH','Juneteenth',      USA), sc('$PRIDE',     'Pride',           USA),
    sc('$FATHERSDAY','Fathers Day',     USA), sc('$SUMMERVIBE','Summer Vibe',     USA),
    sc('$ROADTRIP',  'Road Trip',       USA), sc('$DRIVEIN',   'Drive In',        USA),
    sc('$HOTDOG',    'Hot Dog',         USA), sc('$ROOTBEER',  'Root Beer',       USA),
  ]},
  { label: 'July', coins: [
    sc('$FOURTHJULY','Fourth of July',  USA), sc('$FIREWORKS2','Fireworks 2',     USA),
    sc('$EAGLE',     'Eagle',           USA), sc('$LIBERTY',   'Liberty',         USA),
    sc('$REDWHITEBLUE','Red White Blue',USA), sc('$SPARKLER',  'Sparkler',        USA),
    sc('$PARADE2',   'Parade 2',        USA), sc('$FREEDOMCOIN','Freedom Coin',   USA),
  ]},
  { label: 'August', coins: [
    sc('$BACKTOSCHOOL','Back to School',USA), sc('$STATFAIR',  'State Fair',      USA),
    sc('$CORNCOB',   'Corn Cob',        USA), sc('$FUNNEL',    'Funnel Cake',     USA),
    sc('$FERRISWHEEL','Ferris Wheel',   USA), sc('$RODEO',     'Rodeo',           USA),
    sc('$COUNTRYMUSIC','Country Music', USA), sc('$PICKUP',    'Pickup Truck',    USA),
  ]},
  { label: 'September', coins: [
    sc('$LABORDAY',  'Labor Day',       USA), sc('$NFL',       'NFL',             USA),
    sc('$TAILGATE',  'Tailgate',        USA), sc('$FANTASY',   'Fantasy Football',USA),
    sc('$PUMPKINSPICE','Pumpkin Spice', USA), sc('$FALLLEAVES','Fall Leaves',     USA),
    sc('$SWEATERWEATHER','Sweater Weather',USA),sc('$APPLEORCHARD','Apple Orchard',USA),
  ]},
  { label: 'October', coins: [
    sc('$HALLOWEEN2','Halloween 2',     USA), sc('$TRICKTREAT','Trick or Treat',  USA),
    sc('$JACKOLANTERN','Jack O Lantern',USA), sc('$HAUNTED',   'Haunted',         USA),
    sc('$COSTUME',   'Costume',         USA), sc('$CANDY',     'Candy',           USA),
    sc('$COBWEB',    'Cobweb',          USA), sc('$SCARECROW', 'Scarecrow',       USA),
  ]},
  { label: 'November', coins: [
    sc('$THANKSGIVING','Thanksgiving',  USA), sc('$TURKEY2',   'Turkey 2',        USA),
    sc('$BLACKFRIDAY','Black Friday',   USA), sc('$CYBERMONDAY','Cyber Monday',   USA),
    sc('$STUFFING',  'Stuffing',        USA), sc('$CRANBERRY', 'Cranberry',       USA),
    sc('$GRAVY2',    'Gravy 2',         USA), sc('$PUMPKINPIE','Pumpkin Pie',     USA),
  ]},
  { label: 'December', coins: [
    sc('$CHRISTMAS2','Christmas 2',     USA), sc('$HANUKKAH',  'Hanukkah',        USA),
    sc('$KWANZAA',   'Kwanzaa',         USA), sc('$NEWYEARSNYC','New Year NYC',   USA),
    sc('$TIMESSQUARE','Times Square',   USA), sc('$EGGNOG',    'Eggnog',          USA),
    sc('$GINGERBREAD','Gingerbread',    USA), sc('$MISTLETOE', 'Mistletoe',       USA),
  ]},
];

// ─── EUROPE ───────────────────────────────────────────────────────────────────
const EUR = '_EUROPA';
const europeSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$CARNIVAL',  'Carnival',        EUR), sc('$EPIPHANY',  'Epiphany',        EUR),
    sc('$THREEKINGS','Three Kings',     EUR), sc('$GALETTE',   'Galette',         EUR),
    sc('$MULLEDWINE','Mulled Wine',     EUR), sc('$SCHNAPPS',  'Schnapps',        EUR),
    sc('$FONDUE',    'Fondue',          EUR), sc('$RACLETTE',  'Raclette',        EUR),
  ]},
  { label: 'February', coins: [
    sc('$VENICECARNI','Venice Carnival',EUR), sc('$MASQUERADE','Masquerade',      EUR),
    sc('$MARDI2',    'Mardi 2',         EUR), sc('$CREPE',     'Crepe',           EUR),
    sc('$CHANDELEUR','Chandeleur',      EUR), sc('$STROOPWAFEL','Stroopwafel',    EUR),
    sc('$WAFFLE',    'Waffle',          EUR), sc('$SPECULOOS', 'Speculoos',       EUR),
  ]},
  { label: 'March', coins: [
    sc('$STPATRICK2','St Patrick 2',    EUR), sc('$HOLI2',     'Holi 2',          EUR),
    sc('$TULIP',     'Tulip',           EUR), sc('$WINDMILL',  'Windmill',        EUR),
    sc('$BEERSTEIN', 'Beer Stein',      EUR), sc('$PRETZEL',   'Pretzel',         EUR),
    sc('$LEDERHOSEN','Lederhosen',      EUR), sc('$DIRNDL',    'Dirndl',          EUR),
  ]},
  { label: 'April', coins: [
    sc('$EASTER3',   'Easter 3',        EUR), sc('$EASTERMARKET','Easter Market', EUR),
    sc('$TULIPFIELD','Tulip Field',     EUR), sc('$KEUKENHOF', 'Keukenhof',       EUR),
    sc('$SPRINGFEST','Spring Fest',     EUR), sc('$MAYPOLE',   'Maypole',         EUR),
    sc('$BELTANE',   'Beltane',         EUR), sc('$WALPURGIS', 'Walpurgis',       EUR),
  ]},
  { label: 'May', coins: [
    sc('$EUROVISION','Eurovision',      EUR), sc('$CHAMPAGNE', 'Champagne',       EUR),
    sc('$CROISSANT', 'Croissant',       EUR), sc('$BAGUETTE',  'Baguette',        EUR),
    sc('$ESCARGOT',  'Escargot',        EUR), sc('$FOIEGRAS',  'Foie Gras',       EUR),
    sc('$BORDEAUX',  'Bordeaux',        EUR), sc('$CAMEMBERT', 'Camembert',       EUR),
  ]},
  { label: 'June', coins: [
    sc('$MIDSOMMAR', 'Midsommar',       EUR), sc('$SOLSTICE2', 'Solstice 2',      EUR),
    sc('$MAYPOLE2',  'Maypole 2',       EUR), sc('$HERRING',   'Herring',         EUR),
    sc('$AQUAVIT',   'Aquavit',         EUR), sc('$SAUNA',     'Sauna',           EUR),
    sc('$FJORD',     'Fjord',           EUR), sc('$AURORA',    'Aurora',          EUR),
  ]},
  { label: 'July', coins: [
    sc('$BASTILLEDAY','Bastille Day',   EUR), sc('$TOURDEFRANCE','Tour de France',EUR),
    sc('$GELATO',    'Gelato',          EUR), sc('$PIAZZA',    'Piazza',          EUR),
    sc('$COLOSSEUM', 'Colosseum',       EUR), sc('$GONDOLA',   'Gondola',         EUR),
    sc('$FLAMENCO',  'Flamenco',        EUR), sc('$PAELLA',    'Paella',          EUR),
  ]},
  { label: 'August', coins: [
    sc('$OKTOBERFEST','Oktoberfest',    EUR), sc('$BRATWURST', 'Bratwurst',       EUR),
    sc('$SAUERKRAUT','Sauerkraut',      EUR), sc('$SCHNITZEL', 'Schnitzel',       EUR),
    sc('$STRUDEL',   'Strudel',         EUR), sc('$SACHERTORTE','Sachertorte',    EUR),
    sc('$WIENER',    'Wiener',          EUR), sc('$KAISERSCHMARRN','Kaiserschmarrn',EUR),
  ]},
  { label: 'September', coins: [
    sc('$HARVEST2',  'Harvest 2',       EUR), sc('$VENDANGE',  'Vendange',        EUR),
    sc('$GRAPEPICK', 'Grape Picking',   EUR), sc('$TRUFFLE',   'Truffle',         EUR),
    sc('$MUSHROOMHUNT','Mushroom Hunt', EUR), sc('$CHESTNUT',  'Chestnut',        EUR),
    sc('$CIDER',     'Cider',           EUR), sc('$CALVADOS',  'Calvados',        EUR),
  ]},
  { label: 'October', coins: [
    sc('$OKTOBERFEST2','Oktoberfest 2', EUR), sc('$HALLOWEEN3','Halloween 3',     EUR),
    sc('$ALLSAINTS',  'All Saints',     EUR), sc('$DAYOFTHEDEAD2','Day of Dead 2',EUR),
    sc('$BONFIRE',   'Bonfire',         EUR), sc('$GUYFAWKES', 'Guy Fawkes',      EUR),
    sc('$PUMPKIN2',  'Pumpkin 2',       EUR), sc('$HARVEST3',  'Harvest 3',       EUR),
  ]},
  { label: 'November', coins: [
    sc('$ARMISTICE',  'Armistice',      EUR), sc('$REMEMBRANCE','Remembrance',    EUR),
    sc('$SINTERKLAAS','Sinterklaas',    EUR), sc('$BLACKPETE', 'Black Pete',      EUR),
    sc('$STMARTIN',  'St Martin',       EUR), sc('$LANTERNFEST','Lantern Fest',   EUR),
    sc('$BEAUJOLAIS','Beaujolais',      EUR), sc('$TRUFFLESEASON','Truffle Season',EUR),
  ]},
  { label: 'December', coins: [
    sc('$CHRISTMASMARKET','Xmas Market',EUR), sc('$GLUHWEIN', 'Glühwein',        EUR),
    sc('$STNICOLAS', 'St Nicolas',      EUR), sc('$ADVENT',   'Advent',           EUR),
    sc('$YULE2',     'Yule 2',          EUR), sc('$SOLSTICE3','Solstice 3',       EUR),
    sc('$HOGMANAY',  'Hogmanay',        EUR), sc('$NEWYEAREUR','New Year Europe', EUR),
  ]},
];

// ─── AFRICA ───────────────────────────────────────────────────────────────────
const AFR = '_AFRICA';
const africaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$UBUNTU',    'Ubuntu',          AFR), sc('$SAVANNA2',  'Savanna 2',       AFR),
    sc('$BAOBAB',    'Baobab',          AFR), sc('$ACACIA',    'Acacia',          AFR),
    sc('$SERENGETI', 'Serengeti',       AFR), sc('$MIGRATION', 'Migration',       AFR),
    sc('$WILDEBEEST','Wildebeest',      AFR), sc('$ZEBRA',     'Zebra',           AFR),
  ]},
  { label: 'February', coins: [
    sc('$LION',      'Lion',            AFR), sc('$ELEPHANT2', 'Elephant 2',      AFR),
    sc('$GIRAFFE',   'Giraffe',         AFR), sc('$RHINO',     'Rhino',           AFR),
    sc('$LEOPARD',   'Leopard',         AFR), sc('$BUFFALO',   'Buffalo',         AFR),
    sc('$CHEETAH',   'Cheetah',         AFR), sc('$HIPPO',     'Hippo',           AFR),
  ]},
  { label: 'March', coins: [
    sc('$MANDELA',   'Mandela',         AFR), sc('$FREEDOM2',  'Freedom 2',       AFR),
    sc('$RAINBOW',   'Rainbow Nation',  AFR), sc('$UBUNTU2',   'Ubuntu 2',        AFR),
    sc('$INDABA',    'Indaba',          AFR), sc('$IMPI',      'Impi',            AFR),
    sc('$SANGOMA',   'Sangoma',         AFR), sc('$LOBOLA',    'Lobola',          AFR),
  ]},
  { label: 'April', coins: [
    sc('$FREEDOMDAY','Freedom Day',     AFR), sc('$LIBERATION','Liberation',      AFR),
    sc('$KENTE',     'Kente',           AFR), sc('$DASHIKI',   'Dashiki',         AFR),
    sc('$DJEMBE',    'Djembe',          AFR), sc('$KORA',      'Kora',            AFR),
    sc('$MBIRA',     'Mbira',           AFR), sc('$BALAFON',   'Balafon',         AFR),
  ]},
  { label: 'May', coins: [
    sc('$AFRICADAY', 'Africa Day',      AFR), sc('$PANAFRICANISM','Pan Africanism',AFR),
    sc('$NILERIVER', 'Nile River',      AFR), sc('$SAHARA',    'Sahara',          AFR),
    sc('$KILIMANJARO','Kilimanjaro',    AFR), sc('$VICTORIA',  'Victoria Falls',  AFR),
    sc('$OKAVANGO',  'Okavango',        AFR), sc('$CONGO',     'Congo',           AFR),
  ]},
  { label: 'June', coins: [
    sc('$YOUTHDAY',  'Youth Day',       AFR), sc('$SOWETO',    'Soweto',          AFR),
    sc('$JOLLOF',    'Jollof Rice',     AFR), sc('$FUFU',      'Fufu',            AFR),
    sc('$INJERA',    'Injera',          AFR), sc('$SUYA',      'Suya',            AFR),
    sc('$BOBOTIE',   'Bobotie',         AFR), sc('$BILTONG',   'Biltong',         AFR),
  ]},
  { label: 'July', coins: [
    sc('$MANDELADAY','Mandela Day',     AFR), sc('$UBUNTU3',   'Ubuntu 3',        AFR),
    sc('$MAASAI',    'Maasai',          AFR), sc('$ZULU',      'Zulu',            AFR),
    sc('$YORUBA',    'Yoruba',          AFR), sc('$HAUSA',     'Hausa',           AFR),
    sc('$IGBO',      'Igbo',            AFR), sc('$ASHANTI',   'Ashanti',         AFR),
  ]},
  { label: 'August', coins: [
    sc('$WOMENDAY',  'Women Day',       AFR), sc('$MATRIARCH', 'Matriarch',       AFR),
    sc('$QUEEN',     'Queen',           AFR), sc('$MOTHERAFRICA','Mother Africa', AFR),
    sc('$FERTILITY', 'Fertility',       AFR), sc('$HARVEST4',  'Harvest 4',       AFR),
    sc('$RAIN',      'Rain',            AFR), sc('$THUNDER',   'Thunder',         AFR),
  ]},
  { label: 'September', coins: [
    sc('$HERITAGEDAY','Heritage Day',   AFR), sc('$BRAAI',     'Braai',           AFR),
    sc('$SHISA',     'Shisa Nyama',     AFR), sc('$PAP',       'Pap',             AFR),
    sc('$CHAKALAKA', 'Chakalaka',       AFR), sc('$UMQOMBOTHI','Umqombothi',      AFR),
    sc('$ROOIBOS',   'Rooibos',         AFR), sc('$HONEYBUSH', 'Honeybush',       AFR),
  ]},
  { label: 'October', coins: [
    sc('$HARVEST5',  'Harvest 5',       AFR), sc('$MOONSEASON','Moon Season',     AFR),
    sc('$MASQUERADE2','Masquerade 2',   AFR), sc('$EGUNGUN',   'Egungun',         AFR),
    sc('$VOODOO2',   'Voodoo 2',        AFR), sc('$ANCESTOR',  'Ancestor',        AFR),
    sc('$SPIRIT',    'Spirit',          AFR), sc('$RITUAL',    'Ritual',          AFR),
  ]},
  { label: 'November', coins: [
    sc('$DIWALI2',   'Diwali 2',        AFR), sc('$EIDMUBARAK','Eid Mubarak',     AFR),
    sc('$RAMADAN',   'Ramadan',         AFR), sc('$IFTAR',     'Iftar',           AFR),
    sc('$MOSQUE',    'Mosque',          AFR), sc('$MINARET',   'Minaret',         AFR),
    sc('$CRESCENT',  'Crescent',        AFR), sc('$STAR2',     'Star 2',          AFR),
  ]},
  { label: 'December', coins: [
    sc('$KWANZAA2',  'Kwanzaa 2',       AFR), sc('$UMOJA',     'Umoja',           AFR),
    sc('$KUJICHAGULIA','Kujichagulia',  AFR), sc('$UJIMA',     'Ujima',           AFR),
    sc('$UJAMAA',    'Ujamaa',          AFR), sc('$NIA',       'Nia',             AFR),
    sc('$KUUMBA',    'Kuumba',          AFR), sc('$IMANI',     'Imani',           AFR),
  ]},
];

// ─── RUSSIA ───────────────────────────────────────────────────────────────────
const RUS = '_RUSSIA';
const russiaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$DEDMOROZ',  'Ded Moroz',       RUS), sc('$SNEGUROCHKA','Snegurochka',    RUS),
    sc('$BANYA',     'Banya',           RUS), sc('$VALENKI',   'Valenki',         RUS),
    sc('$USHANKA',   'Ushanka',         RUS), sc('$SAMOVAR',   'Samovar',         RUS),
    sc('$BLINI',     'Blini',           RUS), sc('$CAVIAR',    'Caviar',          RUS),
  ]},
  { label: 'February', coins: [
    sc('$MASLENITSA','Maslenitsa',      RUS), sc('$PANCAKE',   'Pancake',         RUS),
    sc('$SHROVETIDE','Shrovetide',      RUS), sc('$EFFIGY',    'Effigy',          RUS),
    sc('$DEFENDERSDAY','Defenders Day', RUS), sc('$SOLDIER',   'Soldier',         RUS),
    sc('$MEDAL',     'Medal',           RUS), sc('$VICTORY',   'Victory',         RUS),
  ]},
  { label: 'March', coins: [
    sc('$WOMENSDAY', 'Womens Day',      RUS), sc('$MIMOSA',    'Mimosa',          RUS),
    sc('$TULIP2',    'Tulip 2',         RUS), sc('$SPRING2',   'Spring 2',        RUS),
    sc('$THAW',      'Thaw',            RUS), sc('$ICICLE2',   'Icicle 2',        RUS),
    sc('$BIRCH',     'Birch',           RUS), sc('$SNOWDROP',  'Snowdrop',        RUS),
  ]},
  { label: 'April', coins: [
    sc('$COSMONAUT', 'Cosmonaut',       RUS), sc('$SPUTNIK',   'Sputnik',         RUS),
    sc('$GAGARIN',   'Gagarin',         RUS), sc('$VOSTOK',    'Vostok',          RUS),
    sc('$LAIKA',     'Laika',           RUS), sc('$BAIKONUR',  'Baikonur',        RUS),
    sc('$ORBIT',     'Orbit',           RUS), sc('$COSMODROME','Cosmodrome',      RUS),
  ]},
  { label: 'May', coins: [
    sc('$VICTORYDAY','Victory Day',     RUS), sc('$REDSTAR2',  'Red Star 2',      RUS),
    sc('$PARADE3',   'Parade 3',        RUS), sc('$TANK',      'Tank',            RUS),
    sc('$GEORGERIBBON','George Ribbon', RUS), sc('$ETERNAL',   'Eternal Flame',   RUS),
    sc('$KREMLIN',   'Kremlin',         RUS), sc('$REDARMYCOIN','Red Army Coin',  RUS),
  ]},
  { label: 'June', coins: [
    sc('$RUSSIADAY', 'Russia Day',      RUS), sc('$TROIKA',    'Troika',          RUS),
    sc('$MATRYOSHKA2','Matryoshka 2',   RUS), sc('$BALALAIKA', 'Balalaika',       RUS),
    sc('$VOLGA',     'Volga',           RUS), sc('$TAIGA',     'Taiga',           RUS),
    sc('$TUNDRA',    'Tundra',          RUS), sc('$SIBERIA',   'Siberia',         RUS),
  ]},
  { label: 'July', coins: [
    sc('$DACHA',     'Dacha',           RUS), sc('$MUSHROOM2', 'Mushroom 2',      RUS),
    sc('$BERRY',     'Berry',           RUS), sc('$FISHING',   'Fishing',         RUS),
    sc('$BANYA2',    'Banya 2',         RUS), sc('$KVASS',     'Kvass',           RUS),
    sc('$OKROSHKA',  'Okroshka',        RUS), sc('$SUNFLOWER', 'Sunflower',       RUS),
  ]},
  { label: 'August', coins: [
    sc('$HARVEST6',  'Harvest 6',       RUS), sc('$BUCKWHEAT', 'Buckwheat',       RUS),
    sc('$BORSCH',    'Borsch',          RUS), sc('$PELMENI',   'Pelmeni',         RUS),
    sc('$SHASHLIK',  'Shashlik',        RUS), sc('$SOLYANKA',  'Solyanka',        RUS),
    sc('$KHOLODETS', 'Kholodets',       RUS), sc('$MEDOVUKHA', 'Medovukha',       RUS),
  ]},
  { label: 'September', coins: [
    sc('$KNOWLEDGEDAY','Knowledge Day', RUS), sc('$FIRSTBELL', 'First Bell',      RUS),
    sc('$SCHOOLBELL','School Bell',     RUS), sc('$GLADIOLUS', 'Gladiolus',       RUS),
    sc('$TEACHER',   'Teacher',         RUS), sc('$TEXTBOOK',  'Textbook',        RUS),
    sc('$BRIEFCASE', 'Briefcase',       RUS), sc('$AUTUMN2',   'Autumn 2',        RUS),
  ]},
  { label: 'October', coins: [
    sc('$GOLDENAUTUMN','Golden Autumn', RUS), sc('$MAPLE2',    'Maple 2',         RUS),
    sc('$AMBER',     'Amber',           RUS), sc('$MUSHROOM3', 'Mushroom 3',      RUS),
    sc('$HUNTING',   'Hunting',         RUS), sc('$BEAR',      'Bear',            RUS),
    sc('$WOLF',      'Wolf',            RUS), sc('$FOX',       'Fox',             RUS),
  ]},
  { label: 'November', coins: [
    sc('$UNITYNATDAY','Unity Day',      RUS), sc('$ICON',      'Icon',            RUS),
    sc('$CATHEDRAL', 'Cathedral',       RUS), sc('$ORTHODOX',  'Orthodox',        RUS),
    sc('$INCENSE',   'Incense',         RUS), sc('$CANDLE2',   'Candle 2',        RUS),
    sc('$PRAYER',    'Prayer',          RUS), sc('$BELL2',     'Bell 2',          RUS),
  ]},
  { label: 'December', coins: [
    sc('$NEWYRRUS',  'New Year Russia', RUS), sc('$CHAMPAGNE2','Champagne 2',     RUS),
    sc('$OLIVIER',   'Olivier Salad',   RUS), sc('$HERRINGCOAT','Herring Coat',   RUS),
    sc('$MANDARIN2', 'Mandarin 2',      RUS), sc('$SNOWFLAKE', 'Snowflake',       RUS),
    sc('$FIRTREE',   'Fir Tree',        RUS), sc('$MIDNIGHT',  'Midnight',        RUS),
  ]},
];

// ─── INDIA ────────────────────────────────────────────────────────────────────
const IND = '_INDIA';
const indiaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$MAKARSAKRANTI','Makar Sankranti',IND), sc('$KITE2',   'Kite 2',          IND),
    sc('$PONGAL',    'Pongal',           IND), sc('$LOHRI',    'Lohri',           IND),
    sc('$SUGARCANE', 'Sugarcane',        IND), sc('$SESAME',   'Sesame',          IND),
    sc('$BONFIRE2',  'Bonfire 2',        IND), sc('$HARVEST7', 'Harvest 7',       IND),
  ]},
  { label: 'February', coins: [
    sc('$VALENTINES2','Valentines 2',    IND), sc('$BASANT',   'Basant',          IND),
    sc('$MUSTARD',   'Mustard',          IND), sc('$YELLOW',   'Yellow',          IND),
    sc('$SARASWATI', 'Saraswati',        IND), sc('$VEENA',    'Veena',           IND),
    sc('$LOTUS',     'Lotus',            IND), sc('$SWAN',     'Swan',            IND),
  ]},
  { label: 'March', coins: [
    sc('$HOLI3',     'Holi 3',           IND), sc('$GULAL',    'Gulal',           IND),
    sc('$PICHKARI',  'Pichkari',         IND), sc('$THANDAI',  'Thandai',         IND),
    sc('$BHANG',     'Bhang',            IND), sc('$COLOURS',  'Colours',         IND),
    sc('$SPRING3',   'Spring 3',         IND), sc('$FESTIVAL', 'Festival',        IND),
  ]},
  { label: 'April', coins: [
    sc('$UGADI',     'Ugadi',            IND), sc('$GUDI',     'Gudi Padwa',      IND),
    sc('$BAISAKHI',  'Baisakhi',         IND), sc('$HARVEST8', 'Harvest 8',       IND),
    sc('$TURBAN',    'Turban',           IND), sc('$BHANGRA',  'Bhangra',         IND),
    sc('$LASSI',     'Lassi',            IND), sc('$SARSON',   'Sarson',          IND),
  ]},
  { label: 'May', coins: [
    sc('$BUDDHA2',   'Buddha 2',         IND), sc('$VESAK',    'Vesak',           IND),
    sc('$MANGO',     'Mango',            IND), sc('$ALPHONSO', 'Alphonso',        IND),
    sc('$SUMMER4',   'Summer 4',         IND), sc('$LASSI2',   'Lassi 2',         IND),
    sc('$CHAAS',     'Chaas',            IND), sc('$AAMRAS',   'Aamras',          IND),
  ]},
  { label: 'June', coins: [
    sc('$MONSOON',   'Monsoon',          IND), sc('$PETRICHOR','Petrichor',       IND),
    sc('$CHAI2',     'Chai 2',           IND), sc('$PAKORA',   'Pakora',          IND),
    sc('$SAMOSA',    'Samosa',           IND), sc('$CHUTNEY',  'Chutney',         IND),
    sc('$MASALA',    'Masala',           IND), sc('$GARAM',    'Garam',           IND),
  ]},
  { label: 'July', coins: [
    sc('$RATHYATRA', 'Rath Yatra',       IND), sc('$CHARIOT',  'Chariot',         IND),
    sc('$JAGANNATH', 'Jagannath',        IND), sc('$PURI',     'Puri',            IND),
    sc('$ODISHA',    'Odisha',           IND), sc('$KONARK',   'Konark',          IND),
    sc('$TEMPLE',    'Temple',           IND), sc('$INCENSE2', 'Incense 2',       IND),
  ]},
  { label: 'August', coins: [
    sc('$INDEPENDENCE2','Independence 2',IND), sc('$TRICOLOUR','Tricolour',       IND),
    sc('$ASHOKACHAKRA','Ashoka Chakra',  IND), sc('$KITEFLYING','Kite Flying',    IND),
    sc('$RAKSHABANDHAN','Raksha Bandhan',IND), sc('$RAKHI',    'Rakhi',           IND),
    sc('$JANMASHTAMI','Janmashtami',     IND), sc('$KRISHNA',  'Krishna',         IND),
  ]},
  { label: 'September', coins: [
    sc('$GANESH',    'Ganesh',           IND), sc('$MODAK',    'Modak',           IND),
    sc('$VISARJAN',  'Visarjan',         IND), sc('$ONAM',     'Onam',            IND),
    sc('$SADYA',     'Sadya',            IND), sc('$POOKALAM', 'Pookalam',        IND),
    sc('$VALLAMKALI','Vallam Kali',      IND), sc('$KERALA',   'Kerala',          IND),
  ]},
  { label: 'October', coins: [
    sc('$NAVRATRI',  'Navratri',         IND), sc('$GARBA',    'Garba',           IND),
    sc('$DANDIYA',   'Dandiya',          IND), sc('$DURGA',    'Durga',           IND),
    sc('$DUSSEHRA',  'Dussehra',         IND), sc('$RAVANA',   'Ravana',          IND),
    sc('$EFFIGYCOIN','Effigy Coin',      IND), sc('$VICTORY2', 'Victory 2',       IND),
  ]},
  { label: 'November', coins: [
    sc('$DIWALI3',   'Diwali 3',         IND), sc('$DIYA',     'Diya',            IND),
    sc('$RANGOLI',   'Rangoli',          IND), sc('$LAKSHMI',  'Lakshmi',         IND),
    sc('$FIRECRACKER2','Firecracker 2',  IND), sc('$MITHAI',   'Mithai',          IND),
    sc('$GULAB',     'Gulab Jamun',      IND), sc('$BARFI',    'Barfi',           IND),
  ]},
  { label: 'December', coins: [
    sc('$CHRISTMAS3','Christmas 3',      IND), sc('$GOACHRISTMAS','Goa Christmas', IND),
    sc('$NEWYEARIND','New Year India',   IND), sc('$COUNTDOWN','Countdown',       IND),
    sc('$WINTERFOG', 'Winter Fog',       IND), sc('$GAJAR',    'Gajar Halwa',     IND),
    sc('$PINNI',     'Pinni',            IND), sc('$REWRI',    'Rewri',           IND),
  ]},
];

// ─── JAPAN ────────────────────────────────────────────────────────────────────
const JPN = '_JAPAN';
const japanSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$OSHOGATSU', 'Oshogatsu',        JPN), sc('$HATSUMODE','Hatsumode',       JPN),
    sc('$OMAMORI',   'Omamori',          JPN), sc('$KAKIZOME', 'Kakizome',        JPN),
    sc('$OTOSHIDAMA','Otoshidama',       JPN), sc('$KAGAMIMOCHI','Kagami Mochi',  JPN),
    sc('$OZONI',     'Ozoni',            JPN), sc('$FUKUBUKURO','Fukubukuro',     JPN),
  ]},
  { label: 'February', coins: [
    sc('$SETSUBUN',  'Setsubun',         JPN), sc('$MAMEMAKI', 'Mame Maki',       JPN),
    sc('$ONI',       'Oni',              JPN), sc('$EHOMAKI',  'Ehomaki',         JPN),
    sc('$VALENTINES3','Valentines 3',    JPN), sc('$HONMEI',   'Honmei Choco',    JPN),
    sc('$GIRI',      'Giri Choco',       JPN), sc('$TOMO',     'Tomo Choco',      JPN),
  ]},
  { label: 'March', coins: [
    sc('$HINAMATSURI','Hinamatsuri',     JPN), sc('$HINA',     'Hina Doll',       JPN),
    sc('$PEACHBLOSSOM','Peach Blossom', JPN), sc('$WHITEDAY', 'White Day',       JPN),
    sc('$MARSHMALLOW','Marshmallow',    JPN), sc('$SAKURA',   'Sakura',           JPN),
    sc('$HANAMI',    'Hanami',           JPN), sc('$BENTO',    'Bento',           JPN),
  ]},
  { label: 'April', coins: [
    sc('$SAKURA2',   'Sakura 2',         JPN), sc('$CHERRYBLOSSOMFRONT','Cherry Blossom Front',JPN),
    sc('$OHANAMI',   'Ohanami',          JPN), sc('$PICNIC',   'Picnic',          JPN),
    sc('$SHOWA',     'Showa Day',        JPN), sc('$GOLDENWEEK2','Golden Week 2', JPN),
    sc('$KOINOBORI', 'Koinobori',        JPN), sc('$CARP',     'Carp',            JPN),
  ]},
  { label: 'May', coins: [
    sc('$KODOMO',    'Kodomo no Hi',     JPN), sc('$KABUTO',   'Kabuto',          JPN),
    sc('$KASHIWAMOCHI','Kashiwa Mochi', JPN), sc('$MOTHERSDAY2','Mothers Day 2', JPN),
    sc('$CARNATION', 'Carnation',        JPN), sc('$FATHERSDAY2','Fathers Day 2', JPN),
    sc('$ROSE',      'Rose',             JPN), sc('$IRIS',     'Iris',            JPN),
  ]},
  { label: 'June', coins: [
    sc('$TSUYU',     'Tsuyu',            JPN), sc('$HYDRANGEA','Hydrangea',       JPN),
    sc('$RAINYSEASON','Rainy Season',    JPN), sc('$UMBRELLA', 'Umbrella',        JPN),
    sc('$FROG',      'Frog',             JPN), sc('$SNAIL',    'Snail',           JPN),
    sc('$AJISAI',    'Ajisai',           JPN), sc('$KASA',     'Kasa',            JPN),
  ]},
  { label: 'July', coins: [
    sc('$TANABATA',  'Tanabata',         JPN), sc('$MILKYWAY', 'Milky Way',       JPN),
    sc('$WISH',      'Wish',             JPN), sc('$BAMBOO2',  'Bamboo 2',        JPN),
    sc('$FIREWORKS3','Fireworks 3',      JPN), sc('$YUKATA',   'Yukata',          JPN),
    sc('$OBON',      'Obon',             JPN), sc('$LANTERN2', 'Lantern 2',       JPN),
  ]},
  { label: 'August', coins: [
    sc('$NATSU',     'Natsu',            JPN), sc('$KAKIGORI', 'Kakigori',        JPN),
    sc('$WATERMELON','Watermelon',       JPN), sc('$CICADA',   'Cicada',          JPN),
    sc('$GOLDFISH',  'Goldfish',         JPN), sc('$WINDCHIME','Wind Chime',      JPN),
    sc('$SUNFLOWER2','Sunflower 2',      JPN), sc('$MATSURI',  'Matsuri',         JPN),
  ]},
  { label: 'September', coins: [
    sc('$TSUKIMI',   'Tsukimi',          JPN), sc('$MOONDUMPLING','Moon Dumpling',JPN),
    sc('$SUSUKI',    'Susuki',           JPN), sc('$HARVEST9', 'Harvest 9',       JPN),
    sc('$KEIRO',     'Keiro no Hi',      JPN), sc('$RESPECT',  'Respect',         JPN),
    sc('$ELDER',     'Elder',            JPN), sc('$AUTUMN3',  'Autumn 3',        JPN),
  ]},
  { label: 'October', coins: [
    sc('$KOYO',      'Koyo',             JPN), sc('$MOMIJI',   'Momiji',          JPN),
    sc('$REDLEAF',   'Red Leaf',         JPN), sc('$CHESTNUT2','Chestnut 2',      JPN),
    sc('$HALLOWEEN4','Halloween 4',      JPN), sc('$COSTUME2', 'Costume 2',       JPN),
    sc('$PUMPKIN3',  'Pumpkin 3',        JPN), sc('$SPORTS',   'Sports Day',      JPN),
  ]},
  { label: 'November', coins: [
    sc('$SHICHIGOSAN','Shichi Go San',   JPN), sc('$CHITOSEAME','Chitose Ame',    JPN),
    sc('$KIMONO',    'Kimono',           JPN), sc('$SHRINE',   'Shrine',          JPN),
    sc('$CULTURE',   'Culture Day',      JPN), sc('$IKEBANA',  'Ikebana',         JPN),
    sc('$ORIGAMI',   'Origami',          JPN), sc('$BONSAI',   'Bonsai',          JPN),
  ]},
  { label: 'December', coins: [
    sc('$KURISUMASU','Kurisumasu',       JPN), sc('$KFC',      'KFC',             JPN),
    sc('$CHRISTMAS4','Christmas 4',      JPN), sc('$TOSHIKOSHI','Toshikoshi Soba',JPN),
    sc('$JOYA',      'Joya no Kane',     JPN), sc('$BELL3',    'Bell 3',          JPN),
    sc('$NEWYEARJPN','New Year Japan',   JPN), sc('$HATSUHINODE','Hatsuhinode',   JPN),
  ]},
];

// ─── SOUTH AMERICA ────────────────────────────────────────────────────────────
const SA = '_SA';
const southAmericaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$CARNIVAL2', 'Carnival 2',       SA), sc('$SAMBA',     'Samba',           SA),
    sc('$FEATHERS',  'Feathers',         SA), sc('$DRUMLINE',  'Drumline',        SA),
    sc('$CAIPIRINHA','Caipirinha',       SA), sc('$ACAI',      'Açaí',            SA),
    sc('$PAOQUEIJO', 'Pão de Queijo',    SA), sc('$FEIJOADA',  'Feijoada',        SA),
  ]},
  { label: 'February', coins: [
    sc('$RIOCARNIVAL','Rio Carnival',    SA), sc('$SAMBADROME','Sambadrome',      SA),
    sc('$BLOCOS',    'Blocos',           SA), sc('$FREVO',     'Frevo',           SA),
    sc('$MARACATU',  'Maracatu',         SA), sc('$AXEMUSIC',  'Axé Music',       SA),
    sc('$FORRO',     'Forró',            SA), sc('$BAIAO',     'Baião',           SA),
  ]},
  { label: 'March', coins: [
    sc('$PATAGONIA', 'Patagonia',        SA), sc('$ANDES',     'Andes',           SA),
    sc('$CONDOR2',   'Condor 2',         SA), sc('$LLAMA',     'Llama',           SA),
    sc('$ALPACA',    'Alpaca',           SA), sc('$QUINOA',    'Quinoa',          SA),
    sc('$CHICHA',    'Chicha',           SA), sc('$CHUNO',     'Chuño',           SA),
  ]},
  { label: 'April', coins: [
    sc('$SEMANA',    'Semana Santa',     SA), sc('$PROCESSION','Procession',      SA),
    sc('$EMPANADA',  'Empanada',         SA), sc('$ASADO',     'Asado',           SA),
    sc('$CHIMICHURRI','Chimichurri',     SA), sc('$MALBEC',    'Malbec',          SA),
    sc('$GAUCHO',    'Gaucho',           SA), sc('$PAMPA',     'Pampa',           SA),
  ]},
  { label: 'May', coins: [
    sc('$MAYDAY2',   'May Day 2',        SA), sc('$WORKER',    'Worker',          SA),
    sc('$REVOLUTION','Revolution',       SA), sc('$LIBERATOR', 'Liberator',       SA),
    sc('$BOLIVAR',   'Bolivar',          SA), sc('$SANMARTIN', 'San Martin',      SA),
    sc('$INDEPENDENCE3','Independence 3',SA), sc('$FLAG',      'Flag',            SA),
  ]},
  { label: 'June', coins: [
    sc('$JUNINA',    'Festa Junina',     SA), sc('$QUADRILHA', 'Quadrilha',       SA),
    sc('$ARRAIAL',   'Arraial',          SA), sc('$MILHO',     'Milho',           SA),
    sc('$CANJICA',   'Canjica',          SA), sc('$PAMONHA',   'Pamonha',         SA),
    sc('$FOGUEIRA',  'Fogueira',         SA), sc('$BANDEIRINHAS','Bandeirinhas',  SA),
  ]},
  { label: 'July', coins: [
    sc('$AMAZON',    'Amazon',           SA), sc('$PIRANHA',   'Piranha',         SA),
    sc('$TOUCAN',    'Toucan',           SA), sc('$JAGUAR',    'Jaguar',          SA),
    sc('$ANACONDA',  'Anaconda',         SA), sc('$CAPYBARA',  'Capybara',        SA),
    sc('$SLOTH',     'Sloth',            SA), sc('$MACAW',     'Macaw',           SA),
  ]},
  { label: 'August', coins: [
    sc('$PACHAMAMA', 'Pachamama',        SA), sc('$EARTHMOTHER','Earth Mother',   SA),
    sc('$OFFERING',  'Offering',         SA), sc('$COPAAMERICA','Copa America',   SA),
    sc('$FUTBOL',    'Fútbol',           SA), sc('$PELECOIN',  'Pelé Coin',       SA),
    sc('$MARADONA',  'Maradona',         SA), sc('$GOAT',      'GOAT',            SA),
  ]},
  { label: 'September', coins: [
    sc('$INDEPENDENCE4','Independence 4',SA), sc('$GRITO',     'Grito',           SA),
    sc('$VERDE',     'Verde Amarelo',    SA), sc('$SPRING4',   'Spring 4',        SA),
    sc('$JACARANDA2','Jacaranda 2',      SA), sc('$IPE',       'Ipê',             SA),
    sc('$CERRADO',   'Cerrado',          SA), sc('$PANTANAL',  'Pantanal',        SA),
  ]},
  { label: 'October', coins: [
    sc('$HALLOWEEN5','Halloween 5',      SA), sc('$DAYOFTHEDEAD3','Day of Dead 3',SA),
    sc('$OFRENDA',   'Ofrenda',          SA), sc('$MARIGOLD',  'Marigold',        SA),
    sc('$SUGAR2',    'Sugar Skull',      SA), sc('$CALAVERA',  'Calavera',        SA),
    sc('$TEQUILA',   'Tequila',          SA), sc('$MEZCAL',    'Mezcal',          SA),
  ]},
  { label: 'November', coins: [
    sc('$BLACKFRIDAY2','Black Friday 2', SA), sc('$SHOPPING2', 'Shopping 2',      SA),
    sc('$NOVEMBRO',  'Novembro',         SA), sc('$CONSCIENCIA','Consciência',    SA),
    sc('$ZUMBI',     'Zumbi',            SA), sc('$QUILOMBO',  'Quilombo',        SA),
    sc('$CAPOEIRA',  'Capoeira',         SA), sc('$BERIMBAU',  'Berimbau',        SA),
  ]},
  { label: 'December', coins: [
    sc('$NATAL',     'Natal',            SA), sc('$PAPAINOEL', 'Papai Noel',      SA),
    sc('$REVEILLON', 'Réveillon',        SA), sc('$COPACABANA','Copacabana',      SA),
    sc('$WHITEDRESS','White Dress',      SA), sc('$FLOWERS2',  'Flowers 2',       SA),
    sc('$NEWYEARRIO','New Year Rio',     SA), sc('$FIREWORKS4','Fireworks 4',     SA),
  ]},
];

// ─── Edition definitions ───────────────────────────────────────────────────────
// ─── GLOBAL ───────────────────────────────────────────────────────────────────
const GLB = '_GLOBAL';

// Global seasonal coins that have real pixel-art uploads placed in airo-assets slots.
// Key = ticker (without $), value = slot URL.
// Add entries here as new uploads are placed.
export const GLOBAL_SEASONAL_IMAGES: Record<string, string> = {
  // ── Already placed ──────────────────────────────────────────────────────────
  BLIZZARD:   '/airo-assets/images/coins/blizzard',
  BANG:       '/airo-assets/images/coins/bang',
  POP:        '/airo-assets/images/coins/global/pop',
  AUDIT2:     '/airo-assets/images/coins/audit2',
  AUDIT:      '/airo-assets/images/coins/audit',
  ASH:        '/airo-assets/images/coins/ash',
  PHOENIX:    '/airo-assets/images/coins/global/phoenix',
  BLOOM:      '/airo-assets/images/coins/bloom',
  BLOCKED:    '/airo-assets/images/coins/blocked',
  BOOM:       '/airo-assets/images/coins/boom',
  COUCH:      '/airo-assets/images/coins/couch',
  REMOTE:     '/airo-assets/images/coins/global/remote',
  STREAM:     '/airo-assets/images/coins/global/stream',
  BREAD:      '/airo-assets/images/coins/bread',
  COAL:       '/airo-assets/images/coins/coal',
  COPIUM2:    '/airo-assets/images/coins/copium2',
  BURNT:      '/airo-assets/images/coins/burnt',
  REHEAT:     '/airo-assets/images/coins/global/reheat',
  MICROWAVE:  '/airo-assets/images/coins/global/microwave',
  CHIPS:      '/airo-assets/images/coins/chips',
  COLDSTART:  '/airo-assets/images/coins/coldstart',
  SALSA:      '/airo-assets/images/coins/global/salsa',
  CHIPS2:     '/airo-assets/images/coins/chips2',
  ELF:        '/airo-assets/images/coins/elf',
  EVADE:      '/airo-assets/images/coins/evade',
  JAIL:       '/airo-assets/images/coins/global/jail',
  SETTLE:     '/airo-assets/images/coins/global/settle',
  DIP:        '/airo-assets/images/coins/dip',
  DETOX:      '/airo-assets/images/coins/detox',
  CURSE:      '/airo-assets/images/coins/curse',
  VOODOO:     '/airo-assets/images/coins/global/voodoo',
  HEX:        '/airo-assets/images/coins/global/hex',
  DUMP:       '/airo-assets/images/coins/dump',
  HYPE:       '/airo-assets/images/coins/hype',
  REKT:       '/airo-assets/images/coins/global/rekt',
  CRISP:      '/airo-assets/images/coins/crisp',
  DETENTION:  '/airo-assets/images/coins/detention',
  DROPOUT:    '/airo-assets/images/coins/dropout',
  // coins.ts already has correct slot paths for these:
  RESO:       '/airo-assets/images/pages/coins/resolution-ruined',
  FRESHSTART: '/airo-assets/images/coins/freshstart',
  COLDSTART2: '/airo-assets/images/coins/coldstart',
  GHOST:      '/airo-assets/images/coins/ghost',
  CUPID:      '/airo-assets/images/coins/cupid',
  SHOWER:     '/airo-assets/images/coins/shower',
  EXTENSION:  '/airo-assets/images/coins/extension',
  FIZZLE:     '/airo-assets/images/coins/fizzle',
  BEACH:      '/airo-assets/images/coins/beach',
  FOMO:       '/airo-assets/images/coins/fomo',
  CHEAT:      '/airo-assets/images/coins/cheat',
  WITCH:      '/airo-assets/images/coins/witch',
  LEFT:       '/airo-assets/images/coins/left',
  NOEL:       '/airo-assets/images/coins/noel',
  FAIL:       '/airo-assets/images/coins/fail',
  TRYAGAIN:   '/airo-assets/images/coins/tryagain',
  REBOUND:    '/airo-assets/images/coins/rebound',
  TEXTS:      '/airo-assets/images/coins/global/texts',
  GHOSTED:    '/airo-assets/images/coins/ghosted',
  AUDIT2ALT:  '/airo-assets/images/coins/audit2',
  CHIPS2ALT:  '/airo-assets/images/coins/chips2',
  GUAC2:      '/airo-assets/images/coins/guac2',
  SIZZLE2:    '/airo-assets/images/coins/sizzle2',
  FIZZLE2:    '/airo-assets/images/coins/fizzle2',
  EXPELLED:   '/airo-assets/images/coins/expelled',
  FULLMENU:   '/airo-assets/images/coins/fullmenu',
  FROST:      '/airo-assets/images/coins/frost',
  SECRET:     '/airo-assets/images/coins/global/secret',
  HIDDEN:     '/airo-assets/images/coins/global/hidden',
  UNLOCK:     '/airo-assets/images/coins/global/unlock',
  LEGEND:     '/airo-assets/images/coins/global/legend',
  FOREVER:    '/airo-assets/images/coins/forever',
  // ── New Year 1 coins ────────────────────────────────────────────────────────
  JANEND:     '/airo-assets/images/coins/global/janend',
  FREEZE:     '/airo-assets/images/coins/freeze',
  POLAR:      '/airo-assets/images/coins/polar',
  NEWYR:      '/airo-assets/images/coins/newyr',
  VAL:        '/airo-assets/images/coins/global/val',
  HEART:      '/airo-assets/images/coins/global/heart',
  CRUSH:      '/airo-assets/images/coins/crush',
  ROSES:      '/airo-assets/images/coins/roses',
  CHOC:       '/airo-assets/images/coins/choc',
  LOVESICK:   '/airo-assets/images/coins/lovesick',
  HOPIUM:     '/airo-assets/images/coins/global/hopium',
  GREEN:      '/airo-assets/images/coins/global/green',
  CLOVER:     '/airo-assets/images/coins/clover',
  THAW:       '/airo-assets/images/coins/thaw',
  POLLEN:     '/airo-assets/images/coins/pollen',
  EQUINOX:    '/airo-assets/images/coins/equinox',
  FOOL:       '/airo-assets/images/coins/fool',
  RAIN:       '/airo-assets/images/coins/rain',
  MUDDY:      '/airo-assets/images/coins/muddy',
  SPRING:     '/airo-assets/images/coins/spring',
  CINCO:      '/airo-assets/images/coins/cinco',
  BLOOM2:     '/airo-assets/images/coins/bloom2',
  WARMUP:     '/airo-assets/images/coins/warmup',
  SOLSTICE:   '/airo-assets/images/coins/solstice',
  SWEAT:      '/airo-assets/images/coins/sweat',
  HUMID:      '/airo-assets/images/coins/humid',
  HEATWAVE:   '/airo-assets/images/coins/heatwave',
  SUNBURN:    '/airo-assets/images/coins/sunburn',
  GRILL:      '/airo-assets/images/coins/grill',
  ROADTRIP:   '/airo-assets/images/coins/roadtrip',
  HOTDOG:     '/airo-assets/images/coins/hotdog',
  ICECREAM:   '/airo-assets/images/coins/icecream',
  SANDCASTLE: '/airo-assets/images/coins/sandcastle',
  SUNSCREEN:  '/airo-assets/images/coins/sunscreen',
  LASTDAY:    '/airo-assets/images/coins/lastday',
  BACKPACK:   '/airo-assets/images/coins/backpack',
  PENCIL:     '/airo-assets/images/coins/pencil',
  HARVEST:    '/airo-assets/images/coins/harvest',
  FALLLEAF:   '/airo-assets/images/coins/fallleaf',
  SKULL:      '/airo-assets/images/coins/skull',
  CANDY:      '/airo-assets/images/coins/candy',
  COBWEB:     '/airo-assets/images/coins/cobweb',
  HAUNT:      '/airo-assets/images/coins/haunt',
  STUFFED:    '/airo-assets/images/coins/stuffed',
  NAPS:       '/airo-assets/images/coins/naps',
  BLACKFRI:   '/airo-assets/images/coins/blackfri',
  THANKLESS:  '/airo-assets/images/coins/thankless',
  REGIFT:     '/airo-assets/images/coins/regift',
  SNOWBALL:   '/airo-assets/images/coins/snowball',
  // ── Year 1 coins missing from original map ──────────────────────────────────
  IRS:        '/airo-assets/images/coins/global/irs',
  REFUND:     '/airo-assets/images/coins/global/refund',
  SAUCE:      '/airo-assets/images/coins/global/sauce',
  GUAC:       '/airo-assets/images/coins/global/guac',
  POOL:       '/airo-assets/images/coins/global/pool',
  TAN:        '/airo-assets/images/coins/global/tan',
  MELT:       '/airo-assets/images/coins/global/melt',
  SIZZLE:     '/airo-assets/images/coins/global/sizzle',
  OOPS:       '/airo-assets/images/coins/global/oops',
  SPARK:      '/airo-assets/images/coins/global/spark',
  SUN:        '/airo-assets/images/coins/global/sun',
  NAP:        '/airo-assets/images/coins/global/nap',
  HOMEWORK:   '/airo-assets/images/coins/global/homework',
  TRUANT:     '/airo-assets/images/coins/global/truant',
  LATE:       '/airo-assets/images/coins/global/late',
  SCARY:      '/airo-assets/images/coins/global/scary',
  PUMPKIN:    '/airo-assets/images/coins/global/pumpkin',
  ZOMBIE:     '/airo-assets/images/coins/global/zombie',
  TURKEY:     '/airo-assets/images/coins/global/turkey',
  SECOND:     '/airo-assets/images/coins/global/second',
  GRAVY:      '/airo-assets/images/coins/global/gravy',
  MIRACLE:    '/airo-assets/images/coins/global/miracle',
  KRAMPUS:    '/airo-assets/images/coins/global/krampus',
  YULE:       '/airo-assets/images/coins/global/yule',
  // ── Year 2 coins missing from original map ──────────────────────────────────
  RESET:      '/airo-assets/images/coins/global/reset',
  AFTERLIFE:  '/airo-assets/images/coins/global/afterlife',
  REPEAT:     '/airo-assets/images/coins/global/repeat',
  JUSTONCE:   '/airo-assets/images/coins/global/justonce',
  INEVITABLE: '/airo-assets/images/coins/global/inevitable',
  // ── New Year 2 coins ────────────────────────────────────────────────────────
  SNOWDAY2:   '/airo-assets/images/coins/snowday2',
  NUMB:       '/airo-assets/images/coins/numb',
  SLUMP:      '/airo-assets/images/coins/slump',
  SITUATIONSHIP: '/airo-assets/images/coins/situationship',
  ICKS:       '/airo-assets/images/coins/icks',
  UNMATCHED:  '/airo-assets/images/coins/unmatched',
  LEFTSWIPE:  '/airo-assets/images/coins/leftswipe',
  NGMI:       '/airo-assets/images/coins/ngmi',
  PAPERHANDS: '/airo-assets/images/coins/paperhands',
  RUGGED:     '/airo-assets/images/coins/rugged',
  BAGHOLDER:  '/airo-assets/images/coins/bagholder',
  OFFSHORE:   '/airo-assets/images/coins/offshore',
  LOOPHOLE:   '/airo-assets/images/coins/loophole',
  WRITEOFF:   '/airo-assets/images/coins/writeoff',
  DEDUCTION:  '/airo-assets/images/coins/deduction',
  SPLIT:      '/airo-assets/images/coins/global/split',
  PICNIC:     '/airo-assets/images/coins/picnic',
  PATIO:      '/airo-assets/images/coins/patio',
  ROSEBUD:    '/airo-assets/images/coins/rosebud',
  MAYDAY:     '/airo-assets/images/coins/mayday',
  DROUGHT:    '/airo-assets/images/coins/drought',
  WILDFIRE:   '/airo-assets/images/coins/wildfire',
  SCORCHED:   '/airo-assets/images/coins/scorched',
  MIRAGE:     '/airo-assets/images/coins/mirage',
  DUD:        '/airo-assets/images/coins/dud',
  SPARKLER:   '/airo-assets/images/coins/sparkler',
  BACKYARD:   '/airo-assets/images/coins/backyard',
  MOSQUITO:   '/airo-assets/images/coins/mosquito',
  HUMID2:     '/airo-assets/images/coins/humid2',
  SNACKS:     '/airo-assets/images/coins/snacks',
  BINGE:      '/airo-assets/images/coins/binge',
  RERUN:      '/airo-assets/images/coins/rerun',
  SWELTER:    '/airo-assets/images/coins/swelter',
  DOGDAYS:    '/airo-assets/images/coins/dogdays',
  TARDY:      '/airo-assets/images/coins/tardy',
  SUSPEND:    '/airo-assets/images/coins/suspend',
  DEMERIT:    '/airo-assets/images/coins/demerit',
  RECESS:     '/airo-assets/images/coins/recess',
  HALLPASS:   '/airo-assets/images/coins/hallpass',
  SEANCE:     '/airo-assets/images/coins/seance',
  SPECTER:    '/airo-assets/images/coins/specter',
  CAULDRON:   '/airo-assets/images/coins/cauldron',
  GRIMREAP:   '/airo-assets/images/coins/grimreap',
  BANSHEE:    '/airo-assets/images/coins/banshee',
  OVERCOOKED: '/airo-assets/images/coins/overcooked',
  SOGGY:      '/airo-assets/images/coins/soggy',
  CANNED:     '/airo-assets/images/coins/canned',
  POTLUCK:    '/airo-assets/images/coins/potluck',
  CASSEROLE:  '/airo-assets/images/coins/casserole',
  ICICLE:     '/airo-assets/images/coins/global/icicle',
  SLEET:      '/airo-assets/images/coins/sleet',
  SNOWGLOBE:  '/airo-assets/images/coins/snowglobe',
  FROSTBITE:  '/airo-assets/images/coins/frostbite',
  WHITEOUT:   '/airo-assets/images/coins/whiteout',
  YEAREND:    '/airo-assets/images/coins/yearend',
};

// USA seasonal coins — all 96 tickers mapped to their AI-generated pixel-art slots.
const USA_SEASONAL_IMAGES: Record<string, string> = {
  // ── January ──────────────────────────────────────────────────────────────────
  INAUGURATION:    '/airo-assets/images/coins/usa/inauguration',
  SUPERBOWL:       '/airo-assets/images/coins/usa/superbowl',
  MLKDAY:          '/airo-assets/images/coins/usa/mlkday',
  RESOLUTION2:     '/airo-assets/images/coins/usa/resolution2',
  COLDSNAP:        '/airo-assets/images/coins/usa/coldsnap',
  SNOWDAY:         '/airo-assets/images/coins/usa/snowday',
  GROUNDHOG:       '/airo-assets/images/coins/usa/groundhog',
  TAXSEASON:       '/airo-assets/images/coins/usa/taxseason',
  // ── February ─────────────────────────────────────────────────────────────────
  VALENTINES:      '/airo-assets/images/coins/usa/valentines',
  PRESIDENTS:      '/airo-assets/images/coins/usa/presidents',
  MARDIGRAS:       '/airo-assets/images/coins/usa/mardigras',
  GROUNDHOG2:      '/airo-assets/images/coins/usa/groundhog2',
  SWEETHEART:      '/airo-assets/images/coins/usa/sweetheart',
  CHOCOLATEBOX:    '/airo-assets/images/coins/usa/chocolatebox',
  ROSES:           '/airo-assets/images/coins/usa/roses',
  CUPID2:          '/airo-assets/images/coins/usa/cupid2',
  // ── March ────────────────────────────────────────────────────────────────────
  STPADDYS:        '/airo-assets/images/coins/usa/stpaddys',
  MARCHMADNESS:    '/airo-assets/images/coins/usa/marchmadness',
  SPRINGBREAK:     '/airo-assets/images/coins/usa/springbreak',
  SHAMROCK:        '/airo-assets/images/coins/usa/shamrock',
  GREENBEER:       '/airo-assets/images/coins/usa/greenbeer',
  BRACKETBUST:     '/airo-assets/images/coins/usa/bracketbust',
  OVERTIME:        '/airo-assets/images/coins/usa/overtime',
  BUZZERBEAT:      '/airo-assets/images/coins/usa/buzzerbeat',
  // ── April ────────────────────────────────────────────────────────────────────
  TAXDAY:          '/airo-assets/images/coins/usa/taxday',
  EASTER2:         '/airo-assets/images/coins/usa/easter2',
  EARTHDAY:        '/airo-assets/images/coins/usa/earthday',
  APRILFOOL:       '/airo-assets/images/coins/usa/aprilfool',
  REFUND2:         '/airo-assets/images/coins/usa/refund2',
  AUDIT2USA:       '/airo-assets/images/coins/usa/audit2usa',
  EXTENSION2:      '/airo-assets/images/coins/usa/extension2',
  TURBOTAX:        '/airo-assets/images/coins/usa/turbotax',
  // ── May ──────────────────────────────────────────────────────────────────────
  MEMORIALDAY:     '/airo-assets/images/coins/usa/memorialday',
  MOTHERSDAY:      '/airo-assets/images/coins/usa/mothersday',
  CINCODEMAYO:     '/airo-assets/images/coins/usa/cincodemayo',
  BBQSEASON:       '/airo-assets/images/coins/usa/bbqseason',
  GRADSEASON:      '/airo-assets/images/coins/usa/gradseason',
  PROM:            '/airo-assets/images/coins/usa/prom',
  YARDSALE:        '/airo-assets/images/coins/usa/yardsale',
  LEMONADE:        '/airo-assets/images/coins/usa/lemonade',
  // ── June ─────────────────────────────────────────────────────────────────────
  JUNETEENTH:      '/airo-assets/images/coins/usa/juneteenth',
  PRIDE:           '/airo-assets/images/coins/usa/pride',
  FATHERSDAY:      '/airo-assets/images/coins/usa/fathersday',
  SUMMERVIBE:      '/airo-assets/images/coins/usa/summervibe',
  ROADTRIP:        '/airo-assets/images/coins/usa/roadtrip',
  DRIVEIN:         '/airo-assets/images/coins/usa/drivein',
  HOTDOG:          '/airo-assets/images/coins/usa/hotdog',
  ROOTBEER:        '/airo-assets/images/coins/usa/rootbeer',
  // ── July ─────────────────────────────────────────────────────────────────────
  FOURTHJULY:      '/airo-assets/images/coins/usa/fourthjuly',
  FIREWORKS2:      '/airo-assets/images/coins/usa/fireworks2',
  EAGLE:           '/airo-assets/images/coins/usa/eagle',
  LIBERTY:         '/airo-assets/images/coins/usa/liberty',
  REDWHITEBLUE:    '/airo-assets/images/coins/usa/redwhiteblue',
  SPARKLER:        '/airo-assets/images/coins/usa/sparkler',
  PARADE2:         '/airo-assets/images/coins/usa/parade2',
  FREEDOMCOIN:     '/airo-assets/images/coins/usa/freedomcoin',
  // ── August ───────────────────────────────────────────────────────────────────
  BACKTOSCHOOL:    '/airo-assets/images/coins/usa/backtoschool',
  STATFAIR:        '/airo-assets/images/coins/usa/statfair',
  CORNCOB:         '/airo-assets/images/coins/usa/corncob',
  FUNNEL:          '/airo-assets/images/coins/usa/funnel',
  FERRISWHEEL:     '/airo-assets/images/coins/usa/ferriswheel',
  RODEO:           '/airo-assets/images/coins/usa/rodeo',
  COUNTRYMUSIC:    '/airo-assets/images/coins/usa/countrymusic',
  PICKUP:          '/airo-assets/images/coins/usa/pickup',
  // ── September ────────────────────────────────────────────────────────────────
  LABORDAY:        '/airo-assets/images/coins/usa/laborday',
  NFL:             '/airo-assets/images/coins/usa/nfl',
  TAILGATE:        '/airo-assets/images/coins/usa/tailgate',
  FANTASY:         '/airo-assets/images/coins/usa/fantasy',
  PUMPKINSPICE:    '/airo-assets/images/coins/usa/pumpkinspice',
  FALLLEAVES:      '/airo-assets/images/coins/usa/fallleaves',
  SWEATERWEATHER:  '/airo-assets/images/coins/usa/sweaterweather',
  APPLEORCHARD:    '/airo-assets/images/coins/usa/appleorchard',
  // ── October ──────────────────────────────────────────────────────────────────
  HALLOWEEN2:      '/airo-assets/images/coins/usa/halloween2',
  TRICKTREAT:      '/airo-assets/images/coins/usa/tricktreat',
  JACKOLANTERN:    '/airo-assets/images/coins/usa/jackolantern',
  HAUNTED:         '/airo-assets/images/coins/usa/haunted',
  COSTUME:         '/airo-assets/images/coins/usa/costume',
  CANDY:           '/airo-assets/images/coins/usa/candy',
  COBWEB:          '/airo-assets/images/coins/usa/cobweb',
  SCARECROW:       '/airo-assets/images/coins/usa/scarecrow',
  // ── November ─────────────────────────────────────────────────────────────────
  THANKSGIVING:    '/airo-assets/images/coins/usa/thanksgiving',
  TURKEY2:         '/airo-assets/images/coins/usa/turkey2',
  BLACKFRIDAY:     '/airo-assets/images/coins/usa/blackfriday',
  CYBERMONDAY:     '/airo-assets/images/coins/usa/cybermonday',
  STUFFING:        '/airo-assets/images/coins/usa/stuffing',
  CRANBERRY:       '/airo-assets/images/coins/usa/cranberry',
  GRAVY2:          '/airo-assets/images/coins/usa/gravy2',
  PUMPKINPIE:      '/airo-assets/images/coins/usa/pumpkinpie',
  // ── December ─────────────────────────────────────────────────────────────────
  CHRISTMAS2:      '/airo-assets/images/coins/usa/christmas2',
  HANUKKAH:        '/airo-assets/images/coins/usa/hanukkah',
  KWANZAA:         '/airo-assets/images/coins/usa/kwanzaa',
  NEWYEARSNYC:     '/airo-assets/images/coins/usa/newyearsnyc',
  TIMESSQUARE:     '/airo-assets/images/coins/usa/timessquare',
  EGGNOG:          '/airo-assets/images/coins/usa/eggnog',
  GINGERBREAD:     '/airo-assets/images/coins/usa/gingerbread',
  MISTLETOE:       '/airo-assets/images/coins/usa/mistletoe',
};

// Build USA seasonal groups — overlay explicit slot URLs from USA_SEASONAL_IMAGES
// onto the usaSeasonal array (same pattern as buildGlobalSeasonal).
function buildUSASeasonal(): SeasonalGroup[] {
  return usaSeasonal.map((g) => ({
    label: g.label,
    coins: g.coins.map((c) => {
      const key = c.ticker.replace('$', '');
      const slotImage = USA_SEASONAL_IMAGES[key];
      return { ...c, image: slotImage ?? c.image };
    }),
  }));
}

// Build Global permanent coins — reuse the correct slot URLs from coins.ts
function buildGlobalPermanentCoins(): Coin[] {
  return PERMANENT_COINS.map((c) => ({ ...c }));
}

// Build Global seasonal groups — use placed slot URLs where available,
// otherwise undefined so the styled placeholder renders instead of a broken image.
function buildGlobalSeasonal(): SeasonalGroup[] {
  const year1Groups = SEASONAL_YEAR_ONE.map((g) => ({ ...g, label: `${g.label} — Year 1` }));
  const finaleGroup = { label: 'Finale — Year 1', coins: FINALE_COINS };
  const year2Groups = YEAR_TWO_GROUPS.map((g) => ({ ...g, label: `${g.label} — Year 2` }));

  const allGroups = [...year1Groups, finaleGroup, ...year2Groups];

  return allGroups.map((g) => ({
    label: g.label,
    coins: g.coins.map((c) => {
      const key = c.ticker.replace('$', '');
      const slotImage = GLOBAL_SEASONAL_IMAGES[key];
      return {
        ...c,
        image: slotImage ?? undefined,
      };
    }),
  }));
}

// ─── MIDDLE EAST ─────────────────────────────────────────────────────────────
const ME = '_ME';
const MIDDLEEAST_IMAGES: Record<string, string> = {
  NEWYEARME:'coins/middleeast/newyearme', RAMADAN2:'coins/middleeast/ramadan2', DATES:'coins/middleeast/dates', CAMEL:'coins/middleeast/camel',
  DUNES:'coins/middleeast/dunes', OASIS:'coins/middleeast/oasis', FRANKINCENSE:'coins/middleeast/frankincense', MYRRH:'coins/middleeast/myrrh',
  IFTAR2:'coins/middleeast/iftar2', SUHOOR:'coins/middleeast/suhoor', CRESCENT2:'coins/middleeast/crescent2', PRAYER2:'coins/middleeast/prayer2',
  MINARET2:'coins/middleeast/minaret2', MOSQUE2:'coins/middleeast/mosque2', QURAN:'coins/middleeast/quran', TASBIH:'coins/middleeast/tasbih',
  EIDFITR:'coins/middleeast/eidfitr', HENNA:'coins/middleeast/henna', KANDURA:'coins/middleeast/kandura', ABAYA:'coins/middleeast/abaya',
  SOUK:'coins/middleeast/souk', SPICE2:'coins/middleeast/spice2', GOLD2:'coins/middleeast/gold2', PEARL:'coins/middleeast/pearl',
  SPRING5:'coins/middleeast/spring5', JASMINE2:'coins/middleeast/jasmine2', ROSEWATER:'coins/middleeast/rosewater', BAKLAVA:'coins/middleeast/baklava',
  KUNAFA:'coins/middleeast/kunafa', MAAMOUL:'coins/middleeast/maamoul', HALVA:'coins/middleeast/halva', CARDAMOM:'coins/middleeast/cardamom',
  HUMMUS:'coins/middleeast/hummus', FALAFEL:'coins/middleeast/falafel', SHAWARMA:'coins/middleeast/shawarma', MANSAF:'coins/middleeast/mansaf',
  KABSA:'coins/middleeast/kabsa', MEZZE:'coins/middleeast/mezze', FATTOUSH:'coins/middleeast/fattoush', TABBOULEH:'coins/middleeast/tabbouleh',
  SUMMER5:'coins/middleeast/summer5', MIRAGE2:'coins/middleeast/mirage2', SANDSTORM:'coins/middleeast/sandstorm', KHAMSIN:'coins/middleeast/khamsin',
  SIROCCO:'coins/middleeast/sirocco', HEATME:'coins/middleeast/heatme', FALCONRY:'coins/middleeast/falconry', FALCON:'coins/middleeast/falcon',
  DHOW:'coins/middleeast/dhow', PEARLDIVE:'coins/middleeast/pearldive', FISHMARKET:'coins/middleeast/fishmarket', ARABIAN:'coins/middleeast/arabian',
  INCENSE3:'coins/middleeast/incense3', OUD:'coins/middleeast/oud', DARBUKA:'coins/middleeast/darbuka', RABAB:'coins/middleeast/rabab',
  BEDOUIN:'coins/middleeast/bedouin', TENT:'coins/middleeast/tent', STARGAZEME:'coins/middleeast/stargazeme', MILKYWAYME:'coins/middleeast/milkywayme',
  CAMPFIRE2:'coins/middleeast/campfire2', COFFEEME:'coins/middleeast/coffeeme', CARDAMOMCOF:'coins/middleeast/cardamomcof', SAFFRON:'coins/middleeast/saffron',
  HARVEST10:'coins/middleeast/harvest10', OLIVE2:'coins/middleeast/olive2', POMEGRANATE:'coins/middleeast/pomegranate', FIG:'coins/middleeast/fig',
  GRAPE2:'coins/middleeast/grape2', PISTACHIO:'coins/middleeast/pistachio', ALMOND:'coins/middleeast/almond', WALNUT:'coins/middleeast/walnut',
  EIDADHA:'coins/middleeast/eidadha', HAJJ:'coins/middleeast/hajj', KAABA:'coins/middleeast/kaaba', ZAMZAM:'coins/middleeast/zamzam',
  SACRIFICE:'coins/middleeast/sacrifice', LAMB:'coins/middleeast/lamb', PILGRIMAGE:'coins/middleeast/pilgrimage', MECCA:'coins/middleeast/mecca',
  MUHARRAM:'coins/middleeast/muharram', ASHURA:'coins/middleeast/ashura', MAWLID:'coins/middleeast/mawlid', PROPHET:'coins/middleeast/prophet',
  LANTERN3:'coins/middleeast/lantern3', CANDLE3:'coins/middleeast/candle3', PROCESSION2:'coins/middleeast/procession2', CHANT:'coins/middleeast/chant',
  WINTERME:'coins/middleeast/winterme', COLDME:'coins/middleeast/coldme', STARME:'coins/middleeast/starme', MOONME:'coins/middleeast/moonme',
  NEWYEARDUBAI:'coins/middleeast/newyeardubai', FIREWORKSME:'coins/middleeast/fireworksme', GOLDME:'coins/middleeast/goldme', LUXURYME:'coins/middleeast/luxuryme',
};
// Middle East seasonal data
const middleEastSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$NEWYEARME',   'New Year ME',       ME), sc('$RAMADAN2',   'Ramadan',          ME),
    sc('$DATES',       'Dates',             ME), sc('$CAMEL',      'Camel',            ME),
    sc('$DUNES',       'Dunes',             ME), sc('$OASIS',      'Oasis',            ME),
    sc('$FRANKINCENSE','Frankincense',      ME), sc('$MYRRH',      'Myrrh',            ME),
  ]},
  { label: 'February', coins: [
    sc('$IFTAR2',      'Iftar',             ME), sc('$SUHOOR',     'Suhoor',           ME),
    sc('$CRESCENT2',   'Crescent',          ME), sc('$PRAYER2',    'Prayer',           ME),
    sc('$MINARET2',    'Minaret',           ME), sc('$MOSQUE2',    'Mosque',           ME),
    sc('$QURAN',       'Quran',             ME), sc('$TASBIH',     'Tasbih',           ME),
  ]},
  { label: 'March', coins: [
    sc('$EIDFITR',     'Eid al-Fitr',       ME), sc('$HENNA',      'Henna',            ME),
    sc('$KANDURA',     'Kandura',           ME), sc('$ABAYA',      'Abaya',            ME),
    sc('$SOUK',        'Souk',              ME), sc('$SPICE2',     'Spice Market',     ME),
    sc('$GOLD2',       'Gold Souk',         ME), sc('$PEARL',      'Pearl',            ME),
  ]},
  { label: 'April', coins: [
    sc('$SPRING5',     'Spring',            ME), sc('$JASMINE2',   'Jasmine',          ME),
    sc('$ROSEWATER',   'Rose Water',        ME), sc('$BAKLAVA',    'Baklava',          ME),
    sc('$KUNAFA',      'Kunafa',            ME), sc('$MAAMOUL',    'Maamoul',          ME),
    sc('$HALVA',       'Halva',             ME), sc('$CARDAMOM',   'Cardamom',         ME),
  ]},
  { label: 'May', coins: [
    sc('$HUMMUS',      'Hummus',            ME), sc('$FALAFEL',    'Falafel',          ME),
    sc('$SHAWARMA',    'Shawarma',          ME), sc('$MANSAF',     'Mansaf',           ME),
    sc('$KABSA',       'Kabsa',             ME), sc('$MEZZE',      'Mezze',            ME),
    sc('$FATTOUSH',    'Fattoush',          ME), sc('$TABBOULEH',  'Tabbouleh',        ME),
  ]},
  { label: 'June', coins: [
    sc('$SUMMER5',     'Summer',            ME), sc('$MIRAGE2',    'Mirage',           ME),
    sc('$SANDSTORM',   'Sandstorm',         ME), sc('$KHAMSIN',    'Khamsin',          ME),
    sc('$SIROCCO',     'Sirocco',           ME), sc('$HEATME',     'Desert Heat',      ME),
    sc('$FALCONRY',    'Falconry',          ME), sc('$FALCON',     'Falcon',           ME),
  ]},
  { label: 'July', coins: [
    sc('$DHOW',        'Dhow',              ME), sc('$PEARLDIVE',  'Pearl Dive',       ME),
    sc('$FISHMARKET',  'Fish Market',       ME), sc('$ARABIAN',    'Arabian Sea',      ME),
    sc('$INCENSE3',    'Incense',           ME), sc('$OUD',        'Oud',              ME),
    sc('$DARBUKA',     'Darbuka',           ME), sc('$RABAB',      'Rabab',            ME),
  ]},
  { label: 'August', coins: [
    sc('$BEDOUIN',     'Bedouin',           ME), sc('$TENT',       'Desert Tent',      ME),
    sc('$STARGAZEME',  'Stargazing',        ME), sc('$MILKYWAYME', 'Milky Way',        ME),
    sc('$CAMPFIRE2',   'Campfire',          ME), sc('$COFFEEME',   'Arabic Coffee',    ME),
    sc('$CARDAMOMCOF', 'Cardamom Coffee',   ME), sc('$SAFFRON',    'Saffron',          ME),
  ]},
  { label: 'September', coins: [
    sc('$HARVEST10',   'Harvest',           ME), sc('$OLIVE2',     'Olive',            ME),
    sc('$POMEGRANATE', 'Pomegranate',       ME), sc('$FIG',        'Fig',              ME),
    sc('$GRAPE2',      'Grape',             ME), sc('$PISTACHIO',  'Pistachio',        ME),
    sc('$ALMOND',      'Almond',            ME), sc('$WALNUT',     'Walnut',           ME),
  ]},
  { label: 'October', coins: [
    sc('$EIDADHA',     'Eid al-Adha',       ME), sc('$HAJJ',       'Hajj',             ME),
    sc('$KAABA',       'Kaaba',             ME), sc('$ZAMZAM',     'Zamzam',           ME),
    sc('$SACRIFICE',   'Sacrifice',         ME), sc('$LAMB',       'Lamb',             ME),
    sc('$PILGRIMAGE',  'Pilgrimage',        ME), sc('$MECCA',      'Mecca',            ME),
  ]},
  { label: 'November', coins: [
    sc('$MUHARRAM',    'Muharram',          ME), sc('$ASHURA',     'Ashura',           ME),
    sc('$MAWLID',      'Mawlid',            ME), sc('$PROPHET',    'Prophet',          ME),
    sc('$LANTERN3',    'Lantern',           ME), sc('$CANDLE3',    'Candle',           ME),
    sc('$PROCESSION2', 'Procession',        ME), sc('$CHANT',      'Chant',            ME),
  ]},
  { label: 'December', coins: [
    sc('$WINTERME',    'Winter',            ME), sc('$COLDME',     'Cold Desert',      ME),
    sc('$STARME',      'Star',              ME), sc('$MOONME',     'Moon',             ME),
    sc('$NEWYEARDUBAI','New Year Dubai',    ME), sc('$FIREWORKSME','Fireworks',        ME),
    sc('$GOLDME',      'Gold',              ME), sc('$LUXURYME',   'Luxury',           ME),
  ]},
];

function buildMiddleEastSeasonal(): SeasonalGroup[] {
  return middleEastSeasonal.map((g) => ({
    label: g.label,
    coins: g.coins.map((c) => {
      const key = c.ticker.replace('$', '').toUpperCase();
      const slot = MIDDLEEAST_IMAGES[key];
      return { ...c, image: slot ? `/airo-assets/images/${slot}` : c.image };
    }),
  }));
}

// ─── OCEANIA ──────────────────────────────────────────────────────────────────
const OC = '_OC';
const OCEANIA_IMAGES: Record<string, string> = {
  NEWYEAROC:'coins/oceania/newyearoc', HEATOC:'coins/oceania/heatoc', CICADA2:'coins/oceania/cicada2', TIKI:'coins/oceania/tiki',
  LUAU:'coins/oceania/luau', UKULELE:'coins/oceania/ukulele', HULA:'coins/oceania/hula', LEI:'coins/oceania/lei',
  VALENTINEOC:'coins/oceania/valentineoc', TROPICOC:'coins/oceania/tropicoc', HIBISCUS:'coins/oceania/hibiscus', FRANGIPANI:'coins/oceania/frangipani',
  COCONUT:'coins/oceania/coconut', MANGO2:'coins/oceania/mango2', PAPAYA:'coins/oceania/papaya', PASSIONFRUIT:'coins/oceania/passionfruit',
  CYCLONE:'coins/oceania/cyclone', MONSOONOC:'coins/oceania/monsoonoc', RAINBOWOC:'coins/oceania/rainbowoc', WETSEASON:'coins/oceania/wetseason',
  MUDOC:'coins/oceania/mudoc', FLOODOC:'coins/oceania/floodoc', CROC:'coins/oceania/croc', CASSOWARY2:'coins/oceania/cassowary2',
  ANZAC2:'coins/oceania/anzac2', POPPYOC:'coins/oceania/poppyoc', AUTUMNOC:'coins/oceania/autumnoc', HARVESTOC:'coins/oceania/harvestoc',
  KIWI2:'coins/oceania/kiwi2', MAORI:'coins/oceania/maori', HAKA:'coins/oceania/haka', GREENSTONE:'coins/oceania/greenstone',
  MOTHEROC:'coins/oceania/motheroc', COOLOC:'coins/oceania/cooloc', SURFOC:'coins/oceania/surfoc', WAVEOC:'coins/oceania/waveoc',
  REEF:'coins/oceania/reef', CORAL:'coins/oceania/coral', TURTLE:'coins/oceania/turtle', MANTA:'coins/oceania/manta',
  WINTEROC:'coins/oceania/winteroc', MATARIKI:'coins/oceania/matariki', STAROC:'coins/oceania/staroc', PLEIADES:'coins/oceania/pleiades',
  MAORISTAR:'coins/oceania/maoristar', HANGI:'coins/oceania/hangi', KUMARA:'coins/oceania/kumara', PAVLOVAOC:'coins/oceania/pavlovaoc',
  MIDWINTEROC:'coins/oceania/midwinteroc', FIREOC:'coins/oceania/fireoc', WHALERIDER:'coins/oceania/whalerider', WHALE:'coins/oceania/whale',
  DOLPHIN:'coins/oceania/dolphin', SHARK:'coins/oceania/shark', OCTOPUS:'coins/oceania/octopus', CRAB:'coins/oceania/crab',
  FATHEROC:'coins/oceania/fatheroc', RUGBYOC:'coins/oceania/rugbyoc', ALLBLACKS:'coins/oceania/allblacks', HAKA2:'coins/oceania/haka2',
  CRICKET2:'coins/oceania/cricket2', NETBALL:'coins/oceania/netball', AUSSIERULES:'coins/oceania/aussierules', FOOTY2:'coins/oceania/footy2',
  SPRINGOC:'coins/oceania/springoc', BLOSSOMOC:'coins/oceania/blossomoc', WATTLEOC:'coins/oceania/wattleoc', KOWHAI:'coins/oceania/kowhai',
  POHUTUKAWA:'coins/oceania/pohutukawa', KAKAPO:'coins/oceania/kakapo', KOOKABURRA:'coins/oceania/kookaburra', TUATARA:'coins/oceania/tuatara',
  HALLOWEENOC:'coins/oceania/halloweenoc', PUMPKINOC:'coins/oceania/pumpkinoc', SUMMEROC:'coins/oceania/summeroc', BEACHOC:'coins/oceania/beachoc',
  BBQOC:'coins/oceania/bbqoc', PRAWNSOC:'coins/oceania/prawnsoc', COLDONEOC:'coins/oceania/coldoneoc', SNAGOC:'coins/oceania/snagoc',
  MELBCUPOC:'coins/oceania/melbcupoc', PUNTEROC:'coins/oceania/punteroc', BUSHFIREOC:'coins/oceania/bushfireoc', HAZARDOC:'coins/oceania/hazardoc',
  HEATWAVEOC:'coins/oceania/heatwaveoc', SUNSCREENOC:'coins/oceania/sunscreenoc', SLIPOC:'coins/oceania/slipoc', UVOC:'coins/oceania/uvoc',
  XMASOC:'coins/oceania/xmasoc', BEACHXMASOC:'coins/oceania/beachxmasoc', BONDIOC:'coins/oceania/bondioc', PRAWNSOC2:'coins/oceania/prawnsoc2',
  COLDONEOC2:'coins/oceania/coldoneoc2', SUMMERFUNOC:'coins/oceania/summerfunoc', NEWYEARSYDOC:'coins/oceania/newyearsydoc', FIREWORKSOC:'coins/oceania/fireworksoc',
};
function buildOceaniaSeasonal(): SeasonalGroup[] {
  return oceaniaSeasonal.map((g) => ({
    label: g.label,
    coins: g.coins.map((c) => {
      const key = c.ticker.replace('$', '').toUpperCase();
      const slot = OCEANIA_IMAGES[key];
      return { ...c, image: slot ? `/airo-assets/images/${slot}` : c.image };
    }),
  }));
}

// ─── NORTH AMERICA ────────────────────────────────────────────────────────────
const NORTHAMERICA_IMAGES: Record<string, string> = {
  NEWYEARNA:'coins/northamerica/newyearna', BLIZZARDNA:'coins/northamerica/blizzardna', SNOWSTORM:'coins/northamerica/snowstorm', ICESTORM:'coins/northamerica/icestorm',
  MOOSE:'coins/northamerica/moose', BEAVER:'coins/northamerica/beaver', MAPLE:'coins/northamerica/maple', HOCKEY:'coins/northamerica/hockey',
  VALENTINENA:'coins/northamerica/valentinena', GROUNDHOGNA:'coins/northamerica/groundhogna', POUTINE:'coins/northamerica/poutine', TIMBITS:'coins/northamerica/timbits',
  NANAIMO:'coins/northamerica/nanaimo', BEAVERTAIL:'coins/northamerica/beavertail', TOURTIERE:'coins/northamerica/tourtiere', ICEWINE:'coins/northamerica/icewine',
  STPADDYNA:'coins/northamerica/stpaddyna', SUGARBUSH:'coins/northamerica/sugarbush', MAPLESYRUP:'coins/northamerica/maplesyrup', SUGARING:'coins/northamerica/sugaring',
  CABANE:'coins/northamerica/cabane', TAFFY:'coins/northamerica/taffy', BREAKUPNA:'coins/northamerica/breakupna', THAWNA:'coins/northamerica/thawna',
  EASTERCAN:'coins/northamerica/eastercan', TULIPFEST:'coins/northamerica/tulipfest', LOON:'coins/northamerica/loon', CANUCK:'coins/northamerica/canuck',
  VICTORIA:'coins/northamerica/victoria', FIREWORKSNA:'coins/northamerica/fireworksna', MOUNTIE:'coins/northamerica/mountie', RCMP:'coins/northamerica/rcmp',
  VICTORIANA:'coins/northamerica/victoriana', MOTHERCAN:'coins/northamerica/mothercan', CAMPING:'coins/northamerica/camping', CANOE:'coins/northamerica/canoe',
  KAYAK:'coins/northamerica/kayak', FISHING2:'coins/northamerica/fishing2', BEAR:'coins/northamerica/bear', WOLF2:'coins/northamerica/wolf2',
  CANADADAY:'coins/northamerica/canadaday', LEAFS:'coins/northamerica/leafs', PRIDE2:'coins/northamerica/pride2', FATHERCAN:'coins/northamerica/fathercan',
  NATIONALCAN:'coins/northamerica/nationalcan', REDWHITE:'coins/northamerica/redwhite', FIREWORKSCAN:'coins/northamerica/fireworkscan', BBQCAN:'coins/northamerica/bbqcan',
  SUMMERNA:'coins/northamerica/summerna', LAKENA:'coins/northamerica/lakena', COTTAGNA:'coins/northamerica/cottagna', DOCKNA:'coins/northamerica/dockna',
  LOONIECOIN:'coins/northamerica/looniecoin', TOONIECOIN:'coins/northamerica/tooniecoin', TIMMIES:'coins/northamerica/timmies', ROLLUPRIM:'coins/northamerica/rolluprim',
  STAMPEDE:'coins/northamerica/stampede', RODEO2:'coins/northamerica/rodeo2', COWBOY2:'coins/northamerica/cowboy2', CHUCKWAGON:'coins/northamerica/chuckwagon',
  CARIBOU:'coins/northamerica/caribou', BISON:'coins/northamerica/bison', GRIZZLY:'coins/northamerica/grizzly', EAGLE2:'coins/northamerica/eagle2',
  LABOURCAN:'coins/northamerica/labourcan', FALLNA:'coins/northamerica/fallna', MAPLELEAF2:'coins/northamerica/mapleleaf2', FALLCOLOURS:'coins/northamerica/fallcolours',
  HARVEST11:'coins/northamerica/harvest11', PUMPKINNA:'coins/northamerica/pumpkinna', APPLENA:'coins/northamerica/applena', CIDERNA:'coins/northamerica/ciderna',
  THANKSGIVCAN:'coins/northamerica/thanksgivcan', HALLOWEENNA:'coins/northamerica/halloweenna', TURKEYCAN:'coins/northamerica/turkeycan', STUFFINGCAN:'coins/northamerica/stuffingcan',
  PUMPKINPIE2:'coins/northamerica/pumpkinpie2', CRANBERRY2:'coins/northamerica/cranberry2', CORNMAZE:'coins/northamerica/cornmaze', SCARECROW2:'coins/northamerica/scarecrow2',
  REMEMBRCAN:'coins/northamerica/remembrcan', POPPYCAN:'coins/northamerica/poppycan', SNOWNA:'coins/northamerica/snowna', BLIZZARDNA2:'coins/northamerica/blizzardna2',
  HOCKEYNIGHT:'coins/northamerica/hockeynight', CURLING:'coins/northamerica/curling', SKATING:'coins/northamerica/skating', TOBOGGANNA:'coins/northamerica/tobogganna',
  XMASCAN:'coins/northamerica/xmascan', BOXINGDAY:'coins/northamerica/boxingday', NEWYEARVANCOUVER:'coins/northamerica/newyearvancouver', NEWYEARTORONTO:'coins/northamerica/newyeartoronto',
  SNOWFLAKENA:'coins/northamerica/snowflakena', IGLOOCAN:'coins/northamerica/igloocan', DOGSLED:'coins/northamerica/dogsled', AURORA2:'coins/northamerica/aurora2',
};
function buildNorthAmericaSeasonal(): SeasonalGroup[] {
  return northAmericaSeasonal.map((g) => ({
    label: g.label,
    coins: g.coins.map((c) => {
      const key = c.ticker.replace('$', '').toUpperCase();
      const slot = NORTHAMERICA_IMAGES[key];
      return { ...c, image: slot ? `/airo-assets/images/${slot}` : c.image };
    }),
  }));
}

// ─── CENTRAL AMERICA ─────────────────────────────────────────────────────────
const CA = '_CA';
const CENTRALAMERICA_IMAGES: Record<string, string> = {
  NEWYEARCA:'coins/centralamerica/newyearca', TAMALE:'coins/centralamerica/tamale', POZOLE:'coins/centralamerica/pozole', ATOLE:'coins/centralamerica/atole',
  'PIÑATA':'coins/centralamerica/piñata', MARIACHI:'coins/centralamerica/mariachi', SOMBRERO:'coins/centralamerica/sombrero', SERAPE:'coins/centralamerica/serape',
  VALENTINECA:'coins/centralamerica/valentineca', CARNIVALCA:'coins/centralamerica/carnivalca', MASKCARNIVAL:'coins/centralamerica/maskcarnival', MARIMBA:'coins/centralamerica/marimba',
  QUETZAL:'coins/centralamerica/quetzal', TOUCAN2:'coins/centralamerica/toucan2', MACAW2:'coins/centralamerica/macaw2', PARROT:'coins/centralamerica/parrot',
  SEMANA2:'coins/centralamerica/semana2', EASTER4:'coins/centralamerica/easter4', PROCESSION3:'coins/centralamerica/procession3', INCENSE4:'coins/centralamerica/incense4',
  COPAL:'coins/centralamerica/copal', MAIZE:'coins/centralamerica/maize', TORTILLA:'coins/centralamerica/tortilla', BEANS:'coins/centralamerica/beans',
  SPRINGCA:'coins/centralamerica/springca', RAINFOREST:'coins/centralamerica/rainforest', JAGUAR2:'coins/centralamerica/jaguar2', TAPIR:'coins/centralamerica/tapir',
  SLOTH2:'coins/centralamerica/sloth2', ANTEATER:'coins/centralamerica/anteater', IGUANA:'coins/centralamerica/iguana', GECKO:'coins/centralamerica/gecko',
  LABOURCA:'coins/centralamerica/labourca', MOTHERSMEX:'coins/centralamerica/mothersmex', CINCODEMAYO2:'coins/centralamerica/cincodemayo2', TEQUILA2:'coins/centralamerica/tequila2',
  MEZCAL2:'coins/centralamerica/mezcal2', MICHELADA:'coins/centralamerica/michelada', HORCHATA:'coins/centralamerica/horchata', AGUA:'coins/centralamerica/agua',
  SUMMERCA:'coins/centralamerica/summerca', HURRICANE2:'coins/centralamerica/hurricane2', TROPICALSTORM:'coins/centralamerica/tropicalstorm', RAINSEASON:'coins/centralamerica/rainseason',
  CACAO:'coins/centralamerica/cacao', CHOCOLATE2:'coins/centralamerica/chocolate2', VANILLA:'coins/centralamerica/vanilla', COFFEE2:'coins/centralamerica/coffee2',
  INDEPENDCA:'coins/centralamerica/independca', FLAGCA:'coins/centralamerica/flagca', VOLCANCA:'coins/centralamerica/volcanca', LAVA:'coins/centralamerica/lava',
  OBSIDIAN:'coins/centralamerica/obsidian', JADE:'coins/centralamerica/jade', MAYA:'coins/centralamerica/maya', AZTEC:'coins/centralamerica/aztec',
  HARVEST12:'coins/centralamerica/harvest12', CORN2:'coins/centralamerica/corn2', CHILI:'coins/centralamerica/chili', HABANERO:'coins/centralamerica/habanero',
  'JALAPEÑO':'coins/centralamerica/jalapeño', SALSA2:'coins/centralamerica/salsa2', GUACAMOLE2:'coins/centralamerica/guacamole2', NACHOS:'coins/centralamerica/nachos',
  INDEPENDMEX:'coins/centralamerica/independmex', GRITOMEX:'coins/centralamerica/gritomex', FLAGMEX:'coins/centralamerica/flagmex', EAGLE3:'coins/centralamerica/eagle3',
  SERPENT:'coins/centralamerica/serpent', CACTUS:'coins/centralamerica/cactus', AGAVE:'coins/centralamerica/agave', PULQUE:'coins/centralamerica/pulque',
  DAYOFDEADCA:'coins/centralamerica/dayofdeadca', CALAVERA2:'coins/centralamerica/calavera2', MARIGOLD2:'coins/centralamerica/marigold2', OFRENDA2:'coins/centralamerica/ofrenda2',
  SUGARSKULL:'coins/centralamerica/sugarskull', CATRINA:'coins/centralamerica/catrina', COPAL2:'coins/centralamerica/copal2', CANDLE4:'coins/centralamerica/candle4',
  ALLSAINTSCA:'coins/centralamerica/allsaintsca', ALLSOULSCA:'coins/centralamerica/allsoulsca', HARVEST13:'coins/centralamerica/harvest13', CORN3:'coins/centralamerica/corn3',
  TAMALE2:'coins/centralamerica/tamale2', POZOLE2:'coins/centralamerica/pozole2', ATOLE2:'coins/centralamerica/atole2', CHAMPURRADO:'coins/centralamerica/champurrado',
  POSADA:'coins/centralamerica/posada', PINATA2:'coins/centralamerica/pinata2', PONCHE:'coins/centralamerica/ponche', 'BUÑUELO':'coins/centralamerica/buñuelo',
  ROMERITOS:'coins/centralamerica/romeritos', BACALAO:'coins/centralamerica/bacalao', NEWYEARMEX:'coins/centralamerica/newyearmex', GRAPES12:'coins/centralamerica/grapes12',
};
function buildCentralAmericaSeasonal(): SeasonalGroup[] {
  return centralAmericaSeasonal.map((g) => ({
    label: g.label,
    coins: g.coins.map((c) => {
      const key = c.ticker.replace('$', '').toUpperCase();
      const slot = CENTRALAMERICA_IMAGES[key];
      return { ...c, image: slot ? `/airo-assets/images/${slot}` : c.image };
    }),
  }));
}

// ─── ARCTIC ───────────────────────────────────────────────────────────────────
const ARC = '_ARC';
const ARCTIC_IMAGES: Record<string, string> = {
  POLARNIGHT:'coins/arctic/polarnight', AURORA3:'coins/arctic/aurora3', NORTHERNLIGHTS:'coins/arctic/northernlights', IGLOO:'coins/arctic/igloo',
  POLARBEAR:'coins/arctic/polarbear', ARCTICFOX:'coins/arctic/arcticfox', SNOWYOWL:'coins/arctic/snowyowl', LEMMING:'coins/arctic/lemming',
  BLIZZARDARC:'coins/arctic/blizzardarc', WHITEOUT2:'coins/arctic/whiteout2', FROSTBITE2:'coins/arctic/frostbite2', HYPOTHERMIA:'coins/arctic/hypothermia',
  ICEFLOE:'coins/arctic/icefloe', ICEBERG:'coins/arctic/iceberg', WALRUS:'coins/arctic/walrus', NARWHAL:'coins/arctic/narwhal',
  EQUINOXARC:'coins/arctic/equinoxarc', FIRSTLIGHT:'coins/arctic/firstlight', SUNRETURN:'coins/arctic/sunreturn', SNOWMELT:'coins/arctic/snowmelt',
  ICEBREAK:'coins/arctic/icebreak', SEALCOIN:'coins/arctic/sealcoin', RINGEDSEAL:'coins/arctic/ringedseal', BELUGAS:'coins/arctic/belugas',
  SPRINGARC:'coins/arctic/springarc', SNOWGOOSE:'coins/arctic/snowgoose', MIGRATION2:'coins/arctic/migration2', TUNDRA2:'coins/arctic/tundra2',
  PERMAFROST:'coins/arctic/permafrost', MUSKOX:'coins/arctic/muskox', CARIBOU2:'coins/arctic/caribou2', REINDEER:'coins/arctic/reindeer',
  MIDNIGHTSUN:'coins/arctic/midnightsun', SUNDOG:'coins/arctic/sundog', ARCTICPOPPY:'coins/arctic/arcticpoppy', COTTONGRASS:'coins/arctic/cottongrass',
  LICHEN:'coins/arctic/lichen', MOSS:'coins/arctic/moss', PTARMIGAN:'coins/arctic/ptarmigan', PUFFIN:'coins/arctic/puffin',
  SOLSTICEARC:'coins/arctic/solsticearc', '24HRSUN':'coins/arctic/24hrsun', MIDNIGHTGLOW:'coins/arctic/midnightglow', ARCTICTERN:'coins/arctic/arctictern',
  ORCA:'coins/arctic/orca', BOWHEAD:'coins/arctic/bowhead', HUMPBACK:'coins/arctic/humpback', BELUGAS2:'coins/arctic/belugas2',
  SUMMARARC:'coins/arctic/summararc', ICECAP:'coins/arctic/icecap', GLACIERARC:'coins/arctic/glacierarc', FJORDARC:'coins/arctic/fjordarc',
  KAYAKARC:'coins/arctic/kayakarc', DOGSLEDARC:'coins/arctic/dogsledarc', SNOWMOBILE:'coins/arctic/snowmobile', SKIDOO:'coins/arctic/skidoo',
  HARVESTARC:'coins/arctic/harvestarc', BERRYARC:'coins/arctic/berryarc', CLOUDBERRY:'coins/arctic/cloudberry', CROWBERRY:'coins/arctic/crowberry',
  LINGONBERRY:'coins/arctic/lingonberry', INUIT:'coins/arctic/inuit', KAYUMAQ:'coins/arctic/kayumaq', MUKTUK:'coins/arctic/muktuk',
  AUTUMNARC:'coins/arctic/autumnarc', TUNDRAFALL:'coins/arctic/tundrafall', FIRSTSNOW:'coins/arctic/firstsnow', FREEZEUP:'coins/arctic/freezeup',
  ARCTICCHAR:'coins/arctic/arcticchar', SALMON2:'coins/arctic/salmon2', FISHING3:'coins/arctic/fishing3', NETTING:'coins/arctic/netting',
  POLARNIGHT2:'coins/arctic/polarnight2', AURORA4:'coins/arctic/aurora4', GREENAURORA:'coins/arctic/greenaurora', REDAURORA:'coins/arctic/redaurora',
  ICEFORMING:'coins/arctic/iceforming', FRAZIL:'coins/arctic/frazil', PANCAKEICE:'coins/arctic/pancakeice', SEAICE:'coins/arctic/seaice',
  DARKSEASON:'coins/arctic/darkseason', CANDLEARC:'coins/arctic/candlearc', WARMTHARC:'coins/arctic/warmtharc', FIREARC:'coins/arctic/firearc',
  POLARNIGHTFULL:'coins/arctic/polarnightfull', STARFIELD:'coins/arctic/starfield', METEORARC:'coins/arctic/meteorarc', COSMOSARC:'coins/arctic/cosmosarc',
  XMASARC:'coins/arctic/xmasarc', SANTAARC:'coins/arctic/santaarc', REINDEEARC:'coins/arctic/reindeearc', ELFARC:'coins/arctic/elfarc',
  NEWYEARARC:'coins/arctic/newyeararc', FIREWORKSARC:'coins/arctic/fireworksarc', AURORANYE:'coins/arctic/auroranye', POLARSOLSTICE:'coins/arctic/polarsolstice',
};
function buildArcticSeasonal(): SeasonalGroup[] {
  return arcticSeasonal.map((g) => ({
    label: g.label,
    coins: g.coins.map((c) => {
      const key = c.ticker.replace('$', '').toUpperCase();
      const slot = ARCTIC_IMAGES[key];
      return { ...c, image: slot ? `/airo-assets/images/${slot}` : c.image };
    }),
  }));
}

// ─── ANTARCTICA ───────────────────────────────────────────────────────────────
const ANT = '_ANT';
const ANTARCTICA_IMAGES: Record<string, string> = {
  MIDSUMMERANT:'coins/antarctica/midsummerant', PENGUIN:'coins/antarctica/penguin', EMPEROR:'coins/antarctica/emperor', ADELIE:'coins/antarctica/adelie',
  CHINSTRAP:'coins/antarctica/chinstrap', GENTOO:'coins/antarctica/gentoo', ROOKERY:'coins/antarctica/rookery', ICESHELF:'coins/antarctica/iceshelf',
  GLACIERANT:'coins/antarctica/glacierant', ICEBERGANT:'coins/antarctica/icebergant', BLUEICE:'coins/antarctica/blueice', CREVASSE:'coins/antarctica/crevasse',
  LEOPARDSEAL:'coins/antarctica/leopardseal', WEDDELLSEAL:'coins/antarctica/weddellseal', CRABEATERSEAL:'coins/antarctica/crabeaterseal', FURSEALS:'coins/antarctica/furseals',
  AUTUMNANT:'coins/antarctica/autumnant', SEAICEANT:'coins/antarctica/seaiceant', FREEZEANT:'coins/antarctica/freezeant', KRILL:'coins/antarctica/krill',
  ICEFISH:'coins/antarctica/icefish', TOOTHFISH:'coins/antarctica/toothfish', SQUID:'coins/antarctica/squid', ALBATROSS:'coins/antarctica/albatross',
  POLARNIGHT3:'coins/antarctica/polarnight3', AURORA5:'coins/antarctica/aurora5', SOUTHERNLIGHTS:'coins/antarctica/southernlights', BLIZZARANT:'coins/antarctica/blizzarant',
  WHITEOUTANT:'coins/antarctica/whiteoutant', WINDANT:'coins/antarctica/windant', KATABATIC:'coins/antarctica/katabatic', VORTEXANT:'coins/antarctica/vortexant',
  DARKANT:'coins/antarctica/darkant', MIDNIGHTANT:'coins/antarctica/midnightant', STARFIELDANT:'coins/antarctica/starfieldant', MILKYWAYANT:'coins/antarctica/milkywayant',
  SOUTHPOLE:'coins/antarctica/southpole', POLECOIN:'coins/antarctica/polecoin', AMUNDSEN:'coins/antarctica/amundsen', SCOTT:'coins/antarctica/scott',
  SOLSTICEANT:'coins/antarctica/solsticeant', MIDWINTERANT:'coins/antarctica/midwinterant', DARKESTDAY:'coins/antarctica/darkestday', CANDLEANT:'coins/antarctica/candleant',
  RESEARCHANT:'coins/antarctica/researchant', SCIENCEANT:'coins/antarctica/scienceant', TELESCOPE:'coins/antarctica/telescope', COSMOSANT:'coins/antarctica/cosmosant',
  WINTERANT:'coins/antarctica/winterant', STORMANT:'coins/antarctica/stormant', HURRICANEANT:'coins/antarctica/hurricaneant', GALEANT:'coins/antarctica/galeant',
  ICECRACK:'coins/antarctica/icecrack', CALVING:'coins/antarctica/calving', ICEFALL:'coins/antarctica/icefall', MELTPOND:'coins/antarctica/meltpond',
  SPRINGANT:'coins/antarctica/springant', FIRSTLIGHTANT:'coins/antarctica/firstlightant', SUNRISEANT:'coins/antarctica/sunriseant', THAWANT:'coins/antarctica/thawant',
  SNOWPETREL:'coins/antarctica/snowpetrel', SKUA:'coins/antarctica/skua', SHEATHBILL:'coins/antarctica/sheathbill', PRION:'coins/antarctica/prion',
  EQUINOXANT:'coins/antarctica/equinoxant', OZONEHOLECOIN:'coins/antarctica/ozoneholecoin', ICEMELTS:'coins/antarctica/icemelts', MELTWATER:'coins/antarctica/meltwater',
  HUMPBACKANT:'coins/antarctica/humpbackant', MINKEWHALE:'coins/antarctica/minkewhale', BLUEWHALE:'coins/antarctica/bluewhale', SPERMWHALE:'coins/antarctica/spermwhale',
  SUMMERANT:'coins/antarctica/summerant', PENGUINCHICK:'coins/antarctica/penguinchick', EGGANT:'coins/antarctica/eggant', NESTANT:'coins/antarctica/nestant',
  ICEBREAKER:'coins/antarctica/icebreaker', EXPEDITION:'coins/antarctica/expedition', EXPLORER:'coins/antarctica/explorer', SHACKLETON:'coins/antarctica/shackleton',
  MIDSUMMERANT2:'coins/antarctica/midsummerant2', LONGDAYANT:'coins/antarctica/longdayant', SUNBURNANT:'coins/antarctica/sunburnant', UVANT:'coins/antarctica/uvant',
  ICECAVEANT:'coins/antarctica/icecaveant', CRYSTALANT:'coins/antarctica/crystalant', SNOWCRYSTAL:'coins/antarctica/snowcrystal', PRISMANT:'coins/antarctica/prismant',
  XMASANT:'coins/antarctica/xmasant', PENGUINXMAS:'coins/antarctica/penguinxmas', NEWYEARANT:'coins/antarctica/newyearant', FIREWORKSANT:'coins/antarctica/fireworksant',
  MIDNIGHTSUNANT:'coins/antarctica/midnightsunant', AURORAANT:'coins/antarctica/auroraant', SOLSTICEANT2:'coins/antarctica/solsticeant2', POLARSOLANT:'coins/antarctica/polarsolant',
};
function buildAntarcticaSeasonal(): SeasonalGroup[] {
  return antarcticaSeasonal.map((g) => ({
    label: g.label,
    coins: g.coins.map((c) => {
      const key = c.ticker.replace('$', '').toUpperCase();
      const slot = ANTARCTICA_IMAGES[key];
      return { ...c, image: slot ? `/airo-assets/images/${slot}` : c.image };
    }),
  }));
}

// ─── OCEANIA ──────────────────────────────────────────────────────────────────
const oceaniaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$NEWYEAROC',   'New Year OC',       OC), sc('$HEATOC',     'Summer Heat',      OC),
    sc('$CICADA2',     'Cicada',            OC), sc('$TIKI',       'Tiki',             OC),
    sc('$LUAU',        'Luau',              OC), sc('$UKULELE',    'Ukulele',          OC),
    sc('$HULA',        'Hula',              OC), sc('$LEI',        'Lei',              OC),
  ]},
  { label: 'February', coins: [
    sc('$VALENTINEOC', 'Valentine OC',      OC), sc('$TROPICOC',   'Tropical',         OC),
    sc('$HIBISCUS',    'Hibiscus',          OC), sc('$FRANGIPANI', 'Frangipani',       OC),
    sc('$COCONUT',     'Coconut',           OC), sc('$MANGO2',     'Mango',            OC),
    sc('$PAPAYA',      'Papaya',            OC), sc('$PASSIONFRUIT','Passionfruit',     OC),
  ]},
  { label: 'March', coins: [
    sc('$CYCLONE',     'Cyclone',           OC), sc('$MONSOONOC',  'Monsoon',          OC),
    sc('$RAINBOWOC',   'Rainbow',           OC), sc('$WETSEASON',  'Wet Season',       OC),
    sc('$MUDOC',       'Mud',               OC), sc('$FLOODOC',    'Flood',            OC),
    sc('$CROC',        'Crocodile',         OC), sc('$CASSOWARY2', 'Cassowary',        OC),
  ]},
  { label: 'April', coins: [
    sc('$ANZAC2',      'ANZAC',             OC), sc('$POPPYOC',    'Poppy',            OC),
    sc('$AUTUMNOC',    'Autumn',            OC), sc('$HARVESTOC',  'Harvest',          OC),
    sc('$KIWI2',       'Kiwi',              OC), sc('$MAORI',      'Maori',            OC),
    sc('$HAKA',        'Haka',              OC), sc('$GREENSTONE', 'Greenstone',       OC),
  ]},
  { label: 'May', coins: [
    sc('$MOTHEROC',    'Mothers Day OC',    OC), sc('$COOLOC',     'Cool Change',      OC),
    sc('$SURFOC',      'Surf',              OC), sc('$WAVEOC',     'Wave',             OC),
    sc('$REEF',        'Reef',              OC), sc('$CORAL',      'Coral',            OC),
    sc('$TURTLE',      'Sea Turtle',        OC), sc('$MANTA',      'Manta Ray',        OC),
  ]},
  { label: 'June', coins: [
    sc('$WINTEROC',    'Winter OC',         OC), sc('$MATARIKI',   'Matariki',         OC),
    sc('$STAROC',      'Stars',             OC), sc('$PLEIADES',   'Pleiades',         OC),
    sc('$MAORISTAR',   'Maori Star',        OC), sc('$HANGI',      'Hangi',            OC),
    sc('$KUMARA',      'Kumara',            OC), sc('$PAVLOVAOC',  'Pavlova OC',       OC),
  ]},
  { label: 'July', coins: [
    sc('$MIDWINTEROC', 'Mid Winter OC',     OC), sc('$FIREOC',     'Fire',             OC),
    sc('$WHALERIDER',  'Whale Rider',       OC), sc('$WHALE',      'Whale',            OC),
    sc('$DOLPHIN',     'Dolphin',           OC), sc('$SHARK',      'Shark',            OC),
    sc('$OCTOPUS',     'Octopus',           OC), sc('$CRAB',       'Crab',             OC),
  ]},
  { label: 'August', coins: [
    sc('$FATHEROC',    'Fathers Day OC',    OC), sc('$RUGBYOC',    'Rugby',            OC),
    sc('$ALLBLACKS',   'All Blacks',        OC), sc('$HAKA2',      'Haka 2',           OC),
    sc('$CRICKET2',    'Cricket OC',        OC), sc('$NETBALL',    'Netball',          OC),
    sc('$AUSSIERULES', 'Aussie Rules',      OC), sc('$FOOTY2',     'Footy OC',         OC),
  ]},
  { label: 'September', coins: [
    sc('$SPRINGOC',    'Spring OC',         OC), sc('$BLOSSOMOC',  'Blossom',          OC),
    sc('$WATTLEOC',    'Wattle',            OC), sc('$KOWHAI',     'Kowhai',           OC),
    sc('$POHUTUKAWA',  'Pohutukawa',        OC), sc('$KAKAPO',     'Kakapo',           OC),
    sc('$KOOKABURRA',  'Kookaburra',        OC), sc('$TUATARA',    'Tuatara',          OC),
  ]},
  { label: 'October', coins: [
    sc('$HALLOWEENOC', 'Halloween OC',      OC), sc('$PUMPKINOC',  'Pumpkin OC',       OC),
    sc('$SUMMEROC',    'Summer OC',         OC), sc('$BEACHOC',    'Beach OC',         OC),
    sc('$BBQOC',       'BBQ OC',            OC), sc('$PRAWNSOC',   'Prawns OC',        OC),
    sc('$COLDONEOC',   'Cold One OC',       OC), sc('$SNAGOC',     'Snag OC',          OC),
  ]},
  { label: 'November', coins: [
    sc('$MELBCUPOC',   'Melbourne Cup OC',  OC), sc('$PUNTEROC',   'Punter OC',        OC),
    sc('$BUSHFIREOC',  'Bushfire OC',       OC), sc('$HAZARDOC',   'Hazard OC',        OC),
    sc('$HEATWAVEOC',  'Heatwave OC',       OC), sc('$SUNSCREENOC','Sunscreen OC',     OC),
    sc('$SLIPOC',      'Slip Slop OC',      OC), sc('$UVOC',       'UV OC',            OC),
  ]},
  { label: 'December', coins: [
    sc('$XMASOC',      'Xmas OC',           OC), sc('$BEACHXMASOC','Beach Xmas OC',    OC),
    sc('$BONDIOC',     'Bondi OC',          OC), sc('$PRAWNSOC2',  'Prawns 2 OC',      OC),
    sc('$COLDONEOC2',  'Cold One 2 OC',     OC), sc('$SUMMERFUNOC','Summer Fun OC',    OC),
    sc('$NEWYEARSYDOC','New Year Syd OC',   OC), sc('$FIREWORKSOC','Fireworks OC',     OC),
  ]},
];

// ─── NORTH AMERICA ────────────────────────────────────────────────────────────
const NA = '_NA';
const northAmericaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$NEWYEARNA',   'New Year NA',       NA), sc('$BLIZZARDNA', 'Blizzard',         NA),
    sc('$SNOWSTORM',   'Snowstorm',         NA), sc('$ICESTORM',   'Ice Storm',        NA),
    sc('$MOOSE',       'Moose',             NA), sc('$BEAVER',     'Beaver',           NA),
    sc('$MAPLE',       'Maple',             NA), sc('$HOCKEY',     'Hockey',           NA),
  ]},
  { label: 'February', coins: [
    sc('$VALENTINENA', 'Valentine NA',      NA), sc('$GROUNDHOGNA','Groundhog',        NA),
    sc('$POUTINE',     'Poutine',           NA), sc('$TIMBITS',    'Timbits',          NA),
    sc('$NANAIMO',     'Nanaimo Bar',       NA), sc('$BEAVERTAIL', 'Beaver Tail',      NA),
    sc('$TOURTIERE',   'Tourtière',         NA), sc('$ICEWINE',    'Ice Wine',         NA),
  ]},
  { label: 'March', coins: [
    sc('$STPADDYNA',   'St Paddys NA',      NA), sc('$SUGARBUSH',  'Sugar Bush',       NA),
    sc('$MAPLESYRUP',  'Maple Syrup',       NA), sc('$SUGARING',   'Sugaring Off',     NA),
    sc('$CABANE',      'Cabane à Sucre',    NA), sc('$TAFFY',      'Maple Taffy',      NA),
    sc('$BREAKUPNA',   'Spring Breakup',    NA), sc('$THAWNA',     'Thaw',             NA),
  ]},
  { label: 'April', coins: [
    sc('$EASTERCAN',   'Easter CAN',        NA), sc('$TULIPFEST',  'Tulip Festival',   NA),
    sc('$LOON',        'Loon',              NA), sc('$CANUCK',     'Canuck',           NA),
    sc('$VICTORIA',    'Victoria Day',      NA), sc('$FIREWORKSNA','Fireworks NA',     NA),
    sc('$MOUNTIE',     'Mountie',           NA), sc('$RCMP',       'RCMP',             NA),
  ]},
  { label: 'May', coins: [
    sc('$VICTORIANA',  'Victoria Day',      NA), sc('$MOTHERCAN',  'Mothers Day CAN',  NA),
    sc('$CAMPING',     'Camping',           NA), sc('$CANOE',      'Canoe',            NA),
    sc('$KAYAK',       'Kayak',             NA), sc('$FISHING2',   'Fishing',          NA),
    sc('$BEAR',        'Bear',              NA), sc('$WOLF2',      'Wolf',             NA),
  ]},
  { label: 'June', coins: [
    sc('$CANADADAY',   'Canada Day',        NA), sc('$LEAFS',      'Maple Leaf',       NA),
    sc('$PRIDE2',      'Pride NA',          NA), sc('$FATHERCAN',  'Fathers Day CAN',  NA),
    sc('$NATIONALCAN', 'National Day',      NA), sc('$REDWHITE',   'Red & White',      NA),
    sc('$FIREWORKSCAN','Fireworks CAN',     NA), sc('$BBQCAN',     'BBQ CAN',          NA),
  ]},
  { label: 'July', coins: [
    sc('$SUMMERNA',    'Summer NA',         NA), sc('$LAKENA',     'Lake',             NA),
    sc('$COTTAGNA',    'Cottage',           NA), sc('$DOCKNA',     'Dock',             NA),
    sc('$LOONIECOIN',  'Loonie',            NA), sc('$TOONIECOIN', 'Toonie',           NA),
    sc('$TIMMIES',     'Timmies',           NA), sc('$ROLLUPRIM',  'Roll Up The Rim',  NA),
  ]},
  { label: 'August', coins: [
    sc('$STAMPEDE',    'Stampede',          NA), sc('$RODEO2',     'Rodeo',            NA),
    sc('$COWBOY2',     'Cowboy',            NA), sc('$CHUCKWAGON', 'Chuckwagon',       NA),
    sc('$CARIBOU',     'Caribou',           NA), sc('$BISON',      'Bison',            NA),
    sc('$GRIZZLY',     'Grizzly',           NA), sc('$EAGLE2',     'Eagle',            NA),
  ]},
  { label: 'September', coins: [
    sc('$LABOURCAN',   'Labour Day CAN',    NA), sc('$FALLNA',     'Fall',             NA),
    sc('$MAPLELEAF2',  'Maple Leaf 2',      NA), sc('$FALLCOLOURS','Fall Colours',     NA),
    sc('$HARVEST11',   'Harvest',           NA), sc('$PUMPKINNA',  'Pumpkin NA',       NA),
    sc('$APPLENA',     'Apple',             NA), sc('$CIDERNA',    'Cider',            NA),
  ]},
  { label: 'October', coins: [
    sc('$THANKSGIVCAN','Thanksgiving CAN',  NA), sc('$HALLOWEENNA','Halloween NA',     NA),
    sc('$TURKEYCAN',   'Turkey CAN',        NA), sc('$STUFFINGCAN','Stuffing CAN',     NA),
    sc('$PUMPKINPIE2', 'Pumpkin Pie',       NA), sc('$CRANBERRY2', 'Cranberry',        NA),
    sc('$CORNMAZE',    'Corn Maze',         NA), sc('$SCARECROW2', 'Scarecrow',        NA),
  ]},
  { label: 'November', coins: [
    sc('$REMEMBRCAN',  'Remembrance CAN',   NA), sc('$POPPYCAN',   'Poppy CAN',        NA),
    sc('$SNOWNA',      'Snow',              NA), sc('$BLIZZARDNA2','Blizzard 2',       NA),
    sc('$HOCKEYNIGHT', 'Hockey Night',      NA), sc('$CURLING',    'Curling',          NA),
    sc('$SKATING',     'Skating',           NA), sc('$TOBOGGANNA', 'Toboggan',         NA),
  ]},
  { label: 'December', coins: [
    sc('$XMASCAN',     'Xmas CAN',          NA), sc('$BOXINGDAY',  'Boxing Day',       NA),
    sc('$NEWYEARVANCOUVER','New Year Van',  NA), sc('$NEWYEARTORONTO','New Year Tor',  NA),
    sc('$SNOWFLAKENA', 'Snowflake',         NA), sc('$IGLOOCAN',   'Igloo',            NA),
    sc('$DOGSLED',     'Dog Sled',          NA), sc('$AURORA2',    'Aurora',           NA),
  ]},
];

// ─── CENTRAL AMERICA ─────────────────────────────────────────────────────────
const centralAmericaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$NEWYEARCA',   'New Year CA',       CA), sc('$TAMALE',     'Tamale',           CA),
    sc('$POZOLE',      'Pozole',            CA), sc('$ATOLE',      'Atole',            CA),
    sc('$PIÑATA',      'Piñata',            CA), sc('$MARIACHI',   'Mariachi',         CA),
    sc('$SOMBRERO',    'Sombrero',          CA), sc('$SERAPE',      'Serape',           CA),
  ]},
  { label: 'February', coins: [
    sc('$VALENTINECA', 'Valentine CA',      CA), sc('$CARNIVALCA', 'Carnival CA',      CA),
    sc('$MASKCARNIVAL','Mask Carnival',     CA), sc('$MARIMBA',    'Marimba',          CA),
    sc('$QUETZAL',     'Quetzal',           CA), sc('$TOUCAN2',    'Toucan',           CA),
    sc('$MACAW2',      'Macaw',             CA), sc('$PARROT',     'Parrot',           CA),
  ]},
  { label: 'March', coins: [
    sc('$SEMANA2',     'Semana Santa CA',   CA), sc('$EASTER4',    'Easter CA',        CA),
    sc('$PROCESSION3', 'Procession CA',     CA), sc('$INCENSE4',   'Incense CA',       CA),
    sc('$COPAL',       'Copal',             CA), sc('$MAIZE',      'Maize',            CA),
    sc('$TORTILLA',    'Tortilla',          CA), sc('$BEANS',      'Beans',            CA),
  ]},
  { label: 'April', coins: [
    sc('$SPRINGCA',    'Spring CA',         CA), sc('$RAINFOREST', 'Rainforest',       CA),
    sc('$JAGUAR2',     'Jaguar',            CA), sc('$TAPIR',      'Tapir',            CA),
    sc('$SLOTH2',      'Sloth',             CA), sc('$ANTEATER',   'Anteater',         CA),
    sc('$IGUANA',      'Iguana',            CA), sc('$GECKO',      'Gecko',            CA),
  ]},
  { label: 'May', coins: [
    sc('$LABOURCA',    'Labour Day CA',     CA), sc('$MOTHERSMEX', 'Mothers Day MEX',  CA),
    sc('$CINCODEMAYO2','Cinco de Mayo',     CA), sc('$TEQUILA2',   'Tequila',          CA),
    sc('$MEZCAL2',     'Mezcal',            CA), sc('$MICHELADA',  'Michelada',        CA),
    sc('$HORCHATA',    'Horchata',          CA), sc('$AGUA',       'Agua Fresca',      CA),
  ]},
  { label: 'June', coins: [
    sc('$SUMMERCA',    'Summer CA',         CA), sc('$HURRICANE2', 'Hurricane',        CA),
    sc('$TROPICALSTORM','Tropical Storm',   CA), sc('$RAINSEASON', 'Rain Season',      CA),
    sc('$CACAO',       'Cacao',             CA), sc('$CHOCOLATE2', 'Chocolate',        CA),
    sc('$VANILLA',     'Vanilla',           CA), sc('$COFFEE2',    'Coffee',           CA),
  ]},
  { label: 'July', coins: [
    sc('$INDEPENDCA',  'Independence CA',   CA), sc('$FLAGCA',     'Flag CA',          CA),
    sc('$VOLCANCA',    'Volcano',           CA), sc('$LAVA',       'Lava',             CA),
    sc('$OBSIDIAN',    'Obsidian',          CA), sc('$JADE',       'Jade',             CA),
    sc('$MAYA',        'Maya',              CA), sc('$AZTEC',      'Aztec',            CA),
  ]},
  { label: 'August', coins: [
    sc('$HARVEST12',   'Harvest CA',        CA), sc('$CORN2',      'Corn',             CA),
    sc('$CHILI',       'Chili',             CA), sc('$HABANERO',   'Habanero',         CA),
    sc('$JALAPEÑO',    'Jalapeño',          CA), sc('$SALSA2',     'Salsa CA',         CA),
    sc('$GUACAMOLE2',  'Guacamole',         CA), sc('$NACHOS',     'Nachos',           CA),
  ]},
  { label: 'September', coins: [
    sc('$INDEPENDMEX', 'Independence MEX',  CA), sc('$GRITOMEX',   'El Grito',         CA),
    sc('$FLAGMEX',     'Flag MEX',          CA), sc('$EAGLE3',     'Eagle MEX',        CA),
    sc('$SERPENT',     'Serpent',           CA), sc('$CACTUS',     'Cactus',           CA),
    sc('$AGAVE',       'Agave',             CA), sc('$PULQUE',     'Pulque',           CA),
  ]},
  { label: 'October', coins: [
    sc('$DAYOFDEADCA', 'Day of Dead CA',    CA), sc('$CALAVERA2',  'Calavera',         CA),
    sc('$MARIGOLD2',   'Marigold',          CA), sc('$OFRENDA2',   'Ofrenda',          CA),
    sc('$SUGARSKULL',  'Sugar Skull',       CA), sc('$CATRINA',    'Catrina',          CA),
    sc('$COPAL2',      'Copal 2',           CA), sc('$CANDLE4',    'Candle CA',        CA),
  ]},
  { label: 'November', coins: [
    sc('$ALLSAINTSCA', 'All Saints CA',     CA), sc('$ALLSOULSCA', 'All Souls CA',     CA),
    sc('$HARVEST13',   'Harvest 2 CA',      CA), sc('$CORN3',      'Corn 2',           CA),
    sc('$TAMALE2',     'Tamale 2',          CA), sc('$POZOLE2',    'Pozole 2',         CA),
    sc('$ATOLE2',      'Atole 2',           CA), sc('$CHAMPURRADO','Champurrado',      CA),
  ]},
  { label: 'December', coins: [
    sc('$POSADA',      'Las Posadas',       CA), sc('$PINATA2',    'Piñata 2',         CA),
    sc('$PONCHE',      'Ponche',            CA), sc('$BUÑUELO',    'Buñuelo',          CA),
    sc('$ROMERITOS',   'Romeritos',         CA), sc('$BACALAO',    'Bacalao',          CA),
    sc('$NEWYEARMEX',  'New Year MEX',      CA), sc('$GRAPES12',   '12 Grapes',        CA),
  ]},
];

// ─── ARCTIC ───────────────────────────────────────────────────────────────────
const arcticSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$POLARNIGHT',  'Polar Night',       ARC), sc('$AURORA3',   'Aurora',           ARC),
    sc('$NORTHERNLIGHTS','Northern Lights', ARC), sc('$IGLOO',     'Igloo',            ARC),
    sc('$POLARBEAR',   'Polar Bear',        ARC), sc('$ARCTICFOX', 'Arctic Fox',       ARC),
    sc('$SNOWYOWL',    'Snowy Owl',         ARC), sc('$LEMMING',   'Lemming',          ARC),
  ]},
  { label: 'February', coins: [
    sc('$BLIZZARDARC', 'Blizzard ARC',      ARC), sc('$WHITEOUT2', 'Whiteout',         ARC),
    sc('$FROSTBITE2',  'Frostbite',         ARC), sc('$HYPOTHERMIA','Hypothermia',     ARC),
    sc('$ICEFLOE',     'Ice Floe',          ARC), sc('$ICEBERG',   'Iceberg',          ARC),
    sc('$WALRUS',      'Walrus',            ARC), sc('$NARWHAL',   'Narwhal',          ARC),
  ]},
  { label: 'March', coins: [
    sc('$EQUINOXARC',  'Equinox ARC',       ARC), sc('$FIRSTLIGHT','First Light',      ARC),
    sc('$SUNRETURN',   'Sun Return',        ARC), sc('$SNOWMELT',  'Snow Melt',        ARC),
    sc('$ICEBREAK',    'Ice Break',         ARC), sc('$SEALCOIN',  'Seal',             ARC),
    sc('$RINGEDSEAL',  'Ringed Seal',       ARC), sc('$BELUGAS',   'Beluga',           ARC),
  ]},
  { label: 'April', coins: [
    sc('$SPRINGARC',   'Spring ARC',        ARC), sc('$SNOWGOOSE', 'Snow Goose',       ARC),
    sc('$MIGRATION2',  'Migration',         ARC), sc('$TUNDRA2',   'Tundra',           ARC),
    sc('$PERMAFROST',  'Permafrost',        ARC), sc('$MUSKOX',    'Musk Ox',          ARC),
    sc('$CARIBOU2',    'Caribou',           ARC), sc('$REINDEER',  'Reindeer',         ARC),
  ]},
  { label: 'May', coins: [
    sc('$MIDNIGHTSUN', 'Midnight Sun',      ARC), sc('$SUNDOG',    'Sun Dog',          ARC),
    sc('$ARCTICPOPPY', 'Arctic Poppy',      ARC), sc('$COTTONGRASS','Cotton Grass',    ARC),
    sc('$LICHEN',      'Lichen',            ARC), sc('$MOSS',      'Moss',             ARC),
    sc('$PTARMIGAN',   'Ptarmigan',         ARC), sc('$PUFFIN',    'Puffin',           ARC),
  ]},
  { label: 'June', coins: [
    sc('$SOLSTICEARC', 'Solstice ARC',      ARC), sc('$24HRSUN',   '24hr Sun',         ARC),
    sc('$MIDNIGHTGLOW','Midnight Glow',     ARC), sc('$ARCTICTERN','Arctic Tern',      ARC),
    sc('$ORCA',        'Orca',              ARC), sc('$BOWHEAD',   'Bowhead Whale',    ARC),
    sc('$HUMPBACK',    'Humpback',          ARC), sc('$BELUGAS2',  'Beluga 2',         ARC),
  ]},
  { label: 'July', coins: [
    sc('$SUMMARARC',   'Summer ARC',        ARC), sc('$ICECAP',    'Ice Cap',          ARC),
    sc('$GLACIERARC',  'Glacier',           ARC), sc('$FJORDARC',  'Fjord',            ARC),
    sc('$KAYAKARC',    'Kayak',             ARC), sc('$DOGSLEDARC','Dog Sled',         ARC),
    sc('$SNOWMOBILE',  'Snowmobile',        ARC), sc('$SKIDOO',    'Skidoo',           ARC),
  ]},
  { label: 'August', coins: [
    sc('$HARVESTARC',  'Harvest ARC',       ARC), sc('$BERRYARC',  'Berry',            ARC),
    sc('$CLOUDBERRY',  'Cloudberry',        ARC), sc('$CROWBERRY', 'Crowberry',        ARC),
    sc('$LINGONBERRY', 'Lingonberry',       ARC), sc('$INUIT',     'Inuit',            ARC),
    sc('$KAYUMAQ',     'Kayumaq',           ARC), sc('$MUKTUK',    'Muktuk',           ARC),
  ]},
  { label: 'September', coins: [
    sc('$AUTUMNARC',   'Autumn ARC',        ARC), sc('$TUNDRAFALL','Tundra Fall',      ARC),
    sc('$FIRSTSNOW',   'First Snow',        ARC), sc('$FREEZEUP',  'Freeze Up',        ARC),
    sc('$ARCTICCHAR',  'Arctic Char',       ARC), sc('$SALMON2',   'Salmon',           ARC),
    sc('$FISHING3',    'Fishing ARC',       ARC), sc('$NETTING',   'Netting',          ARC),
  ]},
  { label: 'October', coins: [
    sc('$POLARNIGHT2', 'Polar Night 2',     ARC), sc('$AURORA4',   'Aurora 2',         ARC),
    sc('$GREENAURORA', 'Green Aurora',      ARC), sc('$REDAURORA', 'Red Aurora',       ARC),
    sc('$ICEFORMING',  'Ice Forming',       ARC), sc('$FRAZIL',    'Frazil Ice',       ARC),
    sc('$PANCAKEICE',  'Pancake Ice',       ARC), sc('$SEAICE',    'Sea Ice',          ARC),
  ]},
  { label: 'November', coins: [
    sc('$DARKSEASON',  'Dark Season',       ARC), sc('$CANDLEARC', 'Candle ARC',       ARC),
    sc('$WARMTHARC',   'Warmth',            ARC), sc('$FIREARC',   'Fire',             ARC),
    sc('$POLARNIGHTFULL','Full Polar Night', ARC), sc('$STARFIELD', 'Starfield',        ARC),
    sc('$METEORARC',   'Meteor',            ARC), sc('$COSMOSARC', 'Cosmos',           ARC),
  ]},
  { label: 'December', coins: [
    sc('$XMASARC',     'Xmas ARC',          ARC), sc('$SANTAARC',  'Santa',            ARC),
    sc('$REINDEEARC',  'Reindeer ARC',      ARC), sc('$ELFARC',    'Elf ARC',          ARC),
    sc('$NEWYEARARC',  'New Year ARC',      ARC), sc('$FIREWORKSARC','Fireworks ARC',  ARC),
    sc('$AURORANYE',   'Aurora NYE',        ARC), sc('$POLARSOLSTICE','Polar Solstice', ARC),
  ]},
];

// ─── ANTARCTICA ───────────────────────────────────────────────────────────────
const antarcticaSeasonal: SeasonalGroup[] = [
  { label: 'January', coins: [
    sc('$MIDSUMMERANT','Mid Summer ANT',    ANT), sc('$PENGUIN',   'Penguin',          ANT),
    sc('$EMPEROR',     'Emperor Penguin',   ANT), sc('$ADELIE',    'Adelie Penguin',   ANT),
    sc('$CHINSTRAP',   'Chinstrap',         ANT), sc('$GENTOO',    'Gentoo',           ANT),
    sc('$ROOKERY',     'Rookery',           ANT), sc('$ICESHELF',  'Ice Shelf',        ANT),
  ]},
  { label: 'February', coins: [
    sc('$GLACIERANT',  'Glacier ANT',       ANT), sc('$ICEBERGANT','Iceberg ANT',      ANT),
    sc('$BLUEICE',     'Blue Ice',          ANT), sc('$CREVASSE',  'Crevasse',         ANT),
    sc('$LEOPARDSEAL', 'Leopard Seal',      ANT), sc('$WEDDELLSEAL','Weddell Seal',    ANT),
    sc('$CRABEATERSEAL','Crabeater Seal',   ANT), sc('$FURSEALS',  'Fur Seals',        ANT),
  ]},
  { label: 'March', coins: [
    sc('$AUTUMNANT',   'Autumn ANT',        ANT), sc('$SEAICEANT', 'Sea Ice ANT',      ANT),
    sc('$FREEZEANT',   'Freeze ANT',        ANT), sc('$KRILL',     'Krill',            ANT),
    sc('$ICEFISH',     'Ice Fish',          ANT), sc('$TOOTHFISH', 'Toothfish',        ANT),
    sc('$SQUID',       'Squid',             ANT), sc('$ALBATROSS', 'Albatross',        ANT),
  ]},
  { label: 'April', coins: [
    sc('$POLARNIGHT3', 'Polar Night ANT',   ANT), sc('$AURORA5',   'Aurora ANT',       ANT),
    sc('$SOUTHERNLIGHTS','Southern Lights', ANT), sc('$BLIZZARANT','Blizzard ANT',     ANT),
    sc('$WHITEOUTANT', 'Whiteout ANT',      ANT), sc('$WINDANT',   'Wind ANT',         ANT),
    sc('$KATABATIC',   'Katabatic Wind',    ANT), sc('$VORTEXANT', 'Vortex',           ANT),
  ]},
  { label: 'May', coins: [
    sc('$DARKANT',     'Dark ANT',          ANT), sc('$MIDNIGHTANT','Midnight ANT',    ANT),
    sc('$STARFIELDANT','Starfield ANT',     ANT), sc('$MILKYWAYANT','Milky Way ANT',   ANT),
    sc('$SOUTHPOLE',   'South Pole',        ANT), sc('$POLECOIN',  'Pole Coin',        ANT),
    sc('$AMUNDSEN',    'Amundsen',          ANT), sc('$SCOTT',     'Scott',            ANT),
  ]},
  { label: 'June', coins: [
    sc('$SOLSTICEANT', 'Solstice ANT',      ANT), sc('$MIDWINTERANT','Mid Winter ANT', ANT),
    sc('$DARKESTDAY',  'Darkest Day',       ANT), sc('$CANDLEANT', 'Candle ANT',       ANT),
    sc('$RESEARCHANT', 'Research Station',  ANT), sc('$SCIENCEANT','Science ANT',      ANT),
    sc('$TELESCOPE',   'Telescope',         ANT), sc('$COSMOSANT', 'Cosmos ANT',       ANT),
  ]},
  { label: 'July', coins: [
    sc('$WINTERANT',   'Winter ANT',        ANT), sc('$STORMANT',  'Storm ANT',        ANT),
    sc('$HURRICANEANT','Hurricane ANT',     ANT), sc('$GALEANT',   'Gale ANT',         ANT),
    sc('$ICECRACK',    'Ice Crack',         ANT), sc('$CALVING',   'Calving',          ANT),
    sc('$ICEFALL',     'Ice Fall',          ANT), sc('$MELTPOND',  'Melt Pond',        ANT),
  ]},
  { label: 'August', coins: [
    sc('$SPRINGANT',   'Spring ANT',        ANT), sc('$FIRSTLIGHTANT','First Light ANT',ANT),
    sc('$SUNRISEANT',  'Sunrise ANT',       ANT), sc('$THAWANT',   'Thaw ANT',         ANT),
    sc('$SNOWPETREL',  'Snow Petrel',       ANT), sc('$SKUA',      'Skua',             ANT),
    sc('$SHEATHBILL',  'Sheathbill',        ANT), sc('$PRION',     'Prion',            ANT),
  ]},
  { label: 'September', coins: [
    sc('$EQUINOXANT',  'Equinox ANT',       ANT), sc('$OZONEHOLECOIN','Ozone Hole',    ANT),
    sc('$ICEMELTS',    'Ice Melts',         ANT), sc('$MELTWATER', 'Melt Water',       ANT),
    sc('$HUMPBACKANT', 'Humpback ANT',      ANT), sc('$MINKEWHALE','Minke Whale',      ANT),
    sc('$BLUEWHALE',   'Blue Whale',        ANT), sc('$SPERMWHALE','Sperm Whale',      ANT),
  ]},
  { label: 'October', coins: [
    sc('$SUMMERANT',   'Summer ANT',        ANT), sc('$PENGUINCHICK','Penguin Chick',  ANT),
    sc('$EGGANT',      'Egg ANT',           ANT), sc('$NESTANT',   'Nest ANT',         ANT),
    sc('$ICEBREAKER',  'Icebreaker',        ANT), sc('$EXPEDITION','Expedition',       ANT),
    sc('$EXPLORER',    'Explorer',          ANT), sc('$SHACKLETON','Shackleton',       ANT),
  ]},
  { label: 'November', coins: [
    sc('$MIDSUMMERANT2','Mid Summer 2 ANT', ANT), sc('$LONGDAYANT','Long Day ANT',     ANT),
    sc('$SUNBURNANT',  'Sunburn ANT',       ANT), sc('$UVANT',     'UV ANT',           ANT),
    sc('$ICECAVEANT',  'Ice Cave',          ANT), sc('$CRYSTALANT','Crystal ANT',      ANT),
    sc('$SNOWCRYSTAL', 'Snow Crystal',      ANT), sc('$PRISMANT',  'Prism ANT',        ANT),
  ]},
  { label: 'December', coins: [
    sc('$XMASANT',     'Xmas ANT',          ANT), sc('$PENGUINXMAS','Penguin Xmas',    ANT),
    sc('$NEWYEARANT',  'New Year ANT',      ANT), sc('$FIREWORKSANT','Fireworks ANT',  ANT),
    sc('$MIDNIGHTSUNANT','Midnight Sun ANT',ANT), sc('$AURORAANT', 'Aurora NYE ANT',  ANT),
    sc('$SOLSTICEANT2','Solstice 2 ANT',    ANT), sc('$POLARSOLANT','Polar Sol ANT',   ANT),
  ]},
];

export const EDITIONS: Edition[] = [
  {
    id: 'global',
    name: 'Global Edition',
    flag: '🌐',
    suffix: GLB,
    bgColor: '#0F0A1A',
    rimText: 'WORLDWIDE',
    accentColor: '#BF5FFF',
    path: '/global',
    permanentCoins: buildGlobalPermanentCoins(),
    seasonalGroups: buildGlobalSeasonal(),
  },
  {
    id: 'australia',
    name: 'Australia Edition',
    flag: '🇦🇺',
    suffix: AUS,
    bgColor: '#0A1F0A',
    rimText: 'DROP BEAR DOLLARS',
    accentColor: '#4ade80',
    path: '/australia',
    permanentCoins: buildPermanentCoins(AUS),
    seasonalGroups: australiaSeasonal,
  },
  {
    id: 'china',
    name: 'China Edition',
    flag: '🇨🇳',
    suffix: CHN,
    bgColor: '#1F0A0A',
    rimText: 'RICE BOWL',
    accentColor: '#f87171',
    path: '/china',
    permanentCoins: buildPermanentCoins(CHN),
    seasonalGroups: chinaSeasonal,
  },
  {
    id: 'usa',
    name: 'USA Edition',
    flag: '🇺🇸',
    suffix: USA,
    bgColor: '#0A0A1F',
    rimText: 'EAGLE DOLLARS',
    accentColor: '#60a5fa',
    path: '/usa',
    permanentCoins: buildPermanentCoins(USA),
    seasonalGroups: buildUSASeasonal(),
  },
  {
    id: 'europe',
    name: 'Europe Edition',
    flag: '🇪🇺',
    suffix: EUR,
    bgColor: '#130A1F',
    rimText: 'EUROPA',
    accentColor: '#a78bfa',
    path: '/europe',
    permanentCoins: buildPermanentCoins(EUR),
    seasonalGroups: europeSeasonal,
  },
  {
    id: 'africa',
    name: 'Africa Edition',
    flag: '🌍',
    suffix: AFR,
    bgColor: '#1F0F0A',
    rimText: 'SAVANNA',
    accentColor: '#fb923c',
    path: '/africa',
    permanentCoins: buildPermanentCoins(AFR),
    seasonalGroups: africaSeasonal,
  },
  {
    id: 'russia',
    name: 'Russia Edition',
    flag: '🇷🇺',
    suffix: RUS,
    bgColor: '#1A0A0F',
    rimText: 'MATRYOSHKA',
    accentColor: '#f472b6',
    path: '/russia',
    permanentCoins: buildPermanentCoins(RUS),
    seasonalGroups: russiaSeasonal,
  },
  {
    id: 'india',
    name: 'India Edition',
    flag: '🇮🇳',
    suffix: IND,
    bgColor: '#1F1200',
    rimText: 'CHAI COIN',
    accentColor: '#fbbf24',
    path: '/india',
    permanentCoins: buildPermanentCoins(IND),
    seasonalGroups: indiaSeasonal,
  },
  {
    id: 'japan',
    name: 'Japan Edition',
    flag: '🇯🇵',
    suffix: JPN,
    bgColor: '#1F0A12',
    rimText: 'ANIME YEN',
    accentColor: '#fb7185',
    path: '/japan',
    permanentCoins: buildPermanentCoins(JPN),
    seasonalGroups: japanSeasonal,
  },
  {
    id: 'southamerica',
    name: 'South America Edition',
    flag: '🌎',
    suffix: SA,
    bgColor: '#0A1A1A',
    rimText: 'CONDOR',
    accentColor: '#2dd4bf',
    path: '/southamerica',
    permanentCoins: buildPermanentCoins(SA),
    seasonalGroups: southAmericaSeasonal,
  },
  {
    id: 'middleeast',
    name: 'Middle East Edition',
    flag: '🌙',
    suffix: ME,
    bgColor: '#1A1200',
    rimText: 'GOLDEN CRESCENT',
    accentColor: '#f59e0b',
    path: '/middleeast',
    permanentCoins: buildPermanentCoins(ME),
    seasonalGroups: buildMiddleEastSeasonal(),
  },
  {
    id: 'oceania',
    name: 'Oceania Edition',
    flag: '🌊',
    suffix: OC,
    bgColor: '#001A1A',
    rimText: 'REEF DOLLAR',
    accentColor: '#06b6d4',
    path: '/oceania',
    permanentCoins: buildPermanentCoins(OC),
    seasonalGroups: buildOceaniaSeasonal(),
  },
  {
    id: 'northamerica',
    name: 'North America Edition',
    flag: '🍁',
    suffix: NA,
    bgColor: '#0A0F1A',
    rimText: 'MAPLE COIN',
    accentColor: '#ef4444',
    path: '/northamerica',
    permanentCoins: buildPermanentCoins(NA),
    seasonalGroups: buildNorthAmericaSeasonal(),
  },
  {
    id: 'centralamerica',
    name: 'Central America Edition',
    flag: '🌺',
    suffix: CA,
    bgColor: '#0F1A00',
    rimText: 'QUETZAL COIN',
    accentColor: '#84cc16',
    path: '/centralamerica',
    permanentCoins: buildPermanentCoins(CA),
    seasonalGroups: buildCentralAmericaSeasonal(),
  },
  {
    id: 'arctic',
    name: 'Arctic Edition',
    flag: '🧊',
    suffix: ARC,
    bgColor: '#001020',
    rimText: 'AURORA COIN',
    accentColor: '#67e8f9',
    path: '/arctic',
    permanentCoins: buildPermanentCoins(ARC),
    seasonalGroups: buildArcticSeasonal(),
  },
  {
    id: 'antarctica',
    name: 'Antarctica Edition',
    flag: '🐧',
    suffix: ANT,
    bgColor: '#0A0A14',
    rimText: 'PENGUIN COIN',
    accentColor: '#a5f3fc',
    path: '/antarctica',
    permanentCoins: buildPermanentCoins(ANT),
    seasonalGroups: buildAntarcticaSeasonal(),
  },
];

export function getEdition(id: string): Edition | undefined {
  return EDITIONS.find((e) => e.id === id);
}
