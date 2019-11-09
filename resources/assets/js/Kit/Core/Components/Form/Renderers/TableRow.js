import React, { Component } from 'react'
import _ from 'lodash'
import { Table, Button, Message, Header, Icon, Label } from 'semantic-ui-react'
import { InputOnly } from './InputOnly'

class TableRow extends InputOnly {
  static create(form) {
    const r = new TableRow(form)
    return r
  }

  row(type) {
    switch (type) {
      default:
        return (control, fieldInfo, args) => {
          return <Table.Cell>{control}</Table.Cell>
        }
    }
  }

  fields() {
    const rows = this.buildFieldControls()
    return <Table.Row>{_.map(rows, (r, idx) => r)}</Table.Row>
  }

  render() {
    return this.fields()
  }
}

export { TableRow }
