import React, { Component } from 'react'
import _ from 'lodash'
import { Table, Button, Message, Header, Icon, Label } from 'semantic-ui-react'
import { Standard } from './Standard'

class InputOnly extends Standard {
  static create(form) {
    const r = new InputOnly(form)
    return r
  }

  row(type) {
    switch (type) {
      case 'Section':
        return (form, control, fieldInfo, args) => (
          <React.Fragment>
            <div style={{ marginTop: 20 }}>{control}</div>
          </React.Fragment>
        )

      default:
        return (form, control, fieldInfo, args) => {
          return (
            <React.Fragment>
              <React.Fragment>{control}</React.Fragment>
            </React.Fragment>
          )
        }
    }
  }

  fields() {
    const rows = this.buildFieldControls()
    const saveButtons = this.saveButtons()
    return (
      <React.Fragment>
        {_.map(rows, (r, idx) => (
          <div key={idx} style={{ marginBottom: 5 }}>
            {r}
          </div>
        ))}
        {saveButtons}
      </React.Fragment>
    )
  }
}

export { InputOnly }
