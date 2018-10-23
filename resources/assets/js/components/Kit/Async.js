import React, { Component } from 'react'
import {
  Loader,
  Icon,
  Message,
  Sticky,
  Dimmer,
  Segment,
} from 'semantic-ui-react'
import _ from 'lodash'

class Async extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contextRef: null,
    }
  }

  handleStick = () => {
    this.setState({ contentStyle: { paddingTop: 56 } })
  }

  handleUnstick = () => {
    this.setState({ contentStyle: { paddingTop: 0 } })
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    let { watch } = this.props
    if (typeof watch.isLoading !== 'undefined') {
      watch = { default: watch }
    }
    const isLoading = _.reduce(watch, (res, v) => res || v.isLoading, false)
    const isLoaded = _.reduce(watch, (res, v) => res && v.isLoaded, true)
    const hasError = _.reduce(
      watch,
      (res, v) => res || (!isLoading && v.error !== null),
      false,
    )

    const responses = watch.default
      ? watch.default.response
      : _.reduce(
          watch,
          (res, v, k) => {
            res[k] = v.response
            return res
          },
          {},
        )
    const errors = watch.default
      ? watch.default.error
      : _.reduce(
          watch,
          (res, v, k) => {
            res[k] = v.error
            return res
          },
          {},
        )

    const { onError, onHeader, onLoaded, onLoading } = this.props
    const { contextRef, contentStyle } = this.state
    const header = isLoaded ? onHeader(responses) : null
    return (
      <React.Fragment>
        {isLoading && onLoading()}
        {hasError && onError(errors)}
        {isLoaded && (
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
            <div style={contentStyle}>{onLoaded(responses)}</div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

Async.defaultProps = {
  watch: {},
  contentStyle: {},
  onLoading: () => (
    <div style={{ padding: 20 }}>
      <Loader active inline />
    </div>
  ),
  onError: error => (
    <Message negative>
      <Message.Header>Error loading data</Message.Header>
      <p>{error.message}</p>
    </Message>
  ),
  onLoaded: data => (
    <div>
      Default resolver component. Override this.
      <div>
        <code>{JSON.stringify(data, null, 2)}</code>
      </div>
    </div>
  ),
  onHeader: data => null,
}

export { Async }
