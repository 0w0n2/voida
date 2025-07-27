/** @jsxImportSource @emotion/react */
import React from 'react';
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
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
`;

const imageWrapperStyle = css`
  background-color: var(--color-gray-100);
  padding: 2rem;
  display: flex;
  justify-content: center;
`;

const imageStyle = css`
  height: 180px;
`;

const contentBoxStyle = css`
  background-color: white;
  padding: 2.5rem 2rem;
  text-align: left;
`;

const headerStyle = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
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
`;

const titleStyle = css`
  font-size: 24px;
  font-family: 'NanumSquareEB';
  color: black;
  margin-bottom: 10px;
`;

const listStyle = css`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const listItemStyle = css`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 16px;
  color: ;
  margin-bottom: 0.5rem;
`;

const checkIcon = css`
  color: black;
  font-size: 16px;
  margin-top: 2px;
`;
