import { useParams } from 'react-router-dom';

/** 투명 배경 유지 */
const pageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'transparent',
  color: '#fff',
  pointerEvents: 'none', // 기본은 클릭통과
};

export default function OverlayPage() {
  const { roomId } = useParams();
  return (
    <div style={pageStyle}>
      <h3> 라이브 자막 / 알림…</h3>
    </div>
  );
}
