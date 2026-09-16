import { Ruler, Eye, Shield, PlusCircle, Settings, Zap, Lock, Square, Radio } from 'lucide-react';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface OptionItem {
  id: string;
  title: string;
  description: string;
  icon: string | React.ReactNode;
  image: string;
  gallery?: string[];
  details: string[];
  advantages: { title: string; description: string }[];
  processTitle?: string;
  processSteps?: ProcessStep[];
}

export const getIcon = (iconName: string | React.ReactNode) => {
  if (typeof iconName !== 'string') return iconName;
  
  switch (iconName) {
    case 'Radio': return <Radio size={24} />;
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

export const FALLBACK_OPTIONS: OptionItem[] = [
  {
    "id": "remote-control",
    "title": "리모컨 (Remote Control)",
    "description": "지게차 승하차 횟수를 대폭 줄이고, 랩을 직접 묶거나 칼로 자르는 번거로운 수작업을 원판 랩 고정 장치와 무선 리모컨으로 해결합니다.",
    "icon": "Radio",
    "image": "https://postfiles.pstatic.net/MjAyNjA0MDlfMjg2/MDAxNzc1NzA3NjEyMjc2.D1i1s7IwkcgR937TOLkOgoOQf0v_HN-GW0DniabQy0sg.ZEs9Wu7pwNON729njmvz2sSA7RtTSmNGuRt-HWHDTT8g.JPEG/%EB%A6%AC%EB%AA%A8%EC%BB%A8%EB%9E%A9%ED%95%91%EA%B8%B0_%EB%88%84%EB%81%BC.jpg?type=w773",
    "gallery": [
      "https://mblogvideo-phinf.pstatic.net/MjAyNjA0MDlfMTEz/MDAxNzc1NzE4NjQ0MzI5.q_zcO27tqdPOOBA6bBYzg6TKxR0A8jwdm5msEufCAjYg.Ub-L6fI--n9nCWwP5SiqovfRmrlHbXthTnRri4C2hX0g.GIF/20260329_152216.gif?type=mp4w800",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMTU3/MDAxNzc1NzA3NjUzMDEx.R8uADSSkmH2HbELOfzL63zn9iP8ebhsS5nFQDMKi_s4g.Xe4ivI_JaTd6BGUed-LGIOa0s_KT61Y3VVcGUPnQK2Ag.JPEG/20260329_141745.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMTMz/MDAxNzc1NzA3NjYyMjg4.ugCsaBokfdHGhq4TZTRiK0pdiDOWpllm7jI3IkvUoCAg.lwWmmM93jN5qUjR_qlSWNRNLZE2awGe6wMGSk1qsP6Eg.JPEG/20260329_141825.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMTky/MDAxNzc1NzA3NzM0NzY1.QlaUHAOENXGpCXrlgu5vkdTweCCXknJZm8qAahM5A8Qg.5dYohGqOWUuGxVlHsur85Dxti7XgD0d-ogwV3Lsf94Yg.JPEG/20260312_122823.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfMTMg/MDAxNzc1NzA3Njk0ODk1.m_qrq4GLY3EGeCckFnSxjOmKEOQLM8Jr1J-zSw-ViGkg.nF3UH9XgY9StLtFuzFeoRdPfqKeHIDChZVq610237BAg.JPEG/20260329_141806.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA0MDlfNDUg/MDAxNzc1NzA3Njk3ODgy.4M9-BEQdabsU4Lzw2Ay5ODr6Y9QTmt8YTQx145shetQg.0IYiDPYNmmedgOgeEIBslNILS3sYKuZQFxWpTNQGXMwg.JPEG/20260329_141918.jpg?type=w773"
    ],
    "details": [
      "지게차 승하차 횟수 감소",
      "원판 랩 고정 장치 적용",
      "무선 리모컨으로 즉시 랩핑",
      "간편한 랩 절단 장치",
      "작업 동선 단축 및 피로도 감소",
      "최대 50m 무선 송신 가능"
    ],
    "advantages": [
      {
        "title": "승하차 및 피로도 감소",
        "description": "랩핑 때마다 매번 지게차를 오르내리던 번거로움을 줄여 작업자의 피로도를 획기적으로 낮춥니다."
      },
      {
        "title": "안전 절단 & 원터치 시작",
        "description": "랩을 직접 묶고 칼로 자르는 위험한 수작업 대신, 전용 고정 장치와 절단기로 안전하고 빠르게 작업합니다."
      }
    ],
    "processTitle": "기본형 랩핑기 작업 과정 (리모컨 적용)",
    "processSteps": [
      {
        "step": 1,
        "title": "① 파렛트 적재",
        "description": "지게차로 제품이 적재된 파렛트를 랩핑기 원판 위에 올립니다."
      },
      {
        "step": 2,
        "title": "② 랩 고정 장치",
        "description": "원판에 설치된 랩 고정 장치가 랩을 잡아주기 때문에, 작업자가 랩을 잡기 위해 지게차에서 내릴 필요가 없습니다."
      },
      {
        "step": 3,
        "title": "③ 리모컨으로 랩핑 시작",
        "description": "지게차에 탄 상태에서 리모컨 운전 버튼만 누르면 랩핑이 시작됩니다."
      },
      {
        "step": 4,
        "title": "④ 자동 랩핑",
        "description": "랩핑기가 자동으로 회전하며 파렛트를 안정적으로 랩핑합니다."
      },
      {
        "step": 5,
        "title": "⑤ 랩핑 완료 후 간편하게 절단",
        "description": "랩핑이 완료되면 원판과 기둥 사이에 설치된 소형 랩 절단 장치를 이용해 랩을 간편하게 절단합니다."
      },
      {
        "step": 6,
        "title": "⑥ 다음 작업 준비",
        "description": "절단된 랩은 파렛트에 손으로 간단히 마무리하고, 랩걸이에 있는 랩을 다시 원판의 랩 고정 장치에 걸어줍니다."
      },
      {
        "step": 7,
        "title": "⑦ 다음 파렛트도 바로 작업",
        "description": "다음 파렛트를 올린 후 다시 지게차에서 내리지 않고 리모컨 버튼만 눌러 랩핑을 시작할 수 있습니다."
      }
    ]
  },
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
    ]
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
        "description": "검은색 제품뿐만 아니라 모든 색상의 제품에서 정확한 높이 감지가 가능합니다."
      },
      {
        "title": "효율성",
        "description": "센서 오작동으로 인한 작업 중단을 방지하여 생산성을 높입니다."
      }
    ]
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
    ]
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
    ]
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
    ]
  }
];

export const fetchOptions = async (): Promise<OptionItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'options'));
    let options = querySnapshot.docs.map(doc => doc.data() as OptionItem);
    
    if (options.length === 0) {
      return FALLBACK_OPTIONS;
    }
    
    const remoteFallback = FALLBACK_OPTIONS.find(o => o.id === 'remote-control')!;
    const remoteIdx = options.findIndex(o => o.id === 'remote-control' || o.id === 'remote');

    if (remoteIdx === -1) {
      // Remote option doesn't exist in Firestore collection, prepend fallback
      options = [remoteFallback, ...options];
    } else {
      // If remote option exists in Firestore, update it with the latest 7-step process & copy, and put it first
      const existing = options[remoteIdx];
      const mergedRemote: OptionItem = {
        ...existing,
        ...remoteFallback,
        image: existing.image || remoteFallback.image,
        gallery: existing.gallery && existing.gallery.length > 0 ? existing.gallery : remoteFallback.gallery,
        processTitle: remoteFallback.processTitle,
        processSteps: remoteFallback.processSteps,
        description: remoteFallback.description,
        details: remoteFallback.details,
        advantages: remoteFallback.advantages
      };
      options.splice(remoteIdx, 1);
      options.unshift(mergedRemote);
    }
    
    return options;
  } catch (error) {
    console.error("Firestore fetch error, using fallback:", error);
    return FALLBACK_OPTIONS;
  }
};

export const saveOptions = async (data: OptionItem[]): Promise<void> => {
  const path = 'options';
  try {
    const batch = writeBatch(db);
    data.forEach((item) => {
      const docRef = doc(db, 'options', item.id);
      batch.set(docRef, item);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const optionsData: OptionItem[] = FALLBACK_OPTIONS;
