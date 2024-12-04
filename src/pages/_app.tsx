import Head from 'next/head'; // Import Head component from next/head
import '@/styles/globals.css'; // Your global CSS

export default function App({ Component, pageProps }: any) {
	return (
		<>
			<Head>
				<title>The Lab.ms Calender App</title>{' '}
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta charSet="UTF-8" />
			</Head>
			<Component {...pageProps} />
		</>
	);
}
