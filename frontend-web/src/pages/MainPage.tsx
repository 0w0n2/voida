/** @jsxImportSource @emotion/react */
import axios from 'axios';
import { css } from '@emotion/react';
import Footer from '@/components/Footer';
import Window from '@/assets/icons/window.png';
import Microphone from '@/assets/icons/microphone.png';
import Keyboard from '@/assets/icons/keyboard.png';
import overlay from '@/assets/icons/overlay.png';
import VoidaLogo from '@/assets/logo/voida-logo.png';
import multi from '@/assets/image/multi.png';
import vodiashow from '@/assets/show/voidashow.mp4';
import stt from '@/assets/show/stt.mp4';
import shortslot from '@/assets/show/shortslot.mp4';

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
      <section css={heroCss}>
        <img src={VoidaLogo} alt="Voida Logo" css={logoStyle} />
        <h1 css={heroTitleCss}>모두가 함께하는 소통의 공간</h1>

        <p css={heroDescCss}>
          <span css={vodiaCss}>VOIDA</span>는 청각장애인과 비장애인이 함께
          소통할 수 있도록 돕는 <span css={vodiaCss}>실시간 대화 플랫폼</span>
          입니다.
        </p>
        <p css={heroDescCss}></p>

        <button css={downloadButtonCss} onClick={downloadFile}>
          <img
            src={Window}
            alt="Windows"
            style={{ width: 22, height: 22, marginRight: 14, marginBottom: 3 }}
          />
          Windows 다운로드
        </button>

        <div css={heroPreviewBoxCss}>
          <video
            src={vodiashow}
            loop
            controls
            playsInline
            css={videoStyle}
          ></video>
        </div>
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
              <span css={featureLabelCss}>실시간 통신</span>
            </div>
            <h2 css={featureTitleCss}>
              누구나 말하고,
              <br />
              누구나 들을 수 있도록
            </h2>
            <p css={featureTextCss}>음성을 채팅으로,</p>
            <p css={featureTextCss}>
              구화를 음성과 채팅으로 변환할 수 있습니다.
            </p>
          </div>
          <div css={featureBoxCss}>
            <video
              src={stt}
              autoPlay
              muted
              loop
              playsInline
              css={videoStyle}
            ></video>
          </div>
        </div>

        <div css={[featureGridCss, { marginTop: 80 }]}>
          <div css={[featureBoxCss, { order: 1 }]}>
            <div css={featureBoxCss}>
              <video
                src={shortslot}
                autoPlay
                muted
                loop
                playsInline
                css={videoStyle}
              ></video>
            </div>
          </div>

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
              <span css={featureLabelCss}>단축키</span>
            </div>
            <h2 css={featureTitleCss}>
              쉽고 빠르게
              <br />
              소통이 가능하도록
            </h2>
            <p css={featureTextCss}>지정된 단축키를 이용해</p>
            <p css={featureTextCss}>음성과 채팅으로 변환할 수 있습니다.</p>
          </div>
        </div>
        <div css={[featureGridCss, { marginTop: 80 }]}>
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
              <img src={overlay} alt="Overlay" css={featureIconCss} />
              <span css={featureLabelCss}>오버레이</span>
            </div>
            <h2 css={featureTitleCss}>
              다른 작업중에도
              <br />
              함께 사용할 수 있도록
            </h2>
            <p css={featureTextCss}>오버레이 기능으로</p>
            <p css={featureTextCss}>멀티태스킹이 가능합니다.</p>
          </div>
          <div css={featureBoxCss}>
            <img src={multi} alt="오버레이" css={featureImageCss} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const logoStyle = css`
  width: 360px;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  margin-bottom: 35px;
  &:hover {
    opacity: 0.8;
  }
`;

const vodiaCss = css`
  color: var(--color-primary);
  font-weight: bold;
`;

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

const videoStyle = css`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 여백 없이 꽉 차게 */
  object-position: center 14%;
  border-radius: 20px; /* heroPreviewBoxCss에 radius가 있으면 맞춰줘 */
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
  overflow: hidden; // ⭐️ 박스 밖으로 안 나가게
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const featureImageCss = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
