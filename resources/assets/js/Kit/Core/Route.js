import React from 'react'
import _ from 'lodash'
import querystring from 'query-string'
import { RouteRenderer } from './Components'

class RoutingError extends Error {
  constructor(msg, route) {
    super(`${msg}\nas: ${route.as}\npath: ${route.fullPath}`)
  }
}

function createInterpolator(routeInfo) {
  const used = {}

  function process(p, params) {
    const m = p.match(/^:(.+)/)
    if (!m) return p
    if (typeof params[m[1]] === 'undefined') {
      throw new RoutingError(`Parameter :${m[1]} not provided`, routeInfo)
    }
    const v = params[m[1]]
    if (_.isObject(v)) {
      if (typeof v.id === 'undefined')
        throw new RoutingError(
          `Parameter :${m[1]} must haven an 'id' attribute for route`,
          routeInfo,
        )
      used[m[1]] = true
      return v.id
    }
    used[m[1]] = true
    return v
  }

  const interpolator = (params = {}, options = {}) => {
    const { includeQueryString, useDefaultChildPath } = _.defaults(options, {
      includeQueryString: true,
      useDefaultChildPath: true,
    })
    const defaultChild = _.find(interpolator.routes, r => r.default)
    const fullPath =
      useDefaultChildPath && defaultChild
        ? defaultChild.fullPath
        : routeInfo.fullPath
    const parts = _.trim(fullPath, '/').split('/')

    let path = _.map(parts, p => `/${process(p, params)}`).join('')

    if (!includeQueryString) return path

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
    return path
  }
  _.merge(interpolator, routeInfo, {
    match: (props, path) => {
      const src = interpolator(props, {
        includeQueryString: false,
        useDefaultChildPath: false,
      })
      const res = path.startsWith(src)
      return res
    },
  })
  return interpolator
}

function traverseRoutes(rootRoute = {}, childRoutes = {}) {
  _.each(childRoutes, (routeInfo, k) => {
    _.each(Route.middleware, m => m(k, routeInfo, rootRoute))
    rootRoute[k] = childRoutes[k] = createInterpolator(routeInfo)
    traverseRoutes(rootRoute[k], rootRoute[k].routes)
  })
  return rootRoute
}

function Route(routeConfig) {
  const final = traverseRoutes({}, routeConfig)
  return final
}

Route.middleware = [
  (k, routeInfo, parentRouteInfo) => {
    _.defaults(routeInfo, {
      routes: {},
      path: null,
      as: _.compact([parentRouteInfo.as, k]).join('.'),
      default: false,
      component: props => {
        const { route } = props
        return <RouteRenderer {...props} routes={route.routes} />
      },
      decorators: [],
    })
    _.merge(routeInfo, {
      path: _.compact([k, routeInfo.path]).join('/'),
    })
    _.merge(routeInfo, {
      fullPath: `/${_.compact([
        _.trim(parentRouteInfo.fullPath, '/ '),
        _.trim(routeInfo.path, '/ '),
      ]).join('/')}`,
      routes: { ...routeInfo.routes, ...routeInfo.component.routes },
      component: _.reduce(
        routeInfo.decorators,
        (c, d) => d(c),
        routeInfo.component,
      ),
      parent: parentRouteInfo,
    })
    if (routeInfo.path.length === 0)
      throw new RoutingError(`Path cannot be empty`, routeInfo)
  },
]

export { Route }
