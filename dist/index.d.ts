import * as cookie from 'cookie'
import * as next from 'next'
import * as express from 'express'
/**
 *
 * Parses cookies.
 *
 * @param ctx
 * @param options
 */
export declare function parseCookies(
  ctx?:
    | Pick<next.NextPageContext, 'req'>
    | {
        req: next.NextApiRequest
      }
    | {
        req: express.Request
      }
    | null
    | undefined,
  options?: cookie.CookieParseOptions,
): {
  [key: string]: string
}
/**
 *
 * Sets a cookie.
 *
 * @param ctx
 * @param name
 * @param value
 * @param options
 */
export declare function setCookie(
  ctx:
    | Pick<next.NextPageContext, 'res'>
    | {
        res: next.NextApiResponse
      }
    | {
        res: express.Response
      }
    | null
    | undefined,
  name: string,
  value: string,
  options: cookie.CookieSerializeOptions,
): {}
/**
 *
 * Destroys a cookie with a particular name.
 *
 * @param ctx
 * @param name
 * @param options
 */
export declare function destroyCookie(
  ctx:
    | Pick<next.NextPageContext, 'res'>
    | {
        res: next.NextApiResponse
      }
    | {
        res: express.Response
      }
    | null
    | undefined,
  name: string,
  options?: cookie.CookieSerializeOptions,
): {}
declare const _default: {
  set: typeof setCookie
  get: typeof parseCookies
  destroy: typeof destroyCookie
}
export default _default
