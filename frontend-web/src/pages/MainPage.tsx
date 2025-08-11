/** @jsxImportSource @emotion/react */
import axios from 'axios';
import { css } from '@emotion/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Window from '@/assets/icons/window.png';
import Microphone from '@/assets/icons/microphone.png';
import Keyboard from '@/assets/icons/keyboard.png';

const bp = {
  tablet: '@media (min-width: 768px)',
  desktop: '@media (min-width: 1024px)',
};

export default function MainPage() {
  const downloadFile = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_SPRING_API_URL
        }/v1/releases/desktop-apps/latest`,
      );
      console.log(res);
      const version = res.data.result.version;
      const url = res.data.result.url;
      const fileUrl = `${import.meta.env.VITE_CDN_URL}/${url}`;
      console.log('파일 URL:', fileUrl);
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = `Voida-${version}.exe`;
      document.body.appendChild(a);
      a.click();
    } catch (error) {
      console.error('오류 발생함여', error);
    }
  };
  return (
    <div css={pageCss}>
      <Header />
      <section css={heroCss}>
        <h1 css={heroTitleCss}>모두가 함께하는 소통의 공간</h1>

        <p css={heroDescCss}>청각장애인과 비장애인이 함께 소통할 수 있도록,</p>
        <p css={heroDescCss}>
          입술의 움직임을 글자로 바꾸는 실시간 대화 플랫폼 입니다.
        </p>

        <button css={downloadButtonCss} onClick={downloadFile}>
          <img
            src={Window}
            alt="Windows"
            style={{ width: 22, height: 22, marginRight: 14, marginBottom: 3 }}
          />
          Windows 다운로드
        </button>

        <div css={heroPreviewBoxCss}></div>
      </section>

      <section css={featureSectionCss}>
        <div css={featureGridCss}>
          <div
            css={{
              padding: 40,
              [bp.tablet]: {
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              },
            }}
          >
            <div css={featureTitleBoxCss}>
              <img src={Microphone} alt="Microphone" css={featureIconCss} />
              <span css={featureLabelCss}>음성을 텍스트로</span>
            </div>
            <h2 css={featureTitleCss}>
              누구나 말하고,
              <br />
              누구나 들을 수 있도록
            </h2>
            <p css={featureTextCss}>내 목소리를 실시간으로</p>
            <p css={featureTextCss}>게임 중 대화도 채팅으로 전달됩니다.</p>
          </div>
          <div css={featureBoxCss}></div>
        </div>

        <div css={[featureGridCss, { marginTop: 80 }]}>
          <div css={[featureBoxCss, { order: 1 }]}></div>

          <div
            css={{
              order: 2,
              textAlign: 'left',
              padding: 40,
              [bp.tablet]: {
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              },
            }}
          >
            <div css={featureTitleBoxCss}>
              <img src={Keyboard} alt="Keyboard" css={featureIconCss} />
              <span css={featureLabelCss}>단축키를 텍스트로</span>
            </div>
            <h2 css={featureTitleCss}>
              소리 없이도
              <br />
              연결되는 대화
            </h2>
            <p css={featureTextCss}>단축키로 빠르고 간편하게</p>
            <p css={featureTextCss}>게임 중 메세지를 채팅으로 전달합니다.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const pageCss = css`
  min-height: 100vh;
  background: var(--color-bg-white);
  color: var(--color-text-black);
`;

const heroCss = css`
  text-align: center;
  padding: 48px 16px 72px;
  background: linear-gradient(
    135deg,
    #eaf2ffff 0%,
    #eaefffff 50%,
    #f8ebffff 100%
  );

  ${bp.tablet} {
    padding: 72px 24px 96px;
  }
`;

const heroTitleCss = css`
  font-size: 28px;
  font-family: NanumSquareEB;
  margin-bottom: 20px;

  ${bp.tablet} {
    font-size: 46px;
  }
`;

const heroDescCss = css`
  color: var(--color-gray-600);
  margin-bottom: 8px;
  font-size: 15px;

  ${bp.tablet} {
    font-size: 18px;
  }
`;

const downloadButtonCss = css`
  background: var(--color-primary);
  color: var(--color-text-white);
  padding: 14px 26px;
  border-radius: 30px;
  border: none;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin: 28px 0 40px;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  ${bp.tablet} {
    padding: 16px 32px;
    font-size: 18px;
    margin-bottom: 48px;
  }
`;

const heroPreviewBoxCss = css`
  max-width: 1100px;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  background-color: var(--color-gray-100);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const featureSectionCss = css`
  padding: 64px 16px 0;
  padding-bottom: 100px;

  ${bp.tablet} {
    padding-top: 96px;
    padding-left: 24px;
    padding-right: 24px;
  }
`;

const featureGridCss = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;
  max-width: 1200px;
  margin: 0 auto;

  ${bp.tablet} {
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    gap: 64px;
  }
`;

const featureBoxCss = css`
  background: var(--color-bg-white);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 480px;
  aspect-ratio: 16 / 10;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const featureTitleBoxCss = css`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const featureIconCss = css`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const featureLabelCss = css`
  color: var(--color-primary);
  font-family: NanumSquareB;
  font-size: 16px;

  ${bp.tablet} {
    font-size: 18px;
  }
`;

const featureTitleCss = css`
  font-size: 26px;
  font-family: NanumSquareEB;
  margin-bottom: 14px;
  line-height: 1.5;

  ${bp.tablet} {
    font-size: 36px;
    margin-bottom: 18px;
  }
`;

const featureTextCss = css`
  color: var(--color-gray-600);
  margin-bottom: 8px;
  font-size: 15px;

  ${bp.tablet} {
    font-size: 18px;
  }
`;
