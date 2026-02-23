import { motion } from 'framer-motion'; // This is the line that fixes the 'ReferenceError'

const About = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center gap-12">
        
        {/* Text Content (Left Side) */}
        <motion.div 
          className="md:w-1/2 text-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#4A1F0E]">
            About David Emuria
          </h2>

          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              David Emuria is a Kenyan author, speaker, leadership trainer, and social transformation advocate from Turkana. His life and work are shaped by lived experience—growing up in hardship, navigating fatherlessness, poverty and broken family systems, and later finding healing, purpose, and leadership through faith, discipline, and learning.
            </p>
            <p>
              David writes and speaks for the underdog, the overlooked, the struggling student, the leader in the making, and the generation searching for meaning. His message is raw, honest, and practical—bridging faith, psychology, leadership, personal development, and nation building.
            </p>
            <p>
              He has served in multiple leadership roles within Christian unions, campus fellowships, and youth missions, and works closely with students, young leaders, churches, and communities across Kenya, particularly in marginalized regions such as Turkana.
            </p>
            <p className="font-semibold text-[#4A1F0E]">
              Through his books, programs, and consulting work, David is committed to raising resilient individuals, healed leaders, and purpose-driven communities.
            </p>
          </div>
        </motion.div>

      
        <div className="md:w-1/2 flex justify-center relative">
         
          <div className="absolute inset-0 bg-[#D4A017]/5 rounded-full blur-3xl -z-10 scale-110" />
          
          <motion.img
            src="./images/maximize_your_campus_life.jpg"
            alt="David Emuria"
            className="w-full max-w-sm rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }} 
          />
        </div>

      </div>
    </section>
  );
};

export default About;