import React, { Component } from 'react'
import _ from 'lodash'
import { Input } from 'semantic-ui-react'
import { fieldState } from '../fieldState'

function j(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

class MaskedTextInput extends Component {
  constructor(props) {
    super(props)
    const {
      fieldInfo: { conformValue },
    } = props
    this.state = {
      value: conformValue({
        ...fieldState(props),
        value: props.value,
      }),
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value !== prevProps.value) {
      const {
        fieldInfo: { conformValue },
      } = this.props
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        value: conformValue({
          ...fieldState(this.props),
          value: this.props.value,
        }),
      })
    }
  }

  handleBlur = () => {
    const {
      fieldInfo: { unmask, conformValue },
      onChange,
      onBlur,
    } = this.props
    const { value } = this.state
    const textArgs = fieldState(this.props)
    const unmaskedValue = unmask({ ...textArgs, value })
    const newConformedValue = conformValue({
      ...textArgs,
      value: unmaskedValue,
    })
    const finalUnmaskedValue = unmask({ ...textArgs, value: newConformedValue })
    onChange({ ...textArgs, value: finalUnmaskedValue }, onBlur)
  }

  handleChange = e => {
    this.setState({ value: e.target.value })
  }

  render() {
    const {
      fieldInfo: { placeholder, inputLabel, icon, params, conformValue },
      error,
      onBlur,
    } = this.props
    const textArgs = fieldState(this.props)
    const { value } = this.state

    const conformedValue = conformValue(textArgs)
    return (
      <Input
        error={error}
        label={inputLabel(textArgs) || null}
        style={{ width: '100%' }}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        icon={icon(textArgs)}
        iconPosition="left"
        placeholder={placeholder(textArgs)}
        value={value}
        {...params(textArgs)}
      />
    )
  }
}

export { MaskedTextInput }
