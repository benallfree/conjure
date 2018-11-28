import React, { Component } from 'react'
import { subscribe } from '~/react-contextual'

@subscribe('ioc')
class NavWatcher extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged()
    }
  }

  onRouteChanged() {
    const {
      ioc: { setGlobalMessage },
    } = this.props
    setGlobalMessage('')
  }

  render() {
    return null
  }
}

export { NavWatcher }
