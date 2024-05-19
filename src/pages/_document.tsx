import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(() => {
  const theme = document.cookie.includes('theme=dark') ? 'dark' : 'light';
  document.body.setAttribute('data-theme', theme);
})();`,
          }}
          type="text/javascript"
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
