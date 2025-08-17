import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      @font-face {
        font-family: 'NanumSquareEB';
        src: url('/fonts/NanumSquareEB.woff') format('woff');
        font-weight: 800;
        font-style: normal;
      }
      @font-face {
        font-family: 'NanumSquareB';
        src: url('/fonts/NanumSquareB.woff') format('woff');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'NanumSquareR';
        src: url('/fonts/NanumSquareR.woff') format('woff');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'NanumSquareL';
        src: url('/fonts/NanumSquareL.woff') format('woff');
        font-weight: 300;
        font-style: normal;
      }

      :root {
        /* Primary */
        --color-primary: #3182f6;
        --color-primary-dark: #1b6dec;

        /* Gray */
        --color-gray-100: #f4f4f5;
        --color-gray-200: #d9d9d9;
        --color-gray-300: #cbcbcb;
        --color-gray-400: #b7b7b7;
        --color-gray-500: #939393;
        --color-gray-600: #7e7e7e;

        /* Semantic */
        --color-red: #f14452;
        --color-green: #23ad6f;
        --color-yellow: #f4d248;

        /* Background */
        --color-bg-white: #ffffffff;
        --color-bg-blue: #f8f9fc;

        /* Base */
        --color-background: var(--color-bg-white);
        --color-text: #333;
        --color-text-white: #fff;
        --color-text-black: #000;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'NanumSquareR', sans-serif;
        background-color: var(--color-background);
        color: var(--color-text);
        caret-color: transparent;
      }
    `}
  />
);

export default GlobalStyles;
