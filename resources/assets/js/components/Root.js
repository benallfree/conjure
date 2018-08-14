import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Dashboard } from './Dashboard'

const Root = () => (
  <Router>
    <Route exact path="/" component={Dashboard} />
  </Router>
)

export { Root }
