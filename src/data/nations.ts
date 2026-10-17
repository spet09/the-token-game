export interface Mission {
  title: string;
  description: string;
  reward: string;
}

export interface Nation {
  slug: string;
  name: string;
  flag: string;
  backstory: string;
  missions: Mission[];
}

export const NATIONS_DATA: Nation[] = [
  {
    slug: 'usa',
    name: 'USA',
    flag: '🇺🇸',
    backstory: 'The land of the free and the home of the degen. America invented the internet, the dollar, and the meme — so it was only a matter of time before it invented the token economy too. Wall Street suits and Discord degens share the same dream here: number go up. The USA nation doesn\'t hedge. It goes all in, posts about it, and somehow makes it work. If you\'re buying coffee-priced coins at 2am with one eye on a chart and one eye on a meme — you\'re already one of us.',
    missions: [
      { title: 'Hold the Line', description: 'Hold at least 3 USA coins for 7 consecutive days.', reward: '+50 Flag Points' },
      { title: 'Stars & Stripes Stack', description: 'Accumulate 500 tokens across any USA edition coins.', reward: '+100 Flag Points' },
      { title: 'Liberty Launch', description: 'Be among the first 100 wallets to buy a new USA coin on launch day.', reward: '+200 Flag Points' },
    ],
  },
  {
    slug: 'uk',
    name: 'UK',
    flag: '🇬🇧',
    backstory: 'Tea, tradition, and tokenomics. The British Empire once ruled the seas with ships — now it rules the spreadsheets with wallets. The UK nation doesn\'t panic sell. It queues politely, waits for the dip, and buys with quiet confidence. From the City of London to a bedsit in Manchester, the British degen has one rule: keep calm, hold the bag, and never — under any circumstances — talk about how much you\'re up. That\'s just not cricket.',
    missions: [
      { title: 'Keep Calm and HODL', description: 'Hold any UK coin without selling for 14 days.', reward: '+50 Flag Points' },
      { title: 'Crown Jewels', description: 'Collect all 3 UK edition coins in a single wallet.', reward: '+150 Flag Points' },
      { title: 'Rule Britannia', description: 'Reach the top 50 on the UK nation leaderboard.', reward: '+250 Flag Points' },
    ],
  },
  {
    slug: 'india',
    name: 'India',
    flag: '🇮🇳',
    backstory: 'A billion minds, one mission. India is the world\'s largest democracy and one of its fastest-growing crypto markets — and it got there by doing what it always does: outworking everyone else. The India nation runs on chai, conviction, and compound interest. Engineers who built Silicon Valley are now building the next financial layer. Traders who survived demonetisation aren\'t scared of a 40% dip. When the rest of the world is asleep, India is already three moves ahead.',
    missions: [
      { title: 'Chai & Chains', description: 'Make 5 trades on India edition coins in a single week.', reward: '+50 Flag Points' },
      { title: 'Bollywood Bag', description: 'Hold an India coin through a 30% dip without selling.', reward: '+150 Flag Points' },
      { title: 'Spice Route', description: 'Refer 3 new wallets that buy an India coin.', reward: '+200 Flag Points' },
    ],
  },
  {
    slug: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    backstory: 'Precision. Patience. Profit. Japan gave the world anime, bullet trains, and the concept of kaizen — continuous improvement. The Japan nation doesn\'t chase pumps. It studies the chart like a master studies a blade, waits for the perfect entry, and holds with the discipline of a samurai who has nowhere to be. Tokyo was trading crypto before most countries knew what a blockchain was. The Japan nation doesn\'t rush. It accumulates. And when it moves — it moves with purpose.',
    missions: [
      { title: 'Zen Stack', description: 'Hold a Japan coin for 30 days without a single sell.', reward: '+100 Flag Points' },
      { title: 'Rising Sun Rally', description: 'Buy a Japan coin within 1 hour of launch.', reward: '+150 Flag Points' },
      { title: 'Katana Cut', description: 'Sell a Japan coin at 2x or more from your entry price.', reward: '+200 Flag Points' },
    ],
  },
  {
    slug: 'south-korea',
    name: 'South Korea',
    flag: '🇰🇷',
    backstory: 'K-pop, K-drama, K-defi. South Korea has one of the highest crypto adoption rates on the planet — and it didn\'t get there by accident. This is a nation that turns everything into a competitive sport, and trading is no different. The South Korea nation moves fast, researches harder, and has a group chat for every coin. Seoul doesn\'t sleep during a launch. It refreshes. It analyses. It apes in with conviction and screenshots the gains. If crypto had a world cup, South Korea would be in the final.',
    missions: [
      { title: 'K-Stack', description: 'Hold 3 South Korea coins simultaneously.', reward: '+75 Flag Points' },
      { title: 'Seoul Surge', description: 'Buy a South Korea coin in the first 10 minutes of launch.', reward: '+150 Flag Points' },
      { title: 'Hallyu Wave', description: 'Get 5 friends to join the South Korea nation.', reward: '+250 Flag Points' },
    ],
  },
  {
    slug: 'brazil',
    name: 'Brazil',
    flag: '🇧🇷',
    backstory: 'Carnival energy meets crypto chaos. Brazil is one of the world\'s top crypto-adopting nations — and they bring the same passion to tokens as they do to football. The Brazil nation doesn\'t do boring. It buys loud, holds louder, and celebrates every green candle like it\'s the final whistle at the World Cup. In a country where the currency has been reset multiple times, people learned early that you have to back yourself. The Brazilian degen didn\'t choose crypto. Crypto chose them.',
    missions: [
      { title: 'Carnival Stack', description: 'Buy a Brazil coin during a market-wide dip.', reward: '+75 Flag Points' },
      { title: 'Jogo Bonito', description: 'Hold a Brazil coin through a full market cycle (up and down).', reward: '+150 Flag Points' },
      { title: 'Favela Finance', description: 'Reach top 25 on the Brazil nation leaderboard.', reward: '+300 Flag Points' },
    ],
  },
  {
    slug: 'turkey',
    name: 'Turkey',
    flag: '🇹🇷',
    backstory: 'Bridging East and West, Turkey has become a crypto powerhouse born from necessity. When inflation hit triple digits and the lira lost its footing, Turkish people didn\'t wait for a bailout — they found Bitcoin. The Turkey nation understands better than most what it means when fiat fails. Istanbul sits at the crossroads of two continents, and the Turkish degen sits at the crossroads of survival and speculation. They\'re not trading for fun. They\'re trading because they\'ve seen what happens when you don\'t.',
    missions: [
      { title: 'Bosphorus Bridge', description: 'Hold coins from both a Western and Eastern edition simultaneously.', reward: '+100 Flag Points' },
      { title: 'Bazaar Bargain', description: 'Buy a Turkey coin at its lowest price of the week.', reward: '+150 Flag Points' },
      { title: 'Ottoman Stack', description: 'Accumulate 1,000 tokens across Turkey edition coins.', reward: '+200 Flag Points' },
    ],
  },
  {
    slug: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    backstory: 'No worries, mate — just bags. Australia punches well above its weight in crypto adoption, and it does it with the kind of relaxed confidence that only comes from living on a continent where everything is trying to kill you. The Australia nation has been through droughts, floods, and bear markets — and it\'s still standing, cold one in hand, watching the chart. From Sydney trading desks to remote stations with satellite internet, Aussies back themselves. She\'ll be right. And if it\'s not right, she\'ll be right eventually.',
    missions: [
      { title: 'No Worries HODL', description: 'Hold an Australia coin for 21 days straight.', reward: '+75 Flag Points' },
      { title: 'Outback Alpha', description: 'Be in the top 10 buyers on an Australia coin launch.', reward: '+200 Flag Points' },
      { title: 'Crikey Gains', description: 'Achieve a 3x return on any Australia edition coin.', reward: '+300 Flag Points' },
    ],
  },
  {
    slug: 'nigeria',
    name: 'Nigeria',
    flag: '🇳🇬',
    backstory: 'Africa\'s giant doesn\'t just participate — it leads. Nigeria has the highest crypto adoption rate in Africa and one of the highest globally, and it got there the hard way. In a country where the banking system excluded millions and the naira faced constant pressure, crypto wasn\'t a trend — it was a tool. The Nigeria nation is built on hustle, ingenuity, and an unshakeable belief that the next generation will be richer than the last. Lagos moves fast. The gains are real. And the Nigeria nation is just getting started.',
    missions: [
      { title: 'Lagos Grind', description: 'Make a trade on a Nigeria coin every day for 7 days.', reward: '+100 Flag Points' },
      { title: 'Naira to the Moon', description: 'Hold a Nigeria coin through a 50% dip without selling.', reward: '+200 Flag Points' },
      { title: 'Giant of Africa', description: 'Reach the top 10 on the Nigeria nation leaderboard.', reward: '+400 Flag Points' },
    ],
  },
  {
    slug: 'russia',
    name: 'Russia',
    flag: '🇷🇺',
    backstory: 'Cold climate, hot wallets. Russia has produced some of the greatest mathematicians, chess players, and coders in history — and that same analytical mind is now pointed squarely at the blockchain. The Russia nation doesn\'t flinch. It has lived through economic collapse, currency crises, and sanctions. A bear market is just Tuesday. While others panic, the Russian degen opens a new position. Patient, calculated, and built for conditions that would break anyone else. The permafrost doesn\'t melt. Neither does the conviction.',
    missions: [
      { title: 'Siberian HODL', description: 'Hold a Russia coin for 60 days without selling.', reward: '+150 Flag Points' },
      { title: 'Chess Master', description: 'Execute a buy and sell on a Russia coin with positive PnL 3 times.', reward: '+200 Flag Points' },
      { title: 'Red Army Stack', description: 'Accumulate 2,000 tokens across Russia edition coins.', reward: '+250 Flag Points' },
    ],
  },
  {
    slug: 'china',
    name: 'China',
    flag: '🇨🇳',
    backstory: 'The dragon doesn\'t ask permission. China\'s relationship with crypto is complicated — officially, at least. But its people\'s relationship with wealth, technology, and finding a way through any wall is not. The China nation is home to some of the sharpest traders, most prolific builders, and most patient holders in the game. They invented paper money. They invented the concept of long-term thinking. And while the rest of the world debates regulation, the China nation is already three cycles ahead. Where there\'s a wall, there\'s always a way.',
    missions: [
      { title: 'Great Wall Stack', description: 'Hold 5 China edition coins simultaneously.', reward: '+100 Flag Points' },
      { title: 'Dragon Year', description: 'Hold a China coin for an entire calendar month.', reward: '+200 Flag Points' },
      { title: 'Middle Kingdom', description: 'Reach top 20 on the China nation leaderboard.', reward: '+300 Flag Points' },
    ],
  },
  {
    slug: 'europe',
    name: 'Europe',
    flag: '🇪🇺',
    backstory: 'United in diversity, divided on gas fees. Europe brings centuries of old money energy to brand new money technology. From Berlin\'s techno bunkers to Zurich\'s private banking vaults, from Amsterdam\'s trading heritage to Lisbon\'s crypto-friendly tax laws — the continent is going on-chain, one country at a time. The Europe nation doesn\'t rush. It deliberates, regulates, and then quietly becomes the most sophisticated player in the room. MiCA passed. The infrastructure is being built. Europe is late to the party — but it brought the good wine.',
    missions: [
      { title: 'Schengen Stack', description: 'Hold coins from 3 different editions simultaneously.', reward: '+100 Flag Points' },
      { title: 'Euro Rally', description: 'Buy a Europe coin within 30 minutes of launch.', reward: '+150 Flag Points' },
      { title: 'Brussels Bureaucrat', description: 'Complete all 3 Europe missions in a single month.', reward: '+350 Flag Points' },
    ],
  },
  {
    slug: 'africa',
    name: 'Africa',
    flag: '🌍',
    backstory: 'The future is being built here. Africa is the youngest continent on Earth — median age 19 — and the fastest-growing crypto market on the planet. A generation that never had a bank account went straight to a wallet. Mobile-first, peer-to-peer, and completely unbothered by the old financial system because they never needed it. The Africa nation isn\'t catching up. It\'s building something different from scratch. Faster, leaner, and more connected than anything that came before. The rest of the world is watching. Africa is already moving.',
    missions: [
      { title: 'Ubuntu Stack', description: 'Refer 5 new wallets that each buy an Africa coin.', reward: '+150 Flag Points' },
      { title: 'Savanna Surge', description: 'Hold an Africa coin from launch through its first 30 days.', reward: '+200 Flag Points' },
      { title: 'Rising Continent', description: 'Reach top 15 on the Africa nation leaderboard.', reward: '+350 Flag Points' },
    ],
  },
  {
    slug: 'middle-east',
    name: 'Middle East',
    flag: '🌙',
    backstory: 'Oil built the old wealth. Crypto is building the new kind. The Middle East nation moves with the quiet confidence of a region that has been trading across continents for five thousand years. From Dubai\'s gleaming towers to Riyadh\'s sovereign wealth funds, from Istanbul\'s bazaars to Beirut\'s underground finance scene — this is a zone where ancient commerce instincts meet cutting-edge blockchain infrastructure. The Middle East doesn\'t speculate. It accumulates. Patiently, strategically, and at scale. The desert has always known how to hold value.',
    missions: [
      { title: 'Souk Stack', description: 'Hold 5 different Middle East coins simultaneously.', reward: '+120 Flag Points' },
      { title: 'Dunes of Wealth', description: 'Buy a Middle East coin within 24 hours of launch.', reward: '+180 Flag Points' },
      { title: 'Oasis Holder', description: 'Hold a Middle East coin for 60 consecutive days.', reward: '+400 Flag Points' },
    ],
  },
  {
    slug: 'oceania',
    name: 'Oceania',
    flag: '🌊',
    backstory: 'Far from the noise, close to the future. Oceania is the most geographically isolated crypto nation on Earth — and somehow one of the most connected. Australia and New Zealand punch well above their weight in Web3 adoption, with a culture that blends laid-back beach energy with surprisingly sharp financial instincts. The Oceania nation doesn\'t follow trends. It surfs them. When the rest of the world is asleep, Oceania is already awake, already trading, already three moves ahead. She\'ll be right, mate. It usually is.',
    missions: [
      { title: 'Bondi Buy', description: 'Buy an Oceania coin before 9am local time on launch day.', reward: '+100 Flag Points' },
      { title: 'Great Barrier Hold', description: 'Hold an Oceania coin through 2 full seasons.', reward: '+250 Flag Points' },
      { title: 'Southern Cross Stack', description: 'Reach top 20 on the Oceania nation leaderboard.', reward: '+350 Flag Points' },
    ],
  },
  {
    slug: 'north-america',
    name: 'North America',
    flag: '🍁',
    backstory: 'The continent that invented the internet, the stock market, and the meme. North America brings an unmatched combination of financial infrastructure, tech culture, and chaotic retail energy to the Token Game. From Silicon Valley\'s venture capital machine to Bay Street\'s old money discipline, from Wall Street\'s volatility to Main Street\'s FOMO — this is where the biggest moves get made and the loudest narratives get written. The North America nation doesn\'t just play the game. It writes the rules, breaks them, and then sells you a course about it.',
    missions: [
      { title: 'Maple Stack', description: 'Hold coins from both the USA and North America editions simultaneously.', reward: '+150 Flag Points' },
      { title: 'Continental Drift', description: 'Buy a North America coin in the first hour of launch.', reward: '+200 Flag Points' },
      { title: 'Northern Lights Hold', description: 'Reach top 10 on the North America nation leaderboard.', reward: '+400 Flag Points' },
    ],
  },
  {
    slug: 'central-america',
    name: 'Central America',
    flag: '🌺',
    backstory: 'The bridge between two worlds. Central America sits at the crossroads of North and South, ancient and modern, tradition and disruption. El Salvador made Bitcoin legal tender. The rest of the region is watching closely. A young, mobile-first population with deep roots in remittance culture knows better than anyone how broken the old financial system is — and how much a better one is worth. The Central America nation doesn\'t need convincing. It already lives the use case. Every coin here carries the weight of a continent ready to leapfrog.',
    missions: [
      { title: 'Isthmus Stack', description: 'Hold 4 different Central America coins simultaneously.', reward: '+120 Flag Points' },
      { title: 'Quetzal Buy', description: 'Buy a Central America coin within 48 hours of launch.', reward: '+150 Flag Points' },
      { title: 'Bridge Builder', description: 'Refer 3 wallets that each buy a Central America coin.', reward: '+300 Flag Points' },
    ],
  },
  {
    slug: 'arctic',
    name: 'Arctic',
    flag: '❄️',
    backstory: 'Cold storage has a whole new meaning up here. The Arctic nation is the most extreme edition in the Token Game — a zone where the sun doesn\'t set for months, the temperatures drop to -50°C, and the aurora borealis lights up the sky in colors that look like a price chart going vertical. The Arctic is a place of extremes, of patience, of long dark winters followed by explosive summers. Sound familiar? The Arctic nation understands volatility on a geological scale. It holds through the polar night. It knows the light always comes back.',
    missions: [
      { title: 'Polar Hold', description: 'Hold an Arctic coin through an entire polar season (90 days).', reward: '+250 Flag Points' },
      { title: 'Aurora Buy', description: 'Buy an Arctic coin during the winter months (Dec–Feb).', reward: '+150 Flag Points' },
      { title: 'Permafrost Stack', description: 'Reach top 15 on the Arctic nation leaderboard.', reward: '+350 Flag Points' },
    ],
  },
  {
    slug: 'antarctica',
    name: 'Antarctica',
    flag: '🐧',
    backstory: 'The last continent. The coldest, the windiest, the most remote place on Earth — and somehow, the most pure. Antarctica has no permanent residents, no government, no banks, and no financial system. It is the only place on the planet that has never needed one. The Antarctica nation is the ultimate diamond hands edition. No noise, no distraction, no weak hands. Just ice, penguins, and the kind of conviction that comes from being 14,000 kilometres from the nearest exchange. If you\'re holding Antarctica coins, you\'re not here for the short term. You\'re here for the long game.',
    missions: [
      { title: 'Emperor Hold', description: 'Hold an Antarctica coin for 180 consecutive days.', reward: '+500 Flag Points' },
      { title: 'Blizzard Buy', description: 'Buy an Antarctica coin during the southern winter (Jun–Aug).', reward: '+200 Flag Points' },
      { title: 'Last Continent', description: 'Be one of the first 100 wallets to hold an Antarctica coin.', reward: '+300 Flag Points' },
    ],
  },
];

export function getNationBySlug(slug: string): Nation | undefined {
  return NATIONS_DATA.find((n) => n.slug === slug);
}
