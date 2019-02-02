import React, { Component } from 'react'
import _ from 'lodash'
import { Table, Button, Message, Header, Icon, Label } from 'semantic-ui-react'
import { subscribe } from 'react-contextual'
import { ComponentBase } from '../ComponentBase'

@subscribe('ioc')
class Form extends ComponentBase {
  loadState() {
    const input = {}
    const { fields } = this.props
    let allValid = true
    const validState = {}
    _.each(fields, (fieldInfo, name) => {
      const { defaultValue, validate } = fieldInfo
      if (!defaultValue) return
      const args = { form: input, fieldInfo }
      const v = defaultValue(args)
      const isValid = validate({ ...args, value: v }) === true
      allValid = allValid && isValid
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
    const { onValid, onInvalid } = this.props
    if (!changedSinceLastBlur) return
    this.setState({ changedSinceLastBlur: false })
    if (allValid) {
      onValid(input)
    } else {
      onInvalid(input)
    }
  }

  handleChange = (args, cb = newArgs => {}) => {
    const { input } = this.state
    const { name, value } = args
    const mutatedInput = { ...input, [name]: value }
    const mutatedArgs = { ...args, form: mutatedInput }
    this.setState({ input: mutatedInput, changedSinceLastBlur: true }, () =>
      this.setState({ allValid: this.calcAllValid() }, () => cb(mutatedArgs)),
    )
    this.props.onChange(name, value, mutatedInput)
  }

  calcAllValid() {
    const { input } = this.state
    const { fields } = this.props
    return _.reduce(
      input,
      (res, value, name) => {
        const fieldInfo = fields[name]
        const { validate } = fieldInfo
        const args = {
          form: input,
          fieldInfo,
          value,
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
    const { name, value } = args
    this.validate(args, () => {
      const { input } = this.state
      const mutatedInput = { ...input, [name]: value }
      this.setState({ input: mutatedInput }, () => {
        this.notifyValidState()
        this.props.onBlur(name, value, mutatedInput)
      })
    })
  }

  validate = (args, cb = null) => {
    const { validState, fieldErrors } = this.state
    const { fieldInfo, name } = args
    const { validate } = fieldInfo
    const validResult = validate(args)
    const allValid = this.calcAllValid()
    this.setState(
      {
        allValid,
        validState: { ...validState, [name]: validResult === true },
        fieldErrors: {
          ...fieldErrors,
          [name]: validResult === true ? null : validResult,
        },
      },
      cb,
    )
    return validState[name]
  }

  hasFieldError = name => {
    const { validState } = this.state

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
        const args = {
          form: input,
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
    const { allValid, input } = this.state
    const save = this.asyncState('save')
    const {
      onSubmit,
      onCancel,
      submitButtonText,
      submitButtonIcon,
      cancelButtonText,
    } = this.props
    return (
      <React.Fragment>
        {onCancel && (
          <Button negative onClick={this.handleCancel}>
            <Icon name="close" />
            {typeof cancelButtonText === 'function'
              ? cancelButtonText(input)
              : cancelButtonText}
          </Button>
        )}
        {onSubmit && (
          <Button
            loading={save.isLoading}
            disabled={!allValid || save.isLoading}
            primary
            onClick={this.handleSave}
          >
            {submitButtonIcon && <Icon name={submitButtonIcon} />}
            {typeof submitButtonText === 'function'
              ? submitButtonText(input)
              : submitButtonText}
          </Button>
        )}
      </React.Fragment>
    )
  }

  renderSectionRow(control, fieldInfo, args) {
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

  renderDefaultRow(control, fieldInfo, args) {
    const { helpState } = this.state
    const { inputsOnly } = this.props
    const { name } = args
    const { label, help } = fieldInfo
    return (
      <React.Fragment>
        {inputsOnly && <React.Fragment>{control}</React.Fragment>}
        {!inputsOnly && (
          <Table.Row>
            <Table.Cell collapsing style={{ verticalAlign: 'top' }}>
              {label(args)}{' '}
              {help &&
                help(args) && (
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
            <Table.Cell>{control}</Table.Cell>
          </Table.Row>
        )}
      </React.Fragment>
    )
  }

  buildFormRows() {
    const { input, helpState } = this.state
    const { fields } = this.props

    return _.map(fields, (f, name) => {
      const { type, displayIf, render } = f
      const args = {
        form: input,
        value: input[name],
        name,
        fieldInfo: f,
        errorMessage: this.fieldErrorMessage(name),
        showHelp: helpState[name],
      }
      if (!displayIf(args)) return null
      const control = render({
        ...args,
        onBlur: this.handleBlur,
        onChange: (eventArgs, cb = () => {}) =>
          this.handleChange({ ...args, ...eventArgs }, cb),
      })

      const resolvedType = type(args)
      switch (resolvedType) {
        case 'Section':
          return this.renderSectionRow(control, f, args)
        default:
          return this.renderDefaultRow(control, f, args)
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
  onBlur: () => {},
  onSubmit: null,
  onCancel: null,
  onValid: () => {},
  onInvalid: () => {},
  submitButtonText: 'Save',
  submitButtonIcon: null,
  cancelButtonText: 'Cancel',
  inputsOnly: false,
  submittingMessage: 'Saving...',
  submittedMessage: 'Saved.',
}

export { Form }
