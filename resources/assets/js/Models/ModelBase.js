import moment from 'moment'
import _ from 'lodash'

export class ModelBase {
  static SAFETY_LIMIT = 1000

  constructor(item) {
    _.each(item, (v, k) => {
      let final = _.clone(v)
      const mutators = {
        created_at: moment,
        updated_at: moment,
      }
      if (mutators[k]) {
        final = mutators[k](v)
      }
      this[k] = final
    })
  }

  static create(items) {
    if (this.SAFETY_LIMIT && items.length > this.SAFETY_LIMIT) {
      console.warn('Warning: truncating results for', items)
    }
    const arr = this.SAFETY_LIMIT ? items.slice(0, this.SAFETY_LIMIT) : items
    const ret = _.map(arr, (v, k) => new this(v))
    return ret
  }
}
