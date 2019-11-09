import React from 'react'
import _ from 'lodash'

const guard = opts => {
  const config = _.defaults({}, opts, {
    test: () => true,
    onFailed: () => {
      console.error('Guard failed with no handler')
      return null
    },
  })
  return Component => {
    return props => {
      const { onFailed, test } = config
      if (!test({ ...props, ...config })) {
        return onFailed({ ...props, ...config })
      }
      return <Component {...props} />
    }
  }
}

export { guard }
