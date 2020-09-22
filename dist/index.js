'use strict'
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.destroyCookie = exports.setCookie = exports.parseCookies = void 0
var cookie = require('cookie')
var setCookieParser = require('set-cookie-parser')
var isBrowser = function() {
  return typeof window !== 'undefined'
}
function hasSameProperties(a, b) {
  var aProps = Object.getOwnPropertyNames(a)
  var bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length) {
    return false
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  return true
}
/**
 * Compare the cookie and return true if the cookies has equivalent
 * options and the cookies would be overwritten in the browser storage.
 *
 * @param a first Cookie for comparison
 * @param b second Cookie for comparison
 */
function areCookiesEqual(a, b) {
  var sameSiteSame = a.sameSite === b.sameSite
  if (typeof a.sameSite === 'string' && typeof b.sameSite === 'string') {
    sameSiteSame = a.sameSite.toLowerCase() === b.sameSite.toLowerCase()
  }
  return (
    hasSameProperties(
      __assign(__assign({}, a), { sameSite: undefined }),
      __assign(__assign({}, b), { sameSite: undefined }),
    ) && sameSiteSame
  )
}
/**
 * Create an instance of the Cookie interface
 *
 * @param name name of the Cookie
 * @param value value of the Cookie
 * @param options Cookie options
 */
function createCookie(name, value, options) {
  var sameSite = options.sameSite
  if (sameSite === true) {
    sameSite = 'strict'
  }
  if (sameSite === undefined || sameSite === false) {
    sameSite = 'lax'
  }
  var cookieToSet = __assign(__assign({}, options), { sameSite: sameSite })
  delete cookieToSet.encode
  return __assign({ name: name, value: value }, cookieToSet)
}
/**
 *
 * Parses cookies.
 *
 * @param ctx
 * @param options
 */
function parseCookies(ctx, options) {
  if (ctx && ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
    return cookie.parse(ctx.req.headers.cookie, options)
  }
  if (isBrowser()) {
    return cookie.parse(document.cookie, options)
  }
  return {}
}
exports.parseCookies = parseCookies
/**
 *
 * Sets a cookie.
 *
 * @param ctx
 * @param name
 * @param value
 * @param options
 */
function setCookie(ctx, name, value, options) {
  if (ctx && ctx.res && ctx.res.getHeader && ctx.res.setHeader) {
    var cookies = ctx.res.getHeader('Set-Cookie') || []
    if (typeof cookies === 'string') cookies = [cookies]
    if (typeof cookies === 'number') cookies = []
    var parsedCookies = setCookieParser.parse(cookies)
    var cookiesToSet_1 = []
    parsedCookies.forEach(function(parsedCookie) {
      if (!areCookiesEqual(parsedCookie, createCookie(name, value, options))) {
        cookiesToSet_1.push(
          cookie.serialize(
            parsedCookie.name,
            parsedCookie.value,
            __assign({}, parsedCookie),
          ),
        )
      }
    })
    cookiesToSet_1.push(cookie.serialize(name, value, options))
    if (!ctx.res.finished) {
      ctx.res.setHeader('Set-Cookie', cookiesToSet_1)
    }
  }
  if (isBrowser()) {
    if (options && options.httpOnly) {
      throw new Error('Can not set a httpOnly cookie in the browser.')
    }
    document.cookie = cookie.serialize(name, value, options)
  }
  return {}
}
exports.setCookie = setCookie
/**
 *
 * Destroys a cookie with a particular name.
 *
 * @param ctx
 * @param name
 * @param options
 */
function destroyCookie(ctx, name, options) {
  var opts = __assign(__assign({}, options || {}), { maxAge: -1 })
  if (ctx && ctx.res && ctx.res.setHeader && ctx.res.getHeader) {
    var cookies = ctx.res.getHeader('Set-Cookie') || []
    if (typeof cookies === 'string') cookies = [cookies]
    if (typeof cookies === 'number') cookies = []
    cookies.push(cookie.serialize(name, '', opts))
    ctx.res.setHeader('Set-Cookie', cookies)
  }
  if (isBrowser()) {
    document.cookie = cookie.serialize(name, '', opts)
  }
  return {}
}
exports.destroyCookie = destroyCookie
exports.default = {
  set: setCookie,
  get: parseCookies,
  destroy: destroyCookie,
}
//# sourceMappingURL=index.js.map
