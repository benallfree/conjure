import React from 'react'
import { Input } from 'semantic-ui-react'
import MaskedInput from 'react-text-mask'

const Text = props => {
  const { fieldInfo, value, error, onBlur, onChange } = props
  const { placeholder, inputLabel, mask, icon, params } = fieldInfo
  return (
    <Input
      error={error}
      label={inputLabel(props) || null}
      style={{ width: '100%' }}
      onBlur={onBlur}
      icon={icon(props)}
      iconPosition="left"
      input={
        <MaskedInput
          mask={mask(props)}
          value={value}
          placeholder={placeholder(props)}
          showMask={mask(props) !== false}
          onChange={onChange}
        />
      }
      {...params(props)}
    />
  )
}

export { Text }
