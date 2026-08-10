import { motion } from "framer-motion";
import { Quote, Star, ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Grace Mwangi",
    role: "Educator & Mentor",
    image:
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    quote:
      "David has a unique ability to connect with people and communicate ideas in a way that feels practical, relevant and deeply encouraging.",
  },
  {
    name: "Samuel Otieno",
    role: "Youth Leader",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    quote:
      "His message on purpose and personal growth challenged young people to think differently about their potential and the responsibility they carry.",
  },
  {
    name: "Mary Wanjiku",
    role: "Community Leader",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    quote:
      "What stood out most was David's authenticity. His conversations go beyond motivation and encourage people to take meaningful action.",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#C17B4F]/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#4A1F0E]/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-3xl text-center lg:mb-16"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C17B4F]/20 bg-[#C17B4F]/5 px-4 py-2">
            <Quote className="h-4 w-4 text-[#C17B4F]" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B4513]">
              Testimonials
            </span>
          </div>

          <h2 className="text-4xl font-bold leading-tight tracking-tight text-[#2E1208] sm:text-5xl lg:text-6xl">
            Words from people
            <span className="block text-[#C17B4F]">
              touched by the message.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Every meaningful conversation has the potential to create
            perspective, courage and transformation.
          </p>

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#C17B4F]" />
        </motion.div>

        {/* Rating summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 flex w-fit flex-col items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-[#FAFAF9] px-8 py-5 shadow-sm sm:flex-row sm:gap-5"
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5 fill-[#D4A017] text-[#D4A017]"
              />
            ))}
          </div>

          <div className="hidden h-6 w-px bg-gray-200 sm:block" />

          <div className="text-center sm:text-left">
            <p className="text-sm font-bold text-[#2E1208]">
              A message that resonates
            </p>

            <p className="text-xs text-gray-500">
              Feedback from audiences, students and communities
            </p>
          </div>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
              }}
              whileHover={{ y: -6 }}
              className="
                group
                relative
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-3xl
                border
                border-gray-100
                bg-white
                p-7
                shadow-[0_10px_40px_rgba(46,18,8,0.06)]
                transition-shadow
                duration-300
                hover:shadow-[0_20px_55px_rgba(46,18,8,0.12)]
                sm:p-8
              "
            >
              {/* Quote icon */}
              <div className="absolute right-6 top-6 opacity-10">
                <Quote className="h-16 w-16 text-[#4A1F0E]" />
              </div>

              {/* Stars */}
              <div className="relative z-10 mb-6 flex gap-1">
                {Array.from({ length: testimonial.rating }).map(
                  (_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-[#D4A017] text-[#D4A017]"
                    />
                  )
                )}
              </div>

              {/* Quote */}
              <blockquote className="relative z-10 flex-1 text-base leading-7 text-gray-600">
                “{testimonial.quote}”
              </blockquote>

              {/* Person */}
              <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#C17B4F]/20">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#2E1208]">
                    {testimonial.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 text-center"
        >
          <a
            href="#speaking"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#4A1F0E]
              px-6
              py-3
              text-sm
              font-semibold
              text-[#4A1F0E]
              transition-all
              duration-300
              hover:bg-[#4A1F0E]
              hover:text-white
              hover:shadow-lg
            "
          >
            Invite David to Speak
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;