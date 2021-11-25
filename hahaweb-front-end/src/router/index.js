import React from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import LoginForm from '../components/loginform/index';
import App from '../components/app/index';
import InstructionDashBoard from '../components/instructiondashboard/index';
import CandidateList from '../components/candidatelist/index';
import NoMatch from '../components/nomatch/index';

export const childrenRoutes = [
  {
    key: '0',
    name: 'Instruction',
    icon: 'laptop',
    url: '/instruction',
    component: InstructionDashBoard,
    exactly: true
  },
  {
    key: '1',
    name: 'Personal',
    icon: 'user',
    child: [
      {
        key: '10',
        name: 'Annotating',
        url: '/personal/annotating',
        component: CandidateList
      },

      {
        key: '11',
        name: 'Annotated',
        url: '/personal/annotated',
        component: CandidateList
      }
    ]
  },
  {
    key: '2',
    name: 'Annotation History',
    icon: 'laptop',
    url: '/history',
    component: CandidateList,
    exactly: true
  },
]

// 面包屑导航栏url对应的name
export const breadcrumbNameMap = {
    '/instruction': 'Instruction',
    '/personal': 'Personal',
    '/personal/annotating': 'PersonalAnnotating',
    '/personal/annotated': 'PersonalAnnotated',
    '/history': 'History'
};


export default class HaHaWebRouter extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path = "/login" component = { LoginForm } />
          <Redirect exact path="/" to="/login" />
          <Route component={ App } />
          <Route path="*" component={NoMatch} />
        </Switch>
      </Router>
    )
  }
}
