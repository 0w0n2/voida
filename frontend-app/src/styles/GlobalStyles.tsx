import { Global, css } from '@emotion/react'

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

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'NanumSquareR', sans-serif;
        background-color: #f9f9f9;
        color: #333;
        caret-color: transparent;
      }
    `}
  />
)

export default GlobalStyles
