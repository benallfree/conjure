import emailMask from 'text-mask-addons/dist/emailMask'
import { text } from './text'

function email(config = {}) {
  return text({
    validate: ({ value }) => {
      if (!value) return true
      const isValid =
        value.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ) !== null
      if (!isValid) return 'That does not appear to be an email address.'
      return true
    },
    icon: 'at',
    type: 'Email',
    ...config,
  })
}

export { email }
