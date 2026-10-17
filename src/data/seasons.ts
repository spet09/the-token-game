/**
 * Seasonal Calendar — master season definitions
 *
 * Season 1 covers the full calendar year with overlapping thematic windows.
 * Coins are mapped to the season they most naturally belong to.
 * All dates are YYYY-MM-DD (UTC).
 */

import type { Season } from './calendarTypes';

export const SEASONS: Season[] = [
  // ─── January ──────────────────────────────────────────────────────────────
  {
    id: 'new-year',
    name: 'New Year',
    theme: 'special',
    startDate: '2026-01-01',
    endDate: '2026-01-07',
    color: '#FFD700',
    icon: '🎆',
    description: 'The Nexus rings in the new year. Fresh starts, bold resolutions, and the inevitable crash.',
    coins: [
      { slug: 'janend',   name: 'January End',       ticker: '$JANEND',   edition: 'global', startDate: '2026-01-28', endDate: '2026-01-31', flavour: 'You made it through January. Barely.', icon: '📅' },
      { slug: 'reset',    name: 'Reset',             ticker: '$RESET',    edition: 'global', startDate: '2026-01-01', endDate: '2026-01-07', flavour: 'New year, new wallet, same mistakes.', icon: '🔄' },
      { slug: 'repeat',   name: 'Repeat',            ticker: '$REPEAT',   edition: 'global', startDate: '2026-01-01', endDate: '2026-01-14', flavour: 'Did we not do this last year?', icon: '🔁' },
      { slug: 'slump',    name: 'Slump',             ticker: '$SLUMP',    edition: 'global', startDate: '2026-01-08', endDate: '2026-01-31', flavour: 'January blues hit different in the Nexus.', icon: '😔' },
    ],
  },

  // ─── Winter (Northern Hemisphere) ─────────────────────────────────────────
  {
    id: 'deep-winter',
    name: 'Deep Winter',
    theme: 'winter',
    startDate: '2026-01-01',
    endDate: '2026-02-28',
    color: '#7EC8E3',
    icon: '❄️',
    description: 'The coldest stretch. Coins for the frozen, the numb, and the ones who refuse to go outside.',
    coins: [
      { slug: 'blizzard',  name: 'Blizzard',   ticker: '$BLIZZARD', edition: 'global', startDate: null, endDate: null, flavour: 'Zero visibility. Zero gains.', icon: '🌨️' },
      { slug: 'icicle',    name: 'Icicle',     ticker: '$ICICLE',   edition: 'global', startDate: null, endDate: null, flavour: 'Sharp, cold, and melting fast.', icon: '🧊' },
      { slug: 'numb',      name: 'Numb',       ticker: '$NUMB',     edition: 'global', startDate: null, endDate: null, flavour: 'Feeling nothing. Holding everything.', icon: '🥶' },
      { slug: 'freeze',    name: 'Freeze',     ticker: '$FREEZE',   edition: 'global', startDate: null, endDate: null, flavour: 'Frozen portfolio. Frozen soul.', icon: '🧊' },
      { slug: 'frostbite', name: 'Frostbite',  ticker: '$FROSTBITE',edition: 'global', startDate: null, endDate: null, flavour: 'The market bit back.', icon: '🥶' },
      { slug: 'coldstart', name: 'Cold Start', ticker: '$COLDSTART',edition: 'global', startDate: null, endDate: null, flavour: 'Engine won\'t turn over. Neither will the chart.', icon: '🌡️' },
      { slug: 'whiteout',  name: 'Whiteout',   ticker: '$WHITEOUT', edition: 'global', startDate: null, endDate: null, flavour: 'Can\'t see the chart. Can\'t see anything.', icon: '🌫️' },
      { slug: 'nap',       name: 'Nap',        ticker: '$NAP',      edition: 'global', startDate: null, endDate: null, flavour: 'Hibernating until spring. Or a pump.', icon: '😴' },
      { slug: 'couch',     name: 'Couch',      ticker: '$COUCH',    edition: 'global', startDate: null, endDate: null, flavour: 'The couch is the only safe asset.', icon: '🛋️' },
    ],
  },

  // ─── Valentine's / Love Season ────────────────────────────────────────────
  {
    id: 'love-season',
    name: 'Love Season',
    theme: 'love',
    startDate: '2026-02-01',
    endDate: '2026-02-21',
    color: '#FF5F8F',
    icon: '💕',
    description: 'Hearts, heartbreak, and the coins that capture every stage of the situationship.',
    coins: [
      { slug: 'val',          name: 'Valentine',     ticker: '$VAL',         edition: 'global', startDate: '2026-02-10', endDate: '2026-02-14', flavour: 'For the one who holds your bags.', icon: '💝' },
      { slug: 'heart',        name: 'Heart',         ticker: '$HEART',       edition: 'global', startDate: '2026-02-10', endDate: '2026-02-14', flavour: 'Proof of love on-chain.', icon: '❤️' },
      { slug: 'crush',        name: 'Crush',         ticker: '$CRUSH',       edition: 'global', startDate: '2026-02-01', endDate: '2026-02-14', flavour: 'Unrequited. Like your limit orders.', icon: '💘' },
      { slug: 'lovesick',     name: 'Lovesick',      ticker: '$LOVESICK',    edition: 'global', startDate: null,         endDate: null,         flavour: 'Sick with love. Sick of losses.', icon: '🤒' },
      { slug: 'situationship',name: 'Situationship', ticker: '$SITUATIONSHIP',edition:'global', startDate: null,         endDate: null,         flavour: 'We\'re not official. Neither is the pump.', icon: '🤷' },
      { slug: 'texts',        name: 'Texts',         ticker: '$TEXTS',       edition: 'global', startDate: null,         endDate: null,         flavour: 'Left on read. Like your sell order.', icon: '💬' },
      { slug: 'roses',        name: 'Roses',         ticker: '$ROSES',       edition: 'global', startDate: '2026-02-10', endDate: '2026-02-14', flavour: 'Red roses. Red portfolio.', icon: '🌹' },
      { slug: 'unmatched',    name: 'Unmatched',     ticker: '$UNMATCHED',   edition: 'global', startDate: null,         endDate: null,         flavour: 'Swiped left on your entry point.', icon: '💔' },
      { slug: 'leftswipe',    name: 'Left Swipe',    ticker: '$LEFTSWIPE',   edition: 'global', startDate: null,         endDate: null,         flavour: 'The market said no.', icon: '👈' },
    ],
  },

  // ─── Tax Season ───────────────────────────────────────────────────────────
  {
    id: 'tax-season',
    name: 'Tax Season',
    theme: 'tax',
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    color: '#FF8C42',
    icon: '🧾',
    description: 'The Nexus reckons with the taxman. Coins for the audited, the refunded, and the rugged.',
    coins: [
      { slug: 'irs',       name: 'IRS',        ticker: '$IRS',      edition: 'global', startDate: '2026-03-01', endDate: '2026-04-15', flavour: 'They always find you.', icon: '📋' },
      { slug: 'refund',    name: 'Refund',     ticker: '$REFUND',   edition: 'global', startDate: '2026-03-15', endDate: '2026-04-30', flavour: 'The government owes you. Probably.', icon: '💸' },
      { slug: 'rekt',      name: 'Rekt',       ticker: '$REKT',     edition: 'global', startDate: null,         endDate: null,         flavour: 'Rekt by the market. Rekt by the IRS.', icon: '💀' },
      { slug: 'writeoff',  name: 'Write-Off',  ticker: '$WRITEOFF', edition: 'global', startDate: null,         endDate: null,         flavour: 'At least the losses are deductible.', icon: '✏️' },
      { slug: 'deduction', name: 'Deduction',  ticker: '$DEDUCTION',edition: 'global', startDate: null,         endDate: null,         flavour: 'Every loss is a lesson. And a deduction.', icon: '🔢' },
      { slug: 'extension', name: 'Extension',  ticker: '$EXTENSION',edition: 'global', startDate: '2026-04-01', endDate: '2026-04-15', flavour: 'Bought yourself 6 more months of denial.', icon: '📅' },
      { slug: 'evade',     name: 'Evade',      ticker: '$EVADE',    edition: 'global', startDate: null,         endDate: null,         flavour: 'Not financial advice.', icon: '🏃' },
      { slug: 'audit',     name: 'Audit',      ticker: '$AUDIT',    edition: 'global', startDate: null,         endDate: null,         flavour: 'They\'re coming. They\'re always coming.', icon: '🔍' },
      { slug: 'offshore',  name: 'Offshore',   ticker: '$OFFSHORE', edition: 'global', startDate: null,         endDate: null,         flavour: 'Technically not here.', icon: '🏝️' },
      { slug: 'loophole',  name: 'Loophole',   ticker: '$LOOPHOLE', edition: 'global', startDate: null,         endDate: null,         flavour: 'Found one. Won\'t last.', icon: '🕳️' },
    ],
  },

  // ─── Spring ───────────────────────────────────────────────────────────────
  {
    id: 'spring',
    name: 'Spring',
    theme: 'spring',
    startDate: '2026-03-20',
    endDate: '2026-05-31',
    color: '#7FD67F',
    icon: '🌸',
    description: 'New growth, fresh starts, and the coins that bloom with the season.',
    coins: [
      { slug: 'bloom2',   name: 'Bloom',      ticker: '$BLOOM',    edition: 'global', startDate: '2026-03-20', endDate: '2026-04-30', flavour: 'Finally. Something green.', icon: '🌸' },
      { slug: 'spring',   name: 'Spring',     ticker: '$SPRING',   edition: 'global', startDate: '2026-03-20', endDate: '2026-05-31', flavour: 'The chart is thawing.', icon: '🌱' },
      { slug: 'thaw',     name: 'Thaw',       ticker: '$THAW',     edition: 'global', startDate: '2026-03-01', endDate: '2026-04-15', flavour: 'The ice is breaking. So is the resistance.', icon: '💧' },
      { slug: 'pollen',   name: 'Pollen',     ticker: '$POLLEN',   edition: 'global', startDate: '2026-03-20', endDate: '2026-05-15', flavour: 'Allergic to gains. Sneezing through the dip.', icon: '🌼' },
      { slug: 'muddy',    name: 'Muddy',      ticker: '$MUDDY',    edition: 'global', startDate: '2026-03-01', endDate: '2026-04-30', flavour: 'Messy season. Messy chart.', icon: '🌧️' },
      { slug: 'rain',     name: 'Rain',       ticker: '$RAIN',     edition: 'global', startDate: '2026-03-20', endDate: '2026-05-31', flavour: 'April showers bring May pumps.', icon: '🌧️' },
      { slug: 'rosebud',  name: 'Rosebud',    ticker: '$ROSEBUD',  edition: 'global', startDate: '2026-04-01', endDate: '2026-05-15', flavour: 'Just beginning to open.', icon: '🌹' },
      { slug: 'patio',    name: 'Patio',      ticker: '$PATIO',    edition: 'global', startDate: '2026-04-15', endDate: '2026-05-31', flavour: 'First patio day of the year. Bullish.', icon: '☀️' },
    ],
  },

  // ─── School Season ────────────────────────────────────────────────────────
  {
    id: 'school-season',
    name: 'School Season',
    theme: 'school',
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    color: '#FFB347',
    icon: '📚',
    description: 'The academic calendar mapped to the Nexus. Coins for every stage of the school year.',
    coins: [
      { slug: 'homework',  name: 'Homework',   ticker: '$HOMEWORK', edition: 'global', startDate: null, endDate: null, flavour: 'Due tomorrow. Started never.', icon: '📝' },
      { slug: 'detention', name: 'Detention',  ticker: '$DETENTION',edition: 'global', startDate: null, endDate: null, flavour: 'Staying after market hours.', icon: '🏫' },
      { slug: 'late',      name: 'Late',       ticker: '$LATE',     edition: 'global', startDate: null, endDate: null, flavour: 'Late to the trade. Late to class.', icon: '⏰' },
      { slug: 'truant',    name: 'Truant',     ticker: '$TRUANT',   edition: 'global', startDate: null, endDate: null, flavour: 'Skipped the lesson. Paid the price.', icon: '🚪' },
      { slug: 'dropout',   name: 'Dropout',    ticker: '$DROPOUT',  edition: 'global', startDate: null, endDate: null, flavour: 'Dropped out of the trade. Dropped out of school.', icon: '🎓' },
      { slug: 'expelled',  name: 'Expelled',   ticker: '$EXPELLED', edition: 'global', startDate: null, endDate: null, flavour: 'Permanently removed from the position.', icon: '🚫' },
      { slug: 'suspend',   name: 'Suspend',    ticker: '$SUSPEND',  edition: 'global', startDate: null, endDate: null, flavour: 'Suspended. Pending investigation.', icon: '⛔' },
      { slug: 'demerit',   name: 'Demerit',    ticker: '$DEMERIT',  edition: 'global', startDate: null, endDate: null, flavour: 'Another mark against you.', icon: '❌' },
      { slug: 'tardy',     name: 'Tardy',      ticker: '$TARDY',    edition: 'global', startDate: null, endDate: null, flavour: 'Third tardy this week.', icon: '🕐' },
      { slug: 'hallpass',  name: 'Hall Pass',  ticker: '$HALLPASS', edition: 'global', startDate: null, endDate: null, flavour: 'Permission to leave. Temporarily.', icon: '🪪' },
    ],
  },

  // ─── Summer ───────────────────────────────────────────────────────────────
  {
    id: 'summer',
    name: 'Summer',
    theme: 'summer',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    color: '#FFD700',
    icon: '☀️',
    description: 'Peak heat. Peak vibes. Coins for the beach, the grill, and the inevitable sunburn.',
    coins: [
      { slug: 'sun',       name: 'Sun',        ticker: '$SUN',      edition: 'global', startDate: null, endDate: null, flavour: 'Up only. Until it isn\'t.', icon: '☀️' },
      { slug: 'heatwave',  name: 'Heatwave',   ticker: '$HEATWAVE', edition: 'global', startDate: '2026-07-01', endDate: '2026-08-15', flavour: 'Too hot to trade. Too hot to think.', icon: '🌡️' },
      { slug: 'sunburn',   name: 'Sunburn',    ticker: '$SUNBURN',  edition: 'global', startDate: null, endDate: null, flavour: 'Forgot the sunscreen. Forgot the stop-loss.', icon: '🔴' },
      { slug: 'tan',       name: 'Tan',        ticker: '$TAN',      edition: 'global', startDate: '2026-06-15', endDate: '2026-08-31', flavour: 'Trading from the beach. Losing from the beach.', icon: '🏖️' },
      { slug: 'pool',      name: 'Pool',       ticker: '$POOL',     edition: 'global', startDate: '2026-06-01', endDate: '2026-08-31', flavour: 'Liquidity pool. Swimming pool. Same energy.', icon: '🏊' },
      { slug: 'melt',      name: 'Melt',       ticker: '$MELT',     edition: 'global', startDate: '2026-07-01', endDate: '2026-08-31', flavour: 'Portfolio melting. Ice cream melting.', icon: '🍦' },
      { slug: 'sweat',     name: 'Sweat',      ticker: '$SWEAT',    edition: 'global', startDate: null, endDate: null, flavour: 'Sweating the dip. Sweating the heat.', icon: '💦' },
      { slug: 'swelter',   name: 'Swelter',    ticker: '$SWELTER',  edition: 'global', startDate: '2026-07-15', endDate: '2026-08-31', flavour: 'Sweltering. Suffering. Holding.', icon: '🥵' },
      { slug: 'humid',     name: 'Humid',      ticker: '$HUMID',    edition: 'global', startDate: null, endDate: null, flavour: 'Sticky. Uncomfortable. Unshakeable.', icon: '💧' },
      { slug: 'drought',   name: 'Drought',    ticker: '$DROUGHT',  edition: 'global', startDate: '2026-07-01', endDate: '2026-08-31', flavour: 'No rain. No volume. No mercy.', icon: '🏜️' },
      { slug: 'spark',     name: 'Spark',      ticker: '$SPARK',    edition: 'global', startDate: null, endDate: null, flavour: 'The ignition point.', icon: '✨' },
      { slug: 'grill',     name: 'Grill',      ticker: '$GRILL',    edition: 'global', startDate: '2026-06-01', endDate: '2026-08-31', flavour: 'Grilling season. Grilling your portfolio.', icon: '🔥' },
      { slug: 'backyard',  name: 'Backyard',   ticker: '$BACKYARD', edition: 'global', startDate: '2026-06-01', endDate: '2026-08-31', flavour: 'The best trades happen in the backyard.', icon: '🏡' },
      { slug: 'roadtrip',  name: 'Road Trip',  ticker: '$ROADTRIP', edition: 'global', startDate: null, endDate: null, flavour: 'No destination. No stop-loss.', icon: '🚗' },
      { slug: 'picnic',    name: 'Picnic',     ticker: '$PICNIC',   edition: 'global', startDate: '2026-05-15', endDate: '2026-08-31', flavour: 'Ants in the portfolio.', icon: '🧺' },
      { slug: 'sandcastle',name: 'Sandcastle', ticker: '$SANDCASTLE',edition:'global', startDate: '2026-06-15', endDate: '2026-08-31', flavour: 'Built something beautiful. Tide came in.', icon: '🏰' },
    ],
  },

  // ─── Crypto Pain Season ───────────────────────────────────────────────────
  {
    id: 'crypto-pain',
    name: 'Crypto Pain',
    theme: 'crypto',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    color: '#BF5FFF',
    icon: '📉',
    description: 'Evergreen. The Nexus\'s permanent tribute to the full emotional spectrum of crypto.',
    coins: [
      { slug: 'dump',       name: 'Dump',       ticker: '$DUMP',      edition: 'global', startDate: null, endDate: null, flavour: 'It\'s not a dump. It\'s a correction.', icon: '📉' },
      { slug: 'dip',        name: 'Dip',        ticker: '$DIP',       edition: 'global', startDate: null, endDate: null, flavour: 'Buy the dip. Every dip. All dips.', icon: '📊' },
      { slug: 'rekt',       name: 'Rekt',       ticker: '$REKT',      edition: 'global', startDate: null, endDate: null, flavour: 'Fully rekt. Spiritually rekt.', icon: '💀' },
      { slug: 'bagholder',  name: 'Bagholder',  ticker: '$BAGHOLDER', edition: 'global', startDate: null, endDate: null, flavour: 'Holding the bag. Always the bag.', icon: '👜' },
      { slug: 'hopium',     name: 'Hopium',     ticker: '$HOPIUM',    edition: 'global', startDate: null, endDate: null, flavour: 'The drug of choice in the Nexus.', icon: '💊' },
      { slug: 'copium2',    name: 'Copium',     ticker: '$COPIUM',    edition: 'global', startDate: null, endDate: null, flavour: 'Coping. Barely.', icon: '😮‍💨' },
      { slug: 'ngmi',       name: 'NGMI',       ticker: '$NGMI',      edition: 'global', startDate: null, endDate: null, flavour: 'Not gonna make it. Confirmed.', icon: '🚫' },
      { slug: 'paperhands', name: 'Paper Hands',ticker: '$PAPERHANDS',edition: 'global', startDate: null, endDate: null, flavour: 'Sold at the bottom. Again.', icon: '📄' },
      { slug: 'rugged',     name: 'Rugged',     ticker: '$RUGGED',    edition: 'global', startDate: null, endDate: null, flavour: 'The rug was always there.', icon: '🪤' },
      { slug: 'fomo',       name: 'FOMO',       ticker: '$FOMO',      edition: 'global', startDate: null, endDate: null, flavour: 'Fear of missing out. Fear of everything.', icon: '😱' },
      { slug: 'hype',       name: 'Hype',       ticker: '$HYPE',      edition: 'global', startDate: null, endDate: null, flavour: 'All hype. No fundamentals.', icon: '📢' },
      { slug: 'inevitable', name: 'Inevitable', ticker: '$INEVITABLE',edition: 'global', startDate: null, endDate: null, flavour: 'You knew this was coming.', icon: '⚡' },
      { slug: 'second',     name: 'Second',     ticker: '$SECOND',    edition: 'global', startDate: null, endDate: null, flavour: 'Second chance. Second mistake.', icon: '2️⃣' },
      { slug: 'oops',       name: 'Oops',       ticker: '$OOPS',      edition: 'global', startDate: null, endDate: null, flavour: 'Accidentally market sold.', icon: '😬' },
      { slug: 'fail',       name: 'Fail',       ticker: '$FAIL',      edition: 'global', startDate: null, endDate: null, flavour: 'Spectacular. Documented. Immortalised.', icon: '❌' },
    ],
  },

  // ─── Spooky Season ────────────────────────────────────────────────────────
  {
    id: 'spooky-season',
    name: 'Spooky Season',
    theme: 'spooky',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    color: '#FF6B35',
    icon: '🎃',
    description: 'October in the Nexus. Ghosts, ghouls, and coins that haunt your portfolio.',
    coins: [
      { slug: 'pumpkin',   name: 'Pumpkin',    ticker: '$PUMPKIN',  edition: 'global', startDate: '2026-10-01', endDate: '2026-10-31', flavour: 'Carved. Discarded. Like your position.', icon: '🎃' },
      { slug: 'voodoo',    name: 'Voodoo',     ticker: '$VOODOO',   edition: 'global', startDate: '2026-10-15', endDate: '2026-10-31', flavour: 'Cursed from the start.', icon: '🪆' },
      { slug: 'zombie',    name: 'Zombie',     ticker: '$ZOMBIE',   edition: 'global', startDate: '2026-10-20', endDate: '2026-10-31', flavour: 'Dead coin walking.', icon: '🧟' },
      { slug: 'ghost',     name: 'Ghost',      ticker: '$GHOST',    edition: 'global', startDate: '2026-10-01', endDate: '2026-10-31', flavour: 'Ghosted by the dev team.', icon: '👻' },
      { slug: 'witch',     name: 'Witch',      ticker: '$WITCH',    edition: 'global', startDate: '2026-10-15', endDate: '2026-10-31', flavour: 'Hexed your entry. Hexed your exit.', icon: '🧙' },
      { slug: 'curse',     name: 'Curse',      ticker: '$CURSE',    edition: 'global', startDate: null,         endDate: null,         flavour: 'Cursed wallet. Cursed chart.', icon: '🔮' },
      { slug: 'hex',       name: 'Hex',        ticker: '$HEX',      edition: 'global', startDate: null,         endDate: null,         flavour: 'Hexed. No cure.', icon: '⬡' },
      { slug: 'scary',     name: 'Scary',      ticker: '$SCARY',    edition: 'global', startDate: '2026-10-01', endDate: '2026-10-31', flavour: 'The chart is scarier than any costume.', icon: '😱' },
      { slug: 'haunt',     name: 'Haunt',      ticker: '$HAUNT',    edition: 'global', startDate: null,         endDate: null,         flavour: 'Haunted by your buy price.', icon: '👻' },
      { slug: 'cauldron',  name: 'Cauldron',   ticker: '$CAULDRON', edition: 'global', startDate: '2026-10-01', endDate: '2026-10-31', flavour: 'Brewing something. Probably bad.', icon: '🫕' },
      { slug: 'cobweb',    name: 'Cobweb',     ticker: '$COBWEB',   edition: 'global', startDate: '2026-10-01', endDate: '2026-10-31', flavour: 'Abandoned. Neglected. Dusty.', icon: '🕸️' },
      { slug: 'seance',    name: 'Séance',     ticker: '$SEANCE',   edition: 'global', startDate: '2026-10-20', endDate: '2026-10-31', flavour: 'Trying to contact the dev.', icon: '🕯️' },
      { slug: 'specter',   name: 'Specter',    ticker: '$SPECTER',  edition: 'global', startDate: null,         endDate: null,         flavour: 'A ghost of a chance.', icon: '👁️' },
      { slug: 'banshee',   name: 'Banshee',    ticker: '$BANSHEE',  edition: 'global', startDate: null,         endDate: null,         flavour: 'Screaming into the void.', icon: '😱' },
    ],
  },

  // ─── Holiday Season ───────────────────────────────────────────────────────
  {
    id: 'holiday-season',
    name: 'Holiday Season',
    theme: 'holiday',
    startDate: '2026-11-20',
    endDate: '2026-12-31',
    color: '#C41E3A',
    icon: '🎄',
    description: 'The most wonderful time of the year. Coins for the festive, the frugal, and the regifted.',
    coins: [
      { slug: 'yule',      name: 'Yule',       ticker: '$YULE',     edition: 'global', startDate: '2026-12-01', endDate: '2026-12-31', flavour: 'Burning the yule log. Burning the portfolio.', icon: '🪵' },
      { slug: 'krampus',   name: 'Krampus',    ticker: '$KRAMPUS',  edition: 'global', startDate: '2026-12-01', endDate: '2026-12-25', flavour: 'You\'ve been naughty. The market agrees.', icon: '😈' },
      { slug: 'elf',       name: 'Elf',        ticker: '$ELF',      edition: 'global', startDate: '2026-12-01', endDate: '2026-12-25', flavour: 'Working overtime in the Nexus workshop.', icon: '🧝' },
      { slug: 'noel',      name: 'Noel',       ticker: '$NOEL',     edition: 'global', startDate: '2026-12-20', endDate: '2026-12-25', flavour: 'The first noel. The last pump.', icon: '🎵' },
      { slug: 'coal',      name: 'Coal',       ticker: '$COAL',     edition: 'global', startDate: '2026-12-01', endDate: '2026-12-25', flavour: 'You got coal. Again.', icon: '⬛' },
      { slug: 'regift',    name: 'Regift',     ticker: '$REGIFT',   edition: 'global', startDate: '2026-12-20', endDate: '2026-12-31', flavour: 'Passed on the loss. Wrapped it nicely.', icon: '🎁' },
      { slug: 'turkey',    name: 'Turkey',     ticker: '$TURKEY',   edition: 'global', startDate: '2026-11-20', endDate: '2026-11-30', flavour: 'Stuffed. Roasted. Served.', icon: '🦃' },
      { slug: 'gravy',     name: 'Gravy',      ticker: '$GRAVY',    edition: 'global', startDate: '2026-11-20', endDate: '2026-11-30', flavour: 'Poured over everything. Still not enough.', icon: '🫙' },
      { slug: 'stuffed',   name: 'Stuffed',    ticker: '$STUFFED',  edition: 'global', startDate: '2026-11-26', endDate: '2026-11-27', flavour: 'Can\'t move. Won\'t sell.', icon: '🍽️' },
      { slug: 'blackfri',  name: 'Black Friday',ticker:'$BLACKFRI', edition: 'global', startDate: '2026-11-27', endDate: '2026-11-28', flavour: 'The biggest sale of the year. Except your bags.', icon: '🛍️' },
      { slug: 'yearend',   name: 'Year End',   ticker: '$YEAREND',  edition: 'global', startDate: '2026-12-28', endDate: '2026-12-31', flavour: 'Closing out the year. Closing out the position.', icon: '🎆' },
    ],
  },

  // ─── Food Season ──────────────────────────────────────────────────────────
  {
    id: 'food-season',
    name: 'Food Season',
    theme: 'food',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    color: '#FF9F43',
    icon: '🍽️',
    description: 'Evergreen. The Nexus is always hungry. Coins for every meal, snack, and regret.',
    coins: [
      { slug: 'bread',     name: 'Bread',      ticker: '$BREAD',    edition: 'global', startDate: null, endDate: null, flavour: 'The staff of life. The floor of the chart.', icon: '🍞' },
      { slug: 'chips',     name: 'Chips',      ticker: '$CHIPS',    edition: 'global', startDate: null, endDate: null, flavour: 'Can\'t stop at one.', icon: '🍟' },
      { slug: 'dip',       name: 'Dip',        ticker: '$DIP',      edition: 'global', startDate: null, endDate: null, flavour: 'The dip is always better with chips.', icon: '🫙' },
      { slug: 'guac',      name: 'Guac',       ticker: '$GUAC',     edition: 'global', startDate: null, endDate: null, flavour: 'Extra. Always extra.', icon: '🥑' },
      { slug: 'salsa',     name: 'Salsa',      ticker: '$SALSA',    edition: 'global', startDate: null, endDate: null, flavour: 'Hot. Spicy. Volatile.', icon: '🌶️' },
      { slug: 'sauce',     name: 'Sauce',      ticker: '$SAUCE',    edition: 'global', startDate: null, endDate: null, flavour: 'Secret sauce. No one knows the recipe.', icon: '🫙' },
      { slug: 'crisp',     name: 'Crisp',      ticker: '$CRISP',    edition: 'global', startDate: null, endDate: null, flavour: 'Perfectly timed. Perfectly executed.', icon: '✨' },
      { slug: 'reheat',    name: 'Reheat',     ticker: '$REHEAT',   edition: 'global', startDate: null, endDate: null, flavour: 'Yesterday\'s trade. Today\'s regret.', icon: '🔥' },
      { slug: 'microwave', name: 'Microwave',  ticker: '$MICROWAVE',edition: 'global', startDate: null, endDate: null, flavour: '30 seconds. That\'s all it took.', icon: '📡' },
      { slug: 'casserole', name: 'Casserole',  ticker: '$CASSEROLE',edition: 'global', startDate: null, endDate: null, flavour: 'Slow-cooked. Long-term hold.', icon: '🫕' },
      { slug: 'potluck',   name: 'Potluck',    ticker: '$POTLUCK',  edition: 'global', startDate: null, endDate: null, flavour: 'Everyone brings something. No one brings gains.', icon: '🍲' },
      { slug: 'snacks',    name: 'Snacks',     ticker: '$SNACKS',   edition: 'global', startDate: null, endDate: null, flavour: 'Snacking on the portfolio.', icon: '🍿' },
      { slug: 'canned',    name: 'Canned',     ticker: '$CANNED',   edition: 'global', startDate: null, endDate: null, flavour: 'Preserved. Indefinitely.', icon: '🥫' },
    ],
  },

  // ─── Autumn ───────────────────────────────────────────────────────────────
  {
    id: 'autumn',
    name: 'Autumn',
    theme: 'autumn',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    color: '#E07B39',
    icon: '🍂',
    description: 'The leaves are falling. So is the portfolio. Coins for the harvest and the decline.',
    coins: [
      { slug: 'fallleaf',  name: 'Fall Leaf',  ticker: '$FALLLEAF', edition: 'global', startDate: '2026-09-20', endDate: '2026-11-15', flavour: 'Letting go. Gracefully.', icon: '🍂' },
      { slug: 'harvest',   name: 'Harvest',    ticker: '$HARVEST',  edition: 'global', startDate: '2026-09-01', endDate: '2026-10-31', flavour: 'Reaping what you sowed.', icon: '🌾' },
      { slug: 'sleet',     name: 'Sleet',      ticker: '$SLEET',    edition: 'global', startDate: '2026-10-15', endDate: '2026-11-30', flavour: 'Not quite rain. Not quite snow. Not quite a pump.', icon: '🌨️' },
      { slug: 'soggy',     name: 'Soggy',      ticker: '$SOGGY',    edition: 'global', startDate: null,         endDate: null,         flavour: 'Waterlogged. Waterlogged portfolio.', icon: '💧' },
      { slug: 'overcooked',name: 'Overcooked', ticker: '$OVERCOOKED',edition:'global', startDate: null,         endDate: null,         flavour: 'Left it too long. Ruined it.', icon: '🔥' },
    ],
  },
];

/** Look up a season by ID */
export function getSeasonById(id: string): Season | undefined {
  return SEASONS.find((s) => s.id === id);
}

/** All unique themes */
export const SEASON_THEMES = [...new Set(SEASONS.map((s) => s.theme))];
