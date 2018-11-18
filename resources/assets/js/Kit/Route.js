import React from 'react'
import _ from 'lodash'
import changeCase from 'change-case'
import { connect } from '~/store'
import { path } from '~/routes'
import querystring from 'query-string'

class RouteError extends Error {}

function wrapRoute(route, stack) {
  const parts = _.concat(
    _.map(stack, s => _.trim(s.path, '/ ')),
    _.trim(route.path, '/').split('/'),
  )
  const routeInfo = _.merge(
    {
      component: () => null,
      routes: [],
    },
    route,
    {
      path: `/${parts.join('/')}`,
    },
  )
  routeInfo.originalComponent = routeInfo.component

  routeInfo.component = connect(({ user }) => ({ user }))(props => {
    const { match, history } = props
    if (!_.reduce(routeInfo.middleware, (res, cb) => res && cb(props), true)) {
      history.replace(path.login({ r: match.url }))
      return null
    }

    const C = routeInfo.originalComponent
    return <C {...props} />
  })

  if (routeInfo.menu) {
    _.defaults(routeInfo.menu, {
      title: changeCase.title(route.as),
      position: null,
      icon: null,
      middleware: [],
    })
    const middleware = _.clone(routeInfo.menu.middleware)
    routeInfo.menu.middleware = context => {
      return _.reduce(middleware, (res, cb) => res && cb(context), true)
    }
  }

  return routeInfo
}

function createInterpolator(routeInfo, stack) {
  const parts = _.trim(routeInfo.path, '/').split('/')
  const fullAs = _.map(stack, r => r.as)
    .concat(routeInfo.as)
    .join('.')
  const used = {}

  function process(p, params) {
    const m = p.match(/^:(.+)/)
    if (!m) return p
    if (typeof params[m[1]] === 'undefined') {
      throw new RouteError(
        `Parameter :${m[1]} not provided for route ${
          routeInfo.path
        } (${fullAs})`,
      )
    }
    const v = params[m[1]]
    if (_.isObject(v)) {
      if (typeof v.id === 'undefined')
        throw new RouteError(
          `Parameter :${m[1]} must haven an 'id' attribute for route ${
            routeInfo.path
          } (${fullAs})`,
        )
      used[m[1]] = true
      return v.id
    }
    used[m[1]] = true
    return v
  }

  const interpolator = (params = {}) => {
    let path = _.map(parts, p => `/${process(p, params)}`).join('')
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
  _.merge(interpolator, routeInfo)
  return interpolator
}

function Route(
  routeConfig,
  routes = [],
  rootInterpolator = () => {},
  stack = [],
) {
  _.each(routeConfig, r => {
    // const intermediates = r.as.split('.')
    // if (intermediates.length > 1) {
    //   const intermediateRoute = _.merge(wrapRoute(r), {
    //     as: intermediates[0],
    //     routes: [
    //       _.merge({}, r, {
    //         as: intermediates.slice(1).join('.'),
    //       }),
    //     ],
    //   })
    //   const intermediateInterpolator = createInterpolator(
    //     intermediateRoute,
    //     stack,
    //   )
    //   console.log({ intermediateRoute, intermediateInterpolator })

    //   routes[intermediateRoute.as] = intermediateInterpolator
    //   stack.push(intermediateRoute)
    //   Route(intermediateRoute.routes, intermediateInterpolator, stack)
    //   stack.pop()
    //   return
    // }
    const routeInfo = wrapRoute(r, stack)
    if (rootInterpolator[routeInfo.as]) {
      throw new RouteError(`Duplicate 'as' route ${routeInfo.as}`)
    }
    routes.push(routeInfo)
    const interpolator = createInterpolator(routeInfo, stack)
    rootInterpolator[routeInfo.as] = interpolator
    stack.push(routeInfo)
    Route(routeInfo.routes, routes, interpolator, stack)
    stack.pop()
  })
  return { routes, interpolator: rootInterpolator }
}

export { Route }
