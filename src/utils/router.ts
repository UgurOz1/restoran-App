export function navigate(path: string) {
    if (typeof window === 'undefined') return
    if (window.location.pathname === path) return
    history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  
  export function currentPath(): string {
    if (typeof window === 'undefined') return '/'
    return window.location.pathname || '/'
  }
  
  
  