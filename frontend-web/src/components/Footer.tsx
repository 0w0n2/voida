/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Gitlab from '@/assets/icons/gitlab.png';
import Notion from '@/assets/icons/notion.png';

const bp = {
  tablet: '@media (min-width: 768px)',
};

const footerStyle = css`
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 32px 24px;
  font-size: 14px;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${bp.tablet} {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 50px 250px;
  }
`;

const teamStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${bp.tablet} {
    flex-direction: row;
    gap: 80px;
  }
`;

const sectionTitle = css`
  font-family: 'NanumSquareB';
  font-size: 18px;
  color: #000;
  margin-bottom: 16px;
`;

const memberRow = css`
  display: flex;
  gap: 30px;
  font-family: 'NanumSquareR';
  font-size: 16px;
  color: var(--color-gray-600);
  margin-bottom: 10px;
`;

export default function Footer() {
  return (
    <footer css={footerStyle}>
      <div css={teamStyle}>
        <div>
          <div css={sectionTitle}>팀</div>

          <div css={memberRow}>
            <span>이석재</span>
            <span>김규찬</span>
          </div>
          <div css={memberRow}>
            <span>이진모</span>
            <span>이혜원</span>
          </div>
          <div css={memberRow}>
            <span>김수민</span>
            <span>이민희</span>
          </div>
        </div>
      </div>

      <div css={{ textAlign: 'center', [bp.tablet]: { textAlign: 'right' } }}>
        <div style={{ fontSize: 16 }}>
          Copyright © Voida. All Rights Reserved
        </div>
        <div
          css={{
            marginTop: 20,
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            [bp.tablet]: { justifyContent: 'flex-end' },
          }}
        >
          <a
            href="https://lab.ssafy.com/s13-webmobile1-sub1/S13P11E107"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Gitlab} alt="Gitlab" width={28} height={28} />
          </a>
          <a
            href="https://basalt-november-9ac.notion.site/25-SSAFY-13-E107-22976be4587d8024ad4fc3e22dd7180f?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Notion} alt="Notion" width={28} height={28} />
          </a>
        </div>
      </div>
    </footer>
  );
}
