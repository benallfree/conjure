import { User } from '~/Models'
import { ApiBase } from '~/Kit/Api'
import { path } from '~/routes'

class Api extends ApiBase {
  async onNeedsAuthentication({ history, match }) {
    console.error({ history, match })
    history.replace(path.login({ r: match.url }))
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

  tesy = 42
}

const obj = new Api()

export { obj as Api }
