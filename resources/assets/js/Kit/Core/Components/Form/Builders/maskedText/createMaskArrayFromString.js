import _ from 'lodash'

function createMaskArrayFromString(s) {
  const arr = _.map(s, c => {
    if (c.match(/\d/) !== null) {
      return /\d/
    }
    return c
  })
  return arr
}

export { createMaskArrayFromString }
