import { useState } from 'react';
import Input from './Input';
import Button from './Button';

export default function Form() {
  const [username, setUsername] = useState('')

  const submitForm = () => {
    if (username.length == 13) {
      alert("ครบ☺");
    } else {
      alert("ไม่ถูกต้อง☺")
    }
  }

  return (
    <form className="container h-screen w-screen bg-red-500 relative">
      <div className="bg-red-100 flex h-screen w-full items-center justify-center mt">
        <div >
          <Input
            title="username"
            type="text"
            placeholder="username"
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <Input
            title="password"
            type="password"
            placeholder="password"
          />
        </div>

        <div >
          <Button type="button" name="login" onClick={submitForm} />
        </div>
      </div>
    </form>
  )
}
