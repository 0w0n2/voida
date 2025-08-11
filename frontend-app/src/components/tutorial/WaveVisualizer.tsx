/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useMemo } from 'react';

interface Props {
  bars: number[];
}

export default function WaveVisualizer({ bars }: Props) {
  const avg = bars.reduce((a, b) => a + b, 0) / (bars.length || 1);

  const color = useMemo(() => {
    if (avg >= 1.5) return '#8a2be2';   
    if (avg >= 0.1) return '#1677ff'; 
    return '#ccc';                
  }, [avg]);

  return   <div
    css={waveWrapper}
    style={{ '--wave-color': color } as React.CSSProperties}
  />;
}

const waveWrapper = css`
  position: relative;
  width: 100%;
  height: 100px;
  margin-top: 100px;
  --wave-color: #ccc;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 6px;
    border-radius: 10px;
    background-image: linear-gradient(
      to right,
      var(--wave-color) 0 50%,
      transparent 50% 100%
    );
    background-size: 15px 4px;
    transform: translateY(-50%);
    transition: opacity 0.6s ease;
  }

  &::before {
    opacity: 1;
  }
  &::after {
    opacity: 0;
  }

  transition: --wave-color 0s;
`;
