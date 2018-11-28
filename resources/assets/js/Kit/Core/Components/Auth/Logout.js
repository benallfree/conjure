import { ComponentBase } from '..'
import { subscribe } from '~/react-contextual'

@subscribe('ioc')
class Logout extends ComponentBase {
  componentDidMount() {
    super.componentDidMount()
    const { history, match } = this.props
    const { clearUser, setGlobalMessage, routes } = this.props.ioc
    this.api.logout().then(() => {
      history.replace(routes.home())
      clearUser()
      setGlobalMessage(`Logged out.`)
    })
  }

  renderLoaded() {
    return null
  }
}

export { Logout }
