import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'
import { ComponentBase, Form, emailField, passwordField } from '~/Kit'
import changeCase from 'change-case'
import { actions, connect } from '~/store'
import { path } from '~/routes'

class Login extends ComponentBase {
  constructor(props) {
    super(props)
    this.fields = {
      email: emailField({ required: true }),
      password: passwordField({ required: true }),
    }
  }

  loadState() {
    return {
      user: this.api.getCurrentUser(),
    }
  }

  handleLogin = form => {
    const { history, match } = this.props
    return this.api.login(form.email, form.password).then(user => {
      actions.setUser(user)
      history.replace(match.params.r || path.home())
      actions.setGlobalMessage(`Welcome back, ${changeCase.title(user.name)}`)
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
