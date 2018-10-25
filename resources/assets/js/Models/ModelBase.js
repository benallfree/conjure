import moment from 'moment'
import _ from 'lodash'

export class ModelBase {
  static SAFETY_LIMIT = 1000

  static DATES = ['createdAt', 'updatedAt']

  constructor(item) {
    _.each(this.constructor.transform(item), (v, k) => {
      this[k] = v
    })
  }

  static getDates(extra = []) {
    return [...this.DATES, ...extra]
  }

  static getMutators() {
    return _.reduce(
      this.getDates(),
      (r, v) => {
        r[v] = moment
        return r
      },
      {},
    )
  }

  static transform(item) {
    const final = _.clone(item)
    _.each(item, (v, k) => {
      if (this.getMutators()[k]) {
        final[k] = this.getMutators()[k](v)
      } else if (typeof v === 'object') {
        final[k] = this.transform(v)
      }
    })
    return final
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
