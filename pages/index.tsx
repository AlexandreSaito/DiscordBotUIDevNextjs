import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <>
			<h1>Hellow</h1>
			<Link href="post">To post</Link>
		</>
  )
}

export default Home
