import { text } from './text'

function password(config = {}) {
  return text({
    params: { type: 'password' },
    icon: 'key',
    type: 'Password',
    ...config,
  })
}

export { password }
