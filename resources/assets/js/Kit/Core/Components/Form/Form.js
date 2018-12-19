import React, { Component } from 'react'
import _ from 'lodash'
import { Table, Button, Message, Header, Icon, Label } from 'semantic-ui-react'
import { subscribe } from 'react-contextual'
import { ComponentBase } from '../ComponentBase'

@subscribe('ioc')
class Form extends ComponentBase {
  loadState() {
    const input = {}
    const { context, fields } = this.props
    let allValid = true
    const validState = {}
    _.each(fields, (fieldInfo, name) => {
      const { defaultValue, validate, format, options } = fieldInfo
      let v = defaultValue({ context, fieldInfo, options })
      const isValid = validate({ context, fieldInfo, value: v }) === true
      allValid = allValid && isValid
      if (isValid) {
        v = format({ context, fieldInfo, value: v })
      }
      validState[name] = true
      input[name] = v === null ? '' : v
    })
    return {
      input,
      helpState: {},
      allValid,
      validState,
      changedSinceLastBlur: true,
      fieldErrors: {},
    }
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

  handleChange = (args, cb = newArgs => {}) => {
    const { input } = this.state
    const {
      fieldInfo: { unmask, calculate },
      name,
    } = args
    const value = unmask(args)
    const mutatedInput = { ...input, [name]: value }
    const mutatedArgs = { ...args, form: mutatedInput, value }
    calculate(mutatedArgs)
    this.setState({ input: mutatedInput, changedSinceLastBlur: true }, () =>
      this.setState({ allValid: this.calcAllValid() }, () => cb(mutatedArgs)),
    )
    this.props.onChange(name, value, mutatedInput)
  }

  calcAllValid() {
    const { fields } = this.props
    return _.reduce(
      fields,
      (res, f, name) => {
        const { input } = this.state
        const { context } = this.props
        const { validate } = f
        const args = {
          form: input,
          context,
          fieldInfo: f,
          value: input[name],
          name,
        }
        const validResult = validate(args)
        const isValid = validResult === true
        return res && isValid
      },
      true,
    )
  }

  handleBlur = args => {
    const { value } = args
    if (value.length === 0) return
    this.validate(args, () => {
      const { input } = this.state
      const { fieldInfo, name } = args
      const { format } = fieldInfo
      const formattedValue = format({ ...args, value: input[name] })
      const mutatedInput = { ...input, [name]: formattedValue }
      this.setState({ input: mutatedInput }, () => this.notifyValidState())
    })
  }

  validate = (args, cb = null) => {
    const { validState, fieldErrors } = this.state
    const { fieldInfo, name } = args
    const { validate } = fieldInfo
    const validResult = validate(args)
    validState[name] = validResult === true
    fieldErrors[name] = validResult
    const allValid = this.calcAllValid()
    this.setState({ allValid, validState, fieldErrors }, cb)
    return validState[name]
  }

  hasFieldError = args => {
    const { validState } = this.state
    const { name } = args

    return validState[name] === false
  }

  fieldErrorMessage = fieldName => {
    const { fieldErrors } = this.state
    return fieldErrors[fieldName]
  }

  validateAll = () => {
    const { fields } = this.props

    return _.reduce(
      fields,
      (res, f, name) => {
        const { input } = this.state
        const { context } = this.props
        const args = {
          form: input,
          context,
          fieldInfo: f,
          value: input[name],
          name,
        }
        const isValid = this.validate(args)
        return res && isValid
      },
      true,
    )
  }

  handleSave = () => {
    if (!this.calcAllValid()) return

    const { input } = this.state
    const { onSubmit, fields } = this.props
    this.setState({
      save: onSubmit(input)
        .then(() => {
          const fieldErrors = {}
          const validState = {}
          this.setState({ fieldErrors, validState })
        })
        .catch(e => {
          if (!(e.response && e.response.messages)) throw e
          const fieldErrors = {}
          const validState = {}
          _.each(_.pick(e.response.messages, _.keys(fields)), (m, k) => {
            fieldErrors[k] = m
            validState[k] = false
          })
          fieldErrors['*'] = e.response.messages['*']
          this.setState({ fieldErrors, validState })
          throw e
        }),
    })
  }

  handleHelp = name => {
    const { helpState } = this.state
    helpState[name] = !(helpState[name] || false)
    this.setState({ helpState })
  }

  handleCancel = () => {
    const { onCancel } = this.props
    if (!onCancel) return
    onCancel()
  }

  saveButtons() {
    const { allValid } = this.state
    const save = this.asyncState('save')
    const {
      onCancel,
      saveButtonText,
      saveButtonIcon,
      cancelButtonText,
    } = this.props
    return (
      <React.Fragment>
        {onCancel && (
          <Button negative onClick={this.handleCancel}>
            <Icon name="close" />
            {cancelButtonText}
          </Button>
        )}
        <Button
          loading={save.isLoading}
          disabled={!allValid || save.isLoading}
          primary
          onClick={this.handleSave}
        >
          {saveButtonIcon && <Icon name={saveButtonIcon} />}
          {saveButtonText}
        </Button>
      </React.Fragment>
    )
  }

  renderSectionRow(control, args) {
    const { inputsOnly } = this.props
    if (inputsOnly) {
      return (
        <React.Fragment>
          <div style={{ marginTop: 20 }}>{control}</div>
        </React.Fragment>
      )
    }
    return (
      <Table.Row>
        <Table.Cell style={{ backgroundColor: 'initial' }} colSpan={2}>
          <div style={{ marginTop: 20 }}>{control}</div>
        </Table.Cell>
      </Table.Row>
    )
  }

  renderDefaultRow(control, args) {
    const { helpState } = this.state
    const { inputsOnly } = this.props
    const { name, fieldInfo } = args
    const { label, help } = fieldInfo
    return (
      <React.Fragment>
        {inputsOnly && (
          <React.Fragment>
            {control}
            {this.hasFieldError(args) && (
              <div style={{ color: 'red' }}>{this.fieldErrorMessage(name)}</div>
            )}
          </React.Fragment>
        )}
        {!inputsOnly && (
          <Table.Row>
            <Table.Cell collapsing style={{ verticalAlign: 'top' }}>
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
        )}
      </React.Fragment>
    )
  }

  buildFormRows() {
    const { input } = this.state
    const { context, fields } = this.props

    return _.map(fields, (f, name) => {
      const { type, displayIf, render } = f
      let control = null
      const args = {
        form: input,
        context,
        fieldInfo: f,
        value: input[name],
        name,
      }
      const props = {
        ...args,
        error: this.hasFieldError(args),
        onBlur: this.handleBlur,
        onChange: (value, cb = () => {}) =>
          this.handleChange({ ...args, value }, cb),
      }
      if (!displayIf(args)) return null
      const resolvedType = type(args)
      control = render(props)

      switch (resolvedType) {
        case 'Section':
          return this.renderSectionRow(control, args)
        default:
          return this.renderDefaultRow(control, args)
      }
    })
  }

  renderLoaded() {
    const save = this.asyncState('save')
    const { inputsOnly, submittedMessage, submittingMessage } = this.props

    const saveButtons = this.saveButtons()

    const rows = this.buildFormRows()

    return (
      <React.Fragment>
        {save.isLoaded && <Message success>{submittedMessage}</Message>}
        {save.isLoading && <Message>{submittingMessage}</Message>}
        {save.error && (
          <Message error>
            {this.fieldErrorMessage('*') ||
              'Please correct the errors below and try again.'}
          </Message>
        )}
        {inputsOnly && (
          <React.Fragment>
            {_.map(rows, (r, idx) => (
              <div key={idx} style={{ marginBottom: 5 }}>
                {r}
              </div>
            ))}
            {saveButtons}
          </React.Fragment>
        )}
        {!inputsOnly && (
          <Table definition>
            <Table.Body>
              {rows}
              <Table.Row>
                <Table.Cell />
                <Table.Cell style={{ textAlign: 'right' }}>
                  {saveButtons}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )}
      </React.Fragment>
    )
  }
}

Form.defaultProps = {
  onChange: () => {},
  onSubmit: () => {},
  onCancel: null,
  onValid: () => {},
  onInvalid: () => {},
  saveButtonText: 'Save',
  saveButtonIcon: null,
  cancelButtonText: 'Cancel',
  inputsOnly: false,
  submittingMessage: 'Saving...',
  submittedMessage: 'Saved.',
}

export { Form }
