import _ from 'lodash'
import { field } from './field'

function inputlist(config = {}) {
  return field({
    defaultValue: info => {
      const { options } = info
      const ret = {}
      _.each(options(info), (v, k) => {
        ret[k] = false
      })
      return ret
    },
    type: 'Inputlist',
    ...config,
  })
}

export { inputlist }
