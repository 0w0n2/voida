/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";

export default function TutorialMainCard({ step, title, image, items }: Props) {
  return (
    <div css={cardStyle}>
      <div css={stepStyle}>{step}</div>
      <img src={image} alt={title} css={imageStyle} />
      <h3 css={titleStyle}>{title}</h3>
      <ul css={listStyle}>
        {items.map((text, index) => (
          <li key={index}>{text}</li>
        ))}
      </ul>
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
  background: #F4F4F5;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  height: 400px;
  width: 300px;
`;

const imageStyle = css`
  height: 64px;
  margin: 0 auto 1rem;
`;

const titleStyle = css`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const stepStyle = css`
  font-size: 0.875rem;
  color: #999;
  margin-bottom: 0.25rem;
`;

const listStyle = css`
  font-size: 0.875rem;
  color: #666;
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 1.5;
`;
