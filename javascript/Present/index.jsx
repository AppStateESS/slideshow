'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import Present from './Present.jsx'

/* global isAdmin */
ReactDOM.render(
  <Present isAdmin={isAdmin} />,
  document.getElementById('present')
)
