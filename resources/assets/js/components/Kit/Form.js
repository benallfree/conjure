import React, { Component } from 'react'
import _ from 'lodash'
import {
  Table,
  Dropdown,
  Input,
  Button,
  Message,
  Checkbox,
} from 'semantic-ui-react'

class Form extends Component {
  constructor(props) {
    super(props)
    const input = {}
    const { fieldsBuilder, context } = this.props
    const fields = fieldsBuilder({}, context)
    _.each(fields, f => {
      input[f.name] = f.defaultValue === null ? '' : f.defaultValue
    })
    this.state = { input }
  }

  updateInput = (field, valueField = 'value') => (e, d) => {
    const { input } = this.state
    input[field] = d[valueField]
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
    const { asyncState, fieldsBuilder, context } = this.props
    const fields = fieldsBuilder(input, context)
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
        case 'Toggle':
          control = (
            <Checkbox
              toggle
              defaultChecked={input[name] === true}
              onChange={this.updateInput(name, 'checked')}
            />
          )
          break
        case 'Div':
          control = <div>{content}</div>
          break
        default:
          control = <div>Type {type} invalid</div>
          break
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
