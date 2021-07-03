import WebContainer from '@/components/common/WebContainer'
import Head from '@/components/common/Head'
import LoginForm from '@/components/common/Forms/LoginForm'

export default function LoginPage() {
  return (
    <WebContainer style="login-background">
      <Head />

      {/* Fake element for centering LoginForm */}
      <nav />

      <LoginForm />

      {/* Fake element for centering LoginForm */}
      <footer />
    </WebContainer>
  )
}
