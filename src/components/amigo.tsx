"use client";
/* eslint-disable @next/next/no-img-element */
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type SetStateAction,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  BedDouble,
  Check,
  CheckCheck,
  ChevronDown,
  Heart,
  Home,
  LayoutGrid,
  List,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  Wifi,
  Wind,
  X,
  GraduationCap,
  Leaf,
  Building2,
  Send,
  RotateCcw,
} from "lucide-react";
import {
  defaultProfile,
  filterListings,
  listings,
  roommates,
  type Listing,
  type Roommate,
  type Traits,
} from "@/lib/data";
import { compatibility } from "@/lib/matching";
const money = (n: number) => new Intl.NumberFormat("en-IN").format(n);
type View = "discover" | "roommates" | "saved";
type Dialog = "profile" | "owner" | "help" | "plans" | null;
function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("amigo-storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("amigo-storage", callback);
  };
}
function useStored<T>(key: string, initial: T) {
  const snapshot = useSyncExternalStore(
    subscribeStorage,
    () => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
  let value = initial;
  try {
    if (snapshot) value = JSON.parse(snapshot) as T;
  } catch {}
  const setter = useCallback(
    (next: SetStateAction<T>) => {
      let previous = initial;
      try {
        const raw = localStorage.getItem(key);
        if (raw) previous = JSON.parse(raw) as T;
      } catch {}
      const updated =
        typeof next === "function" ? (next as (v: T) => T)(previous) : next;
      try {
        localStorage.setItem(key, JSON.stringify(updated));
        window.dispatchEvent(new Event("amigo-storage"));
      } catch {
        window.alert(
          "Your browser could not save this change. Please enable local storage.",
        );
      }
    },
    [key, initial],
  );
  return [value, setter] as const;
}
export default function Amigo() {
  const [view, setView] = useState<View>("discover");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState(15000);
  const [genders, setGenders] = useState<string[]>([]);
  const [sharing, setSharing] = useState<string[]>([]);
  const [food, setFood] = useState(false);
  const [ac, setAc] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [layout, setLayout] = useState("grid");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [saved, setSaved] = useStored<string[]>("amigo:saved", []);
  const [profile, setProfile] = useStored<Roommate>(
    "amigo:profile",
    defaultProfile,
  );
  const [profileDone, setProfileDone] = useStored("amigo:profileDone", false);
  const [likes, setLikes] = useStored<string[]>("amigo:likes", []);
  const [passed, setPassed] = useStored<string[]>("amigo:passed", []);
  const [enquiries, setEnquiries] = useStored<string[]>("amigo:enquiries", []);
  const [drafts, setDrafts] = useStored<
    { name: string; area: string; price: number; plan: string }[]
  >("amigo:drafts", []);
  const [detail, setDetail] = useState<Listing | null>(null);
  const [enquiring, setEnquiring] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [toast, setToast] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Free");
  const [tab, setTab] = useState("discover");
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDialog(null);
        setDetail(null);
        setMobileFilters(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const toggle = (xs: string[], x: string) =>
    xs.includes(x) ? xs.filter((a) => a !== x) : [...xs, x];
  const save = (id: string) => {
    setSaved(toggle(saved, id));
    setToast(
      saved.includes(id)
        ? "Removed from your saved places"
        : "A little closer to home. Place saved!",
    );
  };
  const reset = () => {
    setBudget(15000);
    setGenders([]);
    setSharing([]);
    setFood(false);
    setAc(false);
    setQuery("");
    setSearch("");
  };
  const filtered = filterListings(
    view === "saved" ? listings.filter((x) => saved.includes(x.id)) : listings,
    { query: search, budget, genders, sharing, food, ac, sort },
  );
  const feed = roommates
    .map((person) => ({ person, match: compatibility(profile, person) }))
    .filter(
      (x) =>
        x.match &&
        !passed.includes(x.person.id) &&
        (tab === "likes"
          ? likes.includes(x.person.id)
          : !likes.includes(x.person.id)),
    )
    .sort((a, b) => b.match!.score - a.match!.score);
  function navigate(next: View) {
    setView(next);
    reset();
    setShowMenu(false);
  }
  const activeFilters =
    genders.length +
    sharing.length +
    Number(food) +
    Number(ac) +
    Number(budget < 15000);
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => navigate("discover")}
            aria-label="PG Amigo home"
          >
            <span className="brand-symbol">
              <Home size={22} />
              <span />
            </span>
            <span>
              pg<span className="brand-green">amigo</span>
              <i>✦</i>
            </span>
          </button>
          <nav
            className={showMenu ? "nav open" : "nav"}
            aria-label="Main navigation"
          >
            <button
              className={view === "discover" ? "active" : ""}
              onClick={() => navigate("discover")}
            >
              Find a PG
            </button>
            <button
              className={view === "roommates" ? "active" : ""}
              onClick={() => navigate("roommates")}
            >
              Find a roommate <span className="new">NEW</span>
            </button>
            <button
              className={view === "saved" ? "active" : ""}
              onClick={() => navigate("saved")}
            >
              Saved <span className="count">{saved.length}</span>
            </button>
          </nav>
          <div className="header-actions">
            <button className="owner-link" onClick={() => setDialog("plans")}>
              List your property <ArrowUpRight size={15} />
            </button>
            <span className="header-divider" />
            <button
              className="avatar"
              aria-label="Edit your profile"
              onClick={() => setDialog("profile")}
            >
              {profileDone ? profile.name.slice(0, 1).toUpperCase() : "S"}
              <span />
            </button>
            <button
              className="menu-button icon-button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Toggle navigation"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> A NEW CITY. A FAMILIAR FEELING.
            </div>
            <h1>
              A place to stay.
              <br />
              People to <span>belong.</span>
              <svg viewBox="0 0 280 14" aria-hidden="true">
                <path d="M3 10Q130 -3 276 7M30 13Q160 4 260 10" />
              </svg>
            </h1>
            <p>
              Find a PG that feels like home and a roommate who gets you.
              <br className="desktop-break" /> Your next chapter starts with a
              little help from Amigo.
            </p>
            <div className="hero-trust">
              <span className="avatar-stack">
                <b>A</b>
                <b>R</b>
                <b>M</b>
                <b>K</b>
              </span>
              <span>
                <strong>A better way to move in</strong>
                <small>Made for students, by people who get it.</small>
              </span>
              <span className="hero-stars">★★★★★</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit" />
            <span className="art-spark one">✧</span>
            <span className="art-spark two">✦</span>
            <div className="art-house">
              <div className="house-roof" />
              <div className="house-body">
                <div className="window w1">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="window w2">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="door">
                  <span />
                </div>
                <div className="house-step" />
              </div>
              <div className="plant">
                <i />
                <i />
                <i />
                <span />
              </div>
            </div>
            <div className="floating-tag tag-verified">
              <span>
                <ShieldCheck size={20} />
              </span>
              <div>
                Good places.<strong>Even better peace of mind.</strong>
              </div>
            </div>
            <div className="floating-tag tag-match">
              <span>
                <Heart size={19} />
              </span>
              <div>
                Same vibe?<strong>Meet your kind of people.</strong>
              </div>
            </div>
            <span className="art-caption">less searching, more living ↗</span>
          </div>
        </section>
        <section className="search-section">
          <div className="search-tabs">
            <button
              className={view !== "roommates" ? "selected" : ""}
              onClick={() => navigate("discover")}
            >
              <Building2 size={17} /> Find my PG
            </button>
            <button
              className={view === "roommates" ? "selected" : ""}
              onClick={() => navigate("roommates")}
            >
              <Users size={18} /> Find my roommate <Sparkles size={13} />
            </button>
          </div>
          <form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(query);
              if (view === "roommates") setView("discover");
            }}
          >
            <div className="search-city">
              <MapPin size={21} />
              <div>
                <label htmlFor="city">YOUR CITY</label>
                <select id="city" aria-label="City">
                  <option>Bengaluru</option>
                </select>
              </div>
            </div>
            <div className="search-input">
              <Search size={21} />
              <div>
                <label htmlFor="search">WHERE DO YOU WANT TO LIVE?</label>
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="College, neighbourhood, or PG name"
                />
              </div>
            </div>
            <button className="primary search-submit" type="submit">
              Find my space <ArrowRight size={18} />
            </button>
          </form>
          <div className="popular">
            <span>Popular near you:</span>
            {[
              "Christ University",
              "Koramangala",
              "BTM Layout",
              "HSR Layout",
            ].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setQuery(t);
                  setSearch(t);
                  setView("discover");
                }}
              >
                {t}
              </button>
            ))}
            <span className="demo-badge">
              <span /> Sample listings · Bengaluru
            </span>
          </div>
        </section>
        <section className="discovery" id="explore">
          <div className="section-title">
            <div className="breadcrumb">YOUR NEXT CHAPTER, RIGHT THIS WAY</div>
            <div className="title-row">
              <h2>
                {view === "roommates"
                  ? "Good roommates. Great beginnings."
                  : view === "saved"
                    ? "Your little list of possibilities."
                    : "Find your kind of home."}
              </h2>
              <span className="curated">
                <ShieldCheck size={16} /> Thoughtfully picked. Student friendly.
              </span>
            </div>
          </div>
          {view === "roommates" ? (
            <>
              <div className="roommate-banner">
                <div className="banner-icon">
                  <Users />
                </div>
                <div>
                  <h3>
                    {profileDone
                      ? `Your people are out there, ${profile.name.split(" ")[0]}.`
                      : "A good match starts with you."}
                  </h3>
                  <p>
                    Tell us your habits and what matters to you. We’ll look for
                    a fit both ways.
                  </p>
                </div>
                <button
                  className="primary"
                  onClick={() => setDialog("profile")}
                >
                  {profileDone ? "Edit my preferences" : "Create my profile"}{" "}
                  <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="roommate-toolbar">
                <div className="segmented">
                  <button
                    className={tab === "discover" ? "selected" : ""}
                    onClick={() => setTab("discover")}
                  >
                    Discover
                  </button>
                  <button
                    className={tab === "likes" ? "selected" : ""}
                    onClick={() => setTab("likes")}
                  >
                    Liked ({likes.length})
                  </button>
                </div>
                <span>
                  <ShieldCheck size={15} /> Contacts stay private. A like isn’t
                  a mutual match.
                </span>
              </div>
              <div className="roommate-grid">
                {feed.map(({ person, match }) => (
                  <article className="roommate-card" key={person.id}>
                    <div className={`person-cover cover-${person.id}`}>
                      <span className="person-monogram">
                        {person.name.charAt(0)}
                      </span>
                      <span className="compatibility">
                        <Sparkles size={14} />
                        {match!.score}% compatible
                      </span>
                      <span className="profile-sample">SAMPLE PROFILE</span>
                    </div>
                    <div className="person-body">
                      <h3>
                        {person.name} <span>{person.age}</span>
                      </h3>
                      <p className="person-college">
                        <GraduationCap size={15} />
                        {person.college}
                      </p>
                      <p className="muted">{person.course} · Bengaluru</p>
                      <p className="bio">{person.bio}</p>
                      <div className="reason-tags">
                        {match!.reasons.slice(0, 3).map((r) => (
                          <span key={r}>
                            <Check size={12} />
                            {r}
                          </span>
                        ))}
                      </div>
                      <div className="person-budget">
                        Monthly budget{" "}
                        <strong>
                          ₹{money(person.budget[0])}–{money(person.budget[1])}
                        </strong>
                      </div>
                      <div className="person-actions">
                        <button
                          className="secondary"
                          onClick={() => setPassed([...passed, person.id])}
                        >
                          <X size={17} /> Pass
                        </button>
                        <button
                          className={
                            likes.includes(person.id)
                              ? "liked-button"
                              : "primary"
                          }
                          onClick={() => {
                            if (!profileDone) {
                              setDialog("profile");
                              return;
                            }
                            setLikes(toggle(likes, person.id));
                            setToast(
                              likes.includes(person.id)
                                ? "Like removed"
                                : "Like saved in this demo. Chat opens only after a real mutual match.",
                            );
                          }}
                        >
                          <Heart size={16} />
                          {likes.includes(person.id) ? "Liked" : "Like profile"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {!feed.length && (
                <div className="empty">
                  <Users size={36} />
                  <h3>
                    {tab === "likes"
                      ? "Your liked profiles will live here."
                      : "You’re all caught up."}
                  </h3>
                  <p>
                    {tab === "likes"
                      ? "Explore profiles and like someone whose lifestyle fits yours."
                      : "Try adjusting your preferences or reset your passed profiles."}
                  </p>
                  <button
                    className="secondary"
                    onClick={() => {
                      setPassed([]);
                      setTab("discover");
                    }}
                  >
                    <RotateCcw size={16} /> Explore profiles
                  </button>
                </div>
              )}
              <p className="demo-note">
                Sample profiles for exploring the experience. Compatibility uses
                both people’s preferences, budget overlap, gender choices, and
                dealbreakers.
              </p>
            </>
          ) : (
            <div className="results-layout">
              <aside
                className={mobileFilters ? "filters show-filters" : "filters"}
              >
                <div className="filter-heading">
                  <h3>
                    <SlidersHorizontal size={17} /> Filters{" "}
                    {activeFilters > 0 && (
                      <span className="count">{activeFilters}</span>
                    )}
                  </h3>
                  <button className="text-button" onClick={reset}>
                    Reset all
                  </button>
                  <button
                    className="mobile-close icon-button"
                    aria-label="Close filters"
                    onClick={() => setMobileFilters(false)}
                  >
                    <X />
                  </button>
                </div>
                <div className="filter-block">
                  <h4>
                    Monthly budget <ChevronDown size={14} />
                  </h4>
                  <div className="budget-values">
                    <span>₹3,000</span>
                    <strong>
                      ₹{money(budget)}
                      {budget === 15000 ? "+" : ""}
                    </strong>
                  </div>
                  <input
                    className="budget-range"
                    aria-label="Maximum monthly budget"
                    type="range"
                    min="3000"
                    max="15000"
                    step="500"
                    value={budget}
                    onChange={(e) => setBudget(+e.target.value)}
                  />
                  <div className="range-labels">
                    <span>Min. budget</span>
                    <span>Max. budget</span>
                  </div>
                </div>
                <div className="filter-block">
                  <h4>
                    Looking for <ChevronDown size={14} />
                  </h4>
                  {["Boys", "Girls", "Co-living"].map((v, i) => (
                    <label className="check-row" key={v}>
                      <input
                        type="checkbox"
                        checked={genders.includes(v)}
                        onChange={() => setGenders(toggle(genders, v))}
                      />
                      <span>
                        {v === "Boys"
                          ? "Boys PG"
                          : v === "Girls"
                            ? "Girls PG"
                            : "Co-living"}
                      </span>
                      <small>{[2, 3, 1][i]}</small>
                    </label>
                  ))}
                </div>
                <div className="filter-block">
                  <h4>
                    Room sharing <ChevronDown size={14} />
                  </h4>
                  <div className="sharing-options">
                    {["Single", "Double", "Triple"].map((v) => (
                      <button
                        className={sharing.includes(v) ? "selected" : ""}
                        key={v}
                        onClick={() => setSharing(toggle(sharing, v))}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-block">
                  <h4>
                    The little essentials <ChevronDown size={14} />
                  </h4>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={food}
                      onChange={(e) => setFood(e.target.checked)}
                    />
                    <UtensilsCrossed size={15} />
                    <span>Meals included</span>
                  </label>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={ac}
                      onChange={(e) => setAc(e.target.checked)}
                    />
                    <Wind size={15} />
                    <span>Air conditioning</span>
                  </label>
                  <div className="verified-note">
                    <ShieldCheck size={17} />
                    <span>
                      Explore with confidence
                      <small>Always visit before you decide.</small>
                    </span>
                  </div>
                </div>
                <div className="filter-help">
                  <span className="help-spark">✧</span>
                  <h4>New city, lots of questions?</h4>
                  <p>We’ve got a little moving-in wisdom for you.</p>
                  <button onClick={() => setDialog("help")}>
                    The student’s guide <ArrowUpRight size={15} />
                  </button>
                </div>
                <button
                  className="primary mobile-apply"
                  onClick={() => setMobileFilters(false)}
                >
                  Show {filtered.length} places
                </button>
              </aside>
              <div className="results">
                <div className="results-toolbar">
                  <span>
                    <strong>{filtered.length} places</strong> to call your own{" "}
                    <span className="results-city">in Bengaluru</span>
                  </span>
                  <div className="toolbar-actions">
                    <button
                      className="mobile-filter secondary"
                      onClick={() => setMobileFilters(true)}
                    >
                      <SlidersHorizontal size={15} /> Filters
                    </button>
                    <label className="sort">
                      Sort by:{" "}
                      <select
                        aria-label="Sort listings"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value="recommended">Recommended</option>
                        <option value="price">Price: low to high</option>
                        <option value="distance">Nearest to college</option>
                        <option value="rating">Top rated</option>
                      </select>
                    </label>
                    <div className="layout-switch">
                      <button
                        className={layout === "grid" ? "selected" : ""}
                        aria-label="Grid view"
                        onClick={() => setLayout("grid")}
                      >
                        <LayoutGrid size={17} />
                      </button>
                      <button
                        className={layout === "list" ? "selected" : ""}
                        aria-label="List view"
                        onClick={() => setLayout("list")}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                {search && (
                  <div className="search-result-tag">
                    Showing results for “{search}”{" "}
                    <button
                      aria-label="Clear search"
                      onClick={() => {
                        setSearch("");
                        setQuery("");
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <div
                  className={`listing-grid ${layout === "list" ? "list-view" : ""}`}
                >
                  {filtered.map((p) => (
                    <article className="listing-card" key={p.id}>
                      <div className="listing-photo">
                        <button
                          className="photo-open"
                          onClick={() => {
                            setDetail(p);
                            setEnquiring(false);
                          }}
                          aria-label={`View ${p.name}`}
                        >
                          <img
                            src={p.image}
                            alt={`Illustrative property photo for ${p.name}`}
                          />
                        </button>
                        <span className="photo-label">
                          {p.featured ? (
                            <>
                              <Sparkles size={12} /> AMIGO PICK
                            </>
                          ) : (
                            <>
                              <Home size={12} /> STUDENT LIVING
                            </>
                          )}
                        </span>
                        <button
                          className={`save-button ${saved.includes(p.id) ? "saved" : ""}`}
                          onClick={() => save(p.id)}
                          aria-label={`${saved.includes(p.id) ? "Unsave" : "Save"} ${p.name}`}
                        >
                          <Heart
                            size={18}
                            fill={
                              saved.includes(p.id) ? "currentColor" : "none"
                            }
                          />
                        </button>
                        <span className="photo-count">1 / 1</span>
                        <span className="photo-demo">Illustrative photo</span>
                      </div>
                      <div className="listing-body">
                        <div className="listing-top">
                          <span
                            className={`gender-tag ${p.gender === "Girls" ? "girl" : p.gender === "Boys" ? "boy" : "coliving"}`}
                          >
                            <span />
                            {p.gender === "Co-living"
                              ? "Co-living"
                              : `${p.gender} PG`}
                          </span>
                          <span className="rating">
                            <Star size={12} fill="currentColor" /> {p.rating}
                            <small>({p.reviews})</small>
                          </span>
                        </div>
                        <button
                          className="listing-name"
                          onClick={() => {
                            setDetail(p);
                            setEnquiring(false);
                          }}
                        >
                          {p.name}
                        </button>
                        <p className="location">
                          <MapPin size={13} />
                          {p.area}, Bengaluru
                        </p>
                        <p className="college-distance">
                          <GraduationCap size={14} />
                          <strong>{p.distance} km</strong> from {p.college}
                        </p>
                        <div className="amenities">
                          {p.amenities.map((a, i) => (
                            <span key={a}>
                              {i === 0 ? (
                                <Wifi size={13} />
                              ) : a === "Meals" ? (
                                <UtensilsCrossed size={13} />
                              ) : a === "AC" ? (
                                <Wind size={13} />
                              ) : (
                                <Check size={13} />
                              )}{" "}
                              {a}
                            </span>
                          ))}
                        </div>
                        <div className="listing-bottom">
                          <div>
                            <strong>₹{money(p.price)}</strong>
                            <span> / month</span>
                            <small>
                              {p.sharing} sharing ·{" "}
                              {p.food
                                ? "Meals included"
                                : "No hidden brokerage"}
                            </small>
                          </div>
                          <button
                            className="round-arrow"
                            aria-label={`See details for ${p.name}`}
                            onClick={() => {
                              setDetail(p);
                              setEnquiring(false);
                            }}
                          >
                            <ArrowUpRight size={20} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {!filtered.length && (
                  <div className="empty">
                    <Home size={38} />
                    <h3>
                      {view === "saved" && !saved.length
                        ? "Home is where the heart is."
                        : "No places found just yet."}
                    </h3>
                    <p>
                      {view === "saved" && !saved.length
                        ? "Tap the heart on a place you love to save it here."
                        : "Try a higher budget or fewer filters to find your space."}
                    </p>
                    <button
                      className="primary"
                      onClick={() => {
                        navigate("discover");
                      }}
                    >
                      Explore all PGs <ArrowRight size={16} />
                    </button>
                  </div>
                )}
                <div className="roommate-cta">
                  <div className="cta-doodle">
                    <Users size={35} />
                    <Heart size={16} />
                  </div>
                  <div>
                    <span>GOOD SPACE. GREAT COMPANY.</span>
                    <h3>A home is better with your kind of people.</h3>
                    <p>
                      Find a roommate who matches your lifestyle, not just your
                      budget.
                    </p>
                  </div>
                  <button onClick={() => navigate("roommates")}>
                    Find my Amigo <ArrowUpRight size={17} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
        <section className="bottom-values">
          <div>
            <ShieldCheck />
            <span>
              <strong>A little more peace of mind</strong>
              <small>Clear details. No surprises at move-in.</small>
            </span>
          </div>
          <div>
            <Users />
            <span>
              <strong>People, not just profiles</strong>
              <small>Compatibility that goes both ways.</small>
            </span>
          </div>
          <div>
            <Leaf />
            <span>
              <strong>Student life, made simpler</strong>
              <small>Free to explore. Always on your side.</small>
            </span>
          </div>
        </section>
      </main>
      <footer>
        <button className="brand" onClick={() => navigate("discover")}>
          <span>
            pg<span className="brand-green">amigo</span>
            <i>✦</i>
          </span>
        </button>
        <p>A place to stay. People to belong.</p>
        <span>
          Made for your next chapter <Heart size={12} />
        </span>
        <button onClick={() => setDialog("help")}>
          Safety & moving guide <ArrowUpRight size={13} />
        </button>
        <button onClick={() => setDialog("plans")}>
          For PG owners <ArrowUpRight size={13} />
        </button>
      </footer>
      {toast && (
        <div className="toast" role="status">
          <CheckCheck size={18} />
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {detail && (
        <Modal
          title={enquiring ? "Plan a visit" : detail.name}
          onClose={() => setDetail(null)}
        >
          <div className="detail-content">
            {!enquiring ? (
              <>
                <img
                  className="detail-image"
                  src={detail.image}
                  alt={`Illustrative photo for ${detail.name}`}
                />
                <div className="detail-price">
                  <strong>
                    ₹{money(detail.price)} <small>/ month</small>
                  </strong>
                  <span className="gender-tag">
                    {detail.gender} · {detail.sharing} sharing
                  </span>
                </div>
                <p className="location">
                  <MapPin size={15} />
                  {detail.area}, Bengaluru · {detail.distance} km from{" "}
                  {detail.college}
                </p>
                <div className="detail-stats">
                  <span>
                    <BedDouble /> {detail.beds} beds available
                  </span>
                  <span>
                    <UtensilsCrossed />{" "}
                    {detail.food ? "Meals included" : "Self-catering"}
                  </span>
                  <span>
                    <ShieldCheck /> Sample property
                  </span>
                </div>
                <h3>Your everyday, sorted.</h3>
                <p>
                  A welcoming space for your student chapter.{" "}
                  {detail.amenities.join(", ")} available. The sample rent is
                  per person; confirm the deposit, bills, house rules, and
                  availability directly with the owner before moving in.
                </p>
                <div className="detail-rules">
                  <span>
                    Deposit <strong>1 month’s rent</strong>
                  </span>
                  <span>
                    Notice period <strong>30 days</strong>
                  </span>
                  <span>
                    Brokerage <strong>₹0</strong>
                  </span>
                </div>
                <p className="demo-note">
                  Demo listing and illustrative photo. Ratings, availability,
                  and details are sample data, not verified claims.
                </p>
                <div className="modal-actions">
                  <button className="secondary" onClick={() => save(detail.id)}>
                    <Heart size={16} />
                    {saved.includes(detail.id) ? "Saved" : "Save place"}
                  </button>
                  <button
                    className="primary"
                    onClick={() => setEnquiring(true)}
                  >
                    <MessageCircle size={16} />
                    {enquiries.includes(detail.id)
                      ? "View / update enquiry"
                      : "Enquire about this PG"}
                  </button>
                </div>
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEnquiries([...new Set([...enquiries, detail.id])]);
                  setToast(
                    "Demo enquiry saved on this device. No message was sent to an owner.",
                  );
                  setDetail(null);
                }}
              >
                <p>
                  Interested in <strong>{detail.name}</strong>? Try the enquiry
                  flow below.
                </p>
                <label className="field">
                  Your name
                  <input
                    required
                    name="name"
                    placeholder="Your full name"
                    defaultValue={profileDone ? profile.name : ""}
                  />
                </label>
                <label className="field">
                  Preferred visit date
                  <input
                    required
                    aria-label="Preferred visit date"
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </label>
                <label className="field">
                  Message
                  <textarea
                    required
                    defaultValue={`Hi! I’m interested in a ${detail.sharing.toLowerCase()} sharing room. Could you share more details about availability and the deposit?`}
                  />
                </label>
                <p className="demo-note">
                  Demo only: your enquiry status is saved locally. This form
                  does not contact an owner.
                </p>
                <button className="primary full" type="submit">
                  <Send size={16} /> Save demo enquiry
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}
      {dialog === "profile" && (
        <ProfileForm
          profile={profile}
          onClose={() => setDialog(null)}
          onSave={(p) => {
            setProfile(p);
            setProfileDone(true);
            setDialog(null);
            setToast("Your preferences are saved. Let’s find your people.");
          }}
        />
      )}
      {dialog === "help" && (
        <Modal
          title="A little moving-in wisdom."
          onClose={() => setDialog(null)}
        >
          <div className="guide-intro">
            <ShieldCheck size={32} />
            <p>
              Your next chapter should start with peace of mind. Here’s your
              before-you-move checklist.
            </p>
          </div>
          {[
            [
              "Visit before you commit",
              "Check the room, bathrooms, water, Wi-Fi, and locks in person. Meet in daylight and bring a friend.",
            ],
            [
              "Get the full picture",
              "Ask for rent, deposit, utility charges, meals, curfew, guest rules, and notice period in writing.",
            ],
            [
              "Keep your details private",
              "Never share OTPs, bank passwords, identity documents, or pay a deposit just to arrange a visit.",
            ],
            [
              "Get to know your roommate",
              "Discuss sleep, guests, cleaning, food, and shared bills. A compatibility score is a conversation starter.",
            ],
          ].map(([a, b], i) => (
            <div className="guide-item" key={a}>
              <span>0{i + 1}</span>
              <div>
                <h3>{a}</h3>
                <p>{b}</p>
              </div>
            </div>
          ))}
        </Modal>
      )}
      {dialog === "plans" && (
        <Modal
          title="Your next resident is out there."
          onClose={() => setDialog(null)}
          wide
        >
          <p className="modal-intro">
            Start with a free listing. Grow when you’re ready.
            <br />
            Students explore for free. Owners pay for extra visibility.
          </p>
          <div className="plans">
            {[
              {
                name: "Free",
                price: "0",
                text: "A good place to begin",
                features: [
                  "1 property listing",
                  "Basic discovery",
                  "Enquiry management",
                ],
              },
              {
                name: "Pro",
                price: "499",
                text: "A little more room to grow",
                features: [
                  "Up to 5 property listings",
                  "Priority visibility",
                  "Listing performance insights",
                ],
              },
              {
                name: "Premium",
                price: "1,499",
                text: "For your next big chapter",
                features: [
                  "Up to 15 property listings",
                  "Featured placement",
                  "Priority owner support",
                ],
              },
            ].map((p) => (
              <div
                className={`plan ${p.name === "Pro" ? "pro" : ""}`}
                key={p.name}
              >
                {p.name === "Pro" && (
                  <span className="plan-recommended">FOR GROWING OWNERS</span>
                )}
                <h3>{p.name}</h3>
                <p>{p.text}</p>
                <strong>
                  ₹{p.price}
                  <small>/month</small>
                </strong>
                {p.features.map((f) => (
                  <span className="plan-feature" key={f}>
                    <Check size={15} />
                    {f}
                  </span>
                ))}
                <button
                  className={p.name === "Pro" ? "primary" : "secondary"}
                  onClick={() => {
                    setSelectedPlan(p.name);
                    setDialog("owner");
                  }}
                >
                  {p.name === "Free" ? "Start free" : `Explore ${p.name}`}
                  <ArrowUpRight size={16} />
                </button>
              </div>
            ))}
          </div>
          <p className="demo-note">
            Illustrative pricing for validation. No payment is collected.
            Verification is independent of paid placement.
          </p>
          {drafts.length > 0 && (
            <div className="saved-drafts">
              <h3>Your local drafts ({drafts.length})</h3>
              {drafts.map((d, i) => (
                <p key={i}>
                  {d.name} · {d.area} · ₹{money(d.price)}/month{" "}
                  <span>Draft</span>
                </p>
              ))}
            </div>
          )}
        </Modal>
      )}
      {dialog === "owner" && (
        <Modal
          title="Let’s make room for someone."
          onClose={() => setDialog(null)}
        >
          <p className="modal-intro">
            Create a local property draft · {selectedPlan} plan
            <br />
            Nothing is published or charged in this demo.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              setDrafts([
                ...drafts,
                {
                  name: String(data.get("name")).trim(),
                  area: String(data.get("area")),
                  price: Number(data.get("price")),
                  plan: selectedPlan,
                },
              ]);
              setToast(
                "Property draft saved on this device. It has not been published.",
              );
              setDialog("plans");
            }}
          >
            <label className="field">
              Property name
              <input
                name="name"
                required
                minLength={3}
                maxLength={100}
                placeholder="e.g. Olive Living PG"
              />
            </label>
            <div className="form-grid">
              <label className="field">
                Neighbourhood
                <select name="area">
                  <option>Koramangala</option>
                  <option>BTM Layout</option>
                  <option>HSR Layout</option>
                </select>
              </label>
              <label className="field">
                Rent per person / month (₹)
                <input
                  name="price"
                  type="number"
                  required
                  min="1000"
                  max="100000"
                  placeholder="8500"
                />
              </label>
            </div>
            <label className="field">
              About your property
              <textarea
                name="description"
                required
                minLength={20}
                placeholder="Tell students about the rooms, meals, amenities, and house rules."
              />
            </label>
            <label className="consent">
              <input required type="checkbox" /> I understand this is a local
              draft, not a published listing.
            </label>
            <button className="primary full" type="submit">
              Save property draft <ArrowRight size={17} />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className={`modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={(node) => {
          if (node && !node.contains(document.activeElement))
            node.querySelector<HTMLButtonElement>("button")?.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            const els = e.currentTarget.querySelectorAll<HTMLElement>(
              'button,input,select,textarea,[tabindex="0"]',
            );
            const first = els[0],
              last = els[els.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="modal-heading">
          <div>
            <span className="breadcrumb">A LITTLE HELP FROM AMIGO</span>
            <h2>{title}</h2>
          </div>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
const traitLabels: Record<keyof Traits, string> = {
  sleep: "Sleep schedule",
  food: "Food habits",
  smoking: "Smoking",
  cleanliness: "Cleanliness",
  social: "Social energy",
};
const traitOptions: Record<keyof Traits, string[]> = {
  sleep: ["Early bird", "Night owl", "Flexible"],
  food: ["Vegetarian", "Non-vegetarian", "Eggetarian", "Jain"],
  smoking: ["No", "Occasionally", "Yes"],
  cleanliness: ["1", "2", "3", "4", "5"],
  social: ["Introvert", "Ambivert", "Extrovert"],
};
function ProfileForm({
  profile,
  onClose,
  onSave,
}: {
  profile: Roommate;
  onClose: () => void;
  onSave: (p: Roommate) => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  return (
    <Modal
      title={
        [
          "First, a little about you.",
          "Your space. Your everyday.",
          "What makes a good roommate?",
        ][step]
      }
      onClose={onClose}
    >
      <div className="form-progress">
        {["The basics", "My lifestyle", "My preferences"].map((s, i) => (
          <span key={s} className={i <= step ? "active" : ""}>
            <b>{i < step ? <Check size={12} /> : i + 1}</b>
            {s}
          </span>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.budget[0] > draft.budget[1]) {
            setError(
              "Your minimum budget must be less than or equal to your maximum.",
            );
            return;
          }
          setError("");
          if (step < 2) {
            setStep(step + 1);
            return;
          }
          onSave(draft);
        }}
      >
        {step === 0 ? (
          <>
            <label className="field">
              What should we call you?
              <input
                required
                minLength={2}
                maxLength={50}
                value={draft.name === "You" ? "" : draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Your first name"
              />
            </label>
            <div className="form-grid">
              <label className="field">
                Gender
                <select
                  value={draft.gender}
                  onChange={(e) =>
                    setDraft({ ...draft, gender: e.target.value })
                  }
                >
                  <option>Woman</option>
                  <option>Man</option>
                  <option>Non-binary</option>
                </select>
              </label>
              <label className="field">
                Your college
                <select
                  value={draft.college}
                  onChange={(e) =>
                    setDraft({ ...draft, college: e.target.value })
                  }
                >
                  <option>Christ University</option>
                  <option>Jyoti Nivas College</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            <div className="form-grid">
              <label className="field">
                Minimum budget (₹)
                <input
                  type="number"
                  required
                  min="1000"
                  max="100000"
                  value={draft.budget[0]}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      budget: [+e.target.value, draft.budget[1]],
                    })
                  }
                />
              </label>
              <label className="field">
                Maximum budget (₹)
                <input
                  type="number"
                  required
                  min="1000"
                  max="100000"
                  value={draft.budget[1]}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      budget: [draft.budget[0], +e.target.value],
                    })
                  }
                />
              </label>
            </div>
            <p className="privacy-note">
              <ShieldCheck size={17} /> Same-gender matching by default. No
              contact details collected in this demo.
            </p>
            <label className="consent">
              <input
                type="checkbox"
                checked={draft.anyGender}
                onChange={(e) =>
                  setDraft({ ...draft, anyGender: e.target.checked })
                }
              />{" "}
              I’m open to any gender (only when both people opt in).
            </label>
          </>
        ) : step === 1 ? (
          <>
            <p className="modal-intro">
              No right answers. Just the little things that make you, you.
            </p>
            {(Object.keys(traitLabels) as (keyof Traits)[]).map((key) => (
              <label className="field trait-row" key={key}>
                {traitLabels[key]}
                <select
                  value={draft.traits[key]}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      traits: {
                        ...draft.traits,
                        [key]:
                          key === "cleanliness"
                            ? +e.target.value
                            : e.target.value,
                      },
                    })
                  }
                >
                  {traitOptions[key].map((v) => (
                    <option key={v} value={v}>
                      {key === "cleanliness"
                        ? `${v} — ${["Relaxed", "Easygoing", "Balanced", "Tidy", "Very tidy"][+v - 1]}`
                        : v}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </>
        ) : (
          <>
            <p className="modal-intro">
              Tell us what you’re hoping for. Dealbreakers exclude incompatible
              profiles in either direction.
            </p>
            {(Object.keys(traitLabels) as (keyof Traits)[]).map((key) => (
              <div className="preference-row" key={key}>
                <label className="field">
                  {traitLabels[key]}
                  <select
                    value={draft.preferences.traits[key]}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        preferences: {
                          ...draft.preferences,
                          traits: {
                            ...draft.preferences.traits,
                            [key]:
                              key === "cleanliness"
                                ? +e.target.value
                                : e.target.value,
                          },
                        },
                      })
                    }
                  >
                    {traitOptions[key].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Importance
                  <select
                    value={draft.preferences.weights[key]}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        preferences: {
                          ...draft.preferences,
                          weights: {
                            ...draft.preferences.weights,
                            [key]: +e.target.value,
                          },
                        },
                      })
                    }
                  >
                    <option value="0">Not important</option>
                    <option value="1">A little</option>
                    <option value="2">Important</option>
                    <option value="3">Very important</option>
                  </select>
                </label>
                <label className="dealbreaker">
                  <input
                    type="checkbox"
                    checked={draft.preferences.dealbreakers.includes(key)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        preferences: {
                          ...draft.preferences,
                          dealbreakers: e.target.checked
                            ? [...draft.preferences.dealbreakers, key]
                            : draft.preferences.dealbreakers.filter(
                                (x) => x !== key,
                              ),
                        },
                      })
                    }
                  />
                  Dealbreaker
                </label>
              </div>
            ))}
            <p className="demo-note">
              These preferences stay in this browser. This demo does not create
              a public profile.
            </p>
          </>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="modal-actions">
          {step > 0 && (
            <button
              type="button"
              className="secondary"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft size={15} />
              Back
            </button>
          )}
          <button className="primary" type="submit">
            {step === 2 ? "Find my people" : "Keep going"}{" "}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
