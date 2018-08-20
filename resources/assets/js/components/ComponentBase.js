import React, { Component } from 'react'
import _ from 'lodash'
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

const ASYNC_STRUCT = {
  isLoading: false,
  isLoaded: false,
  error: null,
  response: null,
}

class ComponentBase extends Component {
  constructor(props) {
    super(props)
    if (this.props.location && this.props.match) {
      const values = queryString.parse(this.props.location.search)
      _.merge(this.props.match.params, values)
    }
    this.reset()
  }

  componentDidMount() {
    this.privateIsMounted = true
    this.reset()
    const p = this.loadData()
    if (p) {
      this.async(() => p, '_boot')
    } else {
      const { _async } = this.state
      _async._boot.isLoaded = true
      this.setState({ _async })
    }
  }

  componentWillUnmount() {
    this.privateIsMounted = false
  }

  defaultState() {
    return {}
  }

  reset(state = {}) {
    const newState = _.merge(
      this.defaultState(),
      {
        contentStyle: {},
        _async: { _boot: ASYNC_STRUCT },
      },
      state,
    )
    if (this.privateIsMounted) {
      this.setState(newState)
    } else {
      this.state = newState
    }
  }

  async(cbOrName = 'default', name = 'default') {
    let { _async } = this.state
    const isGet = typeof cbOrName !== 'function'
    if (isGet) {
      console.log(`Get ${cbOrName}`)
      return _async[cbOrName] || _.cloneDeep(ASYNC_STRUCT)
    }
    const cb = cbOrName
    const handle = _.cloneDeep(ASYNC_STRUCT)
    handle.isLoading = true
    _async[name] = _.cloneDeep(handle)
    this.setState({ _async })
    console.log(`Call ${name}`, cb)

    return cb()
      .then(response => {
        console.log('response')
        ;({ _async } = this.state)
        _async[name] = {
          isLoading: false,
          isLoaded: true,
          response,
          error: null,
        }
        this.setState({ _async })
      })
      .catch(error => {
        console.error(`Error on async '${name}':`, error.message)
        ;({ _async } = this.state)
        _async[name] = {
          isLoading: false,
          isLoaded: false,
          response: null,
          error,
        }
        this.setState({ _async })
      })
  }

  loadData() {
    return null
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

  renderHeader() {
    console.log('state', this.state)
    const { title } = this.state
    if (!title) return null
    return (
      <Header as="h1" block>
        {title}
      </Header>
    )
  }

  handleStick = () => {
    this.setState({ contentStyle: { paddingTop: 56 } })
  }

  handleUnstick = () => {
    this.setState({ contentStyle: { paddingTop: 0 } })
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    const { isLoading, isLoaded, error, response } = this.async('_boot')

    const { contentStyle, contextRef } = this.state
    const header = this.renderHeader()
    return (
      <div ref={this.handleContextRef} className="stickyContainer">
        {header && (
          <Sticky
            context={contextRef}
            offset={5}
            onStick={this.handleStick}
            onUnstick={this.handleUnstick}
          >
            {header}
          </Sticky>
        )}
        <div style={contentStyle}>
          {isLoading && this.renderLoading()}
          {isLoaded && this.renderLoaded(response)}
          {error && this.renderError()}
        </div>
      </div>
    )
  }
}

export { ComponentBase }
