export { locales as middleware } from 'nextra/locales'

export const config = {
  // Chạy locale middleware cho root "/" (để redirect / -> /vi) và mọi route khác,
  // TRỪ _next, api, và path có dấu "." (file static .html/.svg/.css trong public/).
  // Root phải khai báo tường minh vì matcher negative-lookahead không match "/".
  matcher: ['/', '/((?!_next|api|.*\\.).*)']
}
