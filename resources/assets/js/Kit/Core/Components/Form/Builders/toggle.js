function toggle(config = {}) {
  return {
    type: 'Toggle',
    defaultValue: false,
    ...config,
  }
}

export { toggle }
