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
    start: moment().subtract('days', 7),
  },
  '30day': {
    label: '30 days',
    start: moment().subtract('days', 30),
  },
  thisMonth: {
    label: 'This Month',
    start: moment().date(1),
  },
  lastMonth: {
    label: 'Last Month',
    start: moment()
      .subtract('month', 1)
      .startOf('month'),
    end: moment()
      .subtract('month', 1)
      .endOf('month'),
  },
  prevMonth: {
    label: 'Previous Month',
    start: moment()
      .subtract('month', 2)
      .startOf('month'),
    end: moment()
      .subtract('month', 2)
      .endOf('month'),
  },
  last6Month: {
    label: 'Last 6 Months',
    start: moment().subtract('month', 6),
  },
  lastYear: {
    label: 'Last Year',
    start: moment()
      .subtract('year', 1)
      .startOf('year'),
    end: moment()
      .subtract('year', 1)
      .endOf('year'),
  },
  custom: {
    label: 'Custom',
  },
}

class DatePicker extends React.Component {
  handleDateChange = (e, { name, value }) => {
    this.setState({ [name]: moment(value, DATE_FORMAT) })
  }

  componentWillMount() {
    this.setDateRange('lastMonth')
  }

  onDateSelected = (e, d) => {
    this.setDateRange(d.value)
  }

  setDateRange = v => {
    let start = moment()
    let end = moment()
    if (OPTIONS[v]) {
      start = OPTIONS[v].start || moment()
      end = OPTIONS[v].end || moment()
    }
    this.setState({
      date: v,
      start,
      end,
      isCustomOpen: v === 'custom',
    })
    const { onChange } = this.props
    if (onChange) onChange(start, end)
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

export { DatePicker }
