import { motion } from 'motion/react';
import { useSiteConfig } from '../hooks/useSiteConfig';

const DEFAULT_DETAIL_IMAGES = [
  "https://postfiles.pstatic.net/MjAyNjA8MDRfMjA5/MDAxNzg1ODQ4MTQxMzY1.vdm_e6ykYLfDJ33YWwj4v5vhyHhcos9uacLo291ErqEg.9x-1evLc6yZq-54oj2r7Wa5AB_711ciUlonmH3WECJkg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-8.jpg?type=w773",
  "https://postfiles.pstatic.net/MjAyNjA8MDRfMTE5/MDAxNzg1ODQ4MTQxMzY8.mCXXVV0eWAy-euWeNgsgWuDoUmmw4Tu9RLKLmeeTL7Ag.O1hOepVOu84kbLaHsdMrRNlfv__5f3OQyZWeOCF2KRQg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-7.jpg?type=w773",
  "https://postfiles.pstatic.net/MjAyNjA8MDRfOTkg/MDAxNzg1ODQ4MTQxMzcz.jKV1zlqbRjvtuioLWpHm2XrBUapdob499XCJwMyHr4Eg.0QdXJ4MzTYRqDyJrGpsMct9nuDBZBlp3QEa2xP7l4-cg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-5.jpg?type=w773",
  "https://postfiles.pstatic.net/MjAyNjA8MDRfMjE1/MDAxNzg1ODQ4MTQxMzc9.Ppdxw9yvvKE41QnqYHGMc2n4ffRRkOZ-6QLOzq_HtJsg.4WJez7oi35_GF8tfummGO1trwvC1d9nuKezopzbnWfog.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-3.jpg?type=w773",
  "https://postfiles.pstatic.net/MjAyNjA8MDRfMjcw/MDAxNzg1ODQ4MTQxMzc9.YRDXxlqWTap8hqA58giVir3AbmzfS34BTRN4TlcioQwg.Uezh3k9ZfqeuMFr4IFYXi-VshvnvNg8A5nH-uyPTqAUg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-2.jpg?type=w773",
  "https://postfiles.pstatic.net/MjAyNjA8MDRfMTIz/MDAxNzg1ODQ4MTQxM3c3.ua7GR7a4mbja_rMcrfFAyz4H4KRByqqljHvPsbt-KHUg.UARWWIOX2k0r8zoMOk9ilF2Erf9WseoOvVvDH-aJcRsg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-1.jpg?type=w773"
];

export default function HomeImageSequence() {
  const { config } = useSiteConfig();
  const images = config.homeDetailImages && config.homeDetailImages.length > 0
    ? config.homeDetailImages
    : DEFAULT_DETAIL_IMAGES;

  return (
    <section className="py-8 md:py-16 bg-[#F8F9FA] relative border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seamless Image Stream */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full bg-white rounded-2xl md:rounded-[36px] overflow-hidden shadow-2xl border border-gray-200/80 flex flex-col items-center"
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`한울팩 상세 정보 ${index + 1}`}
              className="w-full h-auto block select-none pointer-events-auto transition-opacity duration-300"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
