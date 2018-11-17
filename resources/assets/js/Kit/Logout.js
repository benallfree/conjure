import React, { Component } from 'react'
import { ComponentBase, Api } from '~/Kit'
import { actions } from '~/store'
import { routes } from '~/routes'
import { User } from '~/Models'

class Logout extends ComponentBase {
  componentDidMount() {
    super.componentDidMount()
    const { history } = this.props
    Api.logout().then(() => {
      history.replace(routes.home())
      actions.setUser(new User())
      actions.setGlobalMessage(`Logged out.`)
    })
  }

  renderLoaded() {
    return null
  }
}

export { Logout }
