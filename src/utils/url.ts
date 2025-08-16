export function normalizeImageUrl(input?: string): string | undefined {
    if (!input) return undefined
    try {
      const u = new URL(input, window.location.origin)
      const host = u.host
      const path = u.pathname
  
      // Google wrapper links
      if (/\.google\./.test(host) && (path === '/url' || path === '/imgres')) {
        const fromImg = u.searchParams.get('imgurl')
        const fromUrl = u.searchParams.get('url')
        const candidate = fromImg || fromUrl
        if (candidate) return decodeURIComponent(candidate)
      }
  
      // Facebook redirector
      if (host === 'l.facebook.com' && path === '/l.php') {
        const target = u.searchParams.get('u')
        if (target) return decodeURIComponent(target)
      }
  
      return input
    } catch {
      return input
    }
  }
  
  export async function extractFirstImageFromPage(pageUrl: string): Promise<string | undefined> {
    try {
      const noScheme = pageUrl.replace(/^https?:\/\//, '')
      const proxied = `https://r.jina.ai/http://${noScheme}`
      const res = await fetch(proxied)
      if (!res.ok) return undefined
      const html = await res.text()
      const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
      if (match && match[1]) {
        const base = new URL(pageUrl, window.location.origin)
        const abs = new URL(match[1], base).toString()
        return abs
      }
    } catch {
      // ignore
    }
    return undefined
  }
  
  export function isAbsoluteHttpUrl(u?: string): boolean {
    if (!u) return false
    try {
      const url = new URL(u)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch { return false }
  }
  
  export function toProxyImageUrl(original?: string): string | undefined {
    if (!original) return undefined
    try {
      if (!isAbsoluteHttpUrl(original)) return original
      const noScheme = original.replace(/^https?:\/\//, '')
      return `https://images.weserv.nl/?url=${encodeURIComponent(noScheme)}`
    } catch {
      return original
    }
  }
  
  
  
  