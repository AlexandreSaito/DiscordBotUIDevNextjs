import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from "./layout"
import { NextPageWithLayout } from "./../_app"
import type { ReactElement } from 'react'

const Home: NextPageWithLayout = () => {
  const router = useRouter()
  const { pid } = router.query

	console.log(pid);
  return (
    <div>
			{pid}
    </div>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
};

export default Home
