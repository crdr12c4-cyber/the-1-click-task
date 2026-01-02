// 눈이 편한 저채도 파스텔 색상 팔레트
export const Colors = {
  // 메인 컬러
  primary: '#6B9DFC',      // 부드러운 파랑
  primaryLight: '#E8F0FE', // 연한 파랑 배경
  primaryDark: '#4A7BD4',  // 진한 파랑
  
  // 배경 컬러
  background: '#F8FAFC',   // 아주 연한 회색빛 흰색
  surface: '#FFFFFF',      // 카드 배경
  surfaceVariant: '#F1F5F9', // 섹션 구분 배경
  
  // 텍스트 컬러
  textPrimary: '#1E293B',  // 메인 텍스트 (진한 회색)
  textSecondary: '#64748B', // 보조 텍스트
  textTertiary: '#94A3B8',  // 비활성 텍스트
  textOnPrimary: '#FFFFFF', // 프라이머리 버튼 위 텍스트
  
  // 태그 컬러 (파스텔톤)
  tagColors: [
    '#FFE4E6', // 연분홍
    '#FEF3C7', // 연노랑
    '#D1FAE5', // 연민트
    '#E0E7FF', // 연보라
    '#FED7AA', // 연주황
    '#CFFAFE', // 연하늘
    '#F3E8FF', // 연라벤더
    '#ECFCCB', // 연연두
  ],
  tagTextColors: [
    '#BE123C', // 분홍 텍스트
    '#A16207', // 노랑 텍스트
    '#047857', // 민트 텍스트
    '#4338CA', // 보라 텍스트
    '#C2410C', // 주황 텍스트
    '#0E7490', // 하늘 텍스트
    '#7C3AED', // 라벤더 텍스트
    '#4D7C0F', // 연두 텍스트
  ],
  
  // 상태 컬러
  success: '#10B981',      // 완료 (민트 그린)
  successLight: '#D1FAE5',
  warning: '#F59E0B',      // 경고 (부드러운 주황)
  warningLight: '#FEF3C7',
  error: '#EF4444',        // 에러 (부드러운 빨강)
  errorLight: '#FEE2E2',
  
  // 구분선/테두리
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // 기타
  disabled: '#CBD5E1',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};
