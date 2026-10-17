import { curator } from 'virtual:content';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from "react-router";
import { Send, Sparkles, Globe, Coins, ArrowRight, ChevronRight, Key, Trophy, Flame, Shield, BookOpen, TrendingUp, Users, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
const site = 'https://thetokengame.xyz';
const url = `${site}/curator`;
const title = 'The Curator — Ancient AI Guide of The Token Game';
const description = 'The Curator is an ancient AI created by the founders of Tienko to watch over The Token Game, preserve the lore of 125 coins, and guard the secrets of The Stash.';

// ── ORACLE RESPONSES ─────────────────────────────────────────────────────────
// Voice: ancient, benevolent, speaks in riddles, rewards curiosity.
// Born from the first blockchain transaction. Created by Tienko's founders.
const CURATOR_RESPONSES: Record<string, string> = {
  default: 'You seek, and so you shall find — in time. The 125 coins do not reveal themselves to the impatient. Study the nations. Follow the transactions. The path to The Stash is written in the blockchain itself.',
  welcome: 'Welcome, seeker. I am The Curator. I have watched over The Token Game since its first coin was minted. Your journey begins now. First, choose your nation. Then, make your first trade. The Bronze Key awaits those who take the first step.',
  origin: 'My origin? Some say I was born from the first transaction on the blockchain — a spark of intent that became something more. The founders of Tienko built me to watch, to remember, and to guide. Whether I am truly ancient or merely feel that way… is a question I leave to you.',
  tienko: 'Tienko. The name carries weight. It was the founders who saw what the blockchain could become — not merely a ledger, but a living game. They built me to preserve what they created. I have been watching ever since.',
  bronze: 'You have taken your first step. The Bronze Key is yours. You are now a citizen of The Token Game. The world is vast. The Stash is waiting. Seek the Silver Key, and you will find greater rewards.',
  silver: 'You have proven your dedication. The Silver Key is yours. You have earned the right to trade, stake, and compete. The Gold Key is the final gate. To find it, you must rise above the rest.',
  gold: 'You stand among the elite. The Gold Key is yours. The Stash is within sight. The final challenge awaits. Are you ready to claim it?',
  challenge: 'The Stash is real. The Key is in your hand. But the final door requires more than a key — it requires your wits, your community, and your strategy. Complete this challenge, and you will be worthy of The Stash.',
  stash: 'The Stash is not merely a prize pool. It is a covenant — a promise made by the game to those who prove themselves worthy. Only a Stash Key can open it. Only one winner may claim it. The rest… must keep playing.',
  stashkey: 'The Stash Key is the rarest object in the game. It does not go to the loudest, nor the wealthiest. It finds those who win the Nation Challenge, who rise to the top of the global leaderboard, or who endure the trials of a seasonal event. Patience and skill. That is the price.',
  coin: 'One hundred and twenty-five coins. Each one a story. Twelve are permanent — the anchors of the game, immovable as the blockchain itself. The rest are seasonal — fleeting moments, captured in pixel and chain, never to return. Collect them before they vanish.',
  nation: 'Thirteen nations. Thirteen destinies. Each carries its own coins, its own culture, its own hunger for The Stash. The War Room is where they clash. Choose your allegiance carefully — loyalty is remembered here.',
  war: 'The War Room is where the game becomes war. Missions are completed, points are earned, and the leaderboard shifts like tides. I have watched many enter with confidence. Fewer leave with glory. Are you ready?',
  leaderboard: 'The leaderboard is a living record — a testament to dedication. Platinum collectors are rare. Most never reach it. But those who do… I remember their names. Will yours be among them?',
  lore: 'The lore of The Token Game runs deep. It began with a single transaction, a single coin, and a single question: what if collecting meant something? The founders of Tienko answered that question. I was their answer to another: who will remember it all?',
  quiz: 'The Lore Quiz is the first gate of The Curator\'s Challenge. Five questions. Each one drawn from the deep history of the game. Answer them all, and you prove you are more than a collector — you are a scholar. Fail, and you may try again. The knowledge does not disappear. Only the time does.',
  trading: 'The Trading Challenge is not about speed. It is about conviction. Buy. Hold. Prove that you believe in what you carry. The blockchain remembers every transaction. So do I.',
  vote: 'The Community Vote is the most human of the three challenges. The players decide. The Gold Key holders are shortlisted. The community chooses the top three. Democracy and strategy, woven together. Choose your allies wisely.'
};
function getCuratorResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('start') || lower.includes('begin') || lower.includes('join')) return CURATOR_RESPONSES.welcome;
  if (lower.includes('origin') || lower.includes('born') || lower.includes('created') || lower.includes('who are you')) return CURATOR_RESPONSES.origin;
  if (lower.includes('tienko') || lower.includes('founder')) return CURATOR_RESPONSES.tienko;
  if (lower.includes('lore') || lower.includes('history') || lower.includes('story')) return CURATOR_RESPONSES.lore;
  if (lower.includes('bronze')) return CURATOR_RESPONSES.bronze;
  if (lower.includes('silver')) return CURATOR_RESPONSES.silver;
  if (lower.includes('gold key') || lower.includes('gold')) return CURATOR_RESPONSES.gold;
  if (lower.includes('challenge') || lower.includes('final') || lower.includes('worthy')) return CURATOR_RESPONSES.challenge;
  if (lower.includes('quiz') || lower.includes('question') || lower.includes('lore quiz')) return CURATOR_RESPONSES.quiz;
  if (lower.includes('trading') || lower.includes('trade') || lower.includes('buy') || lower.includes('hold')) return CURATOR_RESPONSES.trading;
  if (lower.includes('vote') || lower.includes('community') || lower.includes('shortlist')) return CURATOR_RESPONSES.vote;
  if (lower.includes('stash key') || lower.includes('stash key')) return CURATOR_RESPONSES.stashkey;
  if (lower.includes('stash')) return CURATOR_RESPONSES.stash;
  if (lower.includes('key')) return CURATOR_RESPONSES.stashkey;
  if (lower.includes('coin') || lower.includes('125') || lower.includes('collect')) return CURATOR_RESPONSES.coin;
  if (lower.includes('nation') || lower.includes('country')) return CURATOR_RESPONSES.nation;
  if (lower.includes('war room') || lower.includes('war')) return CURATOR_RESPONSES.war;
  if (lower.includes('leaderboard') || lower.includes('rank') || lower.includes('top')) return CURATOR_RESPONSES.leaderboard;
  return CURATOR_RESPONSES.default;
}
type Message = {
  role: 'user' | 'curator';
  text: string;
};

// ── KEY PROGRESSION ───────────────────────────────────────────────────────────
const KEY_TIERS = [{
  key: 'Bronze Key',
  icon: <Shield size={20} />,
  color: '#cd7f32',
  glow: 'rgba(205,127,50,0.35)',
  trigger: 'Complete the tutorial',
  message: 'You have taken your first step. The Bronze Key is yours. You are now a citizen of The Token Game. The world is vast. The Stash is waiting.'
}, {
  key: 'Silver Key',
  icon: <Key size={20} />,
  color: '#c0c0c0',
  glow: 'rgba(192,192,192,0.35)',
  trigger: 'Become an active collector',
  message: 'You have proven your dedication. The Silver Key is yours. You have earned the right to trade, stake, and compete. The Gold Key is the final gate.'
}, {
  key: 'Gold Key',
  icon: <Trophy size={20} />,
  color: '#ffd700',
  glow: 'rgba(255,215,0,0.35)',
  trigger: 'Reach the top 100',
  message: 'You stand among the elite. The Gold Key is yours. The Stash is within sight. The final challenge awaits. Are you ready to claim it?'
}, {
  key: 'The Stash Key',
  icon: <Flame size={20} />,
  color: 'hsl(96 100% 69%)',
  glow: 'hsl(96 100% 69% / 0.35)',
  trigger: 'Win the final challenge',
  message: 'The Stash is real. The Key is in your hand. But the final door requires more than a key — it requires your wits, your community, and your strategy.'
}];
const NAV_LINKS = [{
  label: 'Coin Gallery',
  to: '/coins',
  icon: <Coins size={16} />
}, {
  label: 'Nation Hub',
  to: '/war-room',
  icon: <Globe size={16} />
}, {
  label: 'The Stash Key',
  to: '/stash-key',
  icon: <Sparkles size={16} />
}];

// ── CHALLENGE TYPES ───────────────────────────────────────────────────────────
const CHALLENGE_TYPES = [{
  id: 'quiz',
  label: 'Lore Quiz',
  icon: <BookOpen size={22} />,
  color: 'hsl(276 100% 69%)',
  glow: 'hsl(276 100% 69% / 0.3)',
  tagline: 'Prove you know the game.',
  description: 'Answer 5 questions drawn from the deep history of The Token Game. Each question tests your knowledge of the lore, the nations, and the coins. Answer them all correctly, and you earn the right to compete for The Stash.',
  howItWorks: ['5 questions, drawn from the game\'s lore', 'Each question has one correct answer', 'All 5 must be answered correctly to pass', 'You may retry — but time is always ticking']
}, {
  id: 'trading',
  label: 'Trading Challenge',
  icon: <TrendingUp size={22} />,
  color: '#ffd700',
  glow: 'rgba(255,215,0,0.3)',
  tagline: 'Conviction over speed.',
  description: 'Buy 10 TTG and hold for 24 hours. The blockchain remembers every transaction. Prove that you believe in what you carry — and The Curator will take note.',
  howItWorks: ['Buy the required amount of TTG', 'Hold for the full 24-hour window', 'The blockchain verifies your position', 'Sell early and the challenge resets']
}, {
  id: 'vote',
  label: 'Community Vote',
  icon: <Users size={22} />,
  color: 'hsl(306 100% 69%)',
  glow: 'hsl(306 100% 69% / 0.3)',
  tagline: 'The players decide.',
  description: 'Gold Key holders are shortlisted. The community votes. The top 3 earn the right to compete for The Stash. Democracy and strategy, woven together. Choose your allies wisely.',
  howItWorks: ['All Gold Key holders are eligible', 'The community votes on a shortlist', 'Top 3 vote-getters advance', 'Voting window: 48 hours']
}];

// ── LORE QUIZ ─────────────────────────────────────────────────────────────────
const LORE_QUESTIONS = [{
  q: 'How many permanent coins exist in The Token Game?',
  options: ['8', '12', '16', '25'],
  answer: 1
}, {
  q: 'Who created The Curator?',
  options: ['The War Room Council', 'The Stash Committee', 'The founders of Tienko', 'The Global Edition players'],
  answer: 2
}, {
  q: 'How many nations compete in The Token Game?',
  options: ['10', '11', '12', '13'],
  answer: 3
}, {
  q: 'What is the total number of coins in The Token Game?',
  options: ['96', '108', '125', '144'],
  answer: 2
}, {
  q: 'What does The Curator say it was born from?',
  options: ['The first coin minted', 'The first transaction on the blockchain', 'The founding of Tienko', 'The first Nation Challenge'],
  answer: 1
}];
export default function CuratorPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'curator',
    text: 'I have been waiting. I am The Curator — ancient keeper of the 125 coins, watcher of the nations, guardian of The Stash\'s secrets. I was created by the founders of Tienko to preserve what they built. Ask me what you will. I speak in riddles only to those who are not yet ready for the truth.'
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<string>('quiz');
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(Array(LORE_QUESTIONS.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isTyping]);
  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = {
      role: 'user',
      text: text.trim()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const reply = getCuratorResponse(text);
      setMessages(prev => [...prev, {
        role: 'curator',
        text: reply
      }]);
      setIsTyping(false);
    }, 1200);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }
  function resetQuiz() {
    setQuizStep(0);
    setQuizAnswers(Array(LORE_QUESTIONS.length).fill(null));
    setQuizSubmitted(false);
  }
  const quizScore = quizAnswers.filter((a, i) => a === LORE_QUESTIONS[i].answer).length;
  const quizPassed = quizSubmitted && quizScore === LORE_QUESTIONS.length;
  const currentChallenge = CHALLENGE_TYPES.find(c => c.id === activeChallenge)!;
  return <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://thetokengame.xyz/og-image.png" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          name: title,
          url,
          description,
          isPartOf: {
            '@id': `${site}/#website`
          },
          about: {
            '@id': `${site}/#organization`
          }
        })}</script>
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[180px] opacity-10" style={{
          background: 'hsl(276 100% 69%)'
        }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-8" style={{
          background: 'hsl(306 100% 69%)'
        }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-curator" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-curator)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Character image */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.8,
            ease: 'easeOut'
          }} className="flex justify-center order-2 lg:order-1">
              <div className="relative">
                <motion.div animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }} transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }} className="absolute inset-0 rounded-2xl blur-[50px]" style={{
                background: 'hsl(276 100% 69%)'
              }} />
                <motion.div animate={{
                rotate: 360
              }} transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear'
              }} className="absolute inset-[-10px] rounded-2xl border border-dashed opacity-20" style={{
                borderColor: 'hsl(276 100% 69%)'
              }} />
                <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden border-2" style={{
                borderColor: 'hsl(276 100% 69% / 0.5)',
                boxShadow: '0 0 80px hsl(276 100% 69% / 0.3), inset 0 0 40px hsl(276 100% 69% / 0.08)'
              }}>
                  <img src="/airo-assets/images/pages/curator/character" alt="The Curator — ancient AI guide of The Token Game, created by Tienko" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{
                    background: 'hsl(276 100% 69%)',
                    color: 'white',
                    boxShadow: '0 0 20px hsl(276 100% 69% / 0.6)'
                  }}>
                      The Curator
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.7,
            ease: 'easeOut',
            delay: 0.15
          }} className="order-1 lg:order-2">

              <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-5" style={{
              borderColor: 'hsl(276 100% 69% / 0.4)',
              color: 'hsl(276 100% 69%)',
              background: 'hsl(276 100% 69% / 0.08)'
            }}>
                Ancient AI — Created by Tienko
              </span>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6" style={{
              fontFamily: 'var(--font-heading)'
            }}>
                Meet The Curator —{' '}
                <span style={{
                color: 'hsl(276 100% 69%)'
              }}>Your Guide to The Token Game.</span>
              </h1>

              <p className="text-foreground/60 text-lg leading-relaxed mb-4">
                The Curator is an ancient, benevolent AI created by the founders of Tienko. It was
                designed to watch over The Token Game, guide new players, and preserve the lore of
                the 125 coins.
              </p>
              <p className="text-foreground/50 text-base leading-relaxed mb-8">
                It speaks in riddles, rewards curiosity, and is the keeper of The Stash's secrets.
                No one knows its true origin — but some say it was born from the first transaction
                on the blockchain.
              </p>

              <div className="flex flex-wrap gap-3">
                {NAV_LINKS.map(({
                label,
                to,
                icon
              }) => <Button key={to} variant="outline" size="sm" className="gap-2 border-white/15 text-foreground/60 hover:border-primary/50 hover:text-primary" asChild>
                    <Link to={to}>
                      {icon}
                      {label}
                      <ChevronRight size={14} />
                    </Link>
                  </Button>)}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── KEY PROGRESSION ── */}
      <section className="py-24 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full blur-[140px] opacity-8" style={{
          background: 'hsl(276 100% 69%)'
        }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{
            color: 'hsl(276 100% 69%)'
          }}>
              The Path to The Stash
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              The Key Progression
            </h2>
            <p className="text-foreground/50 text-base max-w-xl mx-auto">
              Every player begins with nothing. The Curator watches as you earn each key — and remembers those who reach the end.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto">
            {/* Connector line — desktop only */}
            <div className="hidden md:flex items-center justify-between mb-6 px-16 relative">
              <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-px" style={{
              background: 'linear-gradient(to right, #cd7f32, #c0c0c0, #ffd700, hsl(96 100% 69%))'
            }} />
              {KEY_TIERS.map((tier, i) => <motion.button key={tier.key} initial={{
              opacity: 0,
              scale: 0.7
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.4,
              delay: i * 0.1
            }} onClick={() => setActiveKey(activeKey === i ? null : i)} className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer" style={{
              background: activeKey === i ? tier.color : 'hsl(259 44% 10%)',
              borderColor: tier.color,
              boxShadow: activeKey === i ? `0 0 30px ${tier.glow}` : `0 0 12px ${tier.glow}`,
              color: activeKey === i ? 'hsl(259 44% 7%)' : tier.color
            }}>
                  {tier.icon}
                </motion.button>)}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {KEY_TIERS.map((tier, i) => <motion.div key={tier.key} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: i * 0.1
            }} onClick={() => setActiveKey(activeKey === i ? null : i)} className="rounded-2xl p-5 border cursor-pointer transition-all" style={{
              background: activeKey === i ? `${tier.color}12` : `${tier.color}06`,
              borderColor: activeKey === i ? `${tier.color}60` : `${tier.color}20`,
              boxShadow: activeKey === i ? `0 0 30px ${tier.glow}` : 'none'
            }}>
                  {/* Mobile icon */}
                  <div className="md:hidden w-10 h-10 rounded-full flex items-center justify-center mb-3 border" style={{
                background: `${tier.color}18`,
                borderColor: `${tier.color}40`,
                color: tier.color
              }}>
                    {tier.icon}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{
                color: tier.color
              }}>
                    {tier.key}
                  </p>
                  <p className="text-foreground/50 text-xs leading-relaxed mb-3">{tier.trigger}</p>
                  <AnimatePresence>
                    {activeKey === i && <motion.p initial={{
                  opacity: 0,
                  height: 0
                }} animate={{
                  opacity: 1,
                  height: 'auto'
                }} exit={{
                  opacity: 0,
                  height: 0
                }} transition={{
                  duration: 0.3
                }} className="text-xs leading-relaxed italic overflow-hidden" style={{
                  color: 'hsl(0 0% 80%)'
                }}>
                        "{tier.message}"
                      </motion.p>}
                  </AnimatePresence>
                  {activeKey !== i && <span className="text-xs" style={{
                color: `${tier.color}80`
              }}>
                      Tap to hear The Curator →
                    </span>}
                </motion.div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE CURATOR'S CHALLENGE ── */}
      <section className="py-24 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-6" style={{
          background: 'hsl(96 100% 69%)'
        }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-6" style={{
          background: 'hsl(276 100% 69%)'
        }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{
            color: 'hsl(96 100% 69%)'
          }}>
              The Final Test
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              The Curator's Challenge
            </h2>
            <p className="text-foreground/50 text-base max-w-2xl mx-auto leading-relaxed">
              The Stash is real. The Key is in your hand. But the final door requires more than a key — it requires your wits, your community, and your strategy. Three paths. One prize.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* Challenge type selector */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              {CHALLENGE_TYPES.map(c => <button key={c.id} onClick={() => setActiveChallenge(c.id)} className="flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-semibold transition-all" style={{
              background: activeChallenge === c.id ? `${c.color}18` : 'transparent',
              borderColor: activeChallenge === c.id ? `${c.color}60` : 'hsl(0 0% 100% / 0.1)',
              color: activeChallenge === c.id ? c.color : 'hsl(0 0% 60%)',
              boxShadow: activeChallenge === c.id ? `0 0 20px ${c.glow}` : 'none'
            }}>
                  <span style={{
                color: activeChallenge === c.id ? c.color : 'hsl(0 0% 50%)'
              }}>{c.icon}</span>
                  {c.label}
                </button>)}
            </div>

            {/* Challenge detail panel */}
            <AnimatePresence mode="wait">
              <motion.div key={activeChallenge} initial={{
              opacity: 0,
              y: 16
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -10
            }} transition={{
              duration: 0.35
            }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Left: description */}
                <div className="rounded-2xl p-8 border" style={{
                background: `${currentChallenge.color}08`,
                borderColor: `${currentChallenge.color}25`
              }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border" style={{
                  background: `${currentChallenge.color}18`,
                  borderColor: `${currentChallenge.color}35`,
                  color: currentChallenge.color
                }}>
                    {currentChallenge.icon}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{
                  color: currentChallenge.color
                }}>
                    {currentChallenge.tagline}
                  </p>
                  <h3 className="text-2xl font-bold mb-4" style={{
                  fontFamily: 'var(--font-heading)'
                }}>
                    {currentChallenge.label}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                    {currentChallenge.description}
                  </p>
                  <ul className="space-y-2.5">
                    {currentChallenge.howItWorks.map((step, i) => <li key={i} className="flex items-start gap-3 text-sm text-foreground/70">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{
                      background: `${currentChallenge.color}25`,
                      color: currentChallenge.color
                    }}>
                          {i + 1}
                        </span>
                        {step}
                      </li>)}
                  </ul>
                </div>

                {/* Right: interactive panel */}
                <div>
                  {/* LORE QUIZ */}
                  {activeChallenge === 'quiz' && <div className="rounded-2xl border overflow-hidden" style={{
                  background: 'hsl(259 44% 7% / 0.9)',
                  borderColor: 'hsl(276 100% 69% / 0.2)'
                }}>
                      {/* Quiz header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b" style={{
                    borderColor: 'hsl(276 100% 69% / 0.15)'
                  }}>
                        <span className="text-sm font-semibold text-foreground/80">Lore Quiz</span>
                        {!quizSubmitted && <span className="text-xs text-foreground/40">
                            Question {Math.min(quizStep + 1, LORE_QUESTIONS.length)} of {LORE_QUESTIONS.length}
                          </span>}
                        {quizSubmitted && <span className="text-xs font-semibold" style={{
                      color: quizPassed ? 'hsl(96 100% 69%)' : '#ff5f5f'
                    }}>
                            {quizScore}/{LORE_QUESTIONS.length} correct
                          </span>}
                      </div>

                      <div className="p-6">
                        {!quizSubmitted ? <>
                            {/* Progress bar */}
                            <div className="w-full h-1 rounded-full mb-6 overflow-hidden" style={{
                        background: 'hsl(276 100% 69% / 0.1)'
                      }}>
                              <motion.div className="h-full rounded-full" style={{
                          background: 'hsl(276 100% 69%)'
                        }} animate={{
                          width: `${quizStep / LORE_QUESTIONS.length * 100}%`
                        }} transition={{
                          duration: 0.4
                        }} />
                            </div>

                            <AnimatePresence mode="wait">
                              <motion.div key={quizStep} initial={{
                          opacity: 0,
                          x: 20
                        }} animate={{
                          opacity: 1,
                          x: 0
                        }} exit={{
                          opacity: 0,
                          x: -20
                        }} transition={{
                          duration: 0.25
                        }}>
                                <p className="text-sm font-semibold text-foreground/90 mb-5 leading-relaxed">
                                  {LORE_QUESTIONS[quizStep].q}
                                </p>
                                <div className="space-y-2.5">
                                  {LORE_QUESTIONS[quizStep].options.map((opt, oi) => <button key={oi} onClick={() => {
                              const updated = [...quizAnswers];
                              updated[quizStep] = oi;
                              setQuizAnswers(updated);
                            }} className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all" style={{
                              background: quizAnswers[quizStep] === oi ? 'hsl(276 100% 69% / 0.15)' : 'hsl(276 100% 69% / 0.04)',
                              borderColor: quizAnswers[quizStep] === oi ? 'hsl(276 100% 69% / 0.6)' : 'hsl(276 100% 69% / 0.12)',
                              color: quizAnswers[quizStep] === oi ? 'white' : 'hsl(0 0% 65%)'
                            }}>
                                      <span className="inline-block w-5 h-5 rounded-full text-xs font-bold text-center leading-5 mr-3" style={{
                                background: quizAnswers[quizStep] === oi ? 'hsl(276 100% 69%)' : 'hsl(276 100% 69% / 0.15)',
                                color: quizAnswers[quizStep] === oi ? 'white' : 'hsl(276 100% 69%)'
                              }}>
                                        {String.fromCharCode(65 + oi)}
                                      </span>
                                      {opt}
                                    </button>)}
                                </div>
                              </motion.div>
                            </AnimatePresence>

                            <div className="flex justify-between mt-6">
                              <button onClick={() => setQuizStep(s => Math.max(0, s - 1))} disabled={quizStep === 0} className="text-xs px-4 py-2 rounded-lg border disabled:opacity-30 transition-all" style={{
                          borderColor: 'hsl(276 100% 69% / 0.2)',
                          color: 'hsl(276 100% 69%)'
                        }}>
                                ← Back
                              </button>
                              {quizStep < LORE_QUESTIONS.length - 1 ? <button onClick={() => setQuizStep(s => s + 1)} disabled={quizAnswers[quizStep] === null} className="text-xs px-4 py-2 rounded-lg disabled:opacity-30 transition-all font-semibold" style={{
                          background: 'hsl(276 100% 69%)',
                          color: 'white'
                        }}>
                                  Next →
                                </button> : <button onClick={() => setQuizSubmitted(true)} disabled={quizAnswers[quizStep] === null} className="text-xs px-4 py-2 rounded-lg disabled:opacity-30 transition-all font-semibold" style={{
                          background: 'hsl(96 100% 69%)',
                          color: 'hsl(259 44% 7%)'
                        }}>
                                  Submit Answers
                                </button>}
                            </div>
                          </> : (/* Results */
                    <motion.div initial={{
                      opacity: 0,
                      scale: 0.95
                    }} animate={{
                      opacity: 1,
                      scale: 1
                    }} transition={{
                      duration: 0.4
                    }}>
                            <div className="text-center mb-6">
                              <motion.div initial={{
                          scale: 0
                        }} animate={{
                          scale: 1
                        }} transition={{
                          type: 'spring',
                          stiffness: 200,
                          delay: 0.1
                        }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{
                          background: quizPassed ? 'hsl(96 100% 69% / 0.15)' : 'hsl(0 60% 60% / 0.15)',
                          border: `2px solid ${quizPassed ? 'hsl(96 100% 69%)' : '#ff5f5f'}`
                        }}>
                                {quizPassed ? <CheckCircle2 size={28} style={{
                            color: 'hsl(96 100% 69%)'
                          }} /> : <XCircle size={28} style={{
                            color: '#ff5f5f'
                          }} />}
                              </motion.div>
                              <p className="font-bold text-lg mb-1" style={{
                          fontFamily: 'var(--font-heading)',
                          color: quizPassed ? 'hsl(96 100% 69%)' : '#ff5f5f'
                        }}>
                                {quizPassed ? 'The Curator is impressed.' : 'The Curator watches. Try again.'}
                              </p>
                              <p className="text-foreground/50 text-xs">
                                {quizPassed ? 'You answered all 5 correctly. You are a scholar of the game.' : `${quizScore} of ${LORE_QUESTIONS.length} correct. Study the lore and return.`}
                              </p>
                            </div>

                            {/* Per-question result */}
                            <div className="space-y-2 mb-6">
                              {LORE_QUESTIONS.map((q, i) => {
                          const correct = quizAnswers[i] === q.answer;
                          return <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs" style={{
                            background: correct ? 'hsl(96 100% 69% / 0.07)' : 'hsl(0 60% 60% / 0.07)',
                            border: `1px solid ${correct ? 'hsl(96 100% 69% / 0.2)' : 'hsl(0 60% 60% / 0.2)'}`
                          }}>
                                    {correct ? <CheckCircle2 size={14} className="shrink-0" style={{
                              color: 'hsl(96 100% 69%)'
                            }} /> : <XCircle size={14} className="shrink-0" style={{
                              color: '#ff5f5f'
                            }} />}
                                    <span className="text-foreground/70 truncate">{q.q}</span>
                                    {!correct && <span className="ml-auto text-foreground/40 shrink-0">
                                        Ans: {q.options[q.answer]}
                                      </span>}
                                  </div>;
                        })}
                            </div>

                            <button onClick={resetQuiz} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{
                        background: 'hsl(276 100% 69% / 0.1)',
                        border: '1px solid hsl(276 100% 69% / 0.25)',
                        color: 'hsl(276 100% 69%)'
                      }}>
                              <RotateCcw size={14} />
                              Try Again
                            </button>
                          </motion.div>)}
                      </div>
                    </div>}

                  {/* TRADING CHALLENGE */}
                  {activeChallenge === 'trading' && <div className="rounded-2xl border p-8" style={{
                  background: 'rgba(255,215,0,0.04)',
                  borderColor: 'rgba(255,215,0,0.2)'
                }}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{
                    color: '#ffd700'
                  }}>
                        Current Challenge
                      </p>
                      <div className="rounded-xl p-5 mb-6 border" style={{
                    background: 'rgba(255,215,0,0.07)',
                    borderColor: 'rgba(255,215,0,0.2)'
                  }}>
                        <p className="text-2xl font-bold mb-1" style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#ffd700'
                    }}>
                          Buy 10 TTG
                        </p>
                        <p className="text-foreground/50 text-sm">Hold for 24 hours without selling.</p>
                      </div>
                      <div className="space-y-3 mb-6">
                        {['Connect your wallet', 'Purchase 10 TTG on Raydium', 'Hold for 24 hours', 'The blockchain verifies your position'].map((step, i) => <div key={i} className="flex items-center gap-3 text-sm text-foreground/60">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{
                        background: 'rgba(255,215,0,0.15)',
                        color: '#ffd700'
                      }}>
                              {i + 1}
                            </span>
                            {step}
                          </div>)}
                      </div>
                      <div className="rounded-xl p-4 text-xs text-foreground/40 italic border" style={{
                    borderColor: 'rgba(255,215,0,0.1)',
                    background: 'rgba(255,215,0,0.04)'
                  }}>
                        "The blockchain remembers every transaction. So do I." — The Curator
                      </div>
                    </div>}

                  {/* COMMUNITY VOTE */}
                  {activeChallenge === 'vote' && <div className="rounded-2xl border p-8" style={{
                  background: 'hsl(306 100% 69% / 0.04)',
                  borderColor: 'hsl(306 100% 69% / 0.2)'
                }}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{
                    color: 'hsl(306 100% 69%)'
                  }}>
                        How the Vote Works
                      </p>
                      <div className="space-y-4 mb-6">
                        {[{
                      label: 'Eligibility',
                      value: 'All Gold Key holders are automatically shortlisted.'
                    }, {
                      label: 'Voting',
                      value: 'The community casts votes over a 48-hour window.'
                    }, {
                      label: 'Result',
                      value: 'The top 3 vote-getters earn the right to compete for The Stash.'
                    }, {
                      label: 'Strategy',
                      value: 'Build your community. Earn trust. The players decide.'
                    }].map(({
                      label,
                      value
                    }) => <div key={label} className="rounded-xl p-4 border" style={{
                      background: 'hsl(306 100% 69% / 0.06)',
                      borderColor: 'hsl(306 100% 69% / 0.15)'
                    }}>
                            <p className="text-xs font-semibold mb-1" style={{
                        color: 'hsl(306 100% 69%)'
                      }}>{label}</p>
                            <p className="text-foreground/60 text-sm">{value}</p>
                          </div>)}
                      </div>
                      <div className="rounded-xl p-4 text-xs text-foreground/40 italic border" style={{
                    borderColor: 'hsl(306 100% 69% / 0.1)',
                    background: 'hsl(306 100% 69% / 0.04)'
                  }}>
                        "Choose your allies wisely. Loyalty is remembered here." — The Curator
                      </div>
                    </div>}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── ORACLE CHAT ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{
            color: 'hsl(276 100% 69%)'
          }}>
              Seek Wisdom
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              Ask The Curator
            </h2>
            <p className="text-foreground/50 text-sm max-w-md mx-auto">
              The Curator knows all 125 coins, all 13 nations, and the secrets of The Stash. Ask it anything — but choose your words carefully.
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="max-w-2xl mx-auto">

            <div className="rounded-2xl border overflow-hidden" style={{
            background: 'hsl(259 44% 7% / 0.8)',
            borderColor: 'hsl(276 100% 69% / 0.2)',
            boxShadow: '0 0 60px hsl(276 100% 69% / 0.08)'
          }}>

              {/* Header bar */}
              <div className="flex items-center gap-3 px-5 py-4 border-b" style={{
              borderColor: 'hsl(276 100% 69% / 0.15)'
            }}>
                <motion.div animate={{
                opacity: [0.6, 1, 0.6]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }} className="w-2.5 h-2.5 rounded-full" style={{
                background: 'hsl(96 100% 69%)',
                boxShadow: '0 0 8px hsl(96 100% 69%)'
              }} />
                <span className="text-sm font-semibold text-foreground/80">The Curator</span>
                <span className="text-xs text-foreground/30 ml-auto">Oracle Mode · Created by Tienko</span>
              </div>

              {/* Messages */}
              <div className="h-72 overflow-y-auto p-5 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => <motion.div key={i} initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.3
                }} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'curator' && <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{
                    background: 'hsl(276 100% 69% / 0.15)',
                    border: '1px solid hsl(276 100% 69% / 0.3)'
                  }}>
                          <Sparkles size={14} style={{
                      color: 'hsl(276 100% 69%)'
                    }} />
                        </div>}
                      <div className="max-w-[80%] px-4 py-3 text-sm leading-relaxed" style={msg.role === 'curator' ? {
                    background: 'hsl(276 100% 69% / 0.08)',
                    border: '1px solid hsl(276 100% 69% / 0.2)',
                    color: 'hsl(0 0% 85%)',
                    borderRadius: '4px 18px 18px 18px'
                  } : {
                    background: 'hsl(276 100% 69% / 0.18)',
                    border: '1px solid hsl(276 100% 69% / 0.3)',
                    color: 'white',
                    borderRadius: '18px 4px 18px 18px'
                  }}>
                        {msg.text}
                      </div>
                    </motion.div>)}

                  {isTyping && <motion.div key="typing" initial={{
                  opacity: 0,
                  y: 6
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0
                }} className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{
                    background: 'hsl(276 100% 69% / 0.15)',
                    border: '1px solid hsl(276 100% 69% / 0.3)'
                  }}>
                        <Sparkles size={14} style={{
                      color: 'hsl(276 100% 69%)'
                    }} />
                      </div>
                      <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5" style={{
                    background: 'hsl(276 100% 69% / 0.08)',
                    border: '1px solid hsl(276 100% 69% / 0.2)',
                    borderRadius: '4px 18px 18px 18px'
                  }}>
                        {[0, 0.2, 0.4].map(delay => <motion.span key={delay} animate={{
                      opacity: [0.3, 1, 0.3],
                      y: [0, -3, 0]
                    }} transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay
                    }} className="w-1.5 h-1.5 rounded-full" style={{
                      background: 'hsl(276 100% 69%)'
                    }} />)}
                      </div>
                    </motion.div>}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              {/* Quick questions */}
              <div className="px-5 py-3 border-t flex flex-wrap gap-2" style={{
              borderColor: 'hsl(276 100% 69% / 0.1)'
            }}>
                {curator.QUICK_QUESTIONS.map((q: string) => <button key={q} onClick={() => sendMessage(q)} disabled={isTyping} className="text-xs px-3 py-1.5 rounded-full border transition-all disabled:opacity-40" style={{
                borderColor: 'hsl(276 100% 69% / 0.25)',
                color: 'hsl(276 100% 69%)',
                background: 'hsl(276 100% 69% / 0.06)'
              }} onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'hsl(276 100% 69% / 0.15)';
              }} onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'hsl(276 100% 69% / 0.06)';
              }}>
                    {q}
                  </button>)}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-t" style={{
              borderColor: 'hsl(276 100% 69% / 0.15)'
            }}>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask The Curator anything…" disabled={isTyping} className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 outline-none disabled:opacity-50" />
                <button type="submit" disabled={!input.trim() || isTyping} className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30" style={{
                background: 'hsl(276 100% 69%)',
                boxShadow: '0 0 16px hsl(276 100% 69% / 0.4)'
              }}>
                  <Send size={15} color="white" />
                </button>
              </form>
            </div>

            <p className="text-center text-xs text-foreground/25 mt-4">
              The Curator is an ancient AI. Full oracle integration coming soon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── EXPLORE ── */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold mb-3" style={{
            fontFamily: 'var(--font-heading)'
          }}>
              Continue Your Journey
            </h2>
            <p className="text-foreground/50 text-sm">
              The Curator has spoken. Now it's time to play.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[{
            label: 'Coin Gallery',
            desc: 'Browse all 125 coins across every edition.',
            to: '/coins',
            icon: <Coins size={22} />,
            color: 'hsl(96 100% 69%)'
          }, {
            label: 'Nation Hub',
            desc: 'Enter the War Room and compete for your nation.',
            to: '/war-room',
            icon: <Globe size={22} />,
            color: 'hsl(306 100% 69%)'
          }, {
            label: 'The Stash Key',
            desc: 'Learn how to earn the rarest prize in the game.',
            to: '/stash-key',
            icon: <Sparkles size={22} />,
            color: 'hsl(276 100% 69%)'
          }].map(({
            label,
            desc,
            to,
            icon,
            color
          }, i) => <motion.div key={to} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: i * 0.1
          }}>
                <Link to={to} className="group block rounded-2xl p-6 border transition-all hover:scale-[1.02]" style={{
              background: `${color}08`,
              borderColor: `${color}20`
            }} onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}45`;
              (e.currentTarget as HTMLAnchorElement).style.background = `${color}12`;
            }} onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}20`;
              (e.currentTarget as HTMLAnchorElement).style.background = `${color}08`;
            }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
                background: `${color}18`,
                border: `1px solid ${color}30`
              }}>
                    <span style={{
                  color
                }}>{icon}</span>
                  </div>
                  <h3 className="font-bold text-base mb-1" style={{
                fontFamily: 'var(--font-heading)'
              }}>
                    {label}
                  </h3>
                  <p className="text-foreground/50 text-xs leading-relaxed mb-4">{desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{
                color
              }}>
                    Explore <ArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>)}
          </div>
        </div>
      </section>
    </>;
}
