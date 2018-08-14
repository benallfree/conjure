import { User } from './Models'
import { ApiBase } from './ApiBase'

class Api extends ApiBase {
  async getCurrentUser() {
    const response = await this.get(route('api.user'))
    const urls = new User(response.data)
    console.log('urls', urls)
    return urls
  }
}

const obj = new Api()

export { obj as Api }
