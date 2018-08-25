import React, { Component } from 'react'
import _ from 'lodash'
import { Table, Dropdown, Input, Button, Message } from 'semantic-ui-react'
import { ComponentBase, AsyncIndicator } from './index'

class Form extends Component {
  constructor(props) {
    super(props)
    const input = {}
    _.each(props.fields, f => {
      input[f.name] = f.defaultValue || ''
    })
    this.state = { input }
  }

  updateInput = field => (e, d) => {
    const { input } = this.state
    const { value } = d
    input[field] = value
    this.setState({ input })
  }

  hasFieldError = fieldName => {
    return this.fieldErrorMessage(fieldName) !== null
  }

  fieldErrorMessage = fieldName => {
    const state = this.props.asyncState
    try {
      return state.error.response.messages[fieldName] || null
    } catch (e) {
      return null
    }
  }

  handleSave = () => {
    const { input } = this.state
    const { onSave } = this.props
    onSave(input)
  }

  render() {
    const { input } = this.state
    const { asyncState, fields } = this.props
    const rows = _.map(fields, (f, i) => {
      const { type, name, label, placeholder, options, content } = f
      let control = null
      switch (type) {
        case 'Text':
          control = (
            <Input
              error={this.hasFieldError(name)}
              placeholder={placeholder}
              value={input[name]}
              style={{ width: '100%' }}
              onChange={this.updateInput(name)}
            />
          )
          break
        case 'Dropdown':
          control = (
            <Dropdown
              error={this.hasFieldError(name)}
              fluid
              selection
              options={options}
              defaultValue={input[name]}
              onChange={this.updateInput(name)}
              style={{ width: '100%' }}
            />
          )
          break
        default:
          control = <div>{content}</div>
      }
      return (
        <Table.Row key={i}>
          <Table.Cell collapsing>{label}</Table.Cell>
          <Table.Cell>
            {control}
            {this.hasFieldError(name) && (
              <div style={{ color: 'red' }}>{this.fieldErrorMessage(name)}</div>
            )}
          </Table.Cell>
        </Table.Row>
      )
    })
    return (
      <div>
        {asyncState.isLoaded && <Message success>Saved</Message>}
        {asyncState.isLoading && <Message>Saving</Message>}
        {asyncState.error && (
          <Message error>
            Please correct the errors below and try again.
          </Message>
        )}
        <Table definition>
          <Table.Body>
            {rows}

            <Table.Row>
              <Table.Cell />
              <Table.Cell style={{ textAlign: 'right' }}>
                <Button
                  loading={asyncState.isLoading}
                  disabled={asyncState.isLoading}
                  primary
                  onClick={this.handleSave}
                >
                  Save
                </Button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export { Form }
