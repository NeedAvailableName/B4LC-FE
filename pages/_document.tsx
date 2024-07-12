// pages/_document.tsx

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="vi" translate="no">
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="icon"
            href="/src/assets/svgs/Infinity.svg"
            data-react-helmet="true"
          />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="Blockchain-based L/C managing system"
          />
          <meta
            property="og:title"
            content="B4LC | Blockchain-based L/C managing system"
          />
          <meta
            property="og:description"
            content="Blockchain-based L/C managing system"
            data-rh="true"
          />
          <meta property="og:image" content="" />
          <meta property="og:url" content="" />
          <meta property="og:type" content="website" data-rh="true" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Oswald:wght@200;300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <noscript>Please turn on JavaScript on your device.</noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
