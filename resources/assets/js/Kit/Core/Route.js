import React from 'react'
import _ from 'lodash'
import querystring from 'query-string'
import { RouteRenderer } from './Components'

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
      path: k,
      as: k,
      component: props => {
        const { route } = props
        return <RouteRenderer {...props} routes={route.routes} />
      },
      decorators: [],
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
  },
]

export { Route }
