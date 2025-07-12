
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="StackIt - A minimal question-and-answer platform" />
        <meta name="author" content="StackIt" />
        <meta property="og:title" content="StackIt" />
        <meta property="og:description" content="A minimal question-and-answer platform" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
