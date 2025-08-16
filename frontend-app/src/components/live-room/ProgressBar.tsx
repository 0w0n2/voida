/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

interface ProgressBarProps {
  percent: number;  // 0~100
  height?: number;  // px
  backgroundColor?: string; // 배경색
  barGradient?: string; // 진행 바 색
  position?: 'absolute' | 'relative'; // 위치
  bottom?: number; // position absolute일 때 바닥에서 거리
}

export default function ProgressBar({
  percent,
  height = 6,
  backgroundColor = 'rgba(255,255,255,0.3)',
  barGradient = 'linear-gradient(to right, #3182f6, #a162e5)',
  position = 'absolute',
  bottom = 0
}: ProgressBarProps) {
  return (
    <div css={wrapperStyle(height, backgroundColor, position, bottom)}>
      <div css={barStyle(percent, barGradient)} />
    </div>
  );
}

const wrapperStyle = (
  height: number,
  background: string,
  position: 'absolute' | 'relative',
  bottom: number
) => css`
  position: ${position};
  bottom: ${bottom}px;
  left: 0;
  width: 100%;
  height: ${height}px;
  background: ${background};
  border-radius: ${height}px;
  overflow: hidden;
  z-index: 2;
`;

const barStyle = (percent: number, gradient: string) => css`
  height: 100%;
  width: ${percent}%;
  background: ${gradient};
  transition: width 0.1s linear;
`;
