import React, { Component } from 'react'
import queryString from 'query-string'
import {
  Message,
  Header,
  Sticky,
  Dimmer,
  Loader,
  Image,
  Segment,
} from 'semantic-ui-react'
import _ from 'lodash'

class AsyncBase extends Component {
  constructor(props) {
    super(props)
    if (this.props.location && this.props.match) {
      const values = queryString.parse(this.props.location.search)
      _.merge(this.props.match.params, values)
    }
  }

  state = {
    isLoading: true,
    error: null,
    data: null,
    title: null,
    contentStyle: {
      paddingTop: 0,
    },
  }

  componentDidMount() {
    this.setState({ error: null, isLoading: true }, async () => {
      try {
        const data = await this.loadData()
        this.setState({ data })
      } catch (e) {
        this.setState({ error: e })
      } finally {
        this.setState({ isLoading: false })
      }
    })
  }

  loadData() {
    console.warn('Warning: No resolver defined for async component.')
    return new Promise(resolve => {
      setTimeout(() => resolve({ a: 1, b: 2, c: 3 }), 1000)
    })
  }

  renderLoading() {
    return (
      <Segment>
        <Dimmer active>
          <Loader />
        </Dimmer>

        <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
      </Segment>
    )
  }

  renderError() {
    const { error } = this.state
    return (
      <Message negative>
        <Message.Header>Error loading data</Message.Header>
        <p>{error.message}</p>
      </Message>
    )
  }

  renderLoaded() {
    const { data } = this.state
    return (
      <div>
        Default resolver component. Override this.
        <div>
          <code>{JSON.stringify(data, null, 2)}</code>
        </div>
      </div>
    )
  }

  handleStick = () => {
    this.setState({ contentStyle: { paddingTop: 56 } })
  }

  handleUnstick = () => {
    this.setState({ contentStyle: { paddingTop: 0 } })
  }

  render() {
    const { error, isLoading, contextRef, title, contentStyle } = this.state
    return (
      <div ref={this.handleContextRef} className="stickyContainer">
        {title && (
          <Sticky
            context={contextRef}
            offset={5}
            onStick={this.handleStick}
            onUnstick={this.handleUnstick}
          >
            <Header as="h1" block>
              {title}
            </Header>
          </Sticky>
        )}
        <div style={contentStyle}>
          {isLoading && this.renderLoading()}
          {!isLoading && (
            <div>
              {error && this.renderError()}
              {!error && this.renderLoaded()}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export { AsyncBase }
