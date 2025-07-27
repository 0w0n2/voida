/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

export default function TutorialFooter({ items }: { items: string }) {
  const navigate = useNavigate();

  return (
    <div css={footerWrapperStyle}>
      <button css={skipButtonStyle} onClick={() => navigate('/rooms')}>
        {items}
      </button>
    </div>
  );
}

const footerWrapperStyle = css`
  display: flex;
  justify-content: right;
  margin-top: 0.8rem;
  margin-right: 20rem;
`;

const buttonStyle = css`
  padding: 0.75rem 2.5rem;
  border: none;
  border-radius: 3rem;
  font-weight: 600;
  font-size: 1rem;
  font-family: 'NanumSquareB';
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
