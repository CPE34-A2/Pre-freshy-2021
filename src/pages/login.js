import WebContainer from '@/components/common/WebContainer'
import Head from '@/components/common/Head'
import Footer from '@/components/footer/Footer'
import LoginForm from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <WebContainer>
      <Head />

      {/* Fake element for centering LoginForm */}
      <nav />

      <LoginForm />

      <Footer />
    </WebContainer>
  )
}
