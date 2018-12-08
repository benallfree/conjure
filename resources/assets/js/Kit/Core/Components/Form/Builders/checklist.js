function checklist(config = {}) {
  return {
    type: 'Checklist',
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

export { checklist }
