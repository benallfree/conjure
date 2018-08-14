import moment from 'moment'
import _ from 'lodash'

export class ModelBase {
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
    const ret = _.map(items, (v, k) => new this(v))
    return ret
  }
}
