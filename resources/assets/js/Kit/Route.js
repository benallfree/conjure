import React from 'react'
import _ from 'lodash'
import changeCase from 'change-case'
import { connect } from '~/store'
import { routes as routeFuncs } from '~/routes'
import querystring from 'query-string'

class RouteError extends Error {}

function Route(routes, ret = {}, stack = []) {
  _.each(routes, r => {
    if (!r.as) return
    const myStack = _.clone(stack)
    const parts = _.concat(
      _.map(myStack, s => _.trim(s.path, '/ ')),
      _.trim(r.path, '/').split('/'),
    )
    const routeInfo = _.merge(
      {
        component: () => null,
        routes: [],
      },
      r,
      {
        path: `/${parts.join('/')}`,
        parts,
      },
    )
    routeInfo.originalComponent = routeInfo.component

    routeInfo.component = connect(({ user }) => ({ user }))(props => {
      const { match, history } = props
      if (
        !_.reduce(routeInfo.middleware, (res, cb) => res && cb(props), true)
      ) {
        history.replace(routeFuncs.login({ r: match.url }))
        return null
      }
      const C = routeInfo.originalComponent
      return <C {...props} />
    })

    if (routeInfo.menu) {
      _.defaults(routeInfo.menu, {
        title: changeCase.title(r.as),
        position: null,
        icon: null,
        middleware: [],
      })
      const middleware = _.clone(routeInfo.menu.middleware)
      routeInfo.menu.middleware = context => {
        return _.reduce(middleware, (res, cb) => res && cb(context), true)
      }
    }

    stack.push(routeInfo)
    routeInfo.used = []
    function process(p, params) {
      const m = p.match(/^:(.+)/)
      if (!m) return p
      if (typeof params[m[1]] === 'undefined') {
        throw new RouteError(
          `Parameter :${m[1]} not provided for route ${routeInfo.path} (${_.map(
            myStack,
            r => r.as,
          ).join('.')})`,
        )
      }
      const v = params[m[1]]
      if (_.isObject(v)) {
        if (typeof v.id === 'undefined')
          throw new RouteError(
            `Parameter :${m[1]} must haven an 'id' attribute for route ${
              routeInfo.path
            } (${_.map(myStack, r => r.as).join('.')})`,
          )
        routeInfo.push(m[1])
        return v.id
      }
      routeInfo.push(m[1])
      return v
    }
    const interpolator = (params = {}) => {
      let path = _.map(parts, p => `/${process(p, params)}`).join('')
      const qs = querystring.stringify(
        _.reduce(
          params,
          (res, v, k) => {
            if (!_.findIndex(routeInfo.used, u => u === k)) return res
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
    ret[routeInfo.as] = interpolator
    Route(routeInfo.routes, interpolator, stack)
    stack.pop()
  })
  return ret
}

export { Route }
