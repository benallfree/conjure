import React, { Component } from 'react'
import { Container, Card } from 'semantic-ui-react'
import { ComponentBase } from '~/Kit'
import { Api } from '~/Api'

class Dashboard extends ComponentBase {
  loadState() {
    return {
      user: Api.getCurrentUser(),
      title: 'Dashboard',
    }
  }

  renderLoaded({ user }) {
    return (
      <Container style={{ marginTop: 10 }}>
        <Card>
          <Card.Content>
            <Card.Header>User Information</Card.Header>
            <Card.Meta>{user.name}</Card.Meta>
            <Card.Description>
              <pre>
                <code>{JSON.stringify(user, null, 2)}</code>
              </pre>
            </Card.Description>
          </Card.Content>
        </Card>
      </Container>
    )
  }
}

export { Dashboard }
