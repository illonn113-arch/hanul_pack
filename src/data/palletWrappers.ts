import { collection, getDocs, doc, setDoc, writeBatch, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export interface PalletWrapper {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  videoUrl?: string;
  videoUrls?: string[];
  gallery?: string[];
  fitImages?: string[];
  specs: { label: string; value: string }[];
  performance: string[];
  mainFeatures?: { title: string; description: string }[];
  detailedDescription?: string;
  advantages?: { title: string; description: string }[];
  recommendedIndustries?: string[];
  caution?: string;
  customizedInfo?: { description: string; items: string[] };
}

export const FALLBACK_WRAPPERS: PalletWrapper[] = [
  {
    "id": "standard",
    "order": 1,
    "title": "기본형 랩핑기",
    "subtitle": "Standard Model",
    "description": "가장 보편적으로 사용되는 경제적이고 효율적인 파렛트 랩핑기로 견고한 내구성과 간편한 조작이 특징인 제품입니다.",
    "image": "https://postfiles.pstatic.net/MjAyNjAzMjRfNTAg/MDAxNzc0MzUzMDUzNDYy.Xpu0Xwi55qb1b3hLYkM4SUAyCCbOf9aVPXSVYUdGF0Ag.yFwJFY7ycz4XhteghoL2Pzd1qNMuLz9R-eqej6H0zdIg.JPEG/%EB%9E%A9%ED%95%91%EA%B8%B0_%EB%88%84%EB%81%BC_2.jpg?type=w773",
    "videoUrl": "https://www.youtube.com/embed/AoLMDquiMHk",
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjAzMjRfMjUz/MDAxNzc0MzUzMDU3MTcw.BWW8kAk3NO8vDXr54vrBqThYpozAl8m7GnEBZrcZKYMg.eTbqO0W1Gyzg6gx7Uv9Ti_Qfqld-mGXuplST4-WXJIUg.JPEG/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94_(9).jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjRfMTYg/MDAxNzc0MzUzMDcwMzgy.LmrwT8fxZti1Ltp9OTOYLV2fumcdBB7aOGfKw50-w-gg.KXG5UiQCkb-ZDpfhD3vmi7N9rvuq78pSm_3GvyR9VUEg.JPEG/%EC%A0%95%EB%A9%B4.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjRfMjkw/MDAxNzc0MzUzMDcwNDEw.gK0MWWacMBiraqAKFXW49x8xnpoQ0xtrLrPIkBzV9QEg.HTpHD3EQ6niFIMcyMWhLHEJ1jIJz02bX5DUU4q-6CPQg.JPEG/%EC%B8%A1%EB%A9%B4_2.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfODgg/MDAxNzc0Nzc1ODc0NTkx.aqBfhs0B6QtfUCPHE4aidbJlpH0X4xL0ys4Wq9QiN10g.CrcFsDTtQuZpsuz-lbJfs0dSZong9_MGCyc-un5jdlIg.JPEG/20260329_135622.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMTgz/MDAxNzc0Nzc1ODc0NTQ1.NeCjjQRnRVPpFwtwTWEC_kpa6riTYNLRlfyz5nAZpiYg.3zXCY-_00T5gWHij0T2JlHsOOxYp6iU-_T3tdDxE6G0g.JPEG/KakaoTalk_20260327_095536087_01.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMTQg/MDAxNzc0Nzc1ODc0NjE2._XcVf5bFkxZdpdX01vnCuN72GUDOjUon_oEU8xiZUvsg.ZlEbQxkszC0wmWeaKZFUrtYmgZgeLqleWftRcgv2yFwg.JPEG/20260329_135750.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjVfMjYw/MDAxNzc0NDQyNDcyNjIw.EKgdjKaWQJwLtAj0zoPckpWqGDM78x1KwLWy3rSOmbEg.ZppGLBFNC1G584PvXFi-t3fjNIpkswunp9R9jIgmFG4g.JPEG/KakaoTalk_20250728_131258608_08.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjVfMjMz/MDAxNzc0NDQyNDYxODUy.oNzwhyJOIHGVMg190d5yMO5MMt01AHkb1dCKC8LK-xkg.fmm1g0Ou5pn-WDdytpEh-p8OaHUYMfkzhJZhLtii17Ig.JPEG/%ED%91%9C%EC%A4%80%ED%98%95_%EA%B8%B0%ED%8C%90.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMTUy/MDAxNzc0NDk2NzU2Njc1.HSK4cETIYji17lhQoYKp9U4xPWHdg8pqQ74WjWPP6dQg.35wpwpTRvX_7II0Oitd_08SFwbzgfA88e5ZPbwhM_OIg.JPEG/%EC%84%A4%EB%AA%85%EC%83%81%EC%84%B8%ED%91%9C%EC%8B%9C.jpg?type=w773"
    ],
    "fitImages": [
      "%EA%B8%B0%ED%8C%90",
      "(9)",
      "%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94",
      "%EC%84%A4%EB%AA%85%EC%83%81%EC%84%B8%ED%91%9C%EC%8B%9C.jpg?type=w773"
    ],
    "specs": [
      { "label": "전원", "value": "220V 단상" },
      { "label": "턴테이블 직경", "value": "1,500Φ" },
      { "label": "최대 적재 중량", "value": "2,000kg" },
      { "label": "최대 포장 높이", "value": "2,200mm (표준)" },
      { "label": "랩핑기 규격", "value": "1,500W x 2,600L x 2,485H (mm)" },
      { "label": "기계 중량", "value": "약 500kg" }
    ],
    "performance": [
      "지게차로 쉽게 이동이 가능\n(지게차만 있으면 상시 이동가능)",
      "조작기판 위치 왼쪽 or 오른쪽 변경 가능\n(현장에서도 쉽게 변경 가능)",
      "간편한 조작 기판 (PCB 방식)",
      "제품 상단 자동 높이 감지 센서",
      "턴테이블, 헤드 속도 조절 기능",
      "슬로우 스타트/스톱 기능",
      "간편한 필름 텐션 조절"
    ],
    "mainFeatures": [
      { "title": "경제적인 가격", "description": "합리적인 비용으로 고성능 랩핑 자동화를 실현하여 물류 비용을 절감합니다." },
      { "title": "견고한 내구성", "description": "고강도 강철 프레임과 검증된 부품을 사용하여 장기간 안정적인 사용이 가능합니다." },
      { "title": "사용자 편의성", "description": "직관적인 PCB 제어 방식으로 누구나 쉽게 조작할 수 있으며, 현장 상황에 맞게 기판 위치를 왼쪽 또는 오른쪽으로 변경 가능합니다." }
    ],
    "detailedDescription": "기본형 랩핑기는 가장 널리 사용되는 모델로, 다양한 산업 현장에서 파렛트 포장 작업을 자동화하는 데 최적화되어 있습니다.",
    "advantages": [],
    "customizedInfo": {
      "description": "표준 사양 외에도 고객사의 작업 환경에 맞춘 특수 제작이 가능합니다.",
      "items": [
        "기둥 높이: 최대 3,200mm까지 제작 가능",
        "턴테이블 직경: 최대 3,000 파이(Φ)까지 제작 가능"
      ]
    },
    "recommendedIndustries": []
  },
  {
    "id": "power",
    "order": 2,
    "title": "파워형 랩핑기",
    "subtitle": "Power Pre-Stretch",
    "description": "필름 연신 장치(Pre-stretch)가 장착되어 필름 소모량을 획기적으로 줄여주는 고효율 모델입니다.",
    "image": "https://postfiles.pstatic.net/MjAyNjAzMjRfNjAg/MDAxNzc0MzUzMDgyNDQy.CoV3lLEpZRYKnqIhKjbnRQS8H2xDGw-4_h2Eo4it5ZMg.WVmL4eCGJYXr4SDGASfQaaF2Vvo3VVP0OMhRulZgN5cg.JPEG/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94.jpg?type=w773",
    "videoUrl": "https://www.youtube.com/embed/KtKSQLOuoj0",
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjAzMjRfMTkw/MDAxNzc0MzUzMDk4MzIz.Z5-pujxDxpoyusZhSG33abbpugle1J3fj0kTOq7szmUg.KnPClhCbd5bTQIuKeACmEMfE3M5SinqiL45JmpQmjKgg.JPEG/KakaoTalk_20250808_182614515_01.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjRfMTUx/MDAxNzc0MzUzMTAwNzY1.Ko3vGp7I56V9kk4lOX_YuW0kc8IVtoiUJ1d-e4gSd6Ig.rRorK2k-BINBMueSZs6FMjY4w1PHw7Hug3uBtdivBTgg.JPEG/KakaoTalk_20250808_182614515_04.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjRfODcg/MDAxNzc0MzU3NTM2NTk0.BuMLk88Bl0fBykC2AVt44cdaOOVhzGFNiykZjQWfWs0g.pITwI28rruqVBrakvZ6b0a3oJ1P6kIjUlo9c6rAulYQg.JPEG/SE-f669b6a8-b71d-47c1-b919-171f950bdd64.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfODgg/MDAxNzc0Nzc1ODc0NTkx.aqBfhs0B6QtfUCPHE4aidbJlpH0X4xL0ys4Wq9QiN10g.CrcFsDTtQuZpsuz-lbJfs0dSZong9_MGCyc-un5jdlIg.JPEG/20260329_135622.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMTgz/MDAxNzc0Nzc1ODc0NTQ1.NeCjjQRnRVPpFwtwTWEC_kpa6riTYNLRlfyz5nAZpiYg.3zXCY-_00T5gWHij0T2JlHsOOxYp6iU-_T3tdDxE6G0g.JPEG/KakaoTalk_20260327_095536087_01.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMTQg/MDAxNzc0Nzc1ODc0NjE2._XcVf5bFkxZdpdX01vnCuN72GUDOjUon_oEU8xiZUvsg.ZlEbQxkszC0wmWeaKZFUrtYmgZgeLqleWftRcgv2yFwg.JPEG/20260329_135750.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfNzUg/MDAxNzc0Nzc2MTk4MjE0.e4H_UF4KvFzkkHIzD-Ka1gDAr6XSN7AoTrr8nOTqt4og.k72q2t9m0Rbq2dzTqgidGJIY6SQoIZhNeciS7wertAIg.JPEG/KakaoTalk_20260327_095536087.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMjYg/MDAxNzc0NDk1NTgyMTUz.iIoq1onkOTe8Oo1-2aAhRZ2DhAXAiff-SExw33Klp1Ag.UbDaNxKqjt5vKOGug5T9qUvFNlcwTFbinV68aH3d2iQg.JPEG/%ED%8C%8C%EC%9B%8C%ED%98%95_%EA%B8%B0%ED%8C%90.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMjQ0/MDAxNzc0Nzc2MjczMjc4.xrGPZ5fZJj8xes-DUoseHRFDNqm1_18zWJ7FCCnxRp8g.Jz8eWW1_Sw844g2q1tYBff-1R5oKqRZFg8ba87-kGBcg.JPEG/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94_(2).jpg?type=w773"
    ],
    "fitImages": [
      "%EA%B8%B0%ED%8C%90",
      "(9)",
      "%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94",
      "%EC%84%A4%EB%AA%85%EC%83%81%EC%84%B8%ED%91%9C%EC%8B%9C"
    ],
    "specs": [
      { "label": "전원", "value": "220V 단상" },
      { "label": "필름 연신율", "value": "최대 300%" },
      { "label": "턴테이블 직경", "value": "1,500Φ" },
      { "label": "최대 적재 중량", "value": "2,000kg" },
      { "label": "최대 포장 높이", "value": "2,200mm (표준)" },
      { "label": "랩핑기 규격", "value": "1,500W x 2,600L x 2,485H (mm)" },
      { "label": "기계 중량", "value": "약 500kg" }
    ],
    "performance": [
      "지게차로 쉽게 이동이 가능\n(지게차만 있으면 상시 이동가능)",
      "조작기판 위치 왼쪽 or 오른쪽 변경 가능\n(현장에서도 쉽게 변경 가능)",
      "간편한 조작 기판 (PCB 방식)",
      "필름 연신 기능으로 가벼운 제품도 OK",
      "필름 기능 연신율 최대 300%",
      "포장 견고함 증대",
      "제품 상단 자동 높이 감지 센서",
      "턴테이블, 헤드, 필름연신 조절 기능",
      "간편한 필름 교체",
      "슬로우 스타트/스톱 기능"
    ],
    "mainFeatures": [
      { "title": "필름 연신 장치 (비용 절감)", "description": "필름을 최대 300%까지 늘려주어 랩 소모량을 획기적으로 절감하고 물류 비용을 낮춥니다." },
      { "title": "포장 품질 향상", "description": "랩의 강력한 복원력을 바탕으로 파렛트 적재물을 더욱 단단하고 견고하게 고정합니다." },
      { "title": "경량물 포장 최적화", "description": "인장력 정밀 조절 기능으로 가벼운 제품도 무너짐이나 변형 없이 안전하게 랩핑 가능합니다." },
      { "title": "고효율 및 편의성", "description": "연속적인 대량 작업에도 안정적인 성능을 발휘하며, 직관적인 인터페이스로 누구나 쉽게 조작 가능합니다." }
    ],
    "detailedDescription": "파워형 랩핑기는 기본형 랩핑기에 추가로 모터와 인버터를 부착하여 랩핑 시 인장력을 정밀 조절하는 기능이 추가되었습니다. \n\n필름 연신 장치를 통해 필름을 미리 늘려주어 랩 소모량을 최소화하고 동일한 양의 필름으로 더 많은 파렛트를 랩핑할 수 있습니다.\n\n**이런 현장에 추천드립니다.**\n\n- 높이 대비 가볍고 불안정한 제품(랩핑 중 제품이 이탈되거나 무너지는 경우)\n- 얇은 박스(기본형을 사용 시 각 모서리 부분이 뭉개지는 현상이 발생할 수 있습니다.)",
    "advantages": [],
    "customizedInfo": {
      "description": "표준 사양 외에도 고객사의 작업 환경에 맞춘 특수 제작이 가능합니다.",
      "items": [
        "기둥 높이: 최대 3,200mm까지 제작 가능",
        "턴테이블 직경: 최대 3,000 파이(Φ)까지 제작 가능"
      ]
    },
    "recommendedIndustries": []
  },
  {
    "id": "top-press",
    "order": 3,
    "title": "탑프레스 랩핑기",
    "subtitle": "Top Press",
    "description": "가벼운 제품이나 흔들리기 쉬운 적재물을 상단에서 눌러주어 안정적으로 랩핑할 수 있는 모델입니다.",
    "image": "https://postfiles.pstatic.net/MjAyNjAzMjZfMTY4/MDAxNzc0NDk4MTI1NDI4.wh-TuKOKMmpPQytyBoPj6Ud-Ec-kZCvd2v9yDz7LfDAg.tot_gYf0RKHN-oP-yMgin6ctsPfPYUEP1n1ZoJbL9Rog.JPEG/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94_(11).jpg?type=w773",
    "videoUrl": "https://www.youtube.com/embed/mf0qEL2aFr0",
    "videoUrls": [
      "https://www.youtube.com/embed/mf0qEL2aFr0",
      "https://www.youtube.com/embed/t191nW97FhM",
      "https://www.youtube.com/embed/B_fzzB5Z4gQ"
    ],
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMjU1/MDAxNzc0NDk4MTQ2MTkz.1xmk0R8sr8XJDXuDqApHcaRe7fkQt8G2Z657HuIUr5Ag.PEVBhLA2ra6lcIYL10oldEb8EGETv99TIoq4Cl5sQ1gg.JPEG/%EC%A0%95%EB%A9%B4.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMjEy/MDAxNzc0NDk4MTQ2MTQ1.s3SYxo1TxOFpQ8MxiknTnyuQT9duC1xGQ6jPEguIKD4g.F08MmizsmtTXIECZxee4N7jGIMboCD_4uNhb5XLCtzEg.JPEG/%EC%A2%8C%EC%B8%A1%EB%A9%B4.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMTA1/MDAxNzc0NDk4MTQ2MTkw.FaaUN6ZM68lh5lRhvaqz5Hgq8V6VObcJ_2nN16kDBvEg.tn9A4osgY6zi8l95lnoTQIHVd_HdC47oqTQxj6IQtF8g.JPEG/%EC%9A%B0%EC%B8%A1%EB%A9%B4.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMjg4/MDAxNzc0NDk4MTY3NTIw.K2eNzLu5hkSyRWvw28_h4ghF4xMhz-H7wKbOHmyzEb8g.QICdDzPM_V6mClXzrloKWnAqcvwyGVSiH80Nr0pEiZ4g.JPEG/KakaoTalk_20250819_170207646_08.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMjk5/MDAxNzc0NDk4MTY3NTI4.KHc0eaioR_HiUlydoPB0LGAtMr-lYi_c7shDkHOvP3gg.oviGSgFbhUtmdEN-n7Y7amMYeB2m3Hixbt8ceKiibu4g.JPEG/KakaoTalk_20250819_170207646_09.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMTAw/MDAxNzc0NDk4MTQ2MTc3.9KpiaCHm-sWyOnWERhcucblVpuZkzkUgEgAEiHigRK8g.wGWJy3zRNrRgRZxTwRHUHsyHApN0OhL2hzISwIFBbI8g.JPEG/KakaoTalk_20250819_170207646_05.jpg?type=w773"
    ],
    "fitImages": [
      "%EA%B8%B0%ED%8C%90",
      "(9)",
      "%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94_(11).jpg?type=w773"
    ],
    "specs": [
      { "label": "전원", "value": "220V 단상" },
      { "label": "턴테이블 직경", "value": "1,500Φ" },
      { "label": "최대 적재 중량", "value": "2,000kg" },
      { "label": "최대 포장 높이", "value": "2,200mm (표준)" },
      { "label": "압착 판 크기", "value": "800Φ (원형)" },
      { "label": "랩핑기 규격", "value": "1,500W x 2,600L x 2,485H (mm)" },
      { "label": "기계 중량", "value": "550kg" }
    ],
    "performance": [
      "지게차로 쉽게 이동이 가능\n(지게차만 있으면 상시 이동가능)",
      "상단 압착으로 적재물 무너짐 방지\n(가벼운 박스 포장물에 필수적인 기능)",
      "안정적인 회전 및 랩핑 구현",
      "간편한 조작 기판 (PCB 방식)",
      "제품 상단 자동 높이 감지 센서",
      "턴테이블, 헤드 속도 조절 기능",
      "슬로우 스타트/스톱 기능",
      "간편한 필름 텐션 조절"
    ],
    "mainFeatures": [
      { "title": "상단 압착 시스템 (안정성)", "description": "가벼운 박스나 흔들리기 쉬운 적재물을 위에서 단단히 눌러주어 회전 중 무너짐이나 쏟아짐을 완벽하게 방지합니다." },
      { "title": "자동 높이 감지 (범용성)", "description": "다양한 높이와 크기의 제품을 센서가 자동으로 감지하여 압착판의 높이를 최적으로 조절합니다." },
      { "title": "안전 시스템 탑재", "description": "프레스 하강 시 장애물을 감지하는 안전 센서가 기본 탑재되어 작업자의 안전을 최우선으로 합니다." },
      { "title": "정밀 회전 제어", "description": "상단 고정 상태에서도 부드러운 회전과 랩핑을 지원하여 완벽한 포장 품질을 구현합니다." }
    ],
    "detailedDescription": "탑프레스 랩핑기는 상단 압착 장치를 통해 가벼운 제품이나 불안정한 적재물을 고정하여 안전하게 랩핑할 수 있도록 설계되었습니다.",
    "advantages": [],
    "recommendedIndustries": [
      "가벼운 플라스틱 용기 제조 업체",
      "높이가 높고 폭이 좁은 박스 포장 업체",
      "흔들림에 민감한 정밀 부품 업체"
    ],
    "customizedInfo": {
      "description": "탑프레스 랩핑기 주문제작은 전화 상담을 통해 상세 협의 후 맞춤형으로 제작 가능합니다.",
      "items": [
        "기둥 높이: 최대 3,200mm까지 제작 가능",
        "턴테이블 직경: 최대 3,000 파이(Φ)까지 제작 가능",
        "압착 원판: 300~1000mm 사이즈 주문제작 가능"
      ]
    }
  },
  {
    "id": "remote",
    "order": 4,
    "title": "리모콘 랩핑기",
    "subtitle": "Remote Control",
    "description": "지게차 운전자가 내리지 않고 리모콘으로 조작할 수 있어 작업 효율을 극대화한 모델입니다.",
    "image": "https://postfiles.pstatic.net/MjAyNjA0MDlfMjg2/MDAxNzc1NzA3NjEyMjc2.D1i1s7IwkcgR937TOLkOgoOQf0v_HN-GW0DniabQy0sg.ZEs9Wu7pwNON729njmvz2sSA7RtTSmNGuRt-HWHDTT8g.JPEG/%EB%A6%AC%EB%AA%A8%EC%BB%A8%EB%9E%A9%ED%95%91%EA%B8%B0_%EB%88%84%EB%81%BC.jpg?type=w773",
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMTU3/MDAxNzc1NzA3NjUzMDEx.R8uADSSkmH2HbELOfzL63zn9iP8ebhsS5nFQDMKi_s4g.Xe4ivI_JaTd6BGUed-LGIOa0s_KT61Y3VVcGUPnQK2Ag.JPEG/20260329_141745.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMTMz/MDAxNzc1NzA3NjYyMjg4.ugCsaBokfdHGhq4TZTRiK0pdiDOWpllm7jI3IkvUoCAg.lwWmmM93jN5qUjR_qlSWNRNLZE2awGe6wMGSk1qsP6Eg.JPEG/20260329_141825.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMTky/MDAxNzc1NzA3NzM0NzY1.QlaUHAOENXGpCXrlgu5vkdTweCCXknJZm8qAahM5A8Qg.5dYohGqOWUuGxVlHsur85Dxti7XgD0d-ogwV3Lsf94Yg.JPEG/20260312_122823.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMTMg/MDAxNzc1NzA3Njk0ODk1.m_qrq4GLY3EGeCckFnSxjOmKEOQLM8Jr1J-zSw-ViGkg.nF3UH9XgY9StLtFuzFeoRdPfqKeHIDChZVq610237BAg.JPEG/20260329_141806.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfNDUg/MDAxNzc1NzA3Njk3ODgy.4M9-BEQdabsU4Lzw2Ay5ODr6Y9QTmt8YTQx145shetQg.0IYiDPYNmmedgOgeEIBslNILS3sYKuZQFxWpTNQGXMwg.JPEG/20260329_141918.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMjMw/MDAxNzc1NzA3NzAwODc2.SRmrOpOmRl1zU96CVfdibdmtZIEJzSrPHBfw_tKjqLkg.gMdU-cgbEcNKnxyybEZ5EZ0MG5un8H-qm908PiuYOLkg.JPEG/20260329_141830.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMTA0/MDAxNzc1NzA3NzYxMDM0.YkNhuAPKa8GMzd-Ke_wxxlve_Gc-zK5LkNFZkqbGPFEg.HYQqztO4GNTv4BehWQ94Y2BZQUM-lnyodVq0JBNoh80g.JPEG/20260312_122814.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfNTAg/MDAxNzc1NzA3NzY2Nzg5.jKNcqmTO1mPIAq_Nt0kvtN14nnI1zpP7dMu-ATPtmfAg.Gf2D1oBBtouqRg1hBY4dAvuArKVrA7SC86EYUbm9dGsg.JPEG/20260312_122817.jpg?type=w773",
      "https://mblogvideo-phinf.pstatic.net/MjAyNjA0MDlfMTEz/MDAxNzc1NzE4NjQ0MzI5.q_zcO27tqdPOOBA6bBYzg6TKxR0A8jwdm5msEufCAjYg.Ub-L6fI--n9nCWwP5SiqovfRmrlHbXthTnRri4C2hX0g.GIF/20260329_152216.gif?type=mp4w800",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMjcy/MDAxNzc1NzA3Nzg1ODM1.yh01C777tra20hnKdFwTU76TlFnn_-tF88dMlz0g_Igg.5DWpxI4ODziOqsQ6IfKJ04nTUPoh-EzuZYwXzWMCJzgg.JPEG/KakaoTalk_20260329_173507463.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMzQg/MDAxNzc1NzA4MzE0MjE4.uNmckJb4PMZWIvH7h-_a9RC-l3uaxWNk_nkWj9uvPvUg.w8zJ4CJGwFXq7VvR5eiIv-k3jsIDEoMeSXwzsFIIDzwg.JPEG/KakaoTalk_20250623_093308691_01.jpg?type=w773"
    ],
    "fitImages": [
      "%EA%B8%B0%ED%8C%90",
      "(9)",
      "%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94",
      "%EC%84%A4%EB%AA%85%EC%83%81%EC%84%B8%ED%91%9C%EC%8B%9C",
      "%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-1.png?type=w773",
      "KakaoTalk_20260329_173507463.jpg?type=w773"
    ],
    "specs": [
      { "label": "전원", "value": "220V 단상" },
      { "label": "조작 방식", "value": "무선 리모콘" },
      { "label": "수신 거리", "value": "최대 50m" },
      { "label": "시스템 제어", "value": "PLC 방식" },
      { "label": "랩 부착", "value": "브러쉬 (웰딩 옵션)" },
      { "label": "기능", "value": "자동 필름 컷팅,부착 및 랩 클램프 기능" },
      { "label": "필름 연신율", "value": "최대 300%" },
      { "label": "턴테이블 직경", "value": "1,500Φ" },
      { "label": "최대 적재 중량", "value": "2,000kg" },
      { "label": "최대 랩핑 높이", "value": "2,100mm" },
      { "label": "랩핑기 규격", "value": "1,500W x 2,600L x 2,485H (mm)" },
      { "label": "기계 중량", "value": "약 600kg" }
    ],
    "performance": [
      "지게차로 쉽게 이동이 가능",
      "지게차 하차 없는 원스톱 작업",
      "작업 시간 30% 이상 단축",
      "장거리 수신으로 넓은 작업 반경 확보",
      "비상 정지 리모콘 기능 포함",
      "필름 연신 기능으로 가벼운 제품도 OK",
      "필름 기능 연신율 최대 300%",
      "제품 상단 자동 높이 감지 센서",
      "턴테이블, 헤드, 필름연신 조절 기능",
      "슬로우 스타트/스톱 기능"
    ],
    "mainFeatures": [
      { "title": "원거리 무선 제어", "description": "최대 50m 거리에서도 안정적인 조작이 가능하여 넓은 작업 현장에서도 효율적입니다." },
      { "title": "작업 효율 극대화", "description": "지게차 승하차 시간을 절약하여 기존 대비 약 30% 이상의 작업 속도 향상을 기대할 수 있습니다." },
      { "title": "안전성 확보", "description": "작업자가 기계와 일정 거리를 유지한 상태에서 조작하므로 안전 사고 예방에 효과적입니다." },
      { "title": "간편한 조작", "description": "직관적인 리모콘 버튼 구성으로 누구나 쉽게 숙달할 수 있으며, 비상 정지 기능이 포함되어 있어 위급 상황 시 즉각적인 대처가 가능합니다." }
    ],
    "detailedDescription": "리모콘 랩핑기는 무선 제어 기술을 도입하여 지게차 운전자가 차량에서 내리지 않고도 모든 과정을 제어할 수 있는 스마트 물류 장비입니다. \n\n지게차에서 내리고 타는 반복적인 동작을 없애주어 작업자의 피로도를 획기적으로 줄여주며, 포장 작업 시간을 단축시켜 전체적인 물류 흐름을 원활하게 합니다.",
    "advantages": [
      { "title": "효율성", "description": "반복적인 승하차 과정을 생략하여 작업 속도를 획기적으로 높입니다." },
      { "title": "안전성", "description": "원거리 조작으로 작업자와 기계 간의 안전 거리를 확보합니다." },
      { "title": "편의성", "description": "복잡한 설정 없이 리모콘 하나로 간편하게 시작과 정지가 가능합니다." }
    ],
    "customizedInfo": { "description": "표준 사양 외에도 고객사의 작업 환경에 맞춘 특수 제작이 가능합니다.", "items": [] },
    "recommendedIndustries": [
      "지게차 작업 비중이 높은 대형 물류 센터 및 창고",
      "1인 작업자가 지게차와 랩핑을 동시에 수행하는 현장",
      "작업 인력이 부족하여 1인 다역을 수행해야 하는 현장",
      "신속한 상하차 및 출고가 필요한 유통 기지",
      "작업 효율성과 안전을 중시하는 스마트 공장"
    ],
    "caution": "클램프 기능 , 랩 컷팅 및 부착이 공압시스템으로 에어컴프레셔가 구비되어있어야합니다. (별도 구매)",
    "videoUrl": "",
    "videoUrls": []
  },
  {
    "id": "turntable",
    "order": 5,
    "title": "원판 랩핑기",
    "subtitle": "Turntable Only",
    "description": "기본적인 턴테이블 회전 기능을 제공하는 가장 심플한 형태의 랩핑 보조 장비입니다.",
    "image": "https://postfiles.pstatic.net/MjAyNjAzMjZfMTMy/MDAxNzc0NDk5OTUyMDcw.ZAs77izLrrTRrMljPAKXM-EbK6OGzcdVSLtqRYqAD3Qg.60Xuf8S7uLb_b0723fTZljLAHpE4x-BDV9GXqD2gWjIg.JPEG/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94_(12).jpg?type=w773",
    "videoUrl": "https://www.youtube.com/embed/g1UTNacg33M",
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMjc0/MDAxNzc0NDk5MjE5OTIz.DAQ0EcfRFo_78NFv3ZlzYmOAklNaWA7OB7QtymvriLYg.YjwIbeeUnSSch6oIz-XBgK9ccDNevQ2MBHzx7XwQ220g.JPEG/KakaoTalk_20260110_152635219_02.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMjcg/MDAxNzc0NDk5MjE5OTMz.YTl3lBvhg9TrOeBs4fpQgA59K8b2a3-gBvR4nmdIi44g.1g9-L7JT0UVWTc4x8DlKwc878P1ZnPqoH5wls2kDWIwg.JPEG/KakaoTalk_20260110_152635219_03.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDhfNjAg/MDAxNzc1NjE5NzAyOTIw.nu3X_-1c2M4DcaFXmHp_JonAewDIzSurkjahcjbjvjAg.07eeolz5uhKqacUTgoMli_AVc5DFFuQZW6nnDgh0m00g.JPEG/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94_(16).jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjZfOTUg/MDAxNzc0NDk5MjE5OTIy.WJnXQEYLl9SWjWd3uz9BbJPfsqN-cnTNIX51n3vsK28g.p3dWcnkbZvJZr41WdoJTkanANdZcPbWFyj7jIUnuGgMg.JPEG/KakaoTalk_20260110_152635219_04.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjZfMTIx/MDAxNzc0NDk5MTc2NzY0.OLfra6MtWLPxoEgQb5ei0yYOfIpzJU8a77L2f2E-xcwg.ZIvY5ikwCTW1RI--Fp3_w_GUXPFUtkPMlLR2byKNcm0g.JPEG/KakaoTalk_20260109_124646049_03.jpg?type=w773"
    ],
    "fitImages": [
      "%EA%B8%B0%ED%8C%90",
      "(9)",
      "%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94",
      "%EC%84%A4%EB%AA%85%EC%83%81%EC%84%B8%ED%91%9C%EC%8B%9C"
    ],
    "specs": [
      { "label": "전원", "value": "220V 단상" },
      { "label": "턴테이블 직경", "value": "1,500Φ" },
      { "label": "회전 속도", "value": "0~12 RPM" },
      { "label": "최대 적재 중량", "value": "2,000kg" },
      { "label": "작동 방식", "value": "풋 스위치" }
    ],
    "performance": [
      "지게차로 쉽게 이동이 가능 \n(지게차만 있으면 상시 이동가능)",
      "인버터 제어로 부드러운 가감속\n(슬로우 스타트/스톱)",
      "턴테이블 속도 조절 기능 (0~12 RPM)",
      "풋 스위치 기본 제공으로 양손 자유로운 작업 가능",
      "컴팩트한 디자인으로 좁고 낮은 공간에서도 효율적 사용",
      "강력한 내구성으로 최대 2,000kg 적재 가능",
      "간단한 구조로 고장이 적고 유지보수가 매우 용이",
      "220V 단상 전원으로 어디서나 간편하게 연결 가능"
    ],
    "mainFeatures": [
      { "title": "컴팩트한 공간 효율", "description": "기둥이 없는 구조로 협소한 공간이나 층고가 낮은 작업장에서도 자유롭게 설치 및 사용이 가능합니다." },
      { "title": "풋 스위치 및 가성비", "description": "최소한의 투자로 수동 랩핑의 노동 강도를 크게 줄여주며, 발판 스위치로 양손 자유로운 작업이 가능합니다." },
      { "title": "강력한 내구성 및 안전", "description": "단순한 구조로 고장이 적고 장기간 안정적인 사용이 보장되며, 인버터 제어로 부드러운 가감속을 지원합니다." },
      { "title": "뛰어난 이동성", "description": "지게차 포켓이 내장되어 있어 필요에 따라 현장 내 어디든 신속하게 이동 및 설치가 가능합니다." }
    ],
    "detailedDescription": "원판 랩핑기는 기둥 없이 턴테이블만으로 구성된 랩핑 보조 장비입니다. 좁고 낮은 공간에서도 효율적으로 사용할 수 있으며, 지게차로 이동이 매우 자유롭습니다.\n\n인버터 제어를 통한 부드러운 회전과 풋 스위치를 이용한 간편한 조작으로, 작업자가 직접 돌 필요가 없어 수동 랩핑의 피로도를 \n획기적으로 줄여주는 경제적인 솔루션입니다.",
    "advantages": [],
    "customizedInfo": {
      "description": "표준 사양 외에도 고객사의 작업 환경에 맞춘 특수 제작이 가능합니다.",
      "items": [
        "턴테이블 직경: 최대 3,000 파이(Φ)까지 제작 가능"
      ]
    },
    "recommendedIndustries": []
  },
  {
    "id": "weight-scale",
    "order": 6,
    "title": "로드셀 랩핑기",
    "subtitle": "Weight Scale",
    "description": "랩핑과 동시에 파렛트의 무게를 측정할 수 있는 로드셀이 내장된 스마트 모델입니다.",
    "image": "https://postfiles.pstatic.net/MjAyNjAzMjRfNTAg/MDAxNzc0MzUzMDUzNDYy.Xpu0Xwi55qb1b3hLYkM4SUAyCCbOf9aVPXSVYUdGF0Ag.yFwJFY7ycz4XhteghoL2Pzd1qNMuLz9R-eqej6H0zdIg.JPEG/%EB%9E%A9%ED%95%91%EA%B8%B0_%EB%88%84%EB%81%BC_2.jpg?type=w773",
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjAzMjRfMjUz/MDAxNzc0MzUzMDU3MTcw.BWW8kAk3NO8vDXr54vrBqThYpozAl8m7GnEBZrcZKYMg.eTbqO0W1Gyzg6gx7Uv9Ti_Qfqld-mGXuplST4-WXJIUg.JPEG/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94_(9).jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjRfMTYg/MDAxNzc0MzUzMDcwMzgy.LmrwT8fxZti1Ltp9OTOYLV2fumcdBB7aOGfKw50-w-gg.KXG5UiQCkb-ZDpfhD3vmi7N9rvuq78pSm_3GvyR9VUEg.JPEG/%EC%A0%95%EB%A9%B4.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjRfMjkw/MDAxNzc0MzUzMDcwNDEw.gK0MWWacMBiraqAKFXW49x8xnpoQ0xtrLrPIkBzV9QEg.HTpHD3EQ6niFIMcyMWhLHEJ1jIJz02bX5DUU4q-6CPQg.JPEG/%EC%B8%A1%EB%A9%B4_2.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjRfODYg/MDAxNzc0MzUzNDg5ODk0.C21u6jkxfz348UvyLvFS-Rw3bdOze1d8AlBiTlnv0dgg.FgI-yRnKE9ACDKwMiVEWv7hFZurtDGWLOR6EM4o2WgYg.JPEG/%EC%B8%A1%EB%A9%B4_3.jpg?type=w773"
    ],
    "fitImages": [
      "%EA%B8%B0%ED%8C%90",
      "(9)",
      "%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94",
      "%EC%84%A4%EB%AA%85%EC%83%81%EC%84%B8%ED%91%9C%EC%8B%9C"
    ],
    "specs": [
      { "label": "전원", "value": "220V 단상" },
      { "label": "측정 범위", "value": "최대 2,000kg" },
      { "label": "측정 오차", "value": "±0.5kg" },
      { "label": "디스플레이", "value": "디지털 인디케이터" },
      { "label": "턴테이블 직경", "value": "1,500Φ" }
    ],
    "performance": [
      "별도 계근대 이동 없이 즉시 측정 (포장과 계량의 동시 수행)",
      "물류 데이터 관리 효율성 극대화 (입출고 중량 확인 용이)",
      "고정밀 로드셀 4개 장착으로 편심 하중에도 정확한 측정",
      "디지털 인디케이터를 통한 실시간 중량 표시",
      "영점 조절, 용기 중량 제거(Tare), 홀드 기능 탑재",
      "계량 데이터 프린터 출력 및 PC 연동 가능 (옵션)",
      "견고한 로드셀 보호 구조 설계로 충격 및 과하중 방지",
      "지게차 이동이 용이한 구조"
    ],
    "mainFeatures": [
      { "title": "원스톱 공정 최적화", "description": "랩핑과 계량 공정을 하나로 통합하여 불필요한 이동 시간을 제거하고 물류 흐름을 획기적으로 가속화합니다." },
      { "title": "고정밀 로드셀 계량", "description": "4개의 독립된 고정밀 센서가 하중을 균등하게 감지하여, 적재물이 치우쳐도 정확한 중량을 산출합니다." },
      { "title": "스마트 데이터 관리", "description": "디지털 인디케이터를 통해 중량을 실시간 확인하고 기록할 수 있어 재고 및 출하 관리에 매우 용이합니다." },
      { "title": "내구성 및 안정성", "description": "중량 측정 센서를 외부 충격으로부터 보호하는 특수 설계로 장기간 안정적인 정밀도를 유지합니다." }
    ],
    "detailedDescription": "로드셀 랩핑기는 턴테이블 하단에 4개의 고정밀 로드셀(Load Cell)을 장착하여, 파렛트 랩핑 작업과 동시에 적재물의 무게를 실시간으로 측정할 수 있는 스마트 물류 솔루션입니다.\n\n기존에는 포장 후 별도의 계근대로 이동하여 무게를 측정해야 했으나, 본 장비를 사용하면 이동 동선을 획기적으로 줄일 수 있어 작업 효율이 대폭 향상됩니다. 특히 정확한 중량 확인이 필요한 수출용 화물이나 원자재 관리 현장에서 필수적인 장비입니다.",
    "advantages": [],
    "recommendedIndustries": [
      "정확한 중량 확인이 필요한 수출 물류 업체",
      "원자재 입출고 관리가 엄격한 제조 공장",
      "제품별 중량 데이터 기록이 필요한 식품 및 화학 산업",
      "과적 방지 및 운송 비용 최적화가 필요한 유통 센터"
    ],
    "customizedInfo": {
      "description": "표준 사양 외에도 고객사의 작업 환경에 맞춘 특수 제작이 가능합니다.",
      "items": [
        "기둥 높이: 최대 3,200mm까지 제작 가능",
        "턴테이블 직경: 최대 3,000 파이(Φ)까지 제작 가능"
      ]
    }
  }
];

export const fetchPalletWrappers = async (): Promise<PalletWrapper[]> => {
  try {
    const wrappersQuery = query(collection(db, 'palletWrappers'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(wrappersQuery);
    const wrappers = querySnapshot.docs.map(doc => doc.data() as PalletWrapper);
    
    if (wrappers.length === 0) {
      return FALLBACK_WRAPPERS;
    }
    
    return wrappers;
  } catch (error) {
    console.error("Firestore fetch error, using fallback:", error);
    return FALLBACK_WRAPPERS;
  }
};

export const savePalletWrappers = async (data: PalletWrapper[]): Promise<void> => {
  const path = 'palletWrappers';
  try {
    const batch = writeBatch(db);
    data.forEach((item) => {
      const docRef = doc(db, 'palletWrappers', item.id);
      batch.set(docRef, item);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const palletWrappersData: PalletWrapper[] = FALLBACK_WRAPPERS;
