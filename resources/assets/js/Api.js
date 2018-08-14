import { Url } from './Models'

class Api {
  static async getTribeLinks(siteId, tribeName) {
    try {
      const url = route('api.user', { siteId, tribeName })
      console.log('API GET', url)
      const response = await axios.get(url)
      console.log('api success', response)
      const apiResponse = response.data
      if (apiResponse.status !== 'ok') throw new Error(apiResponse.message)
      const urls = Url.create(apiResponse.data)
      console.log('urls', urls)
      return urls
    } catch (e) {
      console.error(e)
      console.error(e.response)
      if (e.response && e.response.data && e.response.data.message) {
        return { status: 'error', error: e.response.data.message }
      }
      return { status: 'error', error: e.message }
    }
  }
}

export { Api }
