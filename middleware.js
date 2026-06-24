export { locales as middleware } from 'nextra/locales'

export const config = {
  // Bỏ qua các file static (có đuôi file như .html, .svg), _next, và api
  // để middleware i18n không rewrite chúng thành /vi/... gây 404.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)']
}
