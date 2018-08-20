import React, { Component } from 'react'
import { Container, Button, Message } from 'semantic-ui-react'
import _ from 'lodash'
import { Api } from '../Api'
import { ComponentBase } from './ComponentBase'

class Ping extends ComponentBase {
  handlePing = i => {
    this.async(() => Api.ping(), i)
  }

  renderLoaded() {
    return (
      <Container>
        {_.map(_.range(5), i => {
          const { isLoaded, isLoading, response, error } = this.async(i)
          return (
            <Container key={i} style={{ marginBottom: 10 }}>
              <Button loading={isLoading} onClick={() => this.handlePing(i)}>
                Ping
              </Button>
              {error && <Message error>{error.message}</Message>}
              {!error &&
                isLoaded && <Message success>Result: {response}</Message>}
            </Container>
          )
        })}
      </Container>
    )
  }
}

export { Ping }
