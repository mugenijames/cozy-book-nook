// frontend/src/sections/About.tsx
export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="/logo.png" 
              alt="David Emuria" 
              className="rounded-2xl shadow-xl w-full max-w-md mx-auto border-4 border-[#D4A017]"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#2E1208] mb-4">
              About David Emuria
            </h2>
            <div className="w-20 h-1 bg-[#D4A017] mb-6"></div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              David Emuria is a passionate author, speaker, and philanthropist dedicated to transforming lives through the power of storytelling and practical wisdom.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              His work focuses on healing, identity, and purpose, helping individuals and communities discover their true potential and overcome life's challenges.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Through his books, programs, and speaking engagements, David has touched thousands of lives across schools, churches, and community organizations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}