import { motion } from 'motion/react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { Mail, Phone, MapPin, Instagram, Globe, Printer, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function Contact() {
  const { config } = useSiteConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    hasForklift: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const path = 'inquiries';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: Date.now(),
        status: 'new'
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        location: '',
        hasForklift: '',
        message: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold tracking-widest text-[#FF6321] uppercase mb-4 block">Contact Us</span>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-8 leading-tight text-gray-900">
              견적문의
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-lg leading-relaxed">
              귀사의 작업 환경에 맞는 최적의 랩핑 솔루션을 제안해 드립니다.<br className="hidden sm:inline" />
              제품 상담부터 맞춤 견적까지 빠르고 친절하게 안내해 드리겠습니다.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-[#FFF0E9] border border-[#FF6321]/10 rounded-2xl flex items-center justify-center text-[#FF6321] group-hover:bg-[#FF6321] group-hover:text-white transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">전화번호</p>
                  <p className="text-xl font-bold text-gray-900">{config.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-[#FFF0E9] border border-[#FF6321]/10 rounded-2xl flex items-center justify-center text-[#FF6321] group-hover:bg-[#FF6321] group-hover:text-white transition-all duration-300">
                  <Printer size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">팩스</p>
                  <p className="text-xl font-bold text-gray-900">031-401-1166</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-[#FFF0E9] border border-[#FF6321]/10 rounded-2xl flex items-center justify-center text-[#FF6321] group-hover:bg-[#FF6321] group-hover:text-white transition-all duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">이메일</p>
                  <p className="text-xl font-bold text-gray-900">{config.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-[#FFF0E9] border border-[#FF6321]/10 rounded-2xl flex items-center justify-center text-[#FF6321] group-hover:bg-[#FF6321] group-hover:text-white transition-all duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">주소</p>
                  <p className="text-xl font-bold text-gray-900 leading-tight">
                    경기도 시흥시 마유로 42번길 89 (시화공단)<br />
                    <span className="text-lg font-medium text-[#FF6321]">* 현장방문 환영 *</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#F8F9FA] border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-gray-200/50"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-[#FFF0E9] rounded-full flex items-center justify-center text-[#FF6321]">
                  <Send size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">문의가 접수되었습니다</h3>
                  <p className="text-gray-600">빠른 시일 내에 답변 드리겠습니다. 감사합니다.</p>
                </div>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-[#FF6321] font-bold hover:underline"
                >
                  새로운 문의하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="space-y-3">
                    <label className="text-base font-bold text-gray-700 ml-1">담당자 성함</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="성함을 입력해주세요"
                      className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] transition-all placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-base font-bold text-gray-700 ml-1">이메일</label>
                    <input
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="example@email.com"
                      className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] transition-all placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-base font-bold text-gray-700 ml-1">핸드폰 번호</label>
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="010-0000-0000"
                      className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] transition-all placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-base font-bold text-gray-700 ml-1">회사명</label>
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      type="text"
                      placeholder="회사명을 입력해주세요"
                      className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] transition-all placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-base font-bold text-gray-700 ml-1">설치지역</label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      type="text"
                      placeholder="설치하실 지역을 입력해주세요 (예: 경기도 시흥시, 경남 창원시)"
                      className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] transition-all placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-base font-bold text-gray-700 ml-1">문의 내용</label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          message: `• 파렛트 사이즈: \n• 포장 제품: \n• 최대 적재 높이: \n• 최소 / 최대 중량: \n• 지게차 유무: \n• 궁금하신 점: `
                        }));
                      }}
                      className="text-xs font-semibold text-[#FF6321] hover:text-[#e05215] transition-colors flex items-center gap-1 bg-[#FF6321]/10 px-3 py-1.5 rounded-full"
                    >
                      + 작성 양식 채우기
                    </button>
                  </div>
                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={8}
                    placeholder={`원활한 견적 상담을 위해 아래 항목을 포함하여 입력해주시면 더욱 정확하고 빠른 안내가 가능합니다.

• 파렛트 사이즈 (예: 1100 x 1100mm)
• 포장 제품 (예: 종이박스, 플라스틱 용기, 파이프 등)
• 최대 적재 높이 (예: 1800mm)
• 최소 / 최대 중량 (예: 100kg ~ 1500kg)
• 지게차 유무 (예: 지게차 보유 / 미보유 / 핸드리프트 사용)
• 궁금하신 점 및 기타 문의사항`}
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] transition-all resize-none placeholder:text-gray-400 placeholder:leading-relaxed shadow-sm text-sm"
                  />
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={20} className="rotate-[-10deg]" />
                      <span className="text-lg">문의하기</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
