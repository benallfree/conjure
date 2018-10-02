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
  Icon,
  Label,
} from 'semantic-ui-react'
import changeCase from 'change-case'
import InputMask from 'inputmask-core'

class Form extends Component {
  constructor(props) {
    super(props)
    const input = {}
    const { context } = this.props

    this.fields = this.buildFields()
    _.each(this.fields, (f, fieldName) => {
      const v = f.defaultValue({ context, fieldName })
      input[fieldName] = v === null ? '' : v
    })
    this.state = { input, helpState: {} }
  }

  buildFields() {
    const defaults = {
      type: ({ form, context, fieldName, value }) => 'Text',
      placeholder: ({ form, context, fieldName, value }) =>
        changeCase.title(fieldName),
      label: ({ form, context, fieldName, value }) =>
        changeCase.title(fieldName),
      options: ({ form, context, fieldName, value }) => [],
      content: ({ form, context, fieldName, value }) => (
        <div>{changeCase.title(fieldName)} content</div>
      ),
      displayIf: ({ form, context, fieldName, value }) => true,
      defaultValue: ({ context, fieldName }) => changeCase.title(fieldName),
      inputLabel: ({ form, context, fieldName, value }) => '',
      help: ({ form, context, fieldName, value }) => null,
      inputFilter: ({ form, context, fieldName, value }) => true,
      validate: ({ value }) => true,
      mask: () => null,
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
          ret[fieldName][k] = ({ form, context, fieldName, value }) => final
      })
    })

    return ret
  }

  updateInput = (args, valueField = 'value') => (e, d) => {
    const { input } = this.state
    const { form, fieldName, context } = args
    const value = d[valueField]
    const field = this.fields[fieldName]
    const pattern = field.mask({ form, fieldName, context, value })
    const mask = pattern ? new InputMask({ pattern }) : null
    const isMaskValid = mask ? mask.paste(value) : false

    if (!field.inputFilter({ value })) return
    if (pattern && !isMaskValid) return

    input[fieldName] = value
    this.setState({ input })
  }

  hasFieldError = args => {
    const { fieldName } = args

    return (
      !this.fields[fieldName].validate(args) ||
      this.fieldErrorMessage(fieldName) !== null
    )
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

  handleHelp = name => {
    const { helpState } = this.state
    helpState[name] = !(helpState[name] || false)
    this.setState({ helpState })
  }

  render() {
    const { input, helpState } = this.state
    const { asyncState, context } = this.props
    const allValid = _.reduce(
      this.fields,
      (result, value, key) =>
        result &&
        value.validate({
          form: input,
          context,
          fieldName: key,
          value: input[key],
        }),
      true,
    )
    const save = (
      <Table.Row>
        <Table.Cell />
        <Table.Cell style={{ textAlign: 'right' }}>
          <Button
            loading={asyncState.isLoading}
            disabled={!allValid || asyncState.isLoading}
            primary
            negative={!allValid}
            onClick={this.handleSave}
          >
            Save
          </Button>
        </Table.Cell>
      </Table.Row>
    )

    const rows = _.map(this.fields, (f, name) => {
      const {
        type,
        label,
        placeholder,
        options,
        content,
        displayIf,
        inputLabel,
        help,
      } = f
      let control = null
      const args = { form: input, context, fieldName: name, value: input[name] }
      const resolvedType = type(args)
      switch (resolvedType) {
        case 'Text':
          control = (
            <Input
              error={this.hasFieldError(args)}
              placeholder={placeholder({
                form: input,
                context,
                fieldName: name,
              })}
              value={input[name]}
              style={{ width: '100%' }}
              onChange={this.updateInput(args)}
              label={inputLabel(args) || null}
            />
          )
          break
        case 'Dropdown':
          control = (
            <Dropdown
              error={this.hasFieldError(args)}
              fluid
              selection
              options={options(args)}
              defaultValue={input[name]}
              onChange={this.updateInput(args)}
              style={{ width: '100%' }}
              label={inputLabel(args) || null}
            />
          )
          break
        case 'Toggle':
          control = (
            <Checkbox
              toggle
              defaultChecked={input[name]}
              onChange={this.updateInput(args, 'checked')}
            />
          )
          break
        case 'Section':
          control = <Header h={3}>{label(args)}</Header>
          break
        case 'Div':
          control = content(args)
          break
        default:
          control = <div>Type {type} invalid</div>
          break
      }
      if (!displayIf(args)) return null
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
              <Table.Cell collapsing>
                {label(args)}{' '}
                {help(args) && (
                  <Icon
                    circular
                    link
                    size="mini"
                    name="help"
                    inverted={helpState[name] || false}
                    style={{ position: 'relative', top: -3 }}
                    onClick={() => this.handleHelp(name)}
                  />
                )}
              </Table.Cell>
              <Table.Cell>
                {control}
                {helpState[name] && <Label pointing>{help(args)}</Label>}
                {this.hasFieldError(args) && (
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
