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
import { ComponentBase, ASYNC } from './ComponentBase'

class Form extends ComponentBase {
  loadState() {
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
    return {
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
      changedSinceLastBlur: true,
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
      function create() {
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

      const handler = create()
      switch (handlerName) {
        case 'validate':
          return args => {
            const { fieldInfo, value } = args
            const { required } = fieldInfo
            const isRequired = required(args)
            const isEmpty =
              value === undefined ||
              value === null ||
              (typeof value === 'string' && value.trim().length === 0)
            const isValid = (!isRequired && isEmpty) || handler(args)
            return isValid
          }
        case 'defaultValue':
          return args => {
            const { fieldInfo } = args
            const { format, defaultValue } = fieldInfo
            let value = handler(args)
            const isEmpty =
              value === undefined ||
              value === null ||
              (typeof value === 'string' && value.trim().length === 0)
            if (!isEmpty) {
              value = format({ ...args, value })
            }
            return value
          }
        default:
      }
      return handler
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

  componentDidMount() {
    super.componentDidMount()
    setImmediate(() => this.notifyValidState())
  }

  notifyValidState() {
    const { allValid, input, changedSinceLastBlur } = this.state
    const { onValid, onInvalid, context } = this.props
    if (!changedSinceLastBlur) return
    this.setState({ changedSinceLastBlur: false })
    if (allValid) {
      onValid(input, context)
    } else {
      onInvalid(input, context)
    }
  }

  handleChange = (args, valueField = 'value') => (e, d) => {
    const { input } = this.state
    const { fieldInfo } = args
    const { name, unmask } = fieldInfo
    const { value: maskedValue, ...rest } = args
    const value = unmask({ ...rest, value: d[valueField] })
    input[fieldInfo.name] = value
    this.setState({ input, changedSinceLastBlur: true })
    this.props.onChange(fieldInfo.name, value, input)
  }

  handleBlur = args => e => {
    this.validate(args, () => {
      const { input } = this.state
      const { fieldInfo } = args
      const { format } = fieldInfo
      input[fieldInfo.name] = format(args)
      this.setState({ input }, () => {
        this.notifyValidState()
      })
    })
  }

  validate = (args, cb = null) => {
    const { validState } = this.state
    const { fieldInfo } = args
    const { name, validate } = fieldInfo
    validState[name] = validate(args)
    const allValid = _.reduce(
      validState,
      (result, value, key) => result && value,
      true,
    )
    this.setState({ allValid, validState }, cb)
    return validState[name]
  }

  hasFieldError = args => {
    const { validState } = this.state
    const { fieldInfo } = args
    const { name } = fieldInfo

    return !validState[name] || this.fieldErrorMessage(fieldInfo.name) !== null
  }

  fieldErrorMessage = fieldName => {
    const { save } = this.state
    try {
      return save.error.response.messages[fieldName] || null
    } catch (e) {
      return null
    }
  }

  handleSave = () => {
    const { input } = this.state
    const { onSave } = this.props
    this.setState({ save: onSave(input) })
  }

  handleHelp = name => {
    const { helpState } = this.state
    helpState[name] = !(helpState[name] || false)
    this.setState({ helpState })
  }

  renderLoaded() {
    const { input, helpState, allValid, save = ASYNC } = this.state
    const { context } = this.props

    const saveButton = (
      <Table.Row>
        <Table.Cell />
        <Table.Cell style={{ textAlign: 'right' }}>
          <Button
            loading={save.isLoading}
            disabled={!allValid || save.isLoading}
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
              onBlur={this.handleBlur(args)}
              input={
                <MaskedInput
                  mask={mask(args)}
                  value={input[name]}
                  placeholder={placeholder(args)}
                  showMask={mask(args) !== false}
                  onChange={event =>
                    this.handleChange(args)(event, {
                      value: event.target.value,
                    })
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
              onChange={this.handleChange(args)}
              style={{ width: '100%' }}
              label={inputLabel(args) || null}
              onBlur={this.handleBlur(args)}
            />
          )
          break
        case 'Toggle':
          control = (
            <Checkbox
              toggle
              defaultChecked={input[name]}
              onChange={this.handleChange(args, 'checked')}
              onBlur={this.handleBlur(args)}
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
        {save.isLoaded && <Message success>Saved</Message>}
        {save.isLoading && <Message>Saving</Message>}
        {save.error && (
          <Message error>
            Please correct the errors below and try again.
          </Message>
        )}
        <Table definition>
          <Table.Body>
            {rows}
            {saveButton}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

Form.defaultProps = {
  onChange: () => {},
  onSave: () => {},
  onValid: () => {},
  onInvalid: () => {},
}

export * from './formFuncs'
export { Form }
