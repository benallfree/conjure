import React, { Component } from 'react'
import _ from 'lodash'
import { Checkbox, List } from 'semantic-ui-react'

class Checklist extends Component {
  constructor(props) {
    super(props)
    const values = {}
    const { options, value } = props
    _.each(options, v => {
      values[v.key] = value || false
    })
    this.state = {
      values,
    }
  }

  handleChange = opt => (e, d) => {
    const { values } = this.state
    const { onChange } = this.props
    values[opt.key] = d.checked

    this.setState({ values }, () => onChange(e, { value: values }))
  }

  toggleCheck = opt => e => {
    const { values } = this.state
    const { onChange } = this.props
    values[opt.key] = !values[opt.key]
    this.setState({ values }, () => onChange(e, { value: values }))
  }

  render() {
    const {
      fieldInfo: { options },
      error,
      onChange,
    } = this.props
    const { values } = this.state
    return (
      <List>
        {_.map(options(this.props), opt => (
          <List.Item key={opt.key}>
            <Checkbox
              className={error ? 'error' : ''}
              checked={values[opt.key]}
              onChange={this.handleChange(opt)}
            />
            <div
              style={{ display: 'inline-block', cursor: 'pointer' }}
              onClick={this.toggleCheck(opt)}
            >
              {opt.text}
            </div>
          </List.Item>
        ))}
      </List>
    )
  }
}

Checklist.defaultProps = {
  onChange: () => {},
  options: {},
}

export { Checklist }
