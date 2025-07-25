import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      @font-face {
        font-family: 'NanumSquareEB';
        src: url('/fonts/NanumSquareEB.woff') format('opentype');
        font-weight: 800;
        font-style: normal;
      }
      @font-face {
        font-family: 'NanumSquareB';
        src: url('/fonts/NanumSquareB.woff') format('opentype');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'NanumSquareR';
        src: url('/fonts/NanumSquareR.woff') format('opentype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'NanumSquareL';
        src: url('/fonts/NanumSquareL.woff') format('opentype');
        font-weight: 300;
        font-style: normal;
      }

      :root {
        /* Primary */
        --color-primary: #3182F6;
        --color-primary-dark: #1B6DEC;

        /* Gray */
        --color-gray-100: #F4F4F5;
        --color-gray-200: #D9D9D9;
        --color-gray-300: #CBCBCB; 
        --color-gray-400: #B7B7B7;
        --color-gray-500: #939393;
        --color-gray-600: #7E7E7E;

        /* Semantic */
        --color-red: #F14452;
        --color-green: #23AD6F; 
        --color-yellow: #F4D248;

        /* Background */
        --color-bg-white: #ffffffff;
        --color-bg-blue: #dfe7ffff;

         /* Base */
        --color-background: var(--color-bg-white);
        --color-text: #333;
        --color-text-white: #fff;
        --color-text-black: #
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
