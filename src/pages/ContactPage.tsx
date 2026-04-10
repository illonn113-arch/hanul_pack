import Contact from '../components/Contact';
import { motion } from 'motion/react';

export default function ContactPage() {
  return (
    <main className="pt-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Contact />
      </motion.div>
    </main>
  );
}
