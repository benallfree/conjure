import { User } from '../Models'
import { ApiBase } from './ApiBase'

class Api extends ApiBase {
  async onNeedsAuthentication() {
    return new Promise(resolve => {
      window.location = route('login', { r: window.location })
    })
  }

  async getCurrentUser() {
    const data = await this.get(route('api.user'))
    const user = new User(data)
    return user
  }
}

const obj = new Api()

export { obj as Api }
