const { useEffect, useMemo, useRef, useState } = React;

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const ASSETS = {
  backgrounds: {
    home: ["public/assets/backgrounds/home-bg.png", "assets/home-bg.png.jpeg", "assets/hero-bg.jpg"],
    questions: ["public/assets/backgrounds/questions-bg.png", "assets/questions-bg.png.jpeg"],
    truth: ["public/assets/backgrounds/truth-bg.png"],
    dare: ["public/assets/backgrounds/dare-bg.png"],
    activities: ["public/assets/backgrounds/activities-bg.png"],
    memory: ["public/assets/backgrounds/memory-bg.png"],
    surprise: ["public/assets/backgrounds/surprise-bg.png"],
  },
  cards: {
    default: ["public/assets/cards/card.png"],
    question: ["public/assets/cards/question-card.png"],
    truth: ["public/assets/cards/truth-card.png"],
    dare: ["public/assets/cards/dare-card.png"],
    activity: ["public/assets/cards/activity-card.png"],
    memory: ["public/assets/cards/memory-card.png"],
    back: ["public/assets/cards/card-back.png", "assets/card-back.png.jpeg"],
  },
  objects: {
    box: ["public/assets/objects/card-box.png", "assets/envelope.png"],
    boxOpen: ["public/assets/objects/card-box-open.png", "assets/envelope.png"],
    stack: ["public/assets/objects/card-stack.png", "assets/base.png"],
  },
  icons: {
    ask: ["public/assets/icons/ask-icon.png"],
    truth: ["public/assets/icons/truth-icon.png"],
    dare: ["public/assets/icons/dare-icon.png"],
    activities: ["public/assets/icons/activities-icon.png"],
    both: ["public/assets/icons/both-answer-icon.png"],
    memory: ["public/assets/icons/memory-icon.png"],
    surprise: ["public/assets/icons/surprise-icon.png"],
    music: ["public/assets/icons/music-icon.png"],
  },
  effects: {
    sparkle: ["public/assets/effects/sparkle.png"],
    confetti: ["public/assets/effects/confetti.png"],
  },
  music: [
    { title: "Music BG", src: "music_BG.mp3" },
    { title: "Music BG 2", src: "music_BG2.mp3" },
  ],
};

const assetRequirements = [
  ["backgrounds/home-bg.png", "1920x1080 or larger", "16:9", "Opaque atmospheric room/background"],
  ["backgrounds/questions-bg.png", "1920x1080", "16:9", "Opaque writing-table or cozy backdrop"],
  ["backgrounds/truth-bg.png", "1920x1080", "16:9", "Opaque midnight-purple mood image"],
  ["backgrounds/dare-bg.png", "1920x1080", "16:9", "Opaque burgundy/gold action mood image"],
  ["backgrounds/activities-bg.png", "1920x1080", "16:9", "Opaque warm daytime/evening activity scene"],
  ["backgrounds/memory-bg.png", "1920x1080", "16:9", "Opaque nostalgic image"],
  ["backgrounds/surprise-bg.png", "1920x1080", "16:9", "Opaque abstract reveal/surprise image"],
  ["cards/card.png", "900x1260", "5:7", "Transparent PNG preferred"],
  ["cards/question-card.png", "900x1260", "5:7", "Transparent PNG preferred"],
  ["cards/truth-card.png", "900x1260", "5:7", "Transparent PNG preferred"],
  ["cards/dare-card.png", "900x1260", "5:7", "Transparent PNG preferred"],
  ["cards/activity-card.png", "900x1260", "5:7", "Transparent PNG preferred"],
  ["cards/memory-card.png", "900x1260", "5:7", "Transparent PNG preferred"],
  ["cards/card-back.png", "900x1260", "5:7", "Transparent PNG preferred"],
  ["objects/card-box.png", "1200x900", "4:3", "Transparent PNG required"],
  ["objects/card-box-open.png", "1200x900", "4:3", "Transparent PNG required"],
  ["objects/card-stack.png", "1000x700", "10:7", "Transparent PNG required"],
  ["icons/*.png", "512x512", "1:1", "Transparent PNG required"],
  ["effects/sparkle.png, effects/confetti.png", "512x512", "1:1", "Transparent PNG required"],
];

const modeMeta = {
  ask: { label: "Ask Each Other", icon: "✦", accent: "#b85f77", bg: "questions", description: "Write private cards, shuffle them into the box, and draw one at a time." },
  truth: { label: "Truth or Dare", icon: "◐", accent: "#d8a642", bg: "truth", description: "Choose truth, dare, or weave prompts into your question deck." },
  plan: { label: "Plan Something Together", icon: "⌁", accent: "#d88954", bg: "activities", description: "Find a small plan that fits your time, budget, and mood." },
  both: { label: "Both Answer", icon: "◎", accent: "#5f9ea0", bg: "home", description: "A quick shared prompt where both people get the floor." },
  likely: { label: "Who's More Likely To?", icon: "◇", accent: "#9172c7", bg: "surprise", description: "Vote in secret, then reveal the matching chaos together." },
  memory: { label: "Memory Lane", icon: "◌", accent: "#c07a6d", bg: "memory", description: "Nostalgic prompts for stories, firsts, and future bookmarks." },
  surprise: { label: "Random Surprise", icon: "?", accent: "#c15f63", bg: "surprise", description: "Let the app pick a question, activity, or tiny challenge." },
};

const truthPrompts = {
  "Funny": ["What tiny habit of yours deserves its own theme song?", "What is a harmless thing you are weirdly competitive about?", "What is your most dramatic reaction to a minor inconvenience?"],
  "Getting to Know You": ["What makes an ordinary day feel better for you?", "What is a small kindness you remember for a long time?", "What is something you want people to understand about you sooner?"],
  "Personal Stories": ["What is a story your friends still bring up?", "What moment made you feel unexpectedly brave?", "What is a memory that changed how you see yourself?"],
  "School and University": ["Which class or project taught you more than expected?", "What is your ideal study break?", "What campus spot would you put on a tiny personal map?"],
  "Crushes and Romance": ["What is a thoughtful gesture you always notice?", "What makes someone easy to trust?", "What is your favorite kind of slow-burn conversation?"],
  "Unexpected Questions": ["What object in your room has the most lore?", "If tonight had a title, what would it be?", "What rule would you add to a perfect low-pressure hangout?"],
  "Deep Conversations": ["What helps you feel safe being honest?", "What do you hope you are better at one year from now?", "What does feeling cared for look like to you?"],
};

const darePrompts = {
  "Funny Challenges": ["Invent a ridiculous award for the other person and present it.", "Do a dramatic reading of your last harmless notification.", "Create a five-second victory pose for this game."],
  "Creative Challenges": ["Sketch the vibe of tonight in ten lines.", "Make up a tiny jingle for your next snack break.", "Describe the room as if it were a movie set."],
  "Compliments": ["Give the other person a specific compliment about how they think.", "Name one quality they bring into a room.", "Describe a moment when they made something easier."],
  "Acting and Impressions": ["Act like a tour guide for the nearest object.", "Do a weather report for your current mood.", "Narrate the next thirty seconds like a documentary."],
  "Music Challenges": ["Hum a mystery tune for the other person to guess.", "Build a three-song playlist title for tonight.", "Tap a tiny beat and let the other person name it."],
  "Cute Moments": ["Create a secret handshake with exactly three moves.", "Take a photo of something ordinary that looks nice right now.", "Trade one tiny good-news headline from your week."],
  "University-Themed Challenges": ["Pitch a one-day campus festival idea.", "Design a fake elective you would both actually take.", "Create a two-line slogan for your study group era."],
};

const activities = [
  { title: "Snack Flight", icon: "◒", duration: "30 minutes", budget: "low", tags: ["indoors", "low budget", "food and drinks"], description: "Pick three snacks or drinks, rate them like serious critics, and crown a winner." },
  { title: "Golden-Hour Walk", icon: "↗", duration: "1 hour", budget: "free", tags: ["outdoors", "low budget", "relaxation"], description: "Take a slow walk and each choose one view worth remembering." },
  { title: "Teach Me One Thing", icon: "✎", duration: "30 minutes", budget: "free", tags: ["indoors", "creative activities", "campus"], description: "Each person teaches a tiny skill, shortcut, concept, or favorite fact." },
  { title: "Playlist Exchange", icon: "♪", duration: "15 minutes", budget: "free", tags: ["indoors", "creative activities", "relaxation"], description: "Trade three songs: comfort, energy, and main-character walk." },
  { title: "Photo Mini-Mission", icon: "▣", duration: "1 hour", budget: "free", tags: ["outdoors", "campus", "creative activities"], description: "Find five textures, colors, or signs that make a tiny photo story." },
  { title: "Board Game Remix", icon: "□", duration: "1 hour", budget: "low", tags: ["indoors", "low budget", "spontaneous adventures"], description: "Play a game you know, then invent one new house rule after round one." },
  { title: "Future Outing Draft", icon: "⌂", duration: "30 minutes", budget: "varies", tags: ["indoors", "food and drinks", "creative activities"], description: "Plan three possible outings: easy, adventurous, and rainy-day." },
  { title: "Quiet Reset", icon: "◦", duration: "15 minutes", budget: "free", tags: ["indoors", "relaxation", "low budget"], description: "Make tea or water, put on one track, and share one thing you are glad is over." },
  { title: "Campus Coin Flip", icon: "◆", duration: "A whole afternoon or evening", budget: "low", tags: ["campus", "outdoors", "spontaneous adventures"], description: "At each crossing, alternate choosing left/right until you find a stop worth exploring." },
  { title: "Dessert Map", icon: "◍", duration: "A whole afternoon or evening", budget: "medium", tags: ["food and drinks", "outdoors", "spontaneous adventures"], description: "Make a short list of dessert spots and try one now or schedule the first visit." },
];

const likelyPrompts = [
  "Who is more likely to remember a tiny detail from weeks ago?",
  "Who is more likely to turn a short errand into a side quest?",
  "Who is more likely to make friends with a professor or barista?",
  "Who is more likely to plan the perfect rainy-day activity?",
  "Who is more likely to laugh first during a serious moment?",
];

const memoryPrompts = [
  "What is one first impression you remember?",
  "What small moment felt bigger afterward?",
  "What is a place you associate with a good conversation?",
  "What is something you hope becomes a future memory?",
  "What ordinary moment from this month deserves a little spotlight?",
];

const bothPrompts = [
  "What made you smile recently?",
  "What is one thing you want more of this week?",
  "What is a tiny comfort that always works?",
  "What question do you wish people asked you more often?",
  "What is something you appreciate about tonight?",
];

const surpriseBank = [
  { type: "Question", text: "Ask each other: what is a small dream you have not said out loud recently?" },
  { type: "Activity", text: "Pick a snack or drink and give it a dramatic review." },
  { type: "Mini-Challenge", text: "Each person names one song that matches the room right now." },
  { type: "Memory", text: "Tell a story about a time something turned out better than expected." },
  { type: "Compliment", text: "Give a specific compliment that is not about appearance." },
];

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function useAsset(candidates) {
  const list = Array.isArray(candidates) ? candidates : [candidates];
  const [index, setIndex] = useState(0);
  return {
    src: list[index],
    failed: index >= list.length,
    onError: () => setIndex((current) => current + 1),
  };
}

function AssetImage({ candidates, alt, className = "", fallback, decorative = false }) {
  const asset = useAsset(candidates);
  if (asset.failed) return fallback || null;
  return <img src={asset.src} alt={decorative ? "" : alt} aria-hidden={decorative || undefined} onError={asset.onError} className={className} />;
}

function IconBadge({ mode, size = "normal" }) {
  const meta = modeMeta[mode] || modeMeta.ask;
  const classes = size === "large" ? "h-14 w-14 text-3xl" : "h-11 w-11 text-2xl";
  return (
    <span className={cx("icon-badge", classes)} style={{ "--accent": meta.accent }}>
      <AssetImage candidates={ASSETS.icons[mode === "plan" ? "activities" : mode] || ASSETS.icons.ask} alt="" decorative className="h-full w-full object-contain" fallback={<span>{meta.icon}</span>} />
    </span>
  );
}

function AppButton({ children, variant = "primary", className = "", ...props }) {
  return <button {...props} className={cx("app-button", `app-button-${variant}`, className)}>{children}</button>;
}

function FieldLabel({ children }) {
  return <label className="field-label">{children}</label>;
}

function Shell({ phase, children, players, onHome, progress, musicControls, settingsControls }) {
  const bgKey = modeMeta[phase]?.bg || (phase === "setup" ? "home" : phase);
  const bgAsset = useAsset(ASSETS.backgrounds[bgKey] || ASSETS.backgrounds.home);
  const style = bgAsset.failed ? {} : { backgroundImage: `linear-gradient(135deg, rgba(17, 22, 39, .84), rgba(45, 20, 35, .76)), url("${bgAsset.src}")` };
  return (
    <main className={cx("app-shell", `phase-${phase}`)} style={style}>
      {!bgAsset.failed && <img src={bgAsset.src} className="hidden" onError={bgAsset.onError} alt="" />}
      <div className="ambient-grid" />
      <header className="topbar">
        <button className="brand" onClick={onHome} type="button">
          <span className="brand-mark">GT</span>
          <span>
            <strong>Game Time</strong>
            <small>{players.length >= 2 ? `${players[0]} & ${players[1]}` : "date-night cards"}</small>
          </span>
        </button>
        <div className="topbar-actions">
          {progress && <div className="progress-chip">{progress}</div>}
          {settingsControls}
          {musicControls}
        </div>
      </header>
      <section className="page-wrap">{children}</section>
    </main>
  );
}

function MusicControls({ audioRef, settings, setSettings }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("Ready");
  const currentTrack = ASSETS.music[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = settings.muted ? 0 : settings.volume;
  }, [settings.volume, settings.muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentTrack.src;
    audio.loop = !settings.musicShuffle;
    if (isPlaying) {
      audio.play().then(() => setStatus("Playing")).catch(() => {
        setIsPlaying(false);
        setStatus("Tap play to start");
      });
    }
  }, [currentTrackIndex, settings.musicShuffle]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      if (settings.musicShuffle) {
        setCurrentTrackIndex((index) => nextIndex(index));
      }
    };
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentTrackIndex, settings.musicShuffle]);

  const nextIndex = (from = currentTrackIndex) => {
    if (ASSETS.music.length < 2) return from;
    let next = Math.floor(Math.random() * ASSETS.music.length);
    while (next === from) next = Math.floor(Math.random() * ASSETS.music.length);
    return next;
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setStatus("Playing");
      } catch {
        setStatus("Tap play to start");
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      setStatus("Paused");
    }
  };

  const next = () => setCurrentTrackIndex((index) => nextIndex(index));

  return (
    <div className="music-panel">
      <button className="icon-button" type="button" onClick={toggle} aria-label={isPlaying ? "Pause music" : "Play music"}>{isPlaying ? "Ⅱ" : "▶"}</button>
      <button className="icon-button" type="button" onClick={next} aria-label="Next track">↷</button>
      <button className={cx("icon-button", settings.musicShuffle && "is-active")} type="button" onClick={() => setSettings((s) => ({ ...s, musicShuffle: !s.musicShuffle }))} aria-label="Shuffle music">⇄</button>
      <button className={cx("icon-button", settings.muted && "is-active")} type="button" onClick={() => setSettings((s) => ({ ...s, muted: !s.muted }))} aria-label="Mute music">{settings.muted ? "×" : "♪"}</button>
      <input aria-label="Music volume" type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={(event) => setSettings((s) => ({ ...s, volume: Number(event.target.value) }))} />
      <span className="track-title" title={`${currentTrack.title} · ${status}`}>{currentTrack.title}</span>
    </div>
  );
}

function SettingsPanel({ settings, setSettings }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="settings-menu">
      <button className="icon-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Open settings">⚙</button>
      {open && (
        <div className="settings-popover">
          <label><input type="checkbox" checked={settings.sfx} onChange={(event) => setSettings((s) => ({ ...s, sfx: event.target.checked }))} /> Sound effects</label>
          <label><input type="checkbox" checked={settings.reducedMotion} onChange={(event) => setSettings((s) => ({ ...s, reducedMotion: event.target.checked }))} /> Reduce animation</label>
          <label><input type="checkbox" checked={settings.ambient} onChange={(event) => setSettings((s) => ({ ...s, ambient: event.target.checked }))} /> Ambient visuals</label>
        </div>
      )}
    </div>
  );
}

function SetupScreen({ players, playerName, setPlayerName, addPlayer, removePlayer, continueHome }) {
  return (
    <div className="hero-layout">
      <section className="intro-copy">
        <p className="eyebrow">two-player question night</p>
        <h1>A small world for better conversations.</h1>
        <p>Enter both names, keep the music nearby, and choose the kind of evening you want.</p>
      </section>
      <section className="panel setup-panel">
        <form onSubmit={addPlayer} className="name-form">
          <FieldLabel>Player name</FieldLabel>
          <div className="inline-form">
            <input value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Add a name" maxLength="24" />
            <AppButton>Add</AppButton>
          </div>
        </form>
        <div className="player-list">
          {players.length === 0 && <p className="muted">Add two people to begin.</p>}
          {players.map((player, index) => (
            <button key={`${player}-${index}`} type="button" onClick={() => removePlayer(index)} className="player-pill">{player}<span>×</span></button>
          ))}
        </div>
        <AppButton disabled={players.length < 2} onClick={continueHome} className="w-full">Start the evening</AppButton>
        {players.length > 2 && <p className="microcopy">This experience uses the first two players: {players[0]} and {players[1]}.</p>}
      </section>
    </div>
  );
}

function HomeScreen({ players, openMode, stats }) {
  const modes = ["ask", "truth", "plan", "both", "likely", "memory", "surprise"];
  return (
    <div className="home-screen">
      <section className="home-greeting">
        <p className="eyebrow">welcome in</p>
        <h1>Tonight, it's {players[0]} and {players[1]}'s little world.</h1>
        <p>{stats.deckTotal ? `${stats.remaining} custom cards still tucked in the box.` : "Choose a mode to set the tone."}</p>
      </section>
      <section className="mode-grid">
        {modes.map((mode) => {
          const meta = modeMeta[mode];
          return (
            <button key={mode} type="button" onClick={() => openMode(mode)} className="mode-card" style={{ "--accent": meta.accent }}>
              <IconBadge mode={mode} size="large" />
              <span className="mode-card-title">{meta.label}</span>
              <span className="mode-card-description">{meta.description}</span>
            </button>
          );
        })}
      </section>
    </div>
  );
}

function AskSetup({ questionCount, setQuestionCount, customCount, setCustomCount, turnOrder, setTurnOrder, start, resumeBox, hasDeck }) {
  const counts = [3, 5, 10];
  return (
    <section className="panel narrow-panel">
      <div className="section-title">
        <IconBadge mode="ask" />
        <div>
          <p className="eyebrow">ask each other</p>
          <h2>Build the private question box.</h2>
        </div>
      </div>
      <FieldLabel>Questions each person writes</FieldLabel>
      <div className="segmented">
        {counts.map((count) => <button key={count} type="button" className={questionCount === count ? "active" : ""} onClick={() => setQuestionCount(count)}>{count}</button>)}
        <button type="button" className={questionCount === "custom" ? "active" : ""} onClick={() => setQuestionCount("custom")}>Custom</button>
      </div>
      {questionCount === "custom" && (
        <input className="mt-3" type="number" min="1" value={customCount} onChange={(event) => setCustomCount(event.target.value)} placeholder="Positive number" />
      )}
      <FieldLabel>Turn order</FieldLabel>
      <div className="choice-stack">
        <label><input type="radio" name="turn-order" checked={turnOrder === "alternating"} onChange={() => setTurnOrder("alternating")} /> Alternating</label>
        <label><input type="radio" name="turn-order" checked={turnOrder === "stack"} onChange={() => setTurnOrder("stack")} /> Complete your stack</label>
      </div>
      <div className="button-row">
        {hasDeck && <AppButton variant="secondary" onClick={resumeBox}>Return to box</AppButton>}
        <AppButton onClick={start}>Begin writing</AppButton>
      </div>
    </section>
  );
}

function Handoff({ player, onReady }) {
  return (
    <section className="handoff-screen panel">
      <p className="eyebrow">private handoff</p>
      <h2>Pass the screen to {player}.</h2>
      <p className="muted">Drafts and previous questions are covered. Tap when ready.</p>
      <AppButton onClick={onReady}>I'm ready</AppButton>
    </section>
  );
}

function QuestionComposer({ player, quota, completedByPlayer, totalCreated, draft, setDraft, submit, canReturnBox, returnBox, turnLabel, orderLabel, isAnimating }) {
  const progress = completedByPlayer[player] || 0;
  return (
    <div className="composer-layout">
      <section className="panel composer-main">
        <p className="eyebrow">{turnLabel}</p>
        <h2>{player} · Question {Math.min(progress + 1, quota)} of {quota}</h2>
        <div className={cx("live-card", isAnimating && "fly-to-box")}>
          <span className="live-card-kicker">Private card preview</span>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a question for the box..." autoFocus />
          <p>{draft.trim() || "Your question appears here as you type."}</p>
        </div>
        <div className="button-row">
          {canReturnBox && <AppButton variant="secondary" onClick={returnBox}>Return to box</AppButton>}
          <AppButton onClick={submit} disabled={!draft.trim() || isAnimating}>Add to the Box</AppButton>
        </div>
      </section>
      <aside className="panel progress-panel">
        <p className="eyebrow">progress</p>
        <h3>{totalCreated} cards created</h3>
        {Object.entries(completedByPlayer).map(([name, count]) => (
          <div key={name} className="meter-row"><span>{name}</span><strong>{count}/{quota}</strong></div>
        ))}
        <p className="microcopy">Question text stays hidden until a card is drawn.</p>
        <p className="microcopy">Turn order: {orderLabel}</p>
      </aside>
    </div>
  );
}

function CardBox({ deck, drawnCard, stats, shuffleDeck, drawCard, markAnswer, skipCard, swapQuestion, backToWriting, goHome, isShuffling, isDrawing, mixedActions }) {
  const remaining = deck.filter((card) => card.state === "in-box").length;
  const done = stats.answered + stats.skipped;
  if (remaining === 0 && !drawnCard) {
    return <Summary stats={stats} goHome={goHome} replay={backToWriting} />;
  }
  return (
    <div className="box-layout">
      <section className="panel box-stage">
        <div className={cx("box-art", isShuffling && "is-shuffling", isDrawing && "is-drawing")}>
          <AssetImage candidates={isDrawing ? ASSETS.objects.boxOpen : ASSETS.objects.box} alt="Card box" className="box-image" fallback={<div className="css-box"><span /></div>} />
          {deck.filter((card) => card.state === "in-box").slice(0, 8).map((card, index) => (
            <span key={card.id} className="mini-card" style={{ "--i": index }} />
          ))}
        </div>
        <div className="box-actions">
          <AppButton onClick={drawCard} disabled={remaining === 0 || isDrawing}>Pick a Card</AppButton>
          <AppButton variant="secondary" onClick={shuffleDeck} disabled={remaining < 2 || isShuffling}>Shuffle the Cards</AppButton>
          <AppButton variant="ghost" onClick={backToWriting}>Back to writing</AppButton>
        </div>
        <p className="microcopy">{remaining} hidden cards remaining. {done} resolved.</p>
      </section>
      <section className="panel drawn-panel">
        {drawnCard ? (
          <DrawnCard card={drawnCard} markAnswer={markAnswer} skipCard={skipCard} swapQuestion={swapQuestion} mixedActions={mixedActions} />
        ) : (
          <div className="empty-drawn">
            <p className="eyebrow">the next reveal waits</p>
            <h2>Open the box when you are ready.</h2>
            <p className="muted">Shuffling changes the real deck order, not just the animation.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function DrawnCard({ card, markAnswer, skipCard, swapQuestion, mixedActions }) {
  const [bothDone, setBothDone] = useState({});
  const players = card.players || [];
  const opposite = players.find((player) => player !== card.author) || players[0];
  const bothComplete = players.every((player) => bothDone[player]);
  return (
    <div className="drawn-card">
      <p className="eyebrow">card by {card.author || "the box"}</p>
      <h2>{card.text}</h2>
      <div className="answer-block">
        <h3>Both Answer</h3>
        <div className="button-row tight">
          {players.map((player) => (
            <button key={player} type="button" className={cx("done-chip", bothDone[player] && "active")} onClick={() => setBothDone((done) => ({ ...done, [player]: !done[player] }))}>{player}</button>
          ))}
        </div>
        <AppButton disabled={!bothComplete} onClick={() => markAnswer(card.id, "both")}>Both done</AppButton>
      </div>
      <div className="answer-block subtle">
        <h3>Assigned Player Answers</h3>
        <p>{opposite} answers by default.</p>
        <AppButton variant="secondary" onClick={() => markAnswer(card.id, "assigned")}>Mark answered</AppButton>
      </div>
      <div className="button-row">
        <AppButton variant="ghost" onClick={() => skipCard(card.id)}>Skip</AppButton>
        <AppButton variant="secondary" onClick={() => swapQuestion(card.id)}>Swap Question</AppButton>
      </div>
      {mixedActions}
    </div>
  );
}

function Summary({ stats, goHome, replay }) {
  return (
    <section className="panel summary-panel">
      <p className="eyebrow">complete</p>
      <h2>That's one evening worth of new stories.</h2>
      <div className="summary-grid">
        <span><strong>{stats.deckTotal}</strong> created</span>
        <span><strong>{stats.answered}</strong> answered</span>
        <span><strong>{stats.skipped}</strong> skipped</span>
      </div>
      <div className="button-row">
        <AppButton onClick={goHome}>Return home</AppButton>
        <AppButton variant="secondary" onClick={replay}>Replay with same players</AppButton>
      </div>
    </section>
  );
}

function TruthOrDare({ players, drawPrompt, currentPrompt, categories, setCategories, intensity, setIntensity, sessionStyle, setSessionStyle, customDeckCount, openBox }) {
  const truthCats = Object.keys(truthPrompts);
  const dareCats = Object.keys(darePrompts);
  return (
    <div className="mode-layout truth-layout">
      <section className="panel mode-options">
        <div className="section-title">
          <IconBadge mode="truth" />
          <div><p className="eyebrow">truth or dare</p><h2>Choose the kind of reveal.</h2></div>
        </div>
        <FieldLabel>Session style</FieldLabel>
        <select value={sessionStyle} onChange={(event) => setSessionStyle(event.target.value)}>
          <option value="tod">Truth or Dare only</option>
          <option value="custom">Custom question cards only</option>
          <option value="mixed">Mixed mode</option>
        </select>
        <FieldLabel>Intensity</FieldLabel>
        <div className="segmented">
          {["Chill", "Playful", "Bold"].map((level) => <button key={level} type="button" className={intensity === level ? "active" : ""} onClick={() => setIntensity(level)}>{level}</button>)}
        </div>
        <FieldLabel>Categories</FieldLabel>
        <div className="tag-grid">
          {[...truthCats, ...dareCats].map((cat) => <label key={cat}><input type="checkbox" checked={categories.includes(cat)} onChange={() => setCategories((current) => current.includes(cat) ? current.filter((item) => item !== cat) : [...current, cat])} /> {cat}</label>)}
        </div>
        {customDeckCount > 0 && <AppButton variant="secondary" onClick={openBox}>Return to custom card box</AppButton>}
      </section>
      <section className="tod-stage">
        <button type="button" className="tod-card truth-card" onClick={() => drawPrompt("truth")}>
          <span>TRUTH</span><small>honest, warm, curious</small>
        </button>
        <button type="button" className="tod-card dare-card" onClick={() => drawPrompt("dare")}>
          <span>DARE</span><small>playful, creative, low-pressure</small>
        </button>
        {currentPrompt && (
          <div className="panel prompt-reveal">
            <p className="eyebrow">{currentPrompt.type} · {currentPrompt.category} · {intensity}</p>
            <h2>{currentPrompt.text}</h2>
            <div className="button-row">
              <AppButton onClick={() => drawPrompt(currentPrompt.type)}>Another {currentPrompt.type}</AppButton>
              <AppButton variant="secondary" onClick={() => drawPrompt(currentPrompt.type === "truth" ? "dare" : "truth")}>Switch</AppButton>
              <AppButton variant="ghost" onClick={() => drawPrompt(currentPrompt.type)}>Skip</AppButton>
            </div>
            <p className="microcopy">Both can answer verbally, or use this as a detour before returning to the box.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ActivityPlanner() {
  const [duration, setDuration] = useState("30 minutes");
  const [filters, setFilters] = useState([]);
  const [current, setCurrent] = useState(activities[0]);
  const filterOptions = ["indoors", "outdoors", "campus", "low budget", "food and drinks", "creative activities", "relaxation", "spontaneous adventures"];
  const matches = activities.filter((activity) => activity.duration === duration && filters.every((filter) => activity.tags.includes(filter)));
  const pool = matches.length ? matches : activities.filter((activity) => activity.duration === duration);
  const next = (surprise = false) => {
    const source = pool.length ? pool : activities;
    setCurrent(surprise ? sample(source) : source[(source.findIndex((item) => item.title === current.title) + 1) % source.length]);
  };
  return (
    <div className="mode-layout">
      <section className="panel mode-options">
        <div className="section-title"><IconBadge mode="plan" /><div><p className="eyebrow">plan something together</p><h2>Pick the shape of the next little plan.</h2></div></div>
        <FieldLabel>Duration</FieldLabel>
        <select value={duration} onChange={(event) => setDuration(event.target.value)}>
          {["15 minutes", "30 minutes", "1 hour", "A whole afternoon or evening"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <FieldLabel>Filters</FieldLabel>
        <div className="tag-grid">{filterOptions.map((filter) => <label key={filter}><input type="checkbox" checked={filters.includes(filter)} onChange={() => setFilters((currentFilters) => currentFilters.includes(filter) ? currentFilters.filter((item) => item !== filter) : [...currentFilters, filter])} /> {filter}</label>)}</div>
      </section>
      <section className="panel activity-card">
        <span className="activity-icon">{current.icon}</span>
        <p className="eyebrow">{current.duration} · {current.budget} budget</p>
        <h2>{current.title}</h2>
        <p>{current.description}</p>
        <div className="tag-row">{current.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="button-row">
          <AppButton onClick={() => alert(`Plan saved for tonight: ${current.title}`)}>Let's Do It</AppButton>
          <AppButton variant="secondary" onClick={() => next(false)}>Next Idea</AppButton>
          <AppButton variant="ghost" onClick={() => next(true)}>Surprise Us</AppButton>
        </div>
      </section>
    </div>
  );
}

function BothAnswerMode({ players }) {
  const [prompt, setPrompt] = useState(sample(bothPrompts));
  const [done, setDone] = useState({});
  return (
    <section className="panel narrow-panel">
      <div className="section-title"><IconBadge mode="both" /><div><p className="eyebrow">both answer</p><h2>{prompt}</h2></div></div>
      <div className="button-row">
        {players.map((player) => <button key={player} type="button" className={cx("done-chip", done[player] && "active")} onClick={() => setDone((current) => ({ ...current, [player]: !current[player] }))}>{player}</button>)}
      </div>
      <AppButton onClick={() => { setPrompt(sample(bothPrompts)); setDone({}); }}>Another prompt</AppButton>
    </section>
  );
}

function LikelyMode({ players }) {
  const [prompt, setPrompt] = useState(sample(likelyPrompts));
  const [choices, setChoices] = useState({});
  const [revealed, setRevealed] = useState(false);
  const options = [players[0], players[1], "Both"];
  return (
    <section className="panel narrow-panel">
      <div className="section-title"><IconBadge mode="likely" /><div><p className="eyebrow">who's more likely to?</p><h2>{prompt}</h2></div></div>
      {players.map((player) => (
        <div key={player} className="secret-vote">
          <strong>{player}</strong>
          <div className="segmented">{options.map((option) => <button key={option} type="button" className={choices[player] === option ? "active" : ""} onClick={() => setChoices((current) => ({ ...current, [player]: option }))}>{option}</button>)}</div>
        </div>
      ))}
      <div className="button-row">
        <AppButton disabled={!players.every((player) => choices[player])} onClick={() => setRevealed(true)}>Reveal choices</AppButton>
        <AppButton variant="secondary" onClick={() => { setPrompt(sample(likelyPrompts)); setChoices({}); setRevealed(false); }}>New prompt</AppButton>
      </div>
      {revealed && <div className="reveal-grid">{players.map((player) => <span key={player}><strong>{player}</strong>{choices[player]}</span>)}</div>}
    </section>
  );
}

function MemoryMode() {
  const [prompt, setPrompt] = useState(sample(memoryPrompts));
  const [custom, setCustom] = useState("");
  const [customs, setCustoms] = useState([]);
  const add = () => {
    const clean = custom.trim();
    if (!clean) return;
    setCustoms((items) => [...items, clean]);
    setPrompt(clean);
    setCustom("");
  };
  return (
    <section className="panel narrow-panel">
      <div className="section-title"><IconBadge mode="memory" /><div><p className="eyebrow">memory lane</p><h2>{prompt}</h2></div></div>
      <div className="inline-form">
        <input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="Add a custom memory prompt" />
        <AppButton onClick={add}>Add</AppButton>
      </div>
      <div className="button-row">
        <AppButton onClick={() => setPrompt(sample([...memoryPrompts, ...customs]))}>Next memory</AppButton>
      </div>
    </section>
  );
}

function SurpriseMode() {
  const categories = ["Question", "Activity", "Mini-Challenge", "Memory", "Compliment"];
  const [enabled, setEnabled] = useState(categories);
  const [revealing, setRevealing] = useState(false);
  const [item, setItem] = useState(null);
  const reveal = () => {
    setRevealing(true);
    setTimeout(() => {
      const pool = surpriseBank.filter((entry) => enabled.includes(entry.type));
      setItem(sample(pool.length ? pool : surpriseBank));
      setRevealing(false);
    }, 650);
  };
  return (
    <section className="panel narrow-panel">
      <div className="section-title"><IconBadge mode="surprise" /><div><p className="eyebrow">random surprise</p><h2>Configure the mystery.</h2></div></div>
      <div className="tag-grid">{categories.map((category) => <label key={category}><input type="checkbox" checked={enabled.includes(category)} onChange={() => setEnabled((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category])} /> {category}</label>)}</div>
      <AppButton onClick={reveal}>Reveal surprise</AppButton>
      <div className={cx("surprise-reveal", revealing && "anticipating")}>{revealing ? "Choosing..." : item ? <><p className="eyebrow">{item.type}</p><h2>{item.text}</h2></> : "Nothing revealed yet."}</div>
    </section>
  );
}

function AssetGuide() {
  return (
    <details className="asset-guide">
      <summary>Asset guide</summary>
      <table>
        <thead><tr><th>Filename</th><th>Size</th><th>Ratio</th><th>Notes</th></tr></thead>
        <tbody>{assetRequirements.map(([file, size, ratio, notes]) => <tr key={file}><td>{file}</td><td>{size}</td><td>{ratio}</td><td>{notes}</td></tr>)}</tbody>
      </table>
    </details>
  );
}

function App() {
  const [phase, setPhase] = useState("setup");
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [settings, setSettings] = useState({ volume: 0.55, muted: false, musicShuffle: true, sfx: true, reducedMotion: false, ambient: true });
  const audioRef = useRef(null);
  const [questionCount, setQuestionCount] = useState(3);
  const [customCount, setCustomCount] = useState("");
  const [turnOrder, setTurnOrder] = useState("alternating");
  const [completedByPlayer, setCompletedByPlayer] = useState({});
  const [writingPlayer, setWritingPlayer] = useState("");
  const [draft, setDraft] = useState("");
  const [deck, setDeck] = useState([]);
  const [drawnCard, setDrawnCard] = useState(null);
  const [isAnimatingCard, setIsAnimatingCard] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [truthState, setTruthState] = useState({ categories: ["Funny", "Getting to Know You", "Compliments", "Creative Challenges"], intensity: "Playful", sessionStyle: "tod", prompt: null });

  useEffect(() => {
    document.body.classList.toggle("reduce-motion", settings.reducedMotion);
    document.body.classList.toggle("ambient-off", !settings.ambient);
  }, [settings.reducedMotion, settings.ambient]);

  const twoPlayers = players.slice(0, 2);
  const quota = questionCount === "custom" ? Math.max(1, Number(customCount) || 0) : questionCount;
  const stats = useMemo(() => {
    const remaining = deck.filter((card) => card.state === "in-box").length;
    return {
      deckTotal: deck.length,
      remaining,
      answered: deck.filter((card) => card.state === "answered").length,
      skipped: deck.filter((card) => card.state === "skipped").length,
      drawn: deck.filter((card) => card.state === "drawn").length,
    };
  }, [deck]);

  const addPlayer = (event) => {
    event.preventDefault();
    const clean = playerName.trim();
    if (!clean) return;
    setPlayers((current) => [...current, clean]);
    setPlayerName("");
  };

  const removePlayer = (index) => setPlayers((current) => current.filter((_, playerIndex) => playerIndex !== index));

  const goHome = () => {
    if (["writing", "handoff", "box"].includes(phase) && stats.remaining > 0 && !window.confirm("Return home? Your active question session will stay available.")) return;
    setDrawnCard(null);
    setPhase(twoPlayers.length >= 2 ? "home" : "setup");
  };

  const startWriting = () => {
    if (!quota || quota < 1 || twoPlayers.length < 2) return;
    const initial = { [twoPlayers[0]]: 0, [twoPlayers[1]]: 0 };
    setCompletedByPlayer(initial);
    setDeck([]);
    setDrawnCard(null);
    setDraft("");
    setWritingPlayer(twoPlayers[0]);
    setPhase("handoff");
  };

  const nextWriter = (counts) => {
    const [p1, p2] = twoPlayers;
    if (counts[p1] >= quota && counts[p2] >= quota) return null;
    if (turnOrder === "stack") return counts[p1] < quota ? p1 : p2;
    if (writingPlayer === p1 && counts[p2] < quota) return p2;
    if (writingPlayer === p2 && counts[p1] < quota) return p1;
    return counts[p1] < quota ? p1 : p2;
  };

  const submitQuestion = () => {
    const clean = draft.trim();
    if (!clean || isAnimatingCard) return;
    setIsAnimatingCard(true);
    const card = { id: uid(), text: clean, author: writingPlayer, players: twoPlayers, state: "in-box", createdAt: Date.now() };
    setDeck((current) => [...current, card]);
    const nextCounts = { ...completedByPlayer, [writingPlayer]: (completedByPlayer[writingPlayer] || 0) + 1 };
    setCompletedByPlayer(nextCounts);
    setDraft("");
    setTimeout(() => {
      const next = nextWriter(nextCounts);
      setIsAnimatingCard(false);
      if (!next) {
        setPhase("box");
        return;
      }
      setWritingPlayer(next);
      setPhase("handoff");
    }, 520);
  };

  const shuffleDeck = () => {
    setIsShuffling(true);
    setDeck((current) => {
      const inBox = shuffle(current.filter((card) => card.state === "in-box"));
      const resolved = current.filter((card) => card.state !== "in-box");
      return [...inBox, ...resolved];
    });
    setTimeout(() => setIsShuffling(false), 700);
  };

  const drawCard = () => {
    if (isDrawing) return;
    const next = deck.find((card) => card.state === "in-box");
    if (!next) return;
    setIsDrawing(true);
    setTimeout(() => {
      setDeck((current) => current.map((card) => card.id === next.id ? { ...card, state: "drawn" } : card));
      setDrawnCard({ ...next, state: "drawn" });
      setIsDrawing(false);
    }, 520);
  };

  const updateCardState = (id, state) => {
    setDeck((current) => current.map((card) => card.id === id ? { ...card, state } : card));
    setDrawnCard(null);
  };

  const swapQuestion = (id) => {
    setDeck((current) => current.map((card) => card.id === id ? { ...card, state: "in-box" } : card));
    setDrawnCard(null);
    setTimeout(shuffleDeck, 20);
  };

  const drawTruthDare = (type) => {
    const source = type === "truth" ? truthPrompts : darePrompts;
    const allowed = Object.keys(source).filter((cat) => truthState.categories.includes(cat));
    const category = sample(allowed.length ? allowed : Object.keys(source));
    setTruthState((current) => ({ ...current, prompt: { type, category, text: sample(source[category]) } }));
  };

  const openMode = (mode) => {
    if (mode === "ask") setPhase("ask");
    else if (mode === "plan") setPhase("plan");
    else setPhase(mode);
  };

  const progress = phase === "writing" ? `${writingPlayer}: ${(completedByPlayer[writingPlayer] || 0) + 1}/${quota}` : stats.deckTotal ? `${stats.remaining} in box · ${stats.answered} answered · ${stats.skipped} skipped` : null;
  const musicControls = <MusicControls audioRef={audioRef} settings={settings} setSettings={setSettings} />;
  const settingsControls = <SettingsPanel settings={settings} setSettings={setSettings} />;

  return (
    <Shell phase={phase} players={twoPlayers} onHome={goHome} progress={progress} musicControls={musicControls} settingsControls={settingsControls}>
      <audio ref={audioRef} onError={() => console.warn("Audio file could not be loaded.")} />
      {phase === "setup" && <SetupScreen players={players} playerName={playerName} setPlayerName={setPlayerName} addPlayer={addPlayer} removePlayer={removePlayer} continueHome={() => setPhase("home")} />}
      {phase === "home" && <HomeScreen players={twoPlayers} openMode={openMode} stats={stats} />}
      {phase === "ask" && <AskSetup questionCount={questionCount} setQuestionCount={setQuestionCount} customCount={customCount} setCustomCount={setCustomCount} turnOrder={turnOrder} setTurnOrder={setTurnOrder} start={startWriting} resumeBox={() => setPhase("box")} hasDeck={deck.length > 0} />}
      {phase === "handoff" && <Handoff player={writingPlayer} onReady={() => setPhase("writing")} />}
      {phase === "writing" && <QuestionComposer player={writingPlayer} quota={quota} completedByPlayer={completedByPlayer} totalCreated={deck.length} draft={draft} setDraft={setDraft} submit={submitQuestion} canReturnBox={deck.length > 0} returnBox={() => setPhase("box")} turnLabel="private writing turn" orderLabel={turnOrder === "alternating" ? "Alternating" : "Complete your stack"} isAnimating={isAnimatingCard} />}
      {phase === "box" && <CardBox deck={deck} drawnCard={drawnCard} stats={stats} shuffleDeck={shuffleDeck} drawCard={drawCard} markAnswer={(id) => updateCardState(id, "answered")} skipCard={(id) => updateCardState(id, "skipped")} swapQuestion={swapQuestion} backToWriting={() => { setDrawnCard(null); setWritingPlayer(nextWriter(completedByPlayer) || twoPlayers[0]); setPhase(nextWriter(completedByPlayer) ? "handoff" : "ask"); }} goHome={goHome} isShuffling={isShuffling} isDrawing={isDrawing} mixedActions={<div className="mixed-actions"><AppButton variant="secondary" onClick={() => { drawTruthDare("truth"); setPhase("truth"); }}>Switch to Truth</AppButton><AppButton variant="secondary" onClick={() => { drawTruthDare("dare"); setPhase("truth"); }}>Switch to Dare</AppButton></div>} />}
      {phase === "truth" && <TruthOrDare players={twoPlayers} drawPrompt={drawTruthDare} currentPrompt={truthState.prompt} categories={truthState.categories} setCategories={(fn) => setTruthState((current) => ({ ...current, categories: typeof fn === "function" ? fn(current.categories) : fn }))} intensity={truthState.intensity} setIntensity={(intensity) => setTruthState((current) => ({ ...current, intensity }))} sessionStyle={truthState.sessionStyle} setSessionStyle={(sessionStyle) => setTruthState((current) => ({ ...current, sessionStyle }))} customDeckCount={stats.remaining} openBox={() => setPhase("box")} />}
      {phase === "plan" && <ActivityPlanner />}
      {phase === "both" && <BothAnswerMode players={twoPlayers} />}
      {phase === "likely" && <LikelyMode players={twoPlayers} />}
      {phase === "memory" && <MemoryMode />}
      {phase === "surprise" && <SurpriseMode />}
      <AssetGuide />
    </Shell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
