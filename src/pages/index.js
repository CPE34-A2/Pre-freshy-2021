import WebContainer from '@/components/common/WebContainer'
import Head from '@/components/common/Head'
import Navbar from '@/components/navbar/Navbar'
import IndexContent from '@/components/contents/IndexContent'
import Footer from '@/components/footer/Footer'

export default function Home() {
  return (
    <WebContainer>
      <Head />

      <Navbar />

      <IndexContent />

      <Footer />
    </WebContainer>
  )
}
