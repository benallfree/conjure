import _ from 'lodash'

function fieldState(props) {
  return _.pick(props, [
    'item',
    'form',
    'fieldInfo',
    'error',
    'value',
    'name',
    'onChange',
    'onBlur',
  ])
}

export { fieldState }
