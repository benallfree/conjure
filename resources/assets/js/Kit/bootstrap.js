import moment from 'moment-timezone'
window._ = require('lodash')
moment.tz.setDefault('UTC')
window.axios = require('axios')
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
