// frontend/src/sections/About.tsx
export default function About() {
  return (
    <section id="about" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image Section - Smaller */}
          <div className="order-1 md:order-1 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <img 
                src="/logo.png" 
                alt="David Emuria" 
                className="rounded-2xl shadow-xl w-full h-full object-cover border-4 border-[#C17B4F]"
              />
              {/* Optional: Decorative element */}
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-[#C17B4F]/10 rounded-full -z-10" />
              <div className="absolute -top-3 -left-3 w-16 h-16 bg-[#C17B4F]/10 rounded-full -z-10" />
            </div>
          </div>
          
          {/* Text Content */}
          <div className="order-2 md:order-2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-[#2E1208] mb-3 md:mb-4">
              About David Emuria
            </h2>
            <div className="w-20 h-1 bg-[#C17B4F] mx-auto md:mx-0 mb-4 md:mb-6"></div>
            <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4 leading-relaxed">
              David Emuria is a passionate author, speaker, and philanthropist dedicated to transforming lives through the power of storytelling and practical wisdom.
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4 leading-relaxed">
              His work focuses on healing, identity, and purpose, helping individuals and communities discover their true potential and overcome life's challenges.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Through his books, programs, and speaking engagements, David has touched thousands of lives across schools, churches, and community organizations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}