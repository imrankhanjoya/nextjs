import Head from 'next/head'
import Homebanner from '../components/Homebanner'
import Homebanner2 from '../components/Homebanner2'

const Home = ()=> {
  return (
    <>
    <Homebanner></Homebanner>
    <Homebanner2></Homebanner2>
    </>
  )
}

Home.layout = 'LD'
export default Home