import type {Language} from './language'

export function localizePath(language: Language, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return clean ? `/${language}/${clean}/` : `/${language}/`
}

export function canonicalUrl(siteUrl: string, pathname: string): string {
  return `${siteUrl.replace(/\/+$/, '')}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

export function allStaticSeoPaths(languages: readonly Language[]): string[] {
  const routes = ['', 'about', 'company', 'contact', 'services', 'projects']
  return languages.flatMap((language) => routes.map((route) => localizePath(language, route)))
}
