import Head from '@/components/common/Head'
import LoginForm from '@/components/common/Forms/LoginForm'

export default function LoginPage() {
  return (

    <div className="flex flex-col h-screen justify-between login-background">
      <Head />

      {/* Fake element for centering LoginForm */}
      <nav />

      <LoginForm />

      {/* Fake element for centering LoginForm */}
      <footer />
    </div>
  )
}
