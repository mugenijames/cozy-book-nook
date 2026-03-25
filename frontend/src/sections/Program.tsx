import { Link } from "react-router-dom";
import { PROGRAM_ACTIVITIES } from "@/data/programActivities";

const Program = () => {
  return (
    <section id="program" className="py-24 bg-white text-center">
      <h2 className="text-3xl font-bold mb-6">
        Dear Dad Student Transformation Program
      </h2>

      <p className="max-w-3xl mx-auto text-gray-700">
        A practical, school-based initiative designed to help
        students heal emotionally, build identity, develop discipline,
        and grow into responsible leaders.
      </p>

      <div className="mt-14 max-w-4xl mx-auto px-4">
        <h3 className="text-lg font-semibold text-[#2E1208] mb-4">Programs &amp; activities</h3>
        <ul className="grid gap-4 sm:grid-cols-2 text-left">
          {PROGRAM_ACTIVITIES.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/programs/${p.slug}`}
                className="block rounded-xl border border-[#E8DDD4] bg-[#FDF8F3] px-5 py-4 text-[#2E1208] transition hover:border-[#D4A017]/60 hover:shadow-sm"
              >
                <span className="font-medium">{p.title}</span>
                <span className="mt-1 block text-sm text-[#5C4436] line-clamp-2">
                  {p.description}
                </span>
                <span className="mt-2 inline-block text-sm font-medium text-[#8B4513]">
                  View photos →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Program;