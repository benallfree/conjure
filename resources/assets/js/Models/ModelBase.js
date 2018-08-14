import moment from 'moment'

export class ModelBase {
  constructor(item) {
    for (let k in item) {
      let v = item[k]
      const mutators = {
        created_at: moment,
        updated_at: moment
      }
      if (mutators[k]) {
        v = mutators[k](v)
      }
      this[k] = v
    }
  }

  static create(items) {
    let ret = []
    for (let i in items) {
      ret.push(new this(items[i]))
    }
    return ret
  }
}
