import WebContainer from '@/components/common/WebContainer'
import Head from '@/components/common/Head'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import LoginForm from '@/components/forms/LoginForm'

export default function Home() {
  return (
    <WebContainer>
      <Head />

      <Navbar />

      <LoginForm />

      <Footer />
    </WebContainer>
  )
}
