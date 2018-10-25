import React, { Component } from 'react'
import _ from 'lodash'
import { Button } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'
import changeCase from 'change-case'
import { RouteButton } from './RouteButton'

class TabView extends Component {
  render() {
    const { panes, match } = this.props
    const finalPanes = {}
    _.each(panes, (pane, k) => {
      const defaults = {
        to: k,
        label: changeCase.title(k),
        component: () => <div> {changeCase.title(k)} Tab Content</div>,
      }
      const args = { ...defaults, ...pane }
      args.to = _.compact([match.url, args.to]).join('/')
      finalPanes[k] = args
    })

    return (
      <div>
        <Button.Group widths="5" style={{ marginBottom: 20 }}>
          {_.map(finalPanes, (pane, k) => {
            const { to, label } = pane
            return (
              <RouteButton key={k} to={to}>
                {label}
              </RouteButton>
            )
          })}
        </Button.Group>
        <Switch>
          {_.map(finalPanes, (pane, k) => {
            const { path, component: UserComponent } = pane
            return (
              <Route
                key={k}
                path={path}
                render={props => (
                  <UserComponent {...props} {...rest} parentMatch={match} />
                )}
              />
            )
          })}
        </Switch>
      </div>
    )
  }
}

export { TabView }
