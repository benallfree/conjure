import _ from 'lodash'
import { subscribe } from 'react-contextual'
import { ComponentBase } from '../ComponentBase'
import * as Renderers from './Renderers'
import * as Builders from './Builders'

@subscribe('ioc')
class Form extends ComponentBase {
  loadState() {
    const input = {}
    const { fields } = this.props
    let allValid = true
    const validState = {}
    _.each(fields, (fieldInfo, name) => {
      const { defaultValue, validate, displayIf } = fieldInfo
      if (!defaultValue) return
      const args = { form: input, fieldInfo }
      const v = defaultValue(args)
      const isValid =
        !displayIf({ ...args, value: v }) ||
        validate({ ...args, value: v }) === true
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
        if (!fieldInfo.displayIf(args)) return res

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

  renderLoaded() {
    const { renderer } = this.props
    const r = renderer.create(this)
    return r.render()
  }
}

Form.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  onSubmit: null,
  onCancel: null,
  onValid: () => {},
  onInvalid: () => {},
  submitButtonEnabled: true,
  submitButtonText: 'Save',
  submitButtonIcon: null,
  cancelButtonText: 'Cancel',
  cancelButtonEnabled: true,
  submittingMessage: 'Saving...',
  submittedMessage: 'Saved.',
  renderer: Renderers.Standard,
}

Form.Renderers = Renderers
Form.Builders = Builders

export { Form }
