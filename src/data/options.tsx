import { Ruler, Eye, Shield, PlusCircle, Settings, Zap, Lock, Square } from 'lucide-react';
import { collection, getDocs, setDoc, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export interface OptionItem {
  id: string;
  title: string;
  description: string;
  icon: string | React.ReactNode;
  image: string;
  gallery?: string[];
  details: string[];
  advantages: { title: string; description: string }[];
  order?: number;
}

export const DEFAULT_OPTIONS: OptionItem[] = [
  {
    "id": "ramp",
    "title": "경사판 (Ramp)",
    "description": "핸드 자키를 사용하여 파렛트를 턴테이블 위로 올릴 때 필요한 경사로입니다.\n(핸드 자키 사용 시 필수 사항입니다.)",
    "icon": "Ruler",
    "image": "https://postfiles.pstatic.net/MjAyNjAzMjdfMTE4/MDAxNzc0NTkzNTk1NTA2.VPrKnPDMoleBvhG8tYvPP9pFg1IUJxTVFc7r5KMy8v0g.UFFjhs3RrCpQSS6Mv7aDME0H6w5RR0mxJyDCZzuWGfog.PNG/%EA%B2%BD%EC%82%AC%ED%8C%90.png?type=w773",
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjAzMjdfODEg/MDAxNzc0NTkzNTk1NDc5.Qv6kDSGCa6TXu7_kDLduDfgUKfzbAd0Ej79SHNqIWn8g.TTkCQkUrYscbcWS2_npfXKztiIRptu9eh0Awwtw4M48g.JPEG/KakaoTalk_20250813_120904859_03.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjdfMTg2/MDAxNzc0NTkzNTc2MjM4.aTY3o0i_3m1coyHAC9y5UUv0nodGyI3npOWKMq2HLXkg.ZMiEWOtggAnl0rFg_78VZm366wWJERVfLfdUlut6-6Ug.JPEG/%ED%95%B8%EB%93%A4%EC%9E%90%ED%82%A4.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjdfMTcg/MDAxNzc0NTkzNTk1NDYz.VPmyLL3OvD5EH0O1GtCT5INV1xzcFDiKjsvKTkwm2f0g.Bk1qYZ4OoltByvDVCTbnLKt0nG5m9Smf2ui7zZR0HdQg.JPEG/KakaoTalk_20250729_165617251_01.jpg?type=w773"
    ],
    "details": [
      "핸드 자키 전용 진입로",
      "강력한 내구성의 철제 프레임",
      "완만하게 올라갈 수 있도록 제작"
    ],
    "advantages": [
      {
        "title": "편의성",
        "description": "지게차 없이도 핸드 자키만으로 파렛트 상차가 가능합니다."
      },
      {
        "title": "안전성",
        "description": "완만한 경사로 설계로 무거운 적재물도 안전하게 이동시킵니다."
      }
    ],
    "order": 0
  },
  {
    "id": "color-sensor",
    "title": "칼라센서 (Color Sensor)",
    "description": "검정색 랩, 제품 사용 시에도 제품의 높이를 정확하게 감지하여 오작동을 방지합니다.",
    "icon": "Eye",
    "image": "https://postfiles.pstatic.net/MjAyNjAzMjdfMjEg/MDAxNzc0NTkzNTgzMDcy.SyZWO-Vjtg7Qp5QTLBJPsQ0syNPpLkNDuugstWwBW20g.8w-jhsW9hED49OT8PNohGBoPp7kR9PjiYx7rjOaU-Nkg.JPEG/%EC%B9%BC%EB%9D%BC%EC%84%BC%EC%84%9C_2.jpg?type=w773",
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMTQ4/MDAxNzc0Nzc1MjEyNzYy.-FMcipkV6rRimho3u_sYUeGjSw4QHoygG0C7OgCjfjAg.FsXat1TWZdEfu3QG1B2ExKrESD0gmaiQfpGQRCbcnl8g.PNG/%EC%B9%BC%EB%9D%BC%EC%84%BC%EC%84%9C.png?type=w773"
    ],
    "details": [
      "고성능 광전 센서 탑재",
      "검정색 제품 완벽 감지"
    ],
    "advantages": [
      {
        "title": "정확도",
        "description": "투명한 제품뿐만 아니라 모든 색상의 제품에서 정확한 높이 감지가 가능합니다."
      },
      {
        "title": "효율성",
        "description": "센서 오작동으로 인한 작업 중단을 방지하여 생산성을 높입니다."
      }
    ],
    "order": 1
  },
  {
    "id": "safety-fence",
    "title": "안전펜스 (Safety Fence)",
    "description": "기계 작동 범위 내 작업자의 출입을 제한하여 안전 사고를 예방하는 보호 울타리 및 안전 센서 시스템입니다.",
    "icon": "Shield",
    "image": "https://postfiles.pstatic.net/MjAyNjAzMjlfMjUz/MDAxNzc0Nzc1NDIzNTY4.o-g4k6eKxK4Cr3iGoId0QrrOAf-JWCech6b1nGy2zFcg.zI3b52_KvZRNU5wsHHXP8SOTfh7bYeya4W9lfH-sH5sg.JPEG/KakaoTalk_20250623_093308691.jpg?type=w773",
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMjIw/MDAxNzc0Nzc1MzcxNzYy.MsdmRoaq7tm-V1z9mclk5txGA-Mp-eIs6uFymfokXiQg.41tld0YZyodkJ1bK7eXZwNQ0SZIQ_B_Yn5zdOa7u42cg.JPEG/%EC%95%88%EC%A0%84%ED%8E%9C%EC%8A%A4_%ED%98%84%EC%9E%A5%EC%82%AC%EC%A7%84.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMjgx/MDAxNzc0Nzc1NTM4NzAy.HvZlvgRVGg1e52f4rYyA-lJc66lHrPdu2n_l5M21VjAg.A0IyViNdLiU-bu6vaXBDFIjcyLpXVTFQv4vAsZg2zPIg.JPEG/%EC%95%88%EC%A0%84%ED%8E%9C%EC%8A%A4_%EC%8A%A4%EC%9C%84%EC%B9%98.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMTE0/MDAxNzc0Nzc1MzcxNzUw.L83jSVKaJJ4B9HJevLxBZP9cGmxXhRZ_X7E0Uh7Fv_Qg.VxWchdldCorZdvAgfUyibJWf5d_gJilLJWp1sKBtN0kg.JPEG/%EC%95%88%EC%A0%84%ED%8E%9C%EC%8A%A4.jpg?type=w773"
    ],
    "details": [
      "산업용 안전 규격 준수",
      "출입문 안전 스위치 연동",
      "시인성 높은 옐로우 컬러 도장",
      "현장 레이아웃 맞춤형 설치"
    ],
    "advantages": [
      {
        "title": "안전 확보",
        "description": "회전하는 기계로부터 작업자를 격리하여 사고를 예방합니다."
      },
      {
        "title": "법규 준수",
        "description": "산업안전보건법에 따른 안전 조치를 완벽하게 이행할 수 있습니다."
      }
    ],
    "order": 2
  },
  {
    "id": "tiltable-mast",
    "title": "접지형 랩핑기 (Tiltable Mast)",
    "description": "공장 입구가 낮아 기계 진입이 어려운 환경을 위해 기둥(Mast)을 눕혀서 높이를 낮춘 모델입니다. 설치 장소 이동 후 다시 기둥을 세워 정상적으로 사용할 수 있습니다.",
    "icon": "Settings",
    "image": "https://postfiles.pstatic.net/MjAyNjAzMjlfMjIx/MDAxNzc0Nzg2NTc4MDE4.sG7anbqK8yf4rpgSbUWskZ6u1BeQoLfuh6F044rVsm0g.WAFTFXL_BJUJbDur6H6S4_OKygocDYTLipwMRvaPElwg.JPEG/KakaoTalk_20250605_124338312.jpg?type=w773",
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMjA5/MDAxNzc0Nzg2NTc3OTg0.CywbsDG7WBKYe51nRvgAVoCiQMkowZ1n-dR0Sy47It8g.VrGui4n3phim2Q6kdm8gGoqLo7ETo5rydcx_JYwR9Qsg.JPEG/KakaoTalk_20250605_124338312_01.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjAzMjlfMjUx/MDAxNzc0Nzg2NTc3OTky.KubMLTafBXycktRkmRW8SR4NrUiXTrNwMR9RaIF2wqYg.yVlxBi61k5HiCW2NJyjTIhlpHpSv8NjMBzuQVyfL1igg.JPEG/KakaoTalk_20250728_131258608_12.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDdfMjIw/MDAxNzc1NTcxOTY4ODgz.i9L9s5VLmD6UXUm_bVZijxAGL8HDaKloD_6ZyEvU7XQg.lmmLV9uoD-BDfzxLx2Ifyv156W1saFCWE9VxiIeV_Msg.JPEG/KakaoTalk_20260407_232126063_02.jpg?type=w773"
    ],
    "details": [
      "기둥(Mast) 틸팅 시스템 적용",
      "낮은 출입구 통과 가능",
      "설치 후 기존 모델과 동일한 성능",
      "특수 환경 맞춤형 설계"
    ],
    "advantages": [
      {
        "title": "공간 제약 극복",
        "description": "공장 내부 층고는 높지만 입구가 낮은 경우, 기계 높이를 낮게 제작할 필요 없이 진입이 가능합니다."
      },
      {
        "title": "유연한 설치",
        "description": "기계를 눕혀서 이동할 수 있어 다양한 현장 상황에 유연하게 대응할 수 있습니다."
      }
    ],
    "order": 3
  },
  {
    "id": "square-turntable",
    "title": "사각턴테이블 원판 (Square Turntable)",
    "description": "파렛트의 크기가 크거나 비정형인 제품을 랩핑할 때 안정적인 회전을 돕는 사각형 형태의 턴테이블 원판입니다.",
    "icon": "Square",
    "image": "https://postfiles.pstatic.net/MjAyNjA0MDJfMjMy/MDAxNzc1MTI5MDY5ODM3.OgkUBmXRoQCzH4fTDfr72EFsDc97nYgV-OmGHPnr4AUg.t6qze7OUmTmmyN5FHOITqA5pHNnIQDow1hQQIiPw2VYg.JPEG/KakaoTalk_20260324_215746904_02.jpg?type=w773",
    "gallery": [
      "https://postfiles.pstatic.net/MjAyNjA0MDJfMjMz/MDAxNzc1MTI5MDY5ODQ5.o-QaRce0-z4tSvKhKjQDwo93jLDymH9pYkLMLOQgjYAg.BfRK7mDXm0RqP9O24MJWZ5VdZ75pYRIoqLsFviyswzQg.JPEG/KakaoTalk_20260324_215746904.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDJfMTMg/MDAxNzc1MTI5MDY5ODUy.C9myVUXaMVjIBLx6zoXE90WzV2CdZtHMX9FTDgEcCpQg.WiXOjGvuse5knJtcmZkQ1sPvPU0bqWZKguLkGvv8J7Eg.JPEG/KakaoTalk_20260324_215746904_01.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDJfMTMg/MDAxNzc1MTI5Mzg0MDMw.PXTSc9GGfJkMsUInqO7Aria9_HIQmfewC4YEl-cQJdIg.HQdJl1-WlgCn4nY4cfAnXWN_IXXget4Z6GPDDbsknuYg.JPEG/KakaoTalk_20260402_202828124.jpg?type=w773"
    ],
    "details": [
      "대형 파렛트 대응 가능",
      "견고한 강판 구조",
      "안정적인 회전 밸런스",
      "맞춤형 사이즈 제작 가능"
    ],
    "advantages": [
      {
        "title": "안정성",
        "description": "넓은 면적의 제품도 흔들림 없이 안정적으로 랩핑할 수 있습니다."
      },
      {
        "title": "범용성",
        "description": "다양한 크기와 형태의 적재물에 유연하게 대응이 가능합니다."
      }
    ],
    "order": 4
  }
];

export const getIcon = (iconName: string | React.ReactNode) => {
  if (typeof iconName !== 'string') return iconName;
  
  switch (iconName) {
    case 'Ruler': return <Ruler size={24} />;
    case 'Eye': return <Eye size={24} />;
    case 'Shield': return <Shield size={24} />;
    case 'PlusCircle': return <PlusCircle size={24} />;
    case 'Settings': return <Settings size={24} />;
    case 'Zap': return <Zap size={24} />;
    case 'Lock': return <Lock size={24} />;
    case 'Square': return <Square size={24} />;
    default: return <Settings size={24} />;
  }
};

export const fetchOptions = async (): Promise<OptionItem[]> => {
  try {
    const q = query(collection(db, 'options'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const options = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as OptionItem[];
    
    // If Firestore is empty, return default data
    if (options.length === 0) {
      console.log('Firestore is empty, using default options');
      return DEFAULT_OPTIONS;
    }
    
    // Merge to ensure we have all default options even if cloud is missing some
    return DEFAULT_OPTIONS.map(defaultOption => {
      const cloudOption = options.find(o => o.id === defaultOption.id);
      return cloudOption ? { ...defaultOption, ...cloudOption } : defaultOption;
    });
  } catch (error) {
    console.error('Firestore fetch error, falling back to defaults:', error);
    return DEFAULT_OPTIONS;
  }
};

export const saveOptions = async (data: OptionItem[]): Promise<void> => {
  try {
    const promises = data.map((option, index) => {
      const optionData = { ...option, order: index };
      // Remove React nodes before saving to Firestore
      if (typeof optionData.icon !== 'string') {
        optionData.icon = 'Settings';
      }
      return setDoc(doc(db, 'options', option.id), optionData);
    });
    await Promise.all(promises);
    
    // Sync to API
    fetch("/api/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'options');
    throw error;
  }
};

export const deleteOption = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'options', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `options/${id}`);
    throw error;
  }
};

export const optionsData: OptionItem[] = [];
