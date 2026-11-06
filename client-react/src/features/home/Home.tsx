import { useState } from 'react'
import { Link } from 'react-router'
import Register from '@/features/account/Register'
import { useAccountStore } from '@/stores/accountStore'

export default function Home() {
  const currentUser = useAccountStore((s) => s.currentUser)
  const [registerMode, setRegisterMode] = useState(false)

  return (
    <div className="hero bg-base-200 min-h-screen">
      {registerMode && !currentUser ? (
        <div className="w-full text-2xl text-center flex justify-center">
          <Register onCancel={() => setRegisterMode(false)} />
        </div>
      ) : (
        <div className="hero-content text-center">
          <div className="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-42 text-primary">
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>
            <h1 className="text-5xl font-bold">Find your match!</h1>
            {!currentUser && <p className="py-6">All you need to do is sign up!</p>}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <Link to="/members" className="btn btn-info btn-lg">Find matches</Link>
              ) : (
                <button onClick={() => setRegisterMode(true)} className="btn btn-primary btn-lg">Register</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
