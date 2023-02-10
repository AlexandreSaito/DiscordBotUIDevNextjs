import '../styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import RootLayout from './layout'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	if(Component.getLayout){
		const Layout = Component.getLayout(<Component {...pageProps} />);
		return <RootLayout>{Layout}</RootLayout> 
	}
  return <RootLayout><Component {...pageProps} /></RootLayout> 
}

export default MyApp
