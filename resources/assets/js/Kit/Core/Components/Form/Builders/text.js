import React from 'react'
import { Input } from 'semantic-ui-react'
import MaskedInput from 'react-text-mask'
import { field } from './field'

function text(config = {}) {
  return field({
    render: props => {
      const {
        fieldInfo: { placeholder, inputLabel, mask, icon, params },
        value,
        error,
        onBlur,
        onChange,
      } = props
      return (
        <Input
          error={error}
          label={inputLabel(props) || null}
          style={{ width: '100%' }}
          onBlur={() => onBlur(props)}
          icon={icon(props)}
          iconPosition="left"
          input={
            <MaskedInput
              mask={mask(props)}
              value={value}
              placeholder={placeholder(props)}
              showMask={mask(props) !== false}
              onChange={e => onChange(e.target.value)}
            />
          }
          {...params(props)}
        />
      )
    },
    ...config,
  })
}

export { text }
