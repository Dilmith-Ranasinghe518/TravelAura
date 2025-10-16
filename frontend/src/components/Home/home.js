import { useEffect, useState } from "react";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";

export default function HomePage() {
  // --- Hero images (Sri Lanka) ---
  const slides = [
    "https://upload.wikimedia.org/wikipedia/commons/1/11/Colombo_skyline_2024.jpg", // Colombo skyline
    "https://upload.wikimedia.org/wikipedia/commons/8/8f/Mirissa_Beach.jpg",       // Mirissa Beach
    "https://upload.wikimedia.org/wikipedia/commons/c/c7/Sigiriya.jpg",             // Sigiriya
    "https://upload.wikimedia.org/wikipedia/commons/0/00/Nine_Arch_Bridge_Ella.jpg",// Nine Arch Bridge (Ella)
    "https://upload.wikimedia.org/wikipedia/commons/e/e5/Tea-plantation_Nuwara_Eliya-2567.jpg", // Nuwara Eliya tea
  ];

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [slides.length]);

  // Featured destinations
  const featured = [
    { title: "Mirissa", img: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Mirissa_Beach.jpg", meta: "Beaches • Temples • Nightlife" },
    { title: "Sigiriya", img: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Sigiriya.jpg", meta: "Shrines • Gardens • Culture" },
    { title: "Colombo", img: "https://upload.wikimedia.org/wikipedia/commons/1/11/Colombo_skyline_2024.jpg", meta: "Museums • Cafés • Landmarks" },
    { title: "Ninearch Bridge", img: "https://upload.wikimedia.org/wikipedia/commons/0/00/Nine_Arch_Bridge_Ella.jpg", meta: "Rock Fortress • History • Views" },
    { title: "Nuwara Eliya", img: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Tea-plantation_Nuwara_Eliya-2567.jpg", meta: "Mountains • Hiking • Snow" },
    { title: "Galle", img: "https://upload.wikimedia.org/wikipedia/commons/9/98/GALLE_FORT.jpg", meta: "Skylines • Desert • Shopping" },
  ];

  // Stats / Reviews
  const stats = [
    { value: "120,000+", label: "Registered Travelers" },
    { value: "8,500+", label: "Monthly Bookings" },
    { value: "25,000", label: "Peak Concurrent Users" },
    { value: "99.9%", label: "Uptime (Last 90 days)" },
  ];
  const reviews = [
    { name: "Ayesha K.", location: "Colombo, LK", rating: 5, text: "So easy to compare stays and flights. Booked my Kandy trip in minutes!", date: "Aug 2025" },
    { name: "Liam C.", location: "Melbourne, AU", rating: 4, text: "Great UI and fast search. Would love more filters for surf spots.", date: "Aug 2025" },
    { name: "Sakura M.", location: "Kyoto, JP", rating: 5, text: "The itinerary builder is fantastic—saved me hours of planning!", date: "Jul 2025" },
  ];

  // AI video
  const aiVideoUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
  const handleDownload = () => {
    try {
      const a = document.createElement("a");
      a.href = aiVideoUrl;
      a.download = "ai-video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      window.open(aiVideoUrl, "_blank");
    }
  };

  // Color palettes for stats
  const palettes = [
    { from: "from-sky-500", to: "to-sky-400", bg: "bg-sky-50", text: "text-sky-600", hoverRing: "hover:ring-sky-200" },
    { from: "from-emerald-500", to: "to-emerald-400", bg: "bg-emerald-50", text: "text-emerald-600", hoverRing: "hover:ring-emerald-200" },
    { from: "from-violet-500", to: "to-violet-400", bg: "bg-violet-50", text: "text-violet-600", hoverRing: "hover:ring-violet-200" },
    { from: "from-amber-500", to: "to-amber-400", bg: "bg-amber-50", text: "text-amber-600", hoverRing: "hover:ring-amber-200" },
  ];

  const StatIcon = (i) => {
    switch (i) {
      case 0: return (<svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-9 9a9 9 0 0 1 18 0H3Z" /></svg>);
      case 1: return (<svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v3H3V6a2 2 0 0 1 2-2h2Zm-4 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Zm4 3h6v2H7v-2Z" /></svg>);
      case 2: return (<svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M13 2 3 14h7l-1 8 12-14h-7l1-6Z" /></svg>);
      default: return (<svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Zm-1 13-3-3 1.4-1.4L11 12.2l3.6-3.6L16 10l-5 5Z" /></svg>);
    }
  };

  return (
    <div className="relative font-sans text-gray-900 bg-gradient-to-b from-white via-sky-50/50 to-white overflow-x-hidden">
      <Header />
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-sky-400/20 to-teal-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-[30%] -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-fuchsia-300/20 to-violet-300/20 blur-3xl" />

      {/* Hero slideshow */}
      <section className="relative h-[520px] w-full overflow-hidden border-b border-gray-200/70">
        {slides.map((url, i) => (
          <div
            key={url}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${url})` }}
            aria-hidden={i !== index}
          />
        ))}

        {/* soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/25" />

        {/* Hero content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-5">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-white/25 backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Handpicked Sri Lanka Experiences
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] drop-shadow-xl">
            Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-sky-300">adventure</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base md:text-lg/7 text-white/85 max-w-2xl">
            Compare destinations, manage bookings, and build your dream itinerary.
          </p>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#destinations"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 hover:from-sky-700 hover:to-teal-600 active:scale-[.99] transition"
            >
              Explore Destinations
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#blogs"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20 active:scale-[.99] transition"
            >
              See Reviews
            </a>
          </div>

          {/* Slide indicators */}
          <div className="mt-8 flex items-center gap-2">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/60"}`}
              />
            ))}
          </div>
        </div>

        {/* glossy bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Featured section */}
      <section id="destinations" className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-8 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Trending Destinations
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Curated picks loved by travelers this season
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live updates enabled
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {featured.map((d) => (
              <div
                key={d.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(2,6,23,0.12)]"
              >
                {/* image */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={d.img}
                    alt={d.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {/* top-right badge */}
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-gray-800 ring-1 ring-black/5 backdrop-blur">
                    Hot pick
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* content */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-base text-gray-900">{d.title}</div>
                    <div className="text-[11px] rounded-md px-2 py-1 bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                      Sri Lanka
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 line-clamp-2">{d.meta}</div>

                  {/* actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => alert(`Open ${d.title}`)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 active:scale-[.99] transition"
                    >
                      View
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </button>
                    <span className="text-[11px] text-gray-500">~ 3–5 days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* divider */}
          <div className="mt-12 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
      </section>

      {/* AI-Generated Video */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Explore your journey with us
            </h2>
            <p className="text-sm text-gray-600 mt-1">A quick glimpse of what’s possible</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black shadow-[0_24px_60px_rgba(2,6,23,0.12)] ring-1 ring-white/10">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
            <video className="w-full h-auto block" src={aiVideoUrl} controls playsInline />

            {/* bottom bar */}
            <div className="absolute inset-x-0 bottom-0">
              <div className="bg-gradient-to-t from-black/70 to-transparent pt-6 pb-3">
                <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                  <span className="text-white/85 text-sm">Preview • AI video</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="px-3 py-2 rounded-lg text-sm font-semibold bg-white/90 hover:bg-white text-gray-900 shadow"
                    >
                      
                    </button>
                    <button
                      onClick={() => alert("Regenerating…")}
                      className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 shadow"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* glossy outline */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
          </div>
        </div>
      </section>

      {/* Stats & Reviews */}
      <section id="blogs" className="py-14 border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Trusted by Travelers Worldwide
            </h2>
            <p className="text-sm text-gray-600 mt-1">Real usage, real stories, real results</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-10">
            {stats.map((s, i) => {
              const c = palettes[i % palettes.length];
              return (
                <div
                  key={s.label}
                  className={[
                    "group relative overflow-hidden rounded-2xl bg-white/90 border border-gray-200 shadow-sm",
                    "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(2,6,23,0.12)]",
                    "ring-1 ring-transparent",
                    c.hoverRing,
                  ].join(" ")}
                >
                  {/* top gradient bar */}
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.from} ${c.to}`} />
                  <div className="p-5 text-center">
                    <div className={`mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full ${c.bg} ${c.text}`}>
                      {StatIcon(i)}
                    </div>
                    <div className="text-2xl font-extrabold tracking-tight text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-600 mt-1">{s.label}</div>
                  </div>
                  <div className={`pointer-events-none absolute -right-10 -bottom-10 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition ${c.bg}`} />
                </div>
              );
            })}
          </div>

          {/* Reviews */}
          <h3 className="text-xl font-extrabold mb-4">What users say</h3>
          <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
            {reviews.map((r, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-sky-400 to-teal-400 text-white grid place-items-center text-sm font-bold">
                    {r.name.split(" ").map(p => p[0]).join("").slice(0,2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.date}</div>
                    </div>
                    <div className="text-[11px] text-gray-500 mb-1">{r.location}</div>
                    <div className="text-amber-500 text-sm mb-1">
                      {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </div>
                    <div className="text-sm text-gray-800">{r.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* bottom divider */}
          <div className="mt-12 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
      </section>
      <Fotter />
    </div>
  );
}