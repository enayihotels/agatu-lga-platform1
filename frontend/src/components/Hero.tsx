import chairman from "@/assets/hero/chairman.jpg";
import children from "@/assets/hero/children.jpg";
import governor from "@/assets/hero/governor.jpg";
import map from "@/assets/hero/map.webp";

const slides = [
  { src: children, caption: "The people of Agatu" },
  { src: map, caption: "10 wards along the Benue River" },
  { src: chairman, caption: "Hon. (Amb.) James Melvin Ejeh, Executive Chairman" },
  { src: governor, caption: "Rev. Fr. Dr. Hyacinth Iormem Alia, Governor of Benue State" },
];

const welcomeWords = ["Welcome", "to", "Agatu", "Local", "Government"];

export default function Hero() {
  return (
    <div className="relative h-[460px] w-full overflow-hidden bg-agatu-earth-900 sm:h-[560px]">
      {slides.map((slide, index) => (
        <div key={index} className="hero-slide absolute inset-0">
          <img
            src={slide.src}
            alt={slide.caption}
            className="hero-zoom h-full w-full object-cover object-top opacity-70"
          />
        </div>
      ))}

      {/* Gradient scrim for text legibility, on top of every slide */}
      <div className="absolute inset-0 bg-gradient-to-t from-agatu-earth-900 via-agatu-earth-900/70 to-agatu-earth-900/20" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <p className="animate-fade-up mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-agatu-farm-200 sm:text-sm">
          Benue State &middot; Established 1996
        </p>

        <h1 className="max-w-3xl font-serif text-4xl font-extrabold leading-tight tracking-tight drop-shadow-lg sm:text-6xl">
          {welcomeWords.map((word, index) => (
            <span
              key={index}
              className="hero-word mr-3"
              style={{ animationDelay: `${0.15 * index}s` }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p className="animate-fade-up mt-5 max-w-xl text-base text-agatu-earth-100 sm:text-lg" style={{ animationDelay: "1.1s" }}>
          The food basket along the Benue River &mdash; news, history, and
          culture from Agatu&apos;s 10 wards and its proud farming and
          fishing tradition.
        </p>
      </div>
    </div>
  );
}
