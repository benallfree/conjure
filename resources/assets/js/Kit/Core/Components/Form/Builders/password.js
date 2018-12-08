function password(config = {}) {
  return {
    params: () => {
      return { type: 'password' }
    },
    icon: () => 'key',
    ...config,
  }
}

export { password }
