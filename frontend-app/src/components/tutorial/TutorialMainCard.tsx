/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export default function TutorialMainCard({ step, title, image, items }: Props) {
  return (
    <div css={cardStyle}>
      <div css={imageWrapperStyle}>
        <img src={image} alt={title} css={imageStyle} />
      </div>

      <div css={contentBoxStyle}>
        <div css={headerStyle}>
          <div css={stepCircleStyle}>{step}</div>
          <h3 css={titleStyle}>{title}</h3>
        </div>
        <ul css={listStyle}>
          {items.map((text, index) => (
            <li key={index} css={listItemStyle}>
              <span css={checkIcon}>✔</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface Props {
  step: number;
  title: string;
  image: string;
  items: string[];
}

const cardStyle = css`
  border-radius: 1rem;
  overflow: hidden;
  border: 2px solid var(--color-gray-100);
`;

const imageWrapperStyle = css`
  background-color: var(--color-gray-100);
  padding: 1.8rem;
  display: flex;
  justify-content: center;
`;

const imageStyle = css`
  height: 180px;

  @media (max-width: 1200px) {
    height: 160px;
  }

  @media (max-width: 900px) {
    height: 140px;
  }

  @media (max-width: 600px) {
    height: 120px;
  }
`;

const contentBoxStyle = css`
  background-color: white;
  padding: 2rem;
  text-align: left;

  @media (max-width: 900px) {
    padding: 1.5rem;
  }

  @media (max-width: 600px) {
    padding: 1.2rem;
  }
`;

const headerStyle = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const stepCircleStyle = css`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-family: 'NanumSquareEB';
  color: var(--color-gray-600);

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

const titleStyle = css`
  font-size: 24px;
  font-family: 'NanumSquareEB';
  color: black;

  @media (max-width: 900px) {
    font-size: 22px;
  }

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const listStyle = css`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const listItemStyle = css`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  font-size: 16px;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    font-size: 15px;
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const checkIcon = css`
  color: black;
  font-size: 16px;
  margin-top: 2px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;