import React, { Component } from 'react'
import _ from 'lodash'
import {
  Table,
  Dropdown,
  Input,
  Button,
  Message,
  Checkbox,
  Header,
} from 'semantic-ui-react'
import changeCase from 'change-case'

class Form extends Component {
  constructor(props) {
    super(props)
    const input = {}
    const { context } = this.props

    this.fields = this.buildFields()
    _.each(this.fields, (f, fieldName) => {
      const v = f.defaultValue(context, fieldName)
      input[fieldName] = v === null ? '' : `${v}`
    })
    this.state = { input }
  }

  buildFields() {
    const defaults = {
      type: (form, context, fieldName) => 'Text',
      placeholder: (form, context, fieldName) => changeCase.title(fieldName),
      label: (form, context, fieldName) => changeCase.title(fieldName),
      options: (form, context, fieldName) => [],
      content: (form, context, fieldName) => (
        <div>{changeCase.title(fieldName)} content</div>
      ),
      displayIf: (form, context, fieldName) => true,
      defaultValue: (context, fieldName) => changeCase.title(fieldName),
    }
    const { fields } = this.props
    const ret = {}
    _.each(fields, (f, fieldName) => {
      ret[fieldName] = {}
      _.each(defaults, (v, k) => {
        let final = f[k]
        if (typeof final === 'undefined') final = v
        ret[fieldName][k] = final
        if (typeof final !== 'function')
          ret[fieldName][k] = (form, context, fieldName) => final
      })
    })

    return ret
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
    const { asyncState, context } = this.props

    const save = (
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
    )

    const rows = _.map(this.fields, (f, name) => {
      const { type, label, placeholder, options, content, displayIf } = f
      let control = null
      const resolvedType = type(input, context)
      switch (resolvedType) {
        case 'Text':
          control = (
            <Input
              error={this.hasFieldError(name)}
              placeholder={placeholder(input, context, name)}
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
              options={options(input, context, name)}
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
              defaultChecked={!!input[name] === true}
              onChange={this.updateInput(name, 'checked')}
            />
          )
          break
        case 'Section':
          control = <Header h={3}>{label(input, context, name)}</Header>
          break
        case 'Div':
          control = content(input, context, name)
          break
        default:
          control = <div>Type {type} invalid</div>
          break
      }
      if (!displayIf(input, context)) return null
      switch (resolvedType) {
        case 'Section':
          return (
            <Table.Row key={name}>
              <Table.Cell style={{ backgroundColor: 'initial' }} colSpan={2}>
                <div style={{ marginTop: 20 }}>{control}</div>
              </Table.Cell>
            </Table.Row>
          )
        default:
          return (
            <Table.Row key={name}>
              <Table.Cell collapsing>{label(input, context, name)}</Table.Cell>
              <Table.Cell>
                {control}
                {this.hasFieldError(name) && (
                  <div style={{ color: 'red' }}>
                    {this.fieldErrorMessage(name)}
                  </div>
                )}
              </Table.Cell>
            </Table.Row>
          )
      }
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
            {save}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export { Form }
