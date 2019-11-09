import React, { Component } from 'react'
import { Container, Card } from 'semantic-ui-react'
import { subscribe } from 'react-contextual'

const Dashboard = subscribe('ioc')(props => {
  const {
    route,
    ioc: { routes, user },
  } = props
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
      {route.test({ client: 42 })}
    </Container>
  )
})

export { Dashboard }
