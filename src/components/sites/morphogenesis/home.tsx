"use client";

/* The source photography is sized by its containing sections. */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, ChevronDown, Menu } from "lucide-react";
import content from "./content.json";
import localPaths from "./local-paths.json";
import "./morphogenesis.css";

const site = "https://www.morphogenesis.org";
const assets = "/sites/morphogenesis";
const routes = new Set(localPaths);

function localHref(url: string) {
  const target = new URL(url, site);
  const pathname = target.pathname.replace(/\/$/, "") + "/";
  if (target.origin === site && routes.has(pathname)) {
    return pathname + target.search + target.hash;
  }
  return url;
}
const categories = ["Sustainability", "Optimization", "Unique", "Livability"];
const statistics = [[15, "WA100 Wins"], [1350, "Projects"], [250, "Awards"], [1300, "Publications"]] as const;
const cities = ["New Delhi", "Mumbai", "Bengaluru", "Pune"];

function SocialLinks() {
  return <div className="morph-socials">{content.socials.map(([name, url, image]) => (
    <a key={name} href={localHref(url)} aria-label={name}><img src={image} alt="" /></a>
  ))}</div>;
}

function Header({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [active, setActive] = useState("");
  const [image, setImage] = useState(content.menuImage);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    toggle.current?.focus();
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    window.addEventListener("keydown", dismiss);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", dismiss);
    };
  }, [open, setOpen]);

  function toggleMenu() {
    if (!open) {
      setActive("");
      setImage(content.menuImage);
    } else {
      toggle.current?.focus();
    }
    setOpen(!open);
  }

  return <header className={`morph-header ${open ? "morph-header-open" : ""}`}>
    <div className="morph-header-bar">
      <Link href="/" aria-label="Morphogenesis home"><picture>
        {open && <source media="(min-width: 1200px)" srcSet={content.menuLogo} />}
        <img src={content.logo} alt="Morphogenesis" />
      </picture></Link>
      <nav aria-label="Main navigation" className="morph-quick-nav">
        {!open && <><a href={localHref(`${site}/featured-projects/`)}>Projects</a><a href={localHref(`${site}/contact-us/`)}>Contact Us</a></>}
        <button ref={toggle} type="button" className="morph-menu-toggle" onClick={toggleMenu} aria-expanded={open} aria-controls="morph-menu" aria-label={open ? "Close menu" : "Open menu"}>
          <span>{open ? "Close" : "Menu"}</span><Menu size={22} aria-hidden />
        </button>
      </nav>
    </div>
    {open && <div id="morph-menu" className="morph-menu">
      <img className="morph-menu-preview" src={image} alt="" />
      <div className="morph-menu-content">
        <nav aria-label="All sections">
          <p>Menu</p>
          {content.menu.map((item) => <div key={item.title} className="morph-menu-row" onMouseEnter={() => setImage(item.image)}>
            {item.links.length ? <>
              <button type="button" aria-expanded={active === item.title} onClick={() => {
                setActive(active === item.title ? "" : item.title);
                setImage(item.image);
              }}>{item.title}<span aria-hidden>{active === item.title ? "−" : "+"}</span></button>
              {active === item.title && <div className="morph-submenu">{item.links.map(([name, url]) => <a key={url} href={localHref(url)}>{name}</a>)}</div>}
            </> : <a href={localHref(item.href)}>{item.title}</a>}
          </div>)}
        </nav>
        <div className="morph-menu-bottom"><SocialLinks /><div className="morph-cities">{cities.map(city => <a key={city} href={localHref(`${site}/contact-us/`)}>{city}</a>)}</div></div>
      </div>
    </div>}
  </header>;
}

function Statistics() {
  const [progress, setProgress] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      function animate(time: number) {
        const elapsed = Math.min((time - start) / 2500, 1);
        setProgress(1 - (1 - elapsed) ** 2);
        if (elapsed < 1) frame = requestAnimationFrame(animate);
      }
      frame = requestAnimationFrame(animate);
    }, { threshold: 0.8 });

    if (row.current) observer.observe(row.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="morph-stats" ref={row}>{statistics.map(([value, label]) => <div key={label}>
    <strong className="morph-stat-motion" aria-hidden>{Math.floor(value * progress)}+</strong>
    <strong className="morph-stat-value">{value}+</strong><p>{label}</p>
  </div>)}</div>;
}

function Expertise() {
  const [active, setActive] = useState(0);
  return <section className="morph-wrap morph-expertise">
    <h2>Expertise</h2>
    <div className="morph-expertise-layout">
      <div>{content.expertise.map(([name, url], index) => <div key={name} className="morph-expertise-row" onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}>
        <button type="button" onClick={() => setActive(index)} aria-pressed={active === index}>{name}</button>
        <a className="morph-pill" href={localHref(url)}>View Projects</a>
      </div>)}</div>
      <img className="morph-expertise-image" src={content.expertise[active][2]} alt={content.expertise[active][0]} />
    </div>
  </section>;
}

function LogoTrack({ entries, reverse = false }: { entries: string[][]; reverse?: boolean }) {
  return <div className="morph-logo-window">
    <div className={`morph-logo-track ${reverse ? "morph-logo-reverse" : ""}`}>
      {[0, 1].map(copy => <div className="morph-logo-group" key={copy} aria-hidden={copy === 1}>{entries.map(([image, caption]) => <div key={image} className="morph-logo-item">
        <img src={image} alt={caption ? "" : image.split("/").pop()?.replace(/\.png$/i, "").replaceAll("-", " ")} loading="lazy" />{caption && <small>{caption}</small>}
      </div>)}</div>)}
    </div>
  </div>;
}

function GlobalImpact() {
  const [current, setCurrent] = useState(0);
  const count = content.quotes.length;
  const [image, quote, name] = content.quotes[current];
  return <section className="morph-impact">
    <h2>Global Impact</h2>
    <LogoTrack entries={content.press} />
    <div className="morph-wrap morph-testimonial">
      <div className="morph-quote">
        <img className="morph-quote-mark" src={`${assets}/quote.svg`} alt="" />
        <blockquote>{quote}<cite>{name}</cite></blockquote>
        <div className="morph-quote-buttons">
          <button type="button" aria-label="Previous testimonial" onClick={() => setCurrent((current + count - 1) % count)}><ArrowLeft size={16} /></button>
          <button type="button" aria-label="Next testimonial" onClick={() => setCurrent((current + 1) % count)}><ArrowRight size={16} /></button>
        </div>
      </div>
      <img src={image} alt="" loading="lazy" />
    </div>
  </section>;
}

function News() {
  const track = useRef<HTMLDivElement>(null);

  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const cards = Array.from(element.children) as HTMLElement[];
    const first = cards[0].offsetLeft;
    const current = cards.findIndex(card => Math.abs(card.offsetLeft - first - element.scrollLeft) < 5);
    const next = (Math.max(current, 0) + direction + cards.length) % cards.length;
    element.scrollTo({ left: cards[next].offsetLeft - first, behavior: "smooth" });
  }

  return <section className="morph-wrap morph-news">
    <h2>News</h2>
    <div className="morph-news-carousel">
      <div className="morph-news-grid" id="morph-news" ref={track}>{content.news.map(({ image, type, title, year, url }) => <a key={title} href={localHref(url || `${site}/news/`)}>
        <div><img src={image} alt="" loading="lazy" /><span>{type}</span><i aria-hidden><ArrowRight size={16} /></i></div>
        <p>{title}</p><small>{year}</small>
      </a>)}</div>
      <button type="button" aria-label="Previous news item" aria-controls="morph-news" onClick={() => move(-1)}><ArrowLeft size={15} /></button>
      <button type="button" aria-label="Next news item" aria-controls="morph-news" onClick={() => move(1)}><ArrowRight size={15} /></button>
    </div>
  </section>;
}

function Footer() {
  const [feedback, setFeedback] = useState(false);
  return <footer className="morph-footer">
    <div className="morph-wrap morph-footer-columns">
      <div><Link href="/"><img className="morph-footer-logo" src={content.logo} alt="Morphogenesis" /></Link>
        <p>{content.footerIntro}</p>
        <div className="morph-badges">{content.footerBadges.map(image => <img key={image} src={image} alt={image.split("/").pop()?.split(".")[0]} />)}</div>
      </div>
      <div><h2>Quick <em>Links</em></h2>
        <div className="morph-footer-links">{content.footerLinks.filter(([label]) => label !== "Privacy Policy").map(([label, url]) => <a href={localHref(url)} key={url}>{label}</a>)}</div>
      </div>
      <div><h2>Stay <em>Updated</em></h2>
        <form className="morph-newsletter" onSubmit={event => {
          event.preventDefault();
          setFeedback(true);
        }}>
          <input type="email" required placeholder="Your mail" aria-label="Email address" autoComplete="email" onChange={() => setFeedback(false)} />
          <button type="submit" aria-label="Send"><ArrowRight size={18} /></button>
        </form>
        {feedback && <p role="status">Subscribe on the <a href={site}>Morphogenesis website</a>.</p>}
        <h2 className="morph-follow">Follow <em>Us</em></h2><SocialLinks />
      </div>
    </div>
    <div className="morph-wrap morph-legal"><Link href="/privacy-policy/">Privacy Policy</Link><p>© 2026 Morphogenesis. All Rights Reserved.</p></div>
  </footer>;
}

export function MorphogenesisFrame({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 550);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div className="morph-page">
    <Header open={menuOpen} setOpen={setMenuOpen} />
    <div inert={menuOpen}>
      <main id="morph-top">{children}</main>
      <Footer />
      {showTop && <a className="morph-back-top" href="#morph-top" aria-label="Back to top"><ArrowUp size={17} /></a>}
    </div>
  </div>;
}

export default function MorphogenesisHome() {
  const [showSoul, setShowSoul] = useState(false);
  return <MorphogenesisFrame>
    <section className="morph-hero" aria-label="Introduction">
      <video autoPlay muted playsInline loop poster={`${assets}/hero-poster.webp`} aria-hidden="true">
        <source src={`${assets}/hero.mp4`} type="video/mp4" />
      </video>
      <h1><span className="morph-hero-solve">We Design to<br /><strong>SOLVE</strong></span><span className="morph-hero-impact">We Design for<br /><strong>IMPACT</strong></span></h1>
      <a className="morph-scroll-down" href="#morph-practice"><span aria-hidden /><small>Scroll Down</small></a>
    </section>
    <section className="morph-wrap morph-practice" id="morph-practice">
      <Statistics />
      <h2>An Integrated Practice.<br />Powered by S.O.U.L.<sup>©</sup></h2>
      <p className="morph-intro">Every project is informed by 30 years of experience and evolves through S.O.U.L.<sup>©</sup>, the driving force behind our proprietary consulting engine that unites design intelligence with measurable performance.</p>
      <div id="morph-soul" className="morph-soul">{content.soul.map(([title, detail, image]) => <div key={title}>
        <img src={image} alt="" /><h3>{title}</h3>{showSoul && <p>{detail}</p>}
      </div>)}</div>
      <button className="morph-soul-toggle" type="button" aria-label={showSoul ? "Hide S.O.U.L. details" : "Show S.O.U.L. details"} aria-expanded={showSoul} aria-controls="morph-soul" onClick={() => setShowSoul(!showSoul)}><ChevronDown size={22} /></button>
      {showSoul && <p className="morph-soul-copyright">Copyright© 2019 Morphogenesis</p>}
    </section>
    <Expertise />
    <section className="morph-clients">
      <h2>Clients</h2>
      {[content.clients.slice(0, 15), content.clients.slice(15, 30), content.clients.slice(30)].map((logos, index) => <LogoTrack key={logos[0]} entries={logos.map(logo => [logo])} reverse={index === 1} />)}
    </section>
    <section className="morph-projects">
      <div className="morph-wrap">
        <h2>Projects In Focus</h2>
        {categories.map((category, index) => <div key={category} className="morph-project-category">
          <h3>{category}</h3>
          <div className="morph-project-grid">{content.projects.slice(index * 2, index * 2 + 2).map(([image, title, url, city, summary]) => <a key={url} className="morph-project" href={localHref(url)} target="_blank" rel="noreferrer">
            <img src={image} alt={title} loading="lazy" />
            <div><p>{title}</p><small>{city}</small><h4>{summary}</h4><span aria-hidden><ArrowRight size={17} /></span></div>
          </a>)}</div>
        </div>)}
      </div>
    </section>
    <GlobalImpact />
    <section className="morph-cta">
      <img src={content.cta} alt="" loading="lazy" />
      <div><h2>Design the<br /> Future With Us</h2><a href={localHref(`${site}/careers/`)}>Careers</a><a href={localHref(`${site}/contact-us/`)}>Contact Us</a></div>
    </section>
    <News />
  </MorphogenesisFrame>;
}
