import { useLayoutEffect, useRef, type CSSProperties } from "react"

// Vision, mission and core values, after telhaclarke.com.au/studio's <c-values-vision> ("Our values" into "Our vision").
// A sticky screen inside a tall section. It opens on a full-screen photo with the vision and mission at the lower
// right. From a quarter-screen of scroll, over one screen (scrubbed), the photo clips in to the right-hand column while
// it slides to that column's centre and settles from 1.2 to 1, while the vision and mission (each in its own frosted
// glass box) drift up and fade out one after the other. Then each core
// value takes three quarters of a screen: its title and lines rise in as the previous one fades, while its photo
// wipes up over the last (image up from 100%, its mask down from -100%, the photo easing from 1.15 to 1) and darkens
// the one beneath. Below 1024px, or with reduced motion, it becomes a plain stacked layout.
// Photos are stand-ins (Unsplash) until BCE supplies its own.

const TRIGGER = 0.25 // screens of scroll before the photo starts clipping in
const CARD = 0.75 // screens of scroll per core value
const SCRUB = 0.6 // seconds the scrubbed parts take to catch up with the scroll
// Scroll windows (in screens past the section top) over which the vision box, then the mission box, animate out.
const BOX_OUT: [number, number][] = [
  [0.05, 0.75],
  [0.4, 1.15],
]

const photo = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`

// BCE's four pillars (Corporate Profile 2026: Chairwoman's message, pp. 01 and 07).
const values = [
  {
    title: "Quality",
    text: "Built to last. From material selection and production to construction and delivery, laboratory quality control keeps every structure strong, durable and lasting.",
    id: "photo-1512207736890-6ffed8a84e8d",
    alt: "Crews in high-visibility gear on a concrete pour, seen from above",
  },
  {
    title: "Safety",
    text: "Our top priority. We protect our people, our partners and the communities we serve, from the batching plant to the project site.",
    id: "photo-1622612023350-b15f063eabe6",
    alt: "A site worker in a hard hat and high-visibility vest",
  },
  {
    title: "Reliability",
    text: "On time, every time. Our own batching plants, mixer trucks and pump trucks give us the capacity to keep projects on schedule and on spec.",
    id: "photo-1773432114391-f85c1674b233",
    alt: "A concrete mixer truck on a gravel yard",
  },
  {
    title: "Partnership",
    text: "Stronger together. We grow alongside our clients, partners and suppliers through long-term relationships built on trust, respect and mutual success.",
    id: "photo-1694521787193-9293daeddbaa",
    alt: "Three site workers measuring a block wall together",
  },
]

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2

function Subtitle({
  n,
  children,
  dark,
  tag,
}: {
  n: string
  children: string
  dark?: boolean
  tag?: boolean
}) {
  return (
    <p className={`abv-subtitle${dark ? " is-dark" : ""}`}>
      <span className="abv-subtitle-n">{n}</span>
      <span>{children}</span>
      {tag && <span className="pd-tag ab-tag-dark ml-2">Sample content</span>}
    </p>
  )
}

export default function AboutValues() {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!
    const $$ = <T extends HTMLElement>(s: string) => [
      ...root.querySelectorAll<T>(s),
    ]
    const marker = $(".abv-marker"),
      sticky = $(".abv-sticky"),
      valuesLayer = $(".abv-values"),
      valuesImage = $(".abv-values-image"),
      valuesInner = $(".abv-values-inner"),
      valuesSub = $(".abv-values .abv-subtitle"),
      valuesTxt = $$(".abv-values .abv-txt"),
      boxes = $$(".abv-box"),
      visionLayer = $(".abv-vision"),
      visionSub = $(".abv-vision .abv-subtitle"),
      cardsWrap = $(".abv-cards"),
      cards = $$(".abv-card"),
      imageWrap = $(".abv-vision-images"),
      groups = $$(".abv-group")
    const cardTxt = cards.map((c) => [
      ...c.querySelectorAll<HTMLElement>(".abv-txt"),
    ])
    const setOn = (els: HTMLElement[], on: boolean) =>
      els.forEach((el) => el.classList.toggle("is-active", on))

    const desktop = matchMedia("(min-width: 1024px)")
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let teardown = () => {}

    // Phones, tablets and reduced motion: everything in flow, each block revealing as it enters.
    const setupStatic = () => {
      root.classList.remove("is-live")
      const place = () => {
        marker.style.top = `${visionLayer.getBoundingClientRect().top - root.getBoundingClientRect().top}px`
      }
      place()
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            e.target.classList.add("is-active")
            io.unobserve(e.target)
          }),
        { rootMargin: "0px 0px -12% 0px" },
      )
      ;[
        valuesSub,
        visionSub,
        ...boxes,
        ...valuesTxt,
        ...cardTxt.flat(),
      ].forEach((el) => io.observe(el))
      addEventListener("resize", place)
      return () => {
        io.disconnect()
        removeEventListener("resize", place)
      }
    }

    const setupLive = () => {
      root.classList.add("is-live")
      ;[
        valuesSub,
        visionSub,
        ...boxes,
        ...valuesTxt,
        ...cardTxt.flat(),
      ].forEach((el) => el.classList.remove("is-active"))
      let vh = innerHeight,
        clip = { t: 0, r: 0, b: 0, l: 0 },
        shiftX = 0
      const measure = () => {
        vh = innerHeight
        root.style.height = `${vh * (2 + TRIGGER + CARD * values.length)}px`
        marker.style.top = `${vh * (1 + TRIGGER)}px`
        cardsWrap.style.height = `${Math.max(...cards.map((c) => c.offsetHeight))}px`
        const s = sticky.getBoundingClientRect(),
          w = imageWrap.getBoundingClientRect()
        clip = {
          t: w.top - s.top,
          r: s.right - w.right,
          b: s.bottom - w.bottom,
          l: w.left - s.left,
        }
        shiftX = w.left + w.width / 2 - (s.left + s.width / 2)
      }

      let smooth = NaN,
        last = 0,
        raf = 0,
        valuesOn: boolean | null = null,
        current = -2
      const frame = (now: number) => {
        raf = 0
        const r = root.getBoundingClientRect()
        const u = -r.top / vh // screens scrolled past the section top
        const dt = last ? Math.min(0.1, (now - last) / 1000) : 1
        last = now
        smooth = Number.isNaN(smooth)
          ? u
          : lerp(smooth, u, 1 - Math.exp((-dt * 4) / SCRUB))
        if (Math.abs(smooth - u) < 0.0005) smooth = u

        // Photo clipping in to the right-hand column, plus its parallax as the section arrives.
        const p = clamp01((smooth - TRIGGER) / 1)
        const enter = clamp01((vh - r.top) / vh)
        valuesImage.style.clipPath = `inset(${(clip.t * p).toFixed(2)}px ${(clip.r * p).toFixed(2)}px ${(clip.b * p).toFixed(2)}px ${(clip.l * p).toFixed(2)}px round ${(4 * p).toFixed(2)}px)`
        valuesInner.style.transform = `translate3d(${(shiftX * p).toFixed(2)}px, ${(-15 * (1 - enter)).toFixed(3)}%, 0) scale(${(1.2 - 0.2 * p).toFixed(4)})`
        if (p < 0.5) valuesLayer.setAttribute("data-nav-dark", "")
        else valuesLayer.removeAttribute("data-nav-dark")

        // Vision and mission: the glass boxes and their lines rise in just before the section sticks. Then, scrubbed,
        // each box drifts up and fades out in turn (vision, then mission), clearing before the first core value.
        const on = u > -0.35 && u < 1 + TRIGGER
        if (on !== valuesOn) {
          valuesOn = on
          setOn([...boxes, ...valuesTxt], on)
        }
        valuesSub.classList.toggle("is-active", u > -0.35 && u < TRIGGER)
        boxes.forEach((box, i) => {
          const [from, to] = BOX_OUT[i]
          const e = easeInOut(clamp01((smooth - from) / (to - from)))
          box.style.setProperty("--abv-out", e.toFixed(4))
        })

        // Core values: one at a time, each three quarters of a screen.
        const start = 1 + TRIGGER
        const k =
          u < start
            ? -1
            : Math.min(values.length - 1, Math.floor((u - start) / CARD))
        if (k !== current) {
          current = k
          visionSub.classList.toggle("is-active", k >= 0)
          cardTxt.forEach((els, i) => setOn(els, i === k))
        }

        // Each later photo wipes up over the one before, centred on its card's start (scrubbed).
        groups.forEach((g, gi) => {
          const i = gi + 1
          const q = clamp01((smooth - (start + CARD * i - CARD / 2)) / CARD)
          const image = g.children[1] as HTMLElement,
            mask = image.firstElementChild as HTMLElement,
            img = mask.firstElementChild as HTMLElement
          ;(g.firstElementChild as HTMLElement).style.opacity = (
            0.9 * q
          ).toFixed(3)
          image.style.transform = `translate3d(0, ${(100 * (1 - q)).toFixed(3)}%, 0)`
          mask.style.transform = `translate3d(0, ${(-100 * (1 - q)).toFixed(3)}%, 0)`
          img.style.transform = `scale(${(1.15 - 0.15 * q).toFixed(4)})`
        })
        // The last photo drifts down as the section leaves.
        const out = clamp01((vh - r.bottom) / vh)
        groups[groups.length - 1].style.transform =
          `translate3d(0, ${(15 * out).toFixed(3)}%, 0)`

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
        valuesLayer.setAttribute("data-nav-dark", "")
        boxes.forEach((b) => b.style.removeProperty("--abv-out"))
        ;[valuesImage, valuesInner, ...groups, ...$$(".abv-group *")].forEach(
          (el) => {
            el.style.clipPath = ""
            el.style.transform = ""
            el.style.opacity = ""
          },
        )
      }
    }

    const setup = () => {
      teardown()
      teardown =
        desktop.matches && !reduced.matches ? setupLive() : setupStatic()
    }
    setup()
    desktop.addEventListener("change", setup)
    reduced.addEventListener("change", setup)
    return () => {
      teardown()
      desktop.removeEventListener("change", setup)
      reduced.removeEventListener("change", setup)
    }
  }, [])

  return (
    <section
      ref={rootRef}
      id="values"
      data-header-title="Vision & mission"
      aria-labelledby="ab-vision"
      className="abv"
    >
      <div aria-hidden className="abv-marker" data-header-title="Core values" />
      <div className="abv-sticky">
        {/* Vision and mission over the full-screen photo. */}
        <div className="abv-values" data-nav-dark>
          <div className="abv-values-image">
            <div className="abv-values-inner">
              <img
                src={photo(values[0].id, 2400)}
                alt={values[0].alt}
                loading="lazy"
                decoding="async"
              />
              <div className="abv-shade" />
            </div>
          </div>
          <div className="abv-values-grid">
            <div className="abv-values-head">
              <h2 id="ab-vision" className="sr-only">
                Vision and mission
              </h2>
              <Subtitle n="01" tag>
                Vision & mission
              </Subtitle>
            </div>
            <div className="abv-values-content">
              <article className="abv-box" aria-labelledby="ab-our-vision">
                <p
                  id="ab-our-vision"
                  className="abv-label abv-txt"
                  data-split="content"
                  data-split-toggle
                  style={{ "--base": ".1s" } as CSSProperties}
                >
                  Our vision
                </p>
                <p
                  className="abv-statement abv-txt"
                  data-split="content"
                  data-split-toggle
                  style={{ "--base": ".18s" } as CSSProperties}
                >
                  To be Cambodia’s most trusted partner for concrete, piling and
                  construction.
                </p>
              </article>
              <article
                className="abv-box"
                aria-labelledby="ab-our-mission"
                style={{ "--abv-delay": ".15s" } as CSSProperties}
              >
                <p
                  id="ab-our-mission"
                  className="abv-label abv-txt"
                  data-split="content"
                  data-split-toggle
                  style={{ "--base": ".25s" } as CSSProperties}
                >
                  Our mission
                </p>
                <p
                  className="abv-statement abv-txt"
                  data-split="content"
                  data-split-toggle
                  style={{ "--base": ".33s" } as CSSProperties}
                >
                  To deliver quality-controlled concrete, foundations and
                  construction on time and on spec, with our own plants, fleet
                  and people.
                </p>
              </article>
            </div>
          </div>
        </div>

        {/* Core values, one at a time beside the photo column. */}
        <div className="abv-vision">
          <div className="abv-vision-left">
            <h2 className="sr-only">Core values</h2>
            <Subtitle n="02" dark>
              Core values
            </Subtitle>
            <ol className="abv-cards">
              {values.map((v) => (
                <li key={v.title} className="abv-card">
                  <h3
                    className="abv-card-title abv-txt"
                    data-split
                    data-split-toggle
                    style={{ "--base": ".12s" } as CSSProperties}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="abv-card-text abv-txt"
                    data-split="content"
                    data-split-toggle
                    style={{ "--base": ".3s" } as CSSProperties}
                  >
                    {v.text}
                  </p>
                  <figure className="abv-card-photo">
                    <img
                      src={photo(v.id, 1400)}
                      alt={v.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                </li>
              ))}
            </ol>
          </div>
          <div className="abv-vision-images" aria-hidden>
            {values.slice(1).map((v) => (
              <div key={v.id} className="abv-group">
                <div className="abv-overlay" />
                <div className="abv-image">
                  <div className="abv-mask">
                    <img
                      src={photo(v.id, 1600)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
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
