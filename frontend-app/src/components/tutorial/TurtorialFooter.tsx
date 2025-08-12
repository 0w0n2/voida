/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react'; 
import { useNavigate } from 'react-router-dom';

interface TutorialFooterProps {
  items: string;
  customCss?: SerializedStyles;
}

export default function TutorialFooter({ items, customCss }: TutorialFooterProps) {
  const navigate = useNavigate();

  return (
    <div css={[footerWrapperStyle, customCss]}>
      <button css={skipButtonStyle} onClick={() => navigate('/main')}>
        {items}
      </button>
    </div>
  );
}

const footerWrapperStyle = css`
  display: flex;
  justify-content: right;

  @media (max-width: 1400px) {
    margin-right: 8rem;
  }
  @media (max-width: 1200px) {
    margin-right: 6rem;
  }
  @media (max-width: 900px) {
    margin-right: 3rem;
  }
  @media (max-width: 600px) {
    justify-content: center;
    margin-right: 0;
    margin-top: 2rem;
  }
`;

const buttonStyle = css`
  padding: 0.75rem 2.5rem;
  border: none;
  border-radius: 3rem;
  font-weight: 600;
  font-size: 1rem;
  font-family: 'NanumSquareB';

  @media (max-width: 600px) {
    width: 80%;
    max-width: 280px;
    padding: 0.75rem 2rem;
    font-size: 0.95rem;
  }
`;

const skipButtonStyle = css`
  ${buttonStyle};
  background-color: var(--color-gray-400);
  color: var(--color-text-white);
  cursor: pointer;

  &:hover {
    background-color: var(--color-gray-500);
  }
`;