"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Lenis from "lenis";
import { ArrowDown, ArrowRight, GlobeTile } from "@/components/icons";

const EASE = cubicBezier(0.5, 0.08, 0.18, 1);

/* Fade/slide an element in as the scene progresses. */
function Reveal({
  p,
  from,
  to,
  className,
  children,
}: {
  p: MotionValue<number>;
  from: number;
  to: number;
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(p, [from, to], [0, 1], { ease: EASE });
  const y = useTransform(p, [from, to], ["4.5svh", "0svh"], { ease: EASE });
  const pointerEvents = useTransform(opacity, (v): "auto" | "none" =>
    v > 0.5 ? "auto" : "none"
  );
  return (
    <motion.div
      style={{ opacity, y, pointerEvents }}
      className={`opacity-0 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

function ProjectRow({
  href,
  label,
  icon,
  children,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <a href={href} className="group flex items-center gap-5 py-6 sm:gap-6 sm:py-7">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[16px] ring-1 ring-white/10 sm:h-16 sm:w-16">
        {icon}
        <span className="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[1.4rem] font-normal leading-tight text-white">
          {label}
        </h3>
        <p className="mt-1.5 text-[13.5px] leading-[1.55] text-neutral-400">
          {children}
        </p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-neutral-500 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-neutral-100" />
    </a>
  );
}

export default function Home() {
  const ref = useRef<HTMLElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* With reduced motion the scene collapses to its final state. */
  const p = useTransform(scrollYProgress, (v) => (prefersReduced ? 1 : v));

  /* planet travel: horizon rises from the hero into the work section */
  const planetY = useTransform(p, [0.06, 0.58], ["0svh", "-30svh"], {
    ease: EASE,
  });
  const planetScale = useTransform(p, [0.06, 0.58], [1, 1.06], { ease: EASE });
  const hotspotOpacity = useTransform(p, [0.06, 0.42], [1, 0.16], { ease: EASE });

  /* hero exit */
  const markOpacity = useTransform(p, [0, 0.18], [1, 0], { ease: EASE });
  const markY = useTransform(p, [0, 0.22], ["0svh", "-13svh"], { ease: EASE });
  const copyOpacity = useTransform(p, [0.04, 0.24], [1, 0], { ease: EASE });
  const copyY = useTransform(p, [0.04, 0.28], ["0svh", "-9svh"], { ease: EASE });
  const headerOpacity = useTransform(p, [0, 0.1], [1, 0], { ease: EASE });

  const headerPointer = useTransform(headerOpacity, (v): "auto" | "none" =>
    v > 0.5 ? "auto" : "none"
  );
  const heroPointer = useTransform(copyOpacity, (v): "auto" | "none" =>
    v > 0.5 ? "auto" : "none"
  );

  useEffect(() => {
    /* debug/preview helper: /?s=0.75 opens the scene mid-transition */
    const s = parseFloat(
      new URLSearchParams(window.location.search).get("s") ?? ""
    );
    if (!Number.isNaN(s)) window.scrollTo(0, window.innerHeight * s);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09 });
    lenisRef.current = lenis;
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToWork = () => {
    const y = window.innerHeight * 1.5; /* scene progress ~0.75 */
    if (lenisRef.current) {
      lenisRef.current.scrollTo(y, {
        duration: 1.9,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      window.scrollTo({
        top: y,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    }
  };

  return (
    <main ref={ref} className="relative h-[300svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-[#050505]">
        {/* planet */}
        <div className="planet-anchor" aria-hidden="true">
          <motion.div
            className="planet-motion"
            style={{ y: planetY, scale: planetScale }}
          >
            <div className="planet-body" />
            <motion.div className="hotspot" style={{ opacity: hotspotOpacity }} />
          </motion.div>
        </div>

        {/* header */}
        <motion.header
          style={{ opacity: headerOpacity, pointerEvents: headerPointer }}
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 mix-blend-screen sm:px-10 sm:py-7"
        >
          <a href="#" aria-label="shape labs home">
            <img
              src="/sl-lockup.png"
              alt="shape labs"
              className="ink h-7 w-auto sm:h-8"
            />
          </a>
          <nav className="flex items-center gap-2 sm:gap-4">
            <a
              href="#"
              className="px-2 text-[15px] font-light text-neutral-300 transition-colors duration-300 hover:text-white"
            >
              about
            </a>
            <a
              href="#"
              className="rounded-[10px] border border-white/10 bg-white/[0.07] px-3.5 py-2 text-sm text-neutral-100 transition-colors duration-300 hover:bg-white/[0.14] sm:px-4"
            >
              get early access
            </a>
          </nav>
        </motion.header>

        {/* floating mark */}
        <motion.div
          style={{ opacity: markOpacity, y: markY }}
          className="absolute inset-x-0 top-[29svh] z-10 flex justify-center mix-blend-screen"
          aria-hidden="true"
        >
          <div className="floaty">
            <img
              src="/sl-mark.png"
              alt=""
              className="ink h-[clamp(84px,14svh,124px)] w-auto"
            />
          </div>
        </motion.div>

        {/* hero copy */}
        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className="absolute inset-x-0 top-[51svh] z-10 px-6 text-center"
        >
          <h1 className="text-[clamp(2.3rem,5vw,3.85rem)] font-light leading-[1.16] tracking-[-0.015em] text-white">
            we build tiny apps
            <br />
            that solve real workflows.
          </h1>
          <p className="mt-7 text-[clamp(1.02rem,1.5vw,1.22rem)] font-light leading-[1.6] text-neutral-400">
            shape labs is building the future of software,
            <br />
            one shape at a time.
          </p>
        </motion.div>

        {/* scroll cue */}
        <motion.button
          type="button"
          onClick={scrollToWork}
          style={{ opacity: copyOpacity, pointerEvents: heroPointer }}
          className="absolute inset-x-0 bottom-[4.5svh] z-10 mx-auto flex w-fit justify-center p-3 text-neutral-500 transition-colors duration-300 hover:text-neutral-100"
          aria-label="scroll to see what we are working on"
        >
          <ArrowDown className="floaty-slow h-6 w-6" />
        </motion.button>

        {/* work */}
        <section aria-label="currently working on" className="absolute inset-0 z-10">
          <div className="absolute inset-x-0 top-[23svh] flex flex-col items-center px-6">
            <Reveal p={p} from={0.4} to={0.56}>
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                currently working on:
              </p>
            </Reveal>
            <div className="mt-9 w-full max-w-[520px] divide-y divide-white/[0.06]">
              <Reveal p={p} from={0.48} to={0.64}>
                <ProjectRow
                  href="#"
                  label="form"
                  icon={
                    <img
                      src="/form-icon.png"
                      alt="form app icon"
                      className="h-full w-full object-cover"
                    />
                  }
                >
                  build tiny desktop apps with AI.
                  <br className="hidden sm:block" />
                  private, native, and powerful.
                </ProjectRow>
              </Reveal>
              <Reveal p={p} from={0.56} to={0.72}>
                <ProjectRow
                  href="https://useform.sh"
                  label="useform.sh"
                  icon={<GlobeTile />}
                >
                  launch and share your apps.
                  <br className="hidden sm:block" />
                  one link, instant download.
                </ProjectRow>
              </Reveal>
            </div>
          </div>
          <Reveal
            p={p}
            from={0.66}
            to={0.8}
            className="absolute inset-x-0 bottom-[4.5svh] flex justify-center mix-blend-screen"
          >
            <img
              src="/sl-lockup.png"
              alt="shape labs"
              className="ink h-6 w-auto opacity-50"
            />
          </Reveal>
        </section>

        {/* film grain */}
        <div className="grain" aria-hidden="true" />
      </div>
    </main>
  );
}
