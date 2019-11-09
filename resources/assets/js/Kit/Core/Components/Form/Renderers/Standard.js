import React, { Component } from 'react'
import _ from 'lodash'
import { Table, Button, Message, Header, Icon, Label } from 'semantic-ui-react'

class Standard {
  static create(form) {
    const r = new Standard(form)
    return r
  }

  constructor(form) {
    this.form = form
  }

  row(type) {
    switch (type) {
      case 'Section':
        return (control, fieldInfo, args) => (
          <Table.Row>
            <Table.Cell style={{ backgroundColor: 'initial' }} colSpan={2}>
              <div style={{ marginTop: 20 }}>{control}</div>
            </Table.Cell>
          </Table.Row>
        )

      default:
        return (control, fieldInfo, args) => {
          const { helpState } = this.form.state
          const { name } = args
          const { label, help } = fieldInfo
          return (
            <React.Fragment>
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
                        onClick={() => this.form.handleHelp(name)}
                      />
                    )}
                </Table.Cell>
                <Table.Cell>{control}</Table.Cell>
              </Table.Row>
            </React.Fragment>
          )
        }
    }
  }

  messages() {
    const save = this.form.asyncState('save')
    const { submittedMessage, submittingMessage } = this.form.props
    return (
      <React.Fragment>
        {save.isLoaded && <Message success>{submittedMessage}</Message>}
        {save.isLoading && <Message>{submittingMessage}</Message>}
        {save.error && (
          <Message error>
            {this.form.fieldErrorMessage('*') ||
              'Please correct the errors below and try again.'}
          </Message>
        )}
      </React.Fragment>
    )
  }

  saveButtons() {
    const { allValid, input } = this.form.state
    const save = this.form.asyncState('save')
    const {
      onSubmit,
      onCancel,
      submitButtonEnabled,
      submitButtonText,
      submitButtonIcon,
      cancelButtonText,
      cancelButtonEnabled,
    } = this.form.props
    return (
      <React.Fragment>
        {onCancel && (
          <Button
            negative
            onClick={this.form.handleCancel}
            disabled={!cancelButtonEnabled}
          >
            <Icon name="close" />
            {typeof cancelButtonText === 'function'
              ? cancelButtonText(input)
              : cancelButtonText}
          </Button>
        )}
        {onSubmit && (
          <Button
            loading={save.isLoading}
            disabled={!submitButtonEnabled || !allValid || save.isLoading}
            primary
            onClick={this.form.handleSave}
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

  buildFieldControls() {
    const { input, helpState } = this.form.state
    const { fields } = this.form.props

    return _.map(fields, (f, name) => {
      const { type, displayIf, render } = f
      const args = {
        form: input,
        value: input[name],
        name,
        fieldInfo: f,
        errorMessage: this.form.fieldErrorMessage(name),
        showHelp: helpState[name],
      }
      if (!displayIf(args)) return null
      const control = render({
        ...args,
        onBlur: this.form.handleBlur,
        onChange: (eventArgs, cb = () => {}) =>
          this.form.handleChange({ ...args, ...eventArgs }, cb),
      })

      const resolvedType = type(args)
      return this.row(resolvedType)(control, f, args)
    })
  }

  fields() {
    const rows = this.buildFieldControls()
    return (
      <Table definition>
        <Table.Body>
          {_.map(rows, (r, idx) => (
            <React.Fragment key={idx}>{r}</React.Fragment>
          ))}
          <Table.Row>
            <Table.Cell />
            <Table.Cell style={{ textAlign: 'right' }}>
              {this.saveButtons()}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.messages()}
        {this.fields()}
      </React.Fragment>
    )
  }
}

export { Standard }
