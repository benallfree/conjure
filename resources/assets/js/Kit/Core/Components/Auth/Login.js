import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'
import changeCase from 'change-case'
import { subscribe } from 'react-contextual'
import _ from 'lodash'
import { ComponentBase, Form } from '..'

const { email, password } = Form.Builders

@subscribe('ioc')
class Login extends ComponentBase {
  constructor(props) {
    super(props)
    this.fields = {
      email: email({ required: true }),
      password: password({ required: true }),
    }
  }

  loadState() {
    return {
      user: this.api.getCurrentUser(),
    }
  }

  handleLogin = form => {
    const { history, match } = this.props
    const { setUser, setGlobalMessage, routes } = this.props.ioc

    return this.api.login(form.email, form.password).then(user => {
      setUser(user)
      history.replace(match.params.r || routes.home())
      setGlobalMessage(`Welcome back, ${changeCase.title(user.name)}`)
    })
  }

  renderLoaded() {
    return (
      <Card centered>
        <Card.Content header="Log In" />
        <Card.Content>
          <Form
            fields={this.fields}
            renderer={Form.Renderers.InputOnly}
            submitButtonText="Log In"
            submitButtonIcon="sign in"
            submittingMessage="Logging in..."
            submittedMessage="Logged in."
            onSubmit={this.handleLogin}
          />
        </Card.Content>
      </Card>
    )
  }
}

export { Login }
