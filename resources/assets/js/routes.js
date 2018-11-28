import React from 'react'
import _ from 'lodash'
import changeCase from 'change-case'
import { Route, Login, Logout, ensureLoggedIn, ensureLoggedOut } from '~/Kit'
import { Dashboard } from './components/Dashboard'
import { Ping } from './components/Ping'
import { ProtectedPing } from './components/ProtectedPing'

Route.middleware.push((k, routeInfo, parentRouteInfo) => {
  if (!routeInfo.menu) return
  _.defaults(routeInfo.menu, {
    title: changeCase.title(k),
    position: null,
    icon: null,
    decorators: [],
  })
})

const routes = Route({
  dashboard: {
    component: Dashboard,
    menu: {},
    routes: {
      test: {
        path: '/clients/:client/invoices',
      },
    },
  },
  home: {
    path: '',
  },
  ping: {
    menu: {},
    component: Ping,
  },
  login: {
    menu: {
      title: 'Log In',
      position: 'right',
      icon: 'sign in',
      decorators: [ensureLoggedOut()],
    },
    component: Login,
  },
  logout: {
    menu: {
      title: 'Log Out',
      position: 'right',
      icon: 'sign out',
      decorators: [ensureLoggedIn()],
    },
    component: Logout,
  },
  protectedPing: {
    menu: {
      title: 'Secure Ping',
      decorators: [ensureLoggedIn()],
    },
    component: ProtectedPing,
  },
})

export { routes }
