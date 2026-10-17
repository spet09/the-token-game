export type Coin = {
  ticker: string;
  name: string;
  buyUrl: string;
  permanent: boolean;
  image?: string;
  status: 'live' | 'coming-soon';
};

// ─── Flagship Utility Token ────────────────────────────────────────────────────
export type UtilityToken = {
  ticker: string;
  name: string;
  network: string;
  contractAddress: string;
  decimals: number;
  totalSupply: string;
  description: string;
  buyUrl: string;
  image?: string;
};

export const TIENKO: UtilityToken = {
  ticker: '$TEN',
  name: 'TIENKO',
  network: 'Solana',
  contractAddress: '6mKmxj4MMozaM54Jeruawduy2rTT8YaNoAhr1aMSFray',
  decimals: 6,
  totalSupply: '1,000,000,000',
  description: 'TIENKO ($TEN) is the flagship utility token of The Token Game ecosystem. It is used for trading, staking, and accessing premium game features.',
  buyUrl: 'https://jup.ag/swap/SOL-6mKmxj4MMozaM54Jeruawduy2rTT8YaNoAhr1aMSFray',
  image: '/airo-assets/images/coins/tienko',
};

export type CoinGroup = {
  label: string;
  month?: string;
  year?: 1 | 2;
  coins: Coin[];
};

// ─── Permanent 12 ─────────────────────────────────────────────────────────────
export const PERMANENT_COINS: Coin[] = [
{ ticker: '$GM', name: 'Good Morning Coin', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/good-morning-coin", status: 'live' },
{ ticker: '$CBC', name: 'Coffee Before Crypto', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/coffee-before-crypto", status: 'live' },
{ ticker: '$OMC', name: 'One More Candle', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/one-more-candle", status: 'live' },
{ ticker: '$BOAT', name: 'Based On A Tweet', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/based-on-a-tweet", status: 'live' },
{ ticker: '$JATB', name: 'Just A Test Bro', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/just-a-test-bro", status: 'live' },
{ ticker: '$NUJV', name: 'No Utility Just Vibes', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/no-utility-just-vibes", status: 'live' },
{ ticker: '$LEHR', name: 'Low Effort High Reward', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/low-effort-high-reward", status: 'live' },
{ ticker: '$SFTD', name: 'Sorry For The Dip', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/sorry-for-the-dip", status: 'live' },
{ ticker: '$WLN', name: 'Wen Lambo? Never.', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/wen-lambo-never", status: 'live' },
{ ticker: '$RIP', name: 'Refund In Progress', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/refund-in-progress", status: 'live' },
{ ticker: '$ELE', name: 'Exit Liquidity Enjoyer', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/exit-liquidity-enjoyer", status: 'live' },
{ ticker: '$RPOP', name: 'Rug Pull? Or Pull-Up?', buyUrl: '#', permanent: true, image: "/airo-assets/images/pages/home/rug-pull-or-pull-up", status: 'live' }];


// ─── Seasonal — Year One ───────────────────────────────────────────────────────
export const SEASONAL_YEAR_ONE: CoinGroup[] = [
{
  label: 'January', month: 'January', year: 1,
  coins: [
  { ticker: '$RESO', name: 'Resolution Ruined', buyUrl: '#', permanent: false, image: "/airo-assets/images/pages/coins/resolution-ruined", status: 'live' },
  { ticker: '$DETOX', name: 'Detox', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/detox", status: 'coming-soon' },
  { ticker: '$JANEND', name: 'Jan End', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/janend", status: 'coming-soon' },
  { ticker: '$FRESHSTART', name: 'Fresh Start', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/freshstart', status: 'coming-soon' },
  { ticker: '$COLDSTART', name: 'Cold Start', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/coldstart', status: 'coming-soon' },
  { ticker: '$FREEZE', name: 'Freeze', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/freeze', status: 'coming-soon' },
  { ticker: '$POLAR', name: 'Polar', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/polar', status: 'coming-soon' },
  { ticker: '$NEWYR', name: 'New Year', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/newyr', status: 'coming-soon' }]

},
{
  label: 'February', month: 'February', year: 1,
  coins: [
  { ticker: '$VAL', name: 'Valentine', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/valentine", status: 'coming-soon' },
  { ticker: '$HEART', name: 'Heart', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/heart", status: 'coming-soon' },
  { ticker: '$GHOST', name: 'Ghost', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/ghost', status: 'coming-soon' },
  { ticker: '$CUPID', name: 'Cupid', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/cupid', status: 'coming-soon' },
  { ticker: '$CRUSH', name: 'Crush', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/crush', status: 'coming-soon' },
  { ticker: '$ROSES', name: 'Roses', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/roses', status: 'coming-soon' },
  { ticker: '$CHOC', name: 'Chocolate', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/choc', status: 'coming-soon' },
  { ticker: '$LOVESICK', name: 'Lovesick', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/lovesick', status: 'coming-soon' }]

},
{
  label: 'March', month: 'March', year: 1,
  coins: [
  { ticker: '$HOPIUM', name: 'Hopium', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/hopium", status: 'coming-soon' },
  { ticker: '$GREEN', name: 'Green', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/green', status: 'coming-soon' },
  { ticker: '$BLOOM', name: 'Bloom', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/bloom', status: 'coming-soon' },
  { ticker: '$SHOWER', name: 'Shower', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/shower', status: 'coming-soon' },
  { ticker: '$CLOVER', name: 'Clover', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/clover', status: 'coming-soon' },
  { ticker: '$THAW', name: 'Thaw', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/thaw', status: 'coming-soon' },
  { ticker: '$POLLEN', name: 'Pollen', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/pollen', status: 'coming-soon' },
  { ticker: '$EQUINOX', name: 'Equinox', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/equinox', status: 'coming-soon' }]

},
{
  label: 'April', month: 'April', year: 1,
  coins: [
  { ticker: '$IRS', name: 'IRS', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/irs", status: 'coming-soon' },
  { ticker: '$REFUND', name: 'Refund', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/refund", status: 'coming-soon' },
  { ticker: '$AUDIT', name: 'Audit', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/audit", status: 'coming-soon' },
  { ticker: '$EXTENSION', name: 'Extension', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/extension', status: 'coming-soon' },
  { ticker: '$FOOL', name: 'April Fool', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/fool', status: 'coming-soon' },
  { ticker: '$RAIN', name: 'Rain', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/rain', status: 'coming-soon' },
  { ticker: '$MUDDY', name: 'Muddy', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/muddy', status: 'coming-soon' },
  { ticker: '$SPRING', name: 'Spring', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/spring', status: 'coming-soon' }]

},
{
  label: 'May', month: 'May', year: 1,
  coins: [
  { ticker: '$SAUCE', name: 'Sauce', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/sauce", status: 'coming-soon' },
  { ticker: '$DIP', name: 'Dip', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/dip", status: 'coming-soon' },
  { ticker: '$BREAD', name: 'Bread', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/bread", status: 'coming-soon' },
  { ticker: '$CHIPS', name: 'Chips', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/chips", status: 'coming-soon' },
  { ticker: '$GUAC', name: 'Guac', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/guac", status: 'coming-soon' },
  { ticker: '$CINCO', name: 'Cinco', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/cinco', status: 'coming-soon' },
  { ticker: '$BLOOM2', name: 'Bloom 2', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/bloom2', status: 'coming-soon' },
  { ticker: '$WARMUP', name: 'Warmup', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/warmup', status: 'coming-soon' }]

},
{
  label: 'June', month: 'June', year: 1,
  coins: [
  { ticker: '$POOL', name: 'Pool', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/pool", status: 'coming-soon' },
  { ticker: '$TAN', name: 'Tan', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/tan", status: 'coming-soon' },
  { ticker: '$MELT', name: 'Melt', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/melt", status: 'coming-soon' },
  { ticker: '$SIZZLE', name: 'Sizzle', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/sizzle", status: 'coming-soon' },
  { ticker: '$SOLSTICE', name: 'Solstice', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/solstice', status: 'coming-soon' },
  { ticker: '$SWEAT', name: 'Sweat', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/sweat', status: 'coming-soon' },
  { ticker: '$HUMID', name: 'Humid', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/humid', status: 'coming-soon' },
  { ticker: '$HEATWAVE', name: 'Heatwave', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/heatwave', status: 'coming-soon' }]

},
{
  label: 'July', month: 'July', year: 1,
  coins: [
  { ticker: '$BOOM', name: 'Boom', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/boom", status: 'coming-soon' },
  { ticker: '$OOPS', name: 'Oops', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/oops", status: 'coming-soon' },
  { ticker: '$SPARK', name: 'Spark', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/spark", status: 'coming-soon' },
  { ticker: '$FIZZLE', name: 'Fizzle', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/fizzle', status: 'coming-soon' },
  { ticker: '$SUNBURN', name: 'Sunburn', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/sunburn', status: 'coming-soon' },
  { ticker: '$GRILL', name: 'Grill', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/grill', status: 'coming-soon' },
  { ticker: '$ROADTRIP', name: 'Road Trip', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/roadtrip', status: 'coming-soon' },
  { ticker: '$HOTDOG', name: 'Hot Dog', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/hotdog', status: 'coming-soon' }]

},
{
  label: 'August', month: 'August', year: 1,
  coins: [
  { ticker: '$BEACH', name: 'Beach', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/beach', status: 'coming-soon' },
  { ticker: '$SUN', name: 'Sun', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/sun", status: 'coming-soon' },
  { ticker: '$NAP', name: 'Nap', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/nap", status: 'coming-soon' },
  { ticker: '$FOMO', name: 'FOMO', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/fomo', status: 'coming-soon' },
  { ticker: '$ICECREAM', name: 'Ice Cream', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/icecream', status: 'coming-soon' },
  { ticker: '$SANDCASTLE', name: 'Sandcastle', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/sandcastle', status: 'coming-soon' },
  { ticker: '$SUNSCREEN', name: 'Sunscreen', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/sunscreen', status: 'coming-soon' },
  { ticker: '$LASTDAY', name: 'Last Day', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/lastday', status: 'coming-soon' }]

},
{
  label: 'September', month: 'September', year: 1,
  coins: [
  { ticker: '$HOMEWORK', name: 'Homework', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/homework", status: 'coming-soon' },
  { ticker: '$TRUANT', name: 'Truant', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/truant", status: 'coming-soon' },
  { ticker: '$LATE', name: 'Late', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/late", status: 'coming-soon' },
  { ticker: '$CHEAT', name: 'Cheat', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/cheat', status: 'coming-soon' },
  { ticker: '$BACKPACK', name: 'Backpack', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/backpack', status: 'coming-soon' },
  { ticker: '$PENCIL', name: 'Pencil', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/pencil', status: 'coming-soon' },
  { ticker: '$HARVEST', name: 'Harvest', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/harvest', status: 'coming-soon' },
  { ticker: '$FALLLEAF', name: 'Fall Leaf', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/fallleaf', status: 'coming-soon' }]

},
{
  label: 'October', month: 'October', year: 1,
  coins: [
  { ticker: '$SCARY', name: 'Scary', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/scary", status: 'coming-soon' },
  { ticker: '$PUMPKIN', name: 'Pumpkin', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/pumpkin", status: 'coming-soon' },
  { ticker: '$WITCH', name: 'Witch', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/witch', status: 'coming-soon' },
  { ticker: '$ZOMBIE', name: 'Zombie', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/zombie", status: 'coming-soon' },
  { ticker: '$SKULL', name: 'Skull', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/skull', status: 'coming-soon' },
  { ticker: '$CANDY', name: 'Candy', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/candy', status: 'coming-soon' },
  { ticker: '$COBWEB', name: 'Cobweb', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/cobweb', status: 'coming-soon' },
  { ticker: '$HAUNT', name: 'Haunt', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/haunt', status: 'coming-soon' }]

},
{
  label: 'November', month: 'November', year: 1,
  coins: [
  { ticker: '$TURKEY', name: 'Turkey', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/turkey", status: 'coming-soon' },
  { ticker: '$LEFT', name: 'Left', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/left', status: 'coming-soon' },
  { ticker: '$SECOND', name: 'Second', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/second", status: 'coming-soon' },
  { ticker: '$GRAVY', name: 'Gravy', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/gravy", status: 'coming-soon' },
  { ticker: '$STUFFED', name: 'Stuffed', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/stuffed', status: 'coming-soon' },
  { ticker: '$NAPS', name: 'Naps', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/naps', status: 'coming-soon' },
  { ticker: '$BLACKFRI', name: 'Black Friday', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/blackfri', status: 'coming-soon' },
  { ticker: '$THANKLESS', name: 'Thankless', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/thankless', status: 'coming-soon' }]

},
{
  label: 'December', month: 'December', year: 1,
  coins: [
  { ticker: '$MIRACLE', name: 'Miracle', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/miracle", status: 'coming-soon' },
  { ticker: '$COAL', name: 'Coal', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/coal", status: 'coming-soon' },
  { ticker: '$ELF', name: 'Elf', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/elf", status: 'coming-soon' },
  { ticker: '$KRAMPUS', name: 'Krampus', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/krampus", status: 'coming-soon' },
  { ticker: '$YULE', name: 'Yule', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/yule", status: 'coming-soon' },
  { ticker: '$NOEL', name: 'Noel', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/noel', status: 'coming-soon' },
  { ticker: '$REGIFT', name: 'Regift', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/regift', status: 'coming-soon' },
  { ticker: '$SNOWBALL', name: 'Snowball', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/snowball', status: 'coming-soon' }]

}];


// ─── Finale — Year One ────────────────────────────────────────────────────────
export const FINALE_COINS: Coin[] = [
{ ticker: '$RESET', name: 'Reset', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/reset", status: 'coming-soon' },
{ ticker: '$FULLMENU', name: 'Full Menu', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/fullmenu', status: 'coming-soon' },
{ ticker: '$AFTERLIFE', name: 'Afterlife', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/afterlife", status: 'coming-soon' }];


// ─── Year Two ─────────────────────────────────────────────────────────────────
export const YEAR_TWO_GROUPS: CoinGroup[] = [
{
  label: 'January', month: 'January', year: 2,
  coins: [
  { ticker: '$REPEAT', name: 'Repeat', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/repeat", status: 'coming-soon' },
  { ticker: '$FAIL', name: 'Fail', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/fail', status: 'coming-soon' },
  { ticker: '$TRYAGAIN', name: 'Try Again', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/tryagain', status: 'coming-soon' },
  { ticker: '$JUSTONCE', name: 'Just Once', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/justonce", status: 'coming-soon' },
  { ticker: '$INEVITABLE', name: 'Inevitable', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/inevitable", status: 'coming-soon' },
  { ticker: '$SNOWDAY2', name: 'Snow Day 2', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/snowday2', status: 'coming-soon' },
  { ticker: '$NUMB', name: 'Numb', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/numb', status: 'coming-soon' },
  { ticker: '$SLUMP', name: 'Slump', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/slump', status: 'coming-soon' }]

},
{
  label: 'February', month: 'February', year: 2,
  coins: [
  { ticker: '$REBOUND', name: 'Rebound', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/rebound', status: 'coming-soon' },
  { ticker: '$TEXTS', name: 'Texts', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/texts", status: 'coming-soon' },
  { ticker: '$BLOCKED', name: 'Blocked', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/blocked", status: 'coming-soon' },
  { ticker: '$GHOSTED', name: 'Ghosted', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/ghosted', status: 'coming-soon' },
  { ticker: '$SITUATIONSHIP', name: 'Situationship', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/situationship', status: 'coming-soon' },
  { ticker: '$ICKS', name: 'Icks', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/icks', status: 'coming-soon' },
  { ticker: '$UNMATCHED', name: 'Unmatched', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/unmatched', status: 'coming-soon' },
  { ticker: '$LEFTSWIPE', name: 'Left Swipe', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/leftswipe', status: 'coming-soon' }]

},
{
  label: 'March', month: 'March', year: 2,
  coins: [
  { ticker: '$HYPE', name: 'Hype', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/hype", status: 'coming-soon' },
  { ticker: '$DUMP', name: 'Dump', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/dump", status: 'coming-soon' },
  { ticker: '$REKT', name: 'Rekt', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/rekt", status: 'coming-soon' },
  { ticker: '$COPIUM2', name: 'Copium 2', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/copium2", status: 'coming-soon' },
  { ticker: '$NGMI', name: 'NGMI', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/ngmi', status: 'coming-soon' },
  { ticker: '$PAPERHANDS', name: 'Paper Hands', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/paperhands', status: 'coming-soon' },
  { ticker: '$RUGGED', name: 'Rugged', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/rugged', status: 'coming-soon' },
  { ticker: '$BAGHOLDER', name: 'Bag Holder', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/bagholder', status: 'coming-soon' }]

},
{
  label: 'April', month: 'April', year: 2,
  coins: [
  { ticker: '$AUDIT2', name: 'Audit 2', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/audit2', status: 'coming-soon' },
  { ticker: '$EVADE', name: 'Evade', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/evade", status: 'coming-soon' },
  { ticker: '$JAIL', name: 'Jail', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/jail", status: 'coming-soon' },
  { ticker: '$SETTLE', name: 'Settle', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/settle", status: 'coming-soon' },
  { ticker: '$OFFSHORE', name: 'Offshore', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/offshore', status: 'coming-soon' },
  { ticker: '$LOOPHOLE', name: 'Loophole', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/loophole', status: 'coming-soon' },
  { ticker: '$WRITEOFF', name: 'Write Off', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/writeoff', status: 'coming-soon' },
  { ticker: '$DEDUCTION', name: 'Deduction', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/deduction', status: 'coming-soon' }]

},
{
  label: 'May', month: 'May', year: 2,
  coins: [
  { ticker: '$SALSA', name: 'Salsa', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/salsa", status: 'coming-soon' },
  { ticker: '$CHIPS2', name: 'Chips 2', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/chips2', status: 'coming-soon' },
  { ticker: '$GUAC2', name: 'Guac 2', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/guac2', status: 'coming-soon' },
  { ticker: '$SPLIT', name: 'Split', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/split", status: 'coming-soon' },
  { ticker: '$PICNIC', name: 'Picnic', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/picnic', status: 'coming-soon' },
  { ticker: '$PATIO', name: 'Patio', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/patio', status: 'coming-soon' },
  { ticker: '$ROSEBUD', name: 'Rosebud', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/rosebud', status: 'coming-soon' },
  { ticker: '$MAYDAY', name: 'Mayday', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/mayday', status: 'coming-soon' }]

},
{
  label: 'June', month: 'June', year: 2,
  coins: [
  { ticker: '$SIZZLE2', name: 'Sizzle 2', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/sizzle2', status: 'coming-soon' },
  { ticker: '$CRISP', name: 'Crisp', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/crisp", status: 'coming-soon' },
  { ticker: '$ASH', name: 'Ash', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/ash", status: 'coming-soon' },
  { ticker: '$PHOENIX', name: 'Phoenix', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/phoenix", status: 'coming-soon' },
  { ticker: '$DROUGHT', name: 'Drought', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/drought', status: 'coming-soon' },
  { ticker: '$WILDFIRE', name: 'Wildfire', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/wildfire', status: 'coming-soon' },
  { ticker: '$SCORCHED', name: 'Scorched', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/scorched', status: 'coming-soon' },
  { ticker: '$MIRAGE', name: 'Mirage', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/mirage', status: 'coming-soon' }]

},
{
  label: 'July', month: 'July', year: 2,
  coins: [
  { ticker: '$BANG', name: 'Bang', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/bang", status: 'coming-soon' },
  { ticker: '$POP', name: 'Pop', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/pop", status: 'coming-soon' },
  { ticker: '$FIZZLE2', name: 'Fizzle 2', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/fizzle2', status: 'coming-soon' },
  { ticker: '$DUD', name: 'Dud', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/dud', status: 'coming-soon' },
  { ticker: '$SPARKLER', name: 'Sparkler', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/sparkler', status: 'coming-soon' },
  { ticker: '$BACKYARD', name: 'Backyard', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/backyard', status: 'coming-soon' },
  { ticker: '$MOSQUITO', name: 'Mosquito', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/mosquito', status: 'coming-soon' },
  { ticker: '$HUMID2', name: 'Humid 2', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/humid2', status: 'coming-soon' }]

},
{
  label: 'August', month: 'August', year: 2,
  coins: [
  { ticker: '$COUCH', name: 'Couch', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/couch", status: 'coming-soon' },
  { ticker: '$REMOTE', name: 'Remote', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/remote", status: 'coming-soon' },
  { ticker: '$STREAM', name: 'Stream', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/stream", status: 'coming-soon' },
  { ticker: '$SNACKS', name: 'Snacks', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/snacks', status: 'coming-soon' },
  { ticker: '$BINGE', name: 'Binge', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/binge', status: 'coming-soon' },
  { ticker: '$RERUN', name: 'Rerun', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/rerun', status: 'coming-soon' },
  { ticker: '$SWELTER', name: 'Swelter', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/swelter', status: 'coming-soon' },
  { ticker: '$DOGDAYS', name: 'Dog Days', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/dogdays', status: 'coming-soon' }]

},
{
  label: 'September', month: 'September', year: 2,
  coins: [
  { ticker: '$DETENTION', name: 'Detention', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/detention", status: 'coming-soon' },
  { ticker: '$EXPELLED', name: 'Expelled', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/expelled', status: 'coming-soon' },
  { ticker: '$DROPOUT', name: 'Dropout', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/dropout", status: 'coming-soon' },
  { ticker: '$TARDY', name: 'Tardy', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/tardy', status: 'coming-soon' },
  { ticker: '$SUSPEND', name: 'Suspended', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/suspend', status: 'coming-soon' },
  { ticker: '$DEMERIT', name: 'Demerit', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/demerit', status: 'coming-soon' },
  { ticker: '$RECESS', name: 'Recess', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/recess', status: 'coming-soon' },
  { ticker: '$HALLPASS', name: 'Hall Pass', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/hallpass', status: 'coming-soon' }]

},
{
  label: 'October', month: 'October', year: 2,
  coins: [
  { ticker: '$VOODOO', name: 'Voodoo', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/voodoo", status: 'coming-soon' },
  { ticker: '$CURSE', name: 'Curse', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/curse", status: 'coming-soon' },
  { ticker: '$HEX', name: 'Hex', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/hex", status: 'coming-soon' },
  { ticker: '$SEANCE', name: 'Seance', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/seance', status: 'coming-soon' },
  { ticker: '$SPECTER', name: 'Specter', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/specter', status: 'coming-soon' },
  { ticker: '$CAULDRON', name: 'Cauldron', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/cauldron', status: 'coming-soon' },
  { ticker: '$GRIMREAP', name: 'Grim Reaper', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/grimreap', status: 'coming-soon' },
  { ticker: '$BANSHEE', name: 'Banshee', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/banshee', status: 'coming-soon' }]

},
{
  label: 'November', month: 'November', year: 2,
  coins: [
  { ticker: '$REHEAT', name: 'Reheat', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/reheat", status: 'coming-soon' },
  { ticker: '$BURNT', name: 'Burnt', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/burnt", status: 'coming-soon' },
  { ticker: '$MICROWAVE', name: 'Microwave', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/microwave", status: 'coming-soon' },
  { ticker: '$OVERCOOKED', name: 'Overcooked', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/overcooked', status: 'coming-soon' },
  { ticker: '$SOGGY', name: 'Soggy', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/soggy', status: 'coming-soon' },
  { ticker: '$CANNED', name: 'Canned', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/canned', status: 'coming-soon' },
  { ticker: '$POTLUCK', name: 'Potluck', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/potluck', status: 'coming-soon' },
  { ticker: '$CASSEROLE', name: 'Casserole', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/casserole', status: 'coming-soon' }]

},
{
  label: 'December', month: 'December', year: 2,
  coins: [
  { ticker: '$FROST', name: 'Frost', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/frost', status: 'coming-soon' },
  { ticker: '$BLIZZARD', name: 'Blizzard', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/blizzard", status: 'coming-soon' },
  { ticker: '$ICICLE', name: 'Icicle', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/icicle", status: 'coming-soon' },
  { ticker: '$SLEET', name: 'Sleet', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/sleet', status: 'coming-soon' },
  { ticker: '$SNOWGLOBE', name: 'Snow Globe', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/snowglobe', status: 'coming-soon' },
  { ticker: '$FROSTBITE', name: 'Frostbite', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/frostbite', status: 'coming-soon' },
  { ticker: '$WHITEOUT', name: 'Whiteout', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/whiteout', status: 'coming-soon' },
  { ticker: '$YEAREND', name: 'Year End', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/yearend', status: 'coming-soon' }]

},
{
  label: 'Finale', year: 2,
  coins: [
  { ticker: '$SECRET', name: 'Secret', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/secret", status: 'coming-soon' },
  { ticker: '$HIDDEN', name: 'Hidden', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/hidden", status: 'coming-soon' },
  { ticker: '$UNLOCK', name: 'Unlock', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/unlock", status: 'coming-soon' },
  { ticker: '$LEGEND', name: 'Legend', buyUrl: '#', permanent: false, image: "/airo-assets/images/coins/global/legend", status: 'coming-soon' },
  { ticker: '$FOREVER', name: 'Forever', buyUrl: '#', permanent: false, image: '/airo-assets/images/coins/forever', status: 'coming-soon' }]

}];


// ─── Flat list for homepage / all-coins page ───────────────────────────────────
export const COINS: Coin[] = [
...PERMANENT_COINS,
...SEASONAL_YEAR_ONE.flatMap((g) => g.coins),
...FINALE_COINS,
...YEAR_TWO_GROUPS.flatMap((g) => g.coins)];