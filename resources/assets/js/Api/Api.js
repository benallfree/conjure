import _ from 'lodash'
import { User } from '~/Models'
import { ApiBase } from '~/Kit'

class Api extends ApiBase {
  async onNeedsAuthentication({ ioc: { routes }, history }) {
    const {
      location: { pathname, search },
    } = window
    history.replace(routes.login({ r: `${pathname}${search}` }))
  }

  async getCurrentUser(context) {
    const data = await this.get(route('api.user'), context)
    const user = new User(data)
    return user
  }

  async ping(context) {
    const response = await this.get(route('api.ping'), context)
    return response
  }

  async protectedPing(context) {
    const response = await this.get(route('api.auth.ping'), context)
    return response
  }

  async login(email, password, context) {
    const data = await this.post(
      route('api.login'),
      {
        email,
        password,
      },
      context,
    )
    return new User(data)
  }

  async logout(context) {
    await this.post(route('api.logout'), context)
    return null
  }
}

const obj = new Api()

export { obj as Api }
