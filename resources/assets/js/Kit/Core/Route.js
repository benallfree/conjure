import _ from 'lodash'
import querystring from 'query-string'
import changeCase from 'change-case'

class RoutingError extends Error {}

function createInterpolator(routeInfo) {
  const used = {}

  function process(p, params) {
    const m = p.match(/^:(.+)/)
    if (!m) return p
    if (typeof params[m[1]] === 'undefined') {
      throw new RoutingError(
        `Parameter :${m[1]} not provided for route ${routeInfo.path} (${
          routeInfo.as
        })`,
      )
    }
    const v = params[m[1]]
    if (_.isObject(v)) {
      if (typeof v.id === 'undefined')
        throw new RoutingError(
          `Parameter :${m[1]} must haven an 'id' attribute for route ${
            routeInfo.path
          } (${routeInfo.as})`,
        )
      used[m[1]] = true
      return v.id
    }
    used[m[1]] = true
    return v
  }

  const parts = _.trim(routeInfo.fullPath, '/').split('/')
  const interpolator = (params = {}, includeQueryString = true) => {
    let path = _.map(parts, p => `/${process(p, params)}`).join('')
    if (includeQueryString) {
      const qs = querystring.stringify(
        _.reduce(
          params,
          (res, v, k) => {
            if (used[k]) return res
            res[k] = v
            return res
          },
          {},
        ),
      )
      if (qs.length > 0) path = `${path}?${qs}`
    }
    return path
  }
  _.merge(interpolator, routeInfo, {
    match: (props, path) => {
      const l = _.keys(routeInfo.routes).length
      return (
        (l === 0 && path === routeInfo.fullPath) ||
        (l > 0 && path.startsWith(interpolator(props, false)))
      )
    },
  })
  return interpolator
}

function traverseRoutes(parentRoute = {}, routes = {}) {
  _.each(routes, (routeInfo, k) => {
    _.each(Route.middleware, m => m(k, routeInfo, parentRoute))
    parentRoute[k] = routes[k] = createInterpolator(routeInfo)
    traverseRoutes(parentRoute[k], parentRoute[k].routes)
  })
  return parentRoute
}

function Route(routeConfig) {
  const final = traverseRoutes({}, routeConfig)
  return final
}

Route.middleware = [
  (k, routeInfo, parentRouteInfo) => {
    _.defaults(routeInfo, {
      routes: {},
      path: k,
      as: k,
      component: () => `Placeholder for ${changeCase.title(k)}`,
    })
    _.merge(routeInfo, {
      fullPath: `/${_.compact([
        _.trim(parentRouteInfo.fullPath, '/ '),
        _.trim(routeInfo.path, '/ '),
      ]).join('/')}`,
      routes: { ...routeInfo.routes, ...routeInfo.component.routes },
    })
  },
]

export { Route }
