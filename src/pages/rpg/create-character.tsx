import { useEffect, useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useNavigate } from "react-router";
import { Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { rpg_create_character } from 'virtual:content';
import { CLASS_DEFINITIONS, type CharacterClass } from '@/lib/rpg/levels';
const avatarPalette = ['bg-primary', 'bg-amber-400', 'bg-cyan-400', 'bg-emerald-400', 'bg-rose-400', 'bg-violet-400', 'bg-blue-400', 'bg-pink-400'];
function createSeed(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
export default function CreateCharacterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [selectedNation, setSelectedNation] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  useEffect(() => {
    setAvatarSeed(createSeed());
  }, []);
  const progress = currentStep / 3 * 100;
  const canAdvance = currentStep === 1 && selectedClass || currentStep === 2 && selectedNation;
  async function handleSubmit() {
    if (!selectedClass || !selectedNation || !displayName.trim() || !avatarSeed || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      const response = await fetch('/api/rpg/character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: `demo_wallet_${Date.now()}`,
          displayName: displayName.trim(),
          characterClass: selectedClass,
          nation: selectedNation,
          avatarSeed
        })
      });
      if (!response.ok) throw new Error('Character creation failed');
      navigate('/rpg/profile');
    } catch {
      setSubmitError(true);
      setIsSubmitting(false);
    }
  }
  return <>
      <Helmet>
        <title>{rpg_create_character.seo.title}</title>
        <meta name="description" content={rpg_create_character.seo.description} />
        <link rel="canonical" href={rpg_create_character.seo.canonical} />
        <meta property="og:title" content={rpg_create_character.seo.title} />
        <meta property="og:description" content={rpg_create_character.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={rpg_create_character.seo.canonical} />
        <meta property="og:image" content={rpg_create_character.seo.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={rpg_create_character.seo.title} />
        <meta name="twitter:description" content={rpg_create_character.seo.description} />
        <meta name="twitter:image" content={rpg_create_character.seo.ogImage} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: rpg_create_character.seo.title,
          url: rpg_create_character.seo.canonical
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 lg:py-16">
        <section className="mx-auto w-full max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium text-primary">{rpg_create_character.hero.eyebrow}</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{rpg_create_character.hero.title}</h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">{rpg_create_character.hero.subtitle}</p>
          </div>

          <div className="mx-auto mb-10 max-w-3xl" aria-label={`Step ${currentStep} of 3`}>
            <div className="mb-3 flex justify-between text-sm text-muted-foreground">
              {rpg_create_character.steps.map((step, index) => <span className={currentStep >= index + 1 ? 'font-medium text-primary' : ''} key={step.id}>{step.title}</span>)}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={currentStep}>
              <div className="h-full rounded-full bg-primary" style={{
              width: `${progress}%`
            }} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-primary/10 sm:p-8">
            {currentStep === 1 && <section aria-labelledby="class-heading">
                <h2 id="class-heading" className="text-2xl font-semibold">{rpg_create_character.steps[0].title}</h2>
                <p className="mt-2 text-muted-foreground">{rpg_create_character.steps[0].description}</p>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {rpg_create_character.classes.map(characterClass => {
                const definition = CLASS_DEFINITIONS[characterClass.id as CharacterClass];
                const isSelected = selectedClass === characterClass.id;
                return <button type="button" key={characterClass.id} onClick={() => setSelectedClass(characterClass.id as CharacterClass)} className={`rounded-xl border-2 p-5 text-left ${isSelected ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30' : 'border-border bg-background hover:border-primary/60'}`} style={{
                  borderColor: isSelected ? definition.color : undefined
                }}>
                      <span className="text-3xl" aria-hidden="true">{definition.icon}</span>
                      <h3 className="mt-4 text-lg font-semibold">{characterClass.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{characterClass.description}</p>
                      <ul className="mt-4 grid gap-2 text-sm">
                        {characterClass.bonuses.map(bonus => <li className="flex gap-2" key={bonus}><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><span>{bonus}</span></li>)}
                      </ul>
                    </button>;
              })}
                </div>
              </section>}

            {currentStep === 2 && <section aria-labelledby="nation-heading">
                <h2 id="nation-heading" className="text-2xl font-semibold">{rpg_create_character.steps[1].title}</h2>
                <p className="mt-2 text-muted-foreground">{rpg_create_character.steps[1].description}</p>
                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {rpg_create_character.nations.map(nation => <button type="button" key={nation.id} onClick={() => setSelectedNation(nation.name)} className={`rounded-xl border p-4 text-left ${selectedNation === nation.name ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30' : 'border-border bg-background hover:border-primary/60'}`}><span className="text-2xl" aria-hidden="true">{nation.flag}</span><span className="mt-3 block font-medium">{nation.name}</span></button>)}
                </div>
              </section>}

            {currentStep === 3 && <section aria-labelledby="identity-heading" className="mx-auto max-w-2xl">
                <h2 id="identity-heading" className="text-2xl font-semibold">{rpg_create_character.steps[2].title}</h2>
                <p className="mt-2 text-muted-foreground">{rpg_create_character.steps[2].description}</p>
                <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <label htmlFor="display-name" className="text-sm font-medium">{rpg_create_character.form.displayNameLabel}</label>
                    <input id="display-name" value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder={rpg_create_character.form.displayNamePlaceholder} className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none ring-primary focus:ring-2" maxLength={40} />
                    <label htmlFor="avatar-seed" className="mt-6 block text-sm font-medium">{rpg_create_character.form.avatarLabel}</label>
                    <input id="avatar-seed" value={avatarSeed} onChange={event => setAvatarSeed(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none ring-primary focus:ring-2" />
                    <p className="mt-2 text-sm text-muted-foreground">{rpg_create_character.form.avatarHint}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/40 bg-background p-5 text-center">
                    <div className="mx-auto grid size-40 grid-cols-5 gap-1 rounded-lg bg-muted p-2" aria-label="Generated pixel-art avatar" role="img">
                      {Array.from({
                    length: 25
                  }, (_, index) => <span className={`rounded-sm ${avatarPalette[(avatarSeed.charCodeAt(index % Math.max(avatarSeed.length, 1)) || 0) % avatarPalette.length]}`} key={index} />)}
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-primary"><Sparkles className="size-4" aria-hidden="true" />{rpg_create_character.form.avatarLabel}</div>
                  </div>
                </div>
                {submitError && <p className="mt-6 rounded-lg border border-destructive bg-destructive p-3 text-sm text-destructive-foreground" role="alert">{rpg_create_character.form.errorMessage}</p>}
              </section>}

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
              <button type="button" onClick={() => setCurrentStep(step => Math.max(1, step - 1))} disabled={currentStep === 1 || isSubmitting} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-medium disabled:cursor-not-allowed disabled:opacity-50"><ChevronLeft className="size-4" aria-hidden="true" />Back</button>
              {currentStep < 3 ? <button type="button" onClick={() => setCurrentStep(step => Math.min(3, step + 1))} disabled={!canAdvance} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">Next<ChevronRight className="size-4" aria-hidden="true" /></button> : <button type="button" onClick={handleSubmit} disabled={!displayName.trim() || !avatarSeed || isSubmitting} className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? rpg_create_character.form.creatingButton : rpg_create_character.form.createButton}</button>}
            </div>
          </div>
        </section>
      </main>
    </>;
}
