import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';

import './index.css'
import HaHaWebRouter from './router/index'

ReactDOM.render(
  <HaHaWebRouter/>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('./components/app/index', () => {
    ReactDOM.render(
      <HaHaWebRouter/>,
      document.getElementById('root')
    )
  })
}
