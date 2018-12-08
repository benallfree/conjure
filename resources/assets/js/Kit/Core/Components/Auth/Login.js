import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'
import changeCase from 'change-case'
import { subscribe } from 'react-contextual'
import { ComponentBase, Form, email, password } from '..'

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
            saveButtonText="Log In"
            saveButtonIcon="sign in"
            submittingMessage="Logging in..."
            submittedMessage="Logged in."
            inputsOnly
            onSubmit={this.handleLogin}
          />
        </Card.Content>
      </Card>
    )
  }
}

export { Login }
