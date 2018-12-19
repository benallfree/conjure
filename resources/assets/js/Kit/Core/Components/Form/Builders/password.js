import { text } from './text'

function password(config = {}) {
  return text({
    params: { type: 'password' },
    icon: 'key',
    ...config,
  })
}

export { password }
