import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { DateInput } from 'semantic-ui-calendar-react'
import { Grid, Dropdown } from 'semantic-ui-react'

const DATE_FORMAT = 'M/D/YY'
const OPTIONS = {
  '7day': {
    label: '7 days',
    start: moment().subtract(7, 'days'),
  },
  '30day': {
    label: '30 days',
    start: moment().subtract(30, 'days'),
  },
  thisMonth: {
    label: 'This Month',
    start: moment().date(1),
  },
  lastMonth: {
    label: 'Last Month',
    start: moment()
      .subtract(1, 'month')
      .startOf('month'),
    end: moment()
      .subtract(1, 'month')
      .endOf('month'),
  },
  prevMonth: {
    label: 'Previous Month',
    start: moment()
      .subtract(2, 'month')
      .startOf('month'),
    end: moment()
      .subtract(2, 'month')
      .endOf('month'),
  },
  last6Month: {
    label: 'Last 6 Months',
    start: moment().subtract(6, 'month'),
  },
  lastYear: {
    label: 'Last Year',
    start: moment()
      .subtract(1, 'year')
      .startOf('year'),
    end: moment()
      .subtract(1, 'year')
      .endOf('year'),
  },
  custom: {
    label: 'Custom',
  },
}

function createDateRange(v) {
  let start = moment().startOf('day')
  let end = moment()
  if (OPTIONS[v]) {
    start = OPTIONS[v].start || moment()
    end = OPTIONS[v].end || moment()
  }
  return { start: start.startOf('day'), end: end.endOf('day') }
}

class DatePicker extends React.Component {
  handleDateChange = (e, { name, value }) => {
    this.setState({ [name]: moment(value, DATE_FORMAT) }, this.notifyChange)
  }

  componentWillMount() {
    this.setDateRange('lastMonth')
  }

  onDateSelected = (e, d) => {
    this.setDateRange(d.value, this.notifyChange)
  }

  setDateRange = (v, cb = null) => {
    const { start, end } = createDateRange(v)
    this.setState(
      {
        date: v,
        start,
        end,
        isCustomOpen: v === 'custom',
      },
      cb,
    )
  }

  notifyChange() {
    const { onChange } = this.props
    if (!onChange) return
    const { start, end } = this.state
    onChange(start, end)
  }

  /* eslint-disable indent */
  render() {
    const { start, end, date, isCustomOpen } = this.state
    return (
      <Grid columns={3} style={{ marginLeft: 10 }}>
        <Grid.Column>
          <Dropdown
            placeholder="Date Range"
            fluid
            selection
            options={_.map(OPTIONS, (v, k) => ({
              key: k,
              text: v.label,
              value: k,
            }))}
            onChange={this.onDateSelected}
            text={
              date === 'custom'
                ? 'Custom'
                : `${start.format(DATE_FORMAT)} - ${end.format(DATE_FORMAT)}`
            }
          />
        </Grid.Column>
        {date === 'custom' &&
          isCustomOpen && (
            <React.Fragment>
              <Grid.Column>
                <DateInput
                  dateFormat={DATE_FORMAT}
                  value={start.format(DATE_FORMAT)}
                  name="start"
                  onChange={this.handleDateChange}
                />
                From
              </Grid.Column>
              <Grid.Column>
                <DateInput
                  dateFormat={DATE_FORMAT}
                  value={end.format(DATE_FORMAT)}
                  name="end"
                  onChange={this.handleDateChange}
                />
                To
              </Grid.Column>
            </React.Fragment>
          )}
      </Grid>
    )
  }
}

export { DatePicker, createDateRange }
