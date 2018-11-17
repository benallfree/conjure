import { Dashboard } from './components/Dashboard'
import { Ping } from './components/Ping'
import { Route } from './Kit/Route'
import { Login } from './Kit/Login'
import { Logout } from './Kit/Logout'

function isLoggedIn({ user }) {
  return typeof user.id !== 'undefined'
}
function isLoggedOut({ user }) {
  return !isLoggedIn({ user })
}

const routes = Route([
  {
    path: 'dashboard',
    as: 'dashboard',
    component: Dashboard,
    menu: {
      title: 'Dashboard',
    },
    routes: [
      {
        path: '/clients/:client/invoices',
        as: 'test',
      },
    ],
  },
  {
    path: '',
    as: 'home',
    component: () => 'Home',
  },

  {
    path: 'ping',
    as: 'ping',
    menu: { title: 'Ping' },
    component: Ping,
  },

  {
    path: 'login',
    as: 'login',
    menu: {
      title: 'Log In',
      position: 'right',
      icon: 'sign in',
      middleware: [isLoggedOut],
    },
    component: Login,
  },
  {
    path: 'logout',
    as: 'logout',
    menu: {
      title: 'Log Out',
      position: 'right',
      icon: 'sign out',
      middleware: [isLoggedIn],
    },
    component: Logout,
  },
  {
    path: 'protected',
    as: 'protected',
    menu: {
      title: 'Protected',
      middleware: [isLoggedIn],
    },
    component: () => 'Protected Content',
    middleware: [isLoggedIn],
  },
])

export { routes }
