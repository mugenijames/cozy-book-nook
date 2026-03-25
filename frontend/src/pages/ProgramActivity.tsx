import { Link, Navigate, useParams } from "react-router-dom";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import { getProgramBySlug, PROGRAM_ACTIVITIES } from "@/data/programActivities";

export default function ProgramActivityPage() {
  const { slug } = useParams<{ slug: string }>();
  const activity = getProgramBySlug(slug);

  if (!activity) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#2E1208]">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-5xl px-6">
          <nav className="mb-8 text-sm text-[#5C4436]">
            <Link to="/" className="hover:text-[#8B4513] transition-colors">
              Home
            </Link>
            <span className="mx-2 opacity-60" aria-hidden>
              /
            </span>
            <a href="/#program" className="hover:text-[#8B4513] transition-colors">
              Programs
            </a>
            <span className="mx-2 opacity-60" aria-hidden>
              /
            </span>
            <span className="font-medium text-[#2E1208]" aria-current="page">
              {activity.title}
            </span>
          </nav>

          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#2E1208] md:text-4xl">
            {activity.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#5C4436]">
            {activity.description}
          </p>

          <section className="mt-12" aria-label={`Photos for ${activity.title}`}>
            <h2 className="sr-only">Gallery</h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activity.images.map((img) => (
                <li
                  key={img.src}
                  className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-sm"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-[#E8DDD4] pt-10">
            <p className="w-full text-sm font-medium text-[#3D2817]">More programs</p>
            <ul className="flex flex-wrap gap-2">
              {PROGRAM_ACTIVITIES.filter((p) => p.slug !== activity.slug).map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/programs/${p.slug}`}
                    className="inline-flex rounded-full border border-[#C9B8A8] bg-white px-4 py-2 text-sm text-[#4A1F0E] transition-colors hover:border-[#D4A017] hover:bg-[#FAF3EB]"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
