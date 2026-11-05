import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { environment } from '@/environments/environment'
import { getErrorMessage } from '@/lib/errors'
import { useAccountStore } from '@/stores/accountStore'
import { useBusyStore } from '@/stores/busyStore'
import { themes } from './themes'

const activeClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'text-accent' : '')

const blurActive = () => (document.activeElement as HTMLElement | null)?.blur()

export default function Nav() {
  const currentUser = useAccountStore((s) => s.currentUser)
  const login = useAccountStore((s) => s.login)
  const logout = useAccountStore((s) => s.logout)
  const busy = useBusyStore((s) => s.busyRequestCount > 0)
  const navigate = useNavigate()

  const [creds, setCreds] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme)
  }, [selectedTheme])

  const handleSelectTheme = (theme: string) => {
    setSelectedTheme(theme)
    localStorage.setItem('theme', theme)
    blurActive()
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(creds)
      navigate('/members')
      toast.success('Logged in successfully')
      setCreds({ email: '', password: '' })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'), { duration: 2000 })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    blurActive()
    await logout()
    navigate('/')
  }

  const isAdminOrModerator = currentUser?.roles?.some((r) => r === 'Admin' || r === 'Moderator')

  return (
    <header className="p-3 w-full fixed top-0 z-50 bg-linear-to-r from-primary to-black">
      <div className="flex align-middle items-center px-10 mx-auto gap-6">
        <div className="text-white">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 max-h-16 border-r-white border-r-2 pr-6 ${isActive ? 'text-accent' : ''}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <h3 className="text-2xl font-semibold uppercase">Dating App</h3>
          </NavLink>
        </div>

        <nav className="flex gap-3 my-2 uppercase text-lg text-white">
          {currentUser && (
            <>
              <NavLink to="/members" end className={activeClass}>Matches</NavLink>
              <NavLink to="/lists" className={activeClass}>Lists</NavLink>
              <NavLink to="/messages" className={activeClass}>Messages</NavLink>
              {isAdminOrModerator && <NavLink to="/admin" className={activeClass}>Admin</NavLink>}
            </>
          )}
          {!environment.production && <NavLink to="/errors" className={activeClass}>Errors</NavLink>}
        </nav>

        {busy && <span className="loading loading-spinner text-accent"></span>}

        <div className="flex align-middle ml-auto gap-3">
          <div className="dropdown mr-5 dropdown-end">
            <button tabIndex={1} role="button" className="flex flex-col justify-center align-middle text-white cursor-pointer uppercase text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 flex self-center">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
              </svg>
              <span>{selectedTheme}</span>
            </button>
            <ul tabIndex={1} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm">
              {themes.map((theme) => (
                <li key={theme}>
                  <button type="button" onClick={() => handleSelectTheme(theme)}>{theme}</button>
                </li>
              ))}
            </ul>
          </div>

          {currentUser ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="flex items-center text-white text-xl gap-3 cursor-pointer">
                <img src={currentUser.imageUrl || '/user.png'} alt="user avatar" className="w-10 h-10 rounded-full" />
                <span>{currentUser.displayName}</span>
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <li><Link to={`/members/${currentUser.id}`} onClick={blurActive}>Edit Profile</Link></li>
                <li><button type="button" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex items-center gap-3">
              <input
                value={creds.email}
                onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                name="email"
                type="text"
                className="input"
                placeholder="Email"
              />
              <input
                value={creds.password}
                onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                name="password"
                type="password"
                className="input"
                placeholder="Password"
              />
              <button className="btn btn-primary" disabled={loading}>
                {loading && <span className="mr-2 loading loading-spinner"></span>}
                Login
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  )
}
