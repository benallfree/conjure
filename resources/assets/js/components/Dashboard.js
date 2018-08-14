import React, { Component } from 'react'
import { AsyncBase } from './AsyncBase'

class Dashboard extends AsyncBase {
  state = {
    title: 'Dashboard',
  }

  loadData() {
    return axios.get('/api/user')
  }

  renderLoaded() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">Example Component</div>
              <div className="card-body">{JSON.stringify(this.state.data)}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export { Dashboard }
