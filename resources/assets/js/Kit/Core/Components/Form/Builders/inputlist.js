function inputlist(config = {}) {
  return {
    type: 'Inputlist',
    defaultValue: info => {
      const { options } = info
      const ret = {}
      _.each(options(info), (v, k) => {
        ret[k] = false
      })
      return ret
    },
    ...config,
  }
}

export { inputlist }
