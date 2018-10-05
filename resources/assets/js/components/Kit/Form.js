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
import MaskedInput from 'react-text-mask'
import { createMask } from './formFuncs'

class Form extends Component {
  constructor(props) {
    super(props)
    const input = {}
    const { context } = this.props
    let allValid = true
    this.fields = this.buildFields()
    _.each(this.fields, fieldInfo => {
      const { name, defaultValue, validate, format } = fieldInfo
      let v = defaultValue({ context, fieldInfo })
      allValid = allValid && validate({ context, fieldInfo, value: v })
      if (allValid) {
        v = format({ context, fieldInfo, value: v })
      }
      input[name] = v === null ? '' : v
    })
    this.state = {
      input,
      helpState: {},
      allValid,
      validState: _.reduce(
        this.fields,
        (res, value, key) => {
          res[key] = true
          return res
        },
        {},
      ),
    }
  }

  buildFields() {
    const defaults = {
      required: false,
      type: () => 'Text',
      placeholder: ({ fieldInfo }) => changeCase.title(fieldInfo.name),
      label: ({ fieldInfo }) => changeCase.title(fieldInfo.name),
      options: () => [],
      content: ({ fieldInfo }) => (
        <div>{changeCase.title(fieldInfo)} content</div>
      ),
      displayIf: () => true,
      defaultValue: ({ fieldInfo }) => changeCase.title(fieldInfo.name),
      inputLabel: () => '',
      help: () => null,
      validate: () => true,
      mask: () => false,
      unmask: ({ value }) => value,
      inputFormat: ({ value }) => value,
      format: ({ value }) => value,
      input: ({ value }) => value,
    }

    function createHandler({ handlerName, fieldHandler, defaultHandler }) {
      let val = fieldHandler
      if (val === undefined) val = defaultHandler
      if (typeof val === 'function') return val
      switch (handlerName) {
        case 'mask':
          if (typeof val === 'string') {
            val = createMask(val)
            return () => val
          }
          break
        case 'unmask':
          if (val instanceof RegExp) {
            return ({ value }) => value.replace(val, '')
          }
          break
        case 'validate':
          if (val instanceof RegExp) {
            return ({ value }) => (value ? value.match(val) !== null : true)
          }
          break
        default:
          break
      }
      return () => val
    }

    const { fields } = this.props
    const ret = {}
    _.each(fields, (f, fieldName) => {
      ret[fieldName] = { name: fieldName }
      _.each(defaults, (v, k) => {
        ret[fieldName][k] = createHandler({
          handlerName: k,
          fieldHandler: f[k],
          defaultHandler: v,
        })
      })
    })

    return ret
  }

  updateInput = (args, valueField = 'value') => (e, d) => {
    console.log({ args, valueField, e, d })
    const { input } = this.state
    const { fieldInfo } = args
    const { name, unmask } = fieldInfo
    const { value: maskedValue, ...rest } = args
    const value = unmask({ ...rest, value: d[valueField] })
    console.log({ previuous: args.value, current: value, raw: d[valueField] })
    input[fieldInfo.name] = value
    this.setState({ input })
  }

  onBlur = args => e => {
    if (this.validate(args)) {
      const { fieldInfo } = args
      const { format } = fieldInfo
      const { input } = this.state
      input[fieldInfo.name] = format(args)
      this.setState({ input })
    }
  }

  validate = args => {
    const { validState } = this.state
    const { fieldInfo, value } = args
    const { name, validate, required } = fieldInfo
    const isRequired = required(args)
    const isEmpty =
      value === undefined ||
      (typeof value === 'string' && value.trim.length === 0)
    validState[name] = (!isRequired && isEmpty) || validate(args)
    const allValid = _.reduce(
      validState,
      (result, value, key) => result && value,
      true,
    )
    this.setState({ allValid, validState })
    return validState[name]
  }

  hasFieldError = args => {
    const { validState } = this.state
    const { fieldInfo } = args
    const { name } = fieldInfo

    return !validState[name] || this.fieldErrorMessage(fieldInfo.name) !== null
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
    const { input, helpState, allValid } = this.state
    const { asyncState, context } = this.props

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
        mask,
      } = f
      let control = null
      const args = { form: input, context, fieldInfo: f, value: input[name] }
      const resolvedType = type(args)
      switch (resolvedType) {
        case 'Text':
          control = (
            <Input
              error={this.hasFieldError(args)}
              label={inputLabel(args) || null}
              style={{ width: '100%' }}
              onBlur={this.onBlur(args)}
              input={
                <MaskedInput
                  mask={mask(args)}
                  value={input[name]}
                  placeholder={placeholder(args)}
                  showMask={mask(args) !== false}
                  onChange={event =>
                    this.updateInput(args)(event, { value: event.target.value })
                  }
                />
              }
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
              onBlur={this.onBlur(args)}
            />
          )
          break
        case 'Toggle':
          control = (
            <Checkbox
              toggle
              defaultChecked={input[name]}
              onChange={this.updateInput(args, 'checked')}
              onBlur={this.onBlur(args)}
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

export * from './formFuncs'
export { Form }
