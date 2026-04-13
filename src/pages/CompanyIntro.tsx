import { motion } from 'motion/react';
import { Award, Zap, ShieldCheck, Check } from 'lucide-react';

export default function CompanyIntro() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-32 pb-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-gray-900">
              회사 <span className="text-[#FF6321]">소개</span>
            </h1>

            <h2 className="text-xl md:text-2xl font-bold text-black mb-8 tracking-tight">
              "안녕하십니까? 한울팩을 방문해주셔서 감사합니다."
            </h2>

            <div className="space-y-6 text-gray-500 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto font-normal break-keep">
              <p>
                한울팩은 <span className="font-bold text-gray-900">파렛트 랩핑기 전문 제조 및 공급 기업</span>으로서,<br className="hidden md:block" />
                고객사의 생산 효율 극대화와 안전한 물류 환경 조성을 위해 끊임없이 노력하고 있습니다.<br />
                파렛트랩핑기를 주 제품으로 다양한 포장 기계를 통해<br />
                최상의 기술력과 신뢰를 바탕으로 최적의 장비를 공급합니다.
              </p>
            </div>
          </motion.div>

          {/* New Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center text-left"
          >
            <div className="lg:col-span-7 relative aspect-[16/10] rounded-[32px] overflow-hidden shadow-2xl">
              <img
                src="https://postfiles.pstatic.net/MjAyNjAzMjNfMjg1/MDAxNzc0Mjc2NjU2NTkx.qzS6ElHLoqDHQonyhAmMVZbqH1t8uC7y6ZgpPbLrJB0g.js96ehIX84jAwEkbQwZ_fSrCkOfeVWmmPLu16E5nGecg.JPEG/%EA%B3%B5%EC%9E%A5_%EC%A0%84%EC%B2%B4%EC%82%AC%EC%A7%84.jpg?type=w773"
                alt="한울팩 공장 전경"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tighter leading-tight text-gray-900 break-keep">
                고객의 성공이 곧<br />
                <span className="text-[#FF6321]">한울팩의 성공</span>입니다.
              </h3>

              <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed font-normal break-keep">
                <p>
                  급변하는 산업 환경 속에서 포장의 중요성은 날로 커지고 있습니다.
                  한울팩은 <span className="font-bold text-gray-900">파렛트 랩핑기 분야의 전문성</span>을 바탕으로,
                  고객사의 작업 환경과 제품의 특성을 고려하여 가장 적합한 랩핑 솔루션을 제안해 드립니다.
                </p>
                <p>
                  저희는 모든 문제를 고객의 눈높이에서 바라보며,
                  철저한 사후 관리와 신속한 A/S를 통해 고객사의 가동 중단을 최소화하는 것을 최우선 과제로 삼고 있습니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Core Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-32 pb-12"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">핵심 가치</h2>
              <p className="text-gray-500 text-lg">한울팩이 지켜나가는 세 가지 약속입니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-[#F8F9FA] p-10 rounded-[40px] text-left space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Award className="text-[#FF6321] w-7 h-7" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold text-gray-900">최상의 품질</h4>
                  <p className="text-gray-600 leading-relaxed break-keep">
                    엄격한 검수 과정을 거친 검증된 부품만을 사용하여 장비의 내구성과 안정성을 보장합니다.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#F8F9FA] p-10 rounded-[40px] text-left space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Zap className="text-[#FF6321] w-7 h-7" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold text-gray-900">혁신적 효율</h4>
                  <p className="text-gray-600 leading-relaxed break-keep">
                    고성능 자동화 기능을 갖춘 장비를 통해 작업 시간을 단축하고 인건비 절감 효과를 극대화합니다.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#F8F9FA] p-10 rounded-[40px] text-left space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <ShieldCheck className="text-[#FF6321] w-7 h-7" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold text-gray-900">신뢰의 서비스</h4>
                  <p className="text-gray-600 leading-relaxed break-keep">
                    PCB 방식 제어를 통해 고장 시 모듈형 부품 교체로 신속하고 간편한 수리가 가능하며, 전국 어디든 신속하게 대응합니다.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stock & Inventory Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-32"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                철저한 랩핑기 재고 및 부품 관리
              </h2>
              <p className="text-gray-500 text-lg">
                신속한 대응을 위해 상시 넉넉한 완제품과 핵심 부품을 보유하고 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                {
                  image: "https://postfiles.pstatic.net/MjAyNjAzMjZfMjMz/MDAxNzc0NDg5Nzk4NTQy.vHCbnFAcmpLIzE3EfIImZAeiZfwkKBxnfYw_oQrv6cUg.VOwQ_Zm7dErCROAeRK3dzuPCKCFmsl--4CUQlR8NG4wg.JPEG/KakaoTalk_20260111_170324814_04.jpg?type=w773",
                  title: "기본형 랩핑기 완제품 재고",
                  desc: "상시 넉넉한 완제품 재고를 보유하여 고객사의 요청에 즉각적인 대응이 가능합니다. 공장 내부에 랩핑기가 줄지어 대기 중인 모습을 확인하실 수 있습니다. (기본형 외 모델은 제작 기간이 소요될 수 있습니다.)"
                },
                {
                  image: "https://postfiles.pstatic.net/MjAyNjAzMjZfMjEg/MDAxNzc0NDg5ODg1Nzc2.rVuPAvgDqkfxdtPqmPP16jTSUx61Zrvzc-P6aR_yNKMg.etv8xjbPwxFD-z3nGzP3fZlXdoMiZjyEH_7tvWtBQeog.JPEG/%EB%9E%A9%ED%95%91%EA%B8%B0_%ED%94%84%EB%A0%88%EC%9E%84%EA%B8%B0%EB%91%A5.jpg?type=w773",
                  title: "랩핑기 프레임 및 기둥",
                  desc: "견고한 내구성을 자랑하는 랩핑기 프레임과 기둥 재고를 충분히 확보하고 있습니다. 튼튼한 프레임은 장비 수명의 핵심입니다."
                },
                {
                  image: "https://postfiles.pstatic.net/MjAyNjAzMjZfMTAg/MDAxNzc0NDkwNTE5MzUw.ukP9VwbOafz3XI5KZkJe9QTNzOl1dg1ZlBK1XlJfUAQg.DhURnt00xiN1CfX8mUBFtagfYtj_i-1DWhb6AxCvY8Qg.JPEG/KakaoTalk_20260110_152635219_09.jpg?type=w773",
                  title: "핵심 부품 및 소모품",
                  desc: "각종 모터, 인버터, 센서 등 핵심 부품을 상시 보유하여 신속한 유지보수를 보장합니다. 작은 부품 하나까지 꼼꼼하게 관리합니다."
                },
                {
                  image: "https://postfiles.pstatic.net/MjAyNjAzMjZfMjA2/MDAxNzc0NDg5NzgzNTcz.SchDYzFZGB0iHJllh3P1rsiBrPi3KtlvOVwI1M3zQQEg.qr32fgn9baVBQu97hzDMMutikwpYy2F7GQpMJgaatxQg.JPEG/KakaoTalk_20260110_152635219_12.jpg?type=w773",
                  title: "체계적인 창고 관리",
                  desc: "체계적인 재고 관리를 통해 최상의 제품 상태를 유지하며 신속한 출고를 지원합니다. 언제든 현장에서 즉시 출고될 준비가 되어 있습니다."
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed break-keep">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Direct Welding Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-32 space-y-16"
          >
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                견고한 내구성을 위한 <span className="text-[#FF6321]">직접 용접 및 프레임 제작</span>
              </h2>
              <p className="text-gray-500 text-lg break-keep">
                한울팩은 장비의 뼈대가 되는 프레임을 직접 용접하고 제작하여, 
                무거운 중량물에도 뒤틀림 없는 강력한 내구성을 보장합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
              <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl group">
                <img
                  src="https://postfiles.pstatic.net/MjAyNjAzMjlfODEg/MDAxNzc0Nzc3ODc0NzMx.bj8MFfOM6igibhXDBKT78RlcRmhVFx3vBkq1s0nvaZEg.xzrU61jvd97jx8-BiH6QuBTOZI3RAPJGnr__qsoG20kg.JPEG/KakaoTalk_20260202_162156456_05.jpg?type=w773"
                  alt="프레임 용접 현장"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <p className="text-white font-medium">프레임 직접 용접 및 제작 현장</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "https://postfiles.pstatic.net/MjAyNjAzMjlfMjQ2/MDAxNzc0Nzc3ODc0NzY4.gbNqS3BHzaVzFrl5WEH9sOJud3SyWgQlFQa9UncMw5Ug.zGjM2F8H8DdybeiIjUlLZhIML5mVb2j_hZMnP6ntyD0g.JPEG/KakaoTalk_20260105_153403309.jpg?type=w773",
                  "https://postfiles.pstatic.net/MjAyNjAzMjlfMTE2/MDAxNzc0Nzc3ODc0NzU0.83kIsAUFSUgtwsDo5hsg5O2cKH67xL8s4xpLiE6KoFIg.JCdw1OByJrMtnQ0zW9JyZiqKmNNzsanGNjqDuJNbpxcg.JPEG/KakaoTalk_20260324_215830978_01.jpg?type=w773",
                  "https://postfiles.pstatic.net/MjAyNjAzMjlfMjUy/MDAxNzc0Nzc3ODc0NzY2.VZFyNddZ7sXAfvC_B3kRJR9fKvfjWDimYtcphenB9BAg.ZtnzOcRzJGKzHuRQhicHj-wtVrSYilvsdq9APaDBAt4g.JPEG/KakaoTalk_20260327_095536087_02.jpg?type=w773",
                  "https://postfiles.pstatic.net/MjAyNjAzMjlfNjMg/MDAxNzc0Nzc3ODc0NzU2.CtAPUHSU_27raDbSQwJlJidq2Q77LGPQ0sv8q_BEKc8g.a2QJT5fj_WkSbJQS-5u31jjJ169vme-UFvbwCUfuoU4g.JPEG/KakaoTalk_20260324_215830978_03.jpg?type=w773"
                ].map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={url}
                      alt={`용접 제작 상세 ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* PCB Production Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-32 space-y-16"
          >
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                핵심 제어 시스템, <span className="text-[#FF6321]">PCB 기판 직접 설계 및 제작</span>
              </h2>
              <p className="text-gray-500 text-lg break-keep">
                한울팩은 랩핑기의 두뇌 역할을 하는 PCB 기판을 직접 설계하고 제작합니다. 
                이를 통해 장비의 정밀한 제어가 가능하며, 고장 시 모듈형 부품 교체로 신속하고 간편한 수리를 보장합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
              <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl group">
                <img
                  src="https://postfiles.pstatic.net/MjAyNjA0MDVfMjU2/MDAxNzc1MzIxODYwMDQx.lrlJgueXxYM-jcuju2abiCgU_2AB8drMn1yRj_vDrhIg.xDA3eOQ1aOCN9_SN379htLhYzYHjmMGznYdRC4G3DAsg.JPEG/KakaoTalk_20260115_130431666_02.jpg?type=w773"
                  alt="PCB 기판 제작 현장"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <p className="text-white font-medium">PCB 기판 직접 제작 현장</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "https://postfiles.pstatic.net/MjAyNjA0MTBfMjQz/MDAxNzc1NzgzMDc0MzY5.qcg_27v1GMV8GyAqELr7Tl0fkzoYtYQHJXXp7kkMfkEg.yFXKDgL9AmO_eonU_dYTv04y7MdX-Wo4tfWvQrE1g-8g.JPEG/KakaoTalk_20250728_131258608_07.jpg?type=w773",
                  "https://postfiles.pstatic.net/MjAyNjAzMjZfMjYg/MDAxNzc0NDk1NTgyMTUz.iIoq1onkOTe8Oo1-2aAhRZ2DhAXAiff-SExw33Klp1Ag.UbDaNxKqjt5vKOGug5T9qUvFNlcwTFbinV68aH3d2iQg.JPEG/%ED%8C%8C%EC%9B%8C%ED%98%95_%EA%B8%B0%ED%8C%90.jpg?type=w773",
                  "https://postfiles.pstatic.net/MjAyNjA0MDlfMjcy/MDAxNzc1NzA3Nzg1ODM1.yh01C777tra20hnKdFwTU76TlFnn_-tF88dMlz0g_Igg.5DWpxI4ODziOqsQ6IfKJ04nTUPoh-EzuZYwXzWMCJzgg.JPEG/KakaoTalk_20260329_173507463.jpg?type=w773",
                  "https://picsum.photos/seed/pcb4/800/800"
                ].map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-50 flex items-center justify-center">
                    {i < 3 ? (
                       <img
                       src={url}
                       alt={`PCB 제작 상세 ${i + 1}`}
                       className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                       referrerPolicy="no-referrer"
                     />
                    ) : (
                      <p className="text-gray-300 text-xs font-bold uppercase tracking-widest">Coming Soon</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Direct Manufacturing & A/S Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-32 space-y-16"
          >
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                직접 가공 및 제작을 통한 <span className="text-[#FF6321]">완벽한 사후 관리</span>
              </h2>
              <p className="text-gray-500 text-lg break-keep">
                한울팩은 랩핑기 부품을 직접 가공해서 제작하기 때문에 부품 수급은 물론 신속한 A/S가 가능하여 고객사의 걱정을 덜어드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
              <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl group">
                <img
                  src="https://postfiles.pstatic.net/MjAyNjAzMjZfMTcw/MDAxNzc0NDkxMzc5MzU1.q8jd783bKyL7kPtwhNtWqMBBLb_zl3La4wrFSWa9r8wg.M0lCgq76mm8j4GJIVbhryWAlzGD4G-wqZjpAeDKiB04g.JPEG/KakaoTalk_20260111_170324814_01.jpg?type=w773"
                  alt="부품 가공 및 제작 현장 전체"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <p className="text-white font-medium">부품 가공 및 제작 현장</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "https://postfiles.pstatic.net/MjAyNjAzMjZfMTIx/MDAxNzc0NDkxMzI4Mjgy.EuFHC8C3BAyEOiXbondYZRZPSOLPB6Z_YphRyyHrmiog.L324_CTMUla1mWynfUcDoCD-kN3EugOoPCPminGRm9cg.JPEG/KakaoTalk_20250728_205522910_04.jpg?type=w773",
                  "https://postfiles.pstatic.net/MjAyNjAzMjZfMTY1/MDAxNzc0NDkxMzI4Mjgy.VzjH_R7yaJJVR-cp6UvUVUgTQvOeMY5xb3M9c_iyYCUg.VxQOdMrajs6javDqIUcb2eyP0wSpzDuUusYyIaplLFgg.JPEG/KakaoTalk_20250728_205522910_03.jpg?type=w773",
                  "https://postfiles.pstatic.net/MjAyNjAzMjZfMTQ1/MDAxNzc0NDkxMzI4Mjk1.M2pRoQwSj1CIpC_DAzuh3oiJVvcEYBvNvq556ga2lKUg.Gr6XoXf6GlCQfgb9yQLbFBZOleEGgdypBu0voXvuCYUg.JPEG/KakaoTalk_20250728_205522910_02.jpg?type=w773",
                  "https://postfiles.pstatic.net/MjAyNjAzMjZfMjE0/MDAxNzc0NDkxMzI4Mjc3.2OStqGJYvRLUuTaey_M6t2mPjpEu1phYXTXDkGIEHJ4g.prgfL5I9gAH46c76a6FPfVc8UFZoux7DEmLMsoKUHyog.JPEG/KakaoTalk_20250728_205522910_01.jpg?type=w773"
                ].map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={url}
                      alt={`정밀 가공 부품 상세 ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Premium Stretch Film Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left"
          >
            <div className="space-y-8">
              <div className="inline-block px-4 py-1.5 bg-[#FFF0E9] text-[#FF6321] text-xs font-bold tracking-widest rounded-full uppercase">
                Packaging Materials
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight text-gray-900 break-keep">
                  기계 성능을 극대화하는<br />
                  <span className="text-[#FF6321]">프리미엄 스트레치 필름</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed break-keep">
                  한울팩은 기계 공급뿐만 아니라, 장비의 성능을 최상으로 유지하고 포장 품질을 높일 수 있는 최적의 포장 자재를 함께 공급합니다. 당사의 <span className="font-bold text-gray-900">고신축 스트레치 필름</span>은 뛰어난 복원력과 투명도를 자랑하며, 랩핑기 사용 시 필름 소모량을 획기적으로 줄여 경제적입니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#FFF0E9] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#FF6321] stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">고신축성</h4>
                    <p className="text-sm text-gray-500">최대 300% 연신으로 필름 절감</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#FFF0E9] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#FF6321] stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">강력한 점착</h4>
                    <p className="text-sm text-gray-500">흔들림 없는 완벽한 적재물 고정</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#FFF0E9] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#FF6321] stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">고투명도</h4>
                    <p className="text-sm text-gray-500">바코드 인식 및 내용물 확인 용이</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#FFF0E9] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#FF6321] stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">다양한 규격</h4>
                    <p className="text-sm text-gray-500">현장 용도에 맞는 두께/폭 선택</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-[60px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] bg-white p-8 group">
              <div className="absolute top-8 left-8 text-gray-400 text-sm font-medium opacity-50">Premium Stretch Film</div>
              <img
                src="https://postfiles.pstatic.net/MjAyNjAzMjNfMSAg/MDAxNzc0Mjc3NTA1ODA0.I8hjQIgdy8z0XOlBOQklZ1ZGWvIU1h-xP1YtQrbNfP8g.tepKUWlCHMTKIbh35SkUBu_FyyDmdv_Mmb8TgU4oIucg.PNG/Generated_Image_March_23,_2026_-_11_50PM.png?type=w773"
                alt="프리미엄 스트레치 필름"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Major Business Areas Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-32 bg-black rounded-[60px] p-12 md:p-20 text-center"
          >
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">주요 사업 영역</h2>
              <p className="text-gray-400 text-lg">한울팩은 신뢰할 수 있는 포장 기계를 공급합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 text-left max-w-5xl mx-auto">
              {/* Item 1 */}
              <div className="flex items-start gap-6">
                <div className="mt-1 w-10 h-10 rounded-full border border-[#FF6321] flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#FF6321] stroke-[3]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-[#FF6321]">주력 사업: 파렛트 랩핑기</h4>
                  <p className="text-gray-400 leading-relaxed break-keep">
                    기본형부터 파워 연신형, 리모컨랩핑기까지 한울팩만의 기술력이 집약된 맞춤형 랩핑 솔루션을 제공합니다.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-6">
                <div className="mt-1 w-10 h-10 rounded-full border border-[#FF6321] flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#FF6321] stroke-[3]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white">고품질 포장 자재 공급</h4>
                  <p className="text-gray-400 leading-relaxed break-keep">
                    기계 성능을 최상으로 유지해주는 고신축 스트레치 필름 등 핵심 자재를 공급합니다.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-6">
                <div className="mt-1 w-10 h-10 rounded-full border border-[#FF6321] flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#FF6321] stroke-[3]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white">유지보수 및 기술 지원</h4>
                  <p className="text-gray-400 leading-relaxed break-keep">
                    PCB 방식의 간편한 모듈형 수리 시스템을 통해 장비의 가동 중단을 최소화하고 수명을 연장합니다.
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-6">
                <div className="mt-1 w-10 h-10 rounded-full border border-[#FF6321] flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#FF6321] stroke-[3]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white">맞춤형 자동화 시스템</h4>
                  <p className="text-gray-400 leading-relaxed break-keep">
                    고객사의 현장 상황에 최적화된 시스템 구축을 통해 스마트한 물류 환경을 제안합니다.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
