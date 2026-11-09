import { useLayoutEffect, useRef, type CSSProperties } from "react"

// A sticky one-at-a-time sequence, the core values part of src/AboutValues.tsx on its own (used for the HSE
// commitment on Quality & HSE). The screen sticks; each item takes three quarters of a screen of scroll, its title
// and text rising in as the previous one fades, while its photo wipes up over the last one in the right-hand column
// (image up from 100%, its mask down from -100%, the photo easing from 1.15 to 1) and darkens the one beneath.
// It shares AboutValues' .abv-* styles. Below 1024px, or with reduced motion, it becomes a plain stacked layout.

export type StickyItem = { title: string; text: string; image: string; alt: string }

const CARD = 0.75 // screens of scroll per item
const SCRUB = 0.6 // seconds the photo wipes take to catch up with the scroll

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function StickyValues({
  id,
  n,
  label,
  heading,
  items,
}: {
  id: string
  n?: string
  label: string
  heading: string
  items: StickyItem[]
}) {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const sub = root.querySelector<HTMLElement>(".abv-subtitle")!
    const cards = [...root.querySelectorAll<HTMLElement>(".abv-card")]
    const cardsWrap = root.querySelector<HTMLElement>(".abv-cards")!
    const groups = [...root.querySelectorAll<HTMLElement>(".abv-group")]
    const cardTxt = cards.map((c) => [...c.querySelectorAll<HTMLElement>(".abv-txt")])
    const all = [sub, ...cardTxt.flat()]
    const setOn = (els: HTMLElement[], on: boolean) => els.forEach((el) => el.classList.toggle("is-active", on))

    const desktop = matchMedia("(min-width: 1024px)")
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let teardown = () => {}

    // Phones, tablets and reduced motion: everything in flow, each block revealing as it enters.
    const setupStatic = () => {
      root.classList.remove("is-live")
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            e.target.classList.add("is-active")
            io.unobserve(e.target)
          }),
        { rootMargin: "0px 0px -12% 0px" },
      )
      all.forEach((el) => io.observe(el))
      return () => io.disconnect()
    }

    const setupLive = () => {
      root.classList.add("is-live")
      setOn(all, false)
      let vh = innerHeight
      const measure = () => {
        vh = innerHeight
        root.style.height = `${vh * (1 + CARD * items.length)}px`
        cardsWrap.style.height = `${Math.max(...cards.map((c) => c.offsetHeight))}px`
      }

      let smooth = NaN,
        last = 0,
        raf = 0,
        current = -2
      const frame = (now: number) => {
        raf = 0
        const r = root.getBoundingClientRect()
        const u = -r.top / vh // screens scrolled past the section top
        const dt = last ? Math.min(0.1, (now - last) / 1000) : 1
        last = now
        smooth = Number.isNaN(smooth) ? u : lerp(smooth, u, 1 - Math.exp((-dt * 4) / SCRUB))
        if (Math.abs(smooth - u) < 0.0005) smooth = u

        // The first item rises in as the section arrives, then one item per three quarters of a screen.
        const k = u < -0.35 ? -1 : Math.min(items.length - 1, Math.floor(Math.max(0, u) / CARD))
        if (k !== current) {
          current = k
          sub.classList.toggle("is-active", k >= 0)
          cardTxt.forEach((els, i) => setOn(els, i === k))
        }

        // Each later photo wipes up over the one before, centred on its item's start (scrubbed).
        groups.forEach((g, gi) => {
          const i = gi + 1
          const q = clamp01((smooth - (CARD * i - CARD / 2)) / CARD)
          const image = g.children[1] as HTMLElement,
            mask = image.firstElementChild as HTMLElement,
            img = mask.firstElementChild as HTMLElement
          ;(g.firstElementChild as HTMLElement).style.opacity = (0.9 * q).toFixed(3)
          image.style.transform = `translate3d(0, ${(100 * (1 - q)).toFixed(3)}%, 0)`
          mask.style.transform = `translate3d(0, ${(-100 * (1 - q)).toFixed(3)}%, 0)`
          img.style.transform = `scale(${(1.15 - 0.15 * q).toFixed(4)})`
        })

        if (smooth !== u) request()
      }
      const request = () => (raf ||= requestAnimationFrame(frame))
      const onResize = () => {
        measure()
        request()
      }
      measure()
      document.fonts?.ready.then(onResize)
      frame(performance.now())
      addEventListener("scroll", request, { passive: true })
      addEventListener("resize", onResize)
      return () => {
        cancelAnimationFrame(raf)
        removeEventListener("scroll", request)
        removeEventListener("resize", onResize)
        root.style.height = ""
        cardsWrap.style.height = ""
        root.querySelectorAll<HTMLElement>(".abv-group, .abv-group *").forEach((el) => {
          el.style.transform = ""
          el.style.opacity = ""
        })
      }
    }

    const setup = () => {
      teardown()
      teardown = desktop.matches && !reduced.matches ? setupLive() : setupStatic()
    }
    setup()
    desktop.addEventListener("change", setup)
    reduced.addEventListener("change", setup)
    return () => {
      teardown()
      desktop.removeEventListener("change", setup)
      reduced.removeEventListener("change", setup)
    }
  }, [items])

  const headingId = `${id}-title`
  return (
    <section ref={rootRef} id={id} data-header-title={label} aria-labelledby={headingId} className="abv abv--solo qh-section">
      <div className="abv-sticky">
        <div className="abv-vision">
          <div className="abv-vision-left">
            <h2 id={headingId} className="sr-only">
              {heading}
            </h2>
            <p className="abv-subtitle is-dark">
              {n && <span className="abv-subtitle-n">{n}</span>}
              <span>{label}</span>
            </p>
            <ol className="abv-cards">
              {items.map((v) => (
                <li key={v.title} className="abv-card">
                  <h3 className="abv-card-title abv-txt" data-split data-split-toggle style={{ "--base": ".12s" } as CSSProperties}>
                    {v.title}
                  </h3>
                  <p className="abv-card-text abv-txt" data-split="content" data-split-toggle style={{ "--base": ".3s" } as CSSProperties}>
                    {v.text}
                  </p>
                  <figure className="abv-card-photo">
                    <img src={v.image} alt={v.alt} loading="lazy" decoding="async" />
                  </figure>
                </li>
              ))}
            </ol>
          </div>
          <div className="abv-vision-images" aria-hidden>
            <div className="abv-base">
              <img src={items[0].image} alt="" loading="lazy" decoding="async" />
            </div>
            {items.slice(1).map((v) => (
              <div key={v.image} className="abv-group">
                <div className="abv-overlay" />
                <div className="abv-image">
                  <div className="abv-mask">
                    <img src={v.image} alt="" loading="lazy" decoding="async" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
