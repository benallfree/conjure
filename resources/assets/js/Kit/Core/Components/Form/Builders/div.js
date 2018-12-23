import { field } from './field'

function div(config = {}) {
  return field({
    render: props => {
      const {
        fieldInfo: { content },
      } = props
      return content(props)
    },
    type: 'Div',
    ...config,
  })
}

export { div }
