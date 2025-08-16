import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Admin from './components/Admin'
import { useEffect, useState } from 'react'
import { currentPath } from './utils/router'

function Root() {
  const [route, setRoute] = useState<string>(currentPath())
  useEffect(() => {
    const onPop = () => setRoute(currentPath())
    window.addEventListener('popstate', onPop)
    window.addEventListener('pushstate', onPop as any)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('pushstate', onPop as any)
    }
  }, [])
  return route.startsWith('/admin') ? <Admin /> : <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
