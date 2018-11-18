import { ComponentBase } from '~/Kit'
import { actions } from '~/store'
import { path } from '~/routes'
import { User } from '~/Models'

class Logout extends ComponentBase {
  componentDidMount() {
    super.componentDidMount()
    const { history } = this.props
    this.api.logout().then(() => {
      history.replace(path.home())
      actions.setUser(new User())
      actions.setGlobalMessage(`Logged out.`)
    })
  }

  renderLoaded() {
    return null
  }
}

export { Logout }
