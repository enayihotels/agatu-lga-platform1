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

export default function Hero() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden bg-agatu-earth-900 sm:h-[480px]">
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
      <div className="absolute inset-0 bg-gradient-to-t from-agatu-earth-900 via-agatu-earth-900/60 to-transparent" />

      <div className="animate-fade-up absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-4 pb-10 text-white">
        <p className="text-sm font-medium uppercase tracking-wide text-agatu-farm-200">
          Benue State &middot; Est. 1996
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Welcome to AgatuConnect
        </h1>
        <p className="mt-2 max-w-xl text-agatu-earth-100">
          Agatu &mdash; the food basket along the Benue River. News,
          history, and culture from Agatu Local Government Area, home to
          10 wards and a proud farming and fishing tradition.
        </p>
      </div>
    </div>
  );
}
