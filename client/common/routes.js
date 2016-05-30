import Cookies from 'js-cookie'

import { App } from '@components/App'
import { Home } from '@components/Home'
import { About } from '@components/About'
import { Letter } from '@components/Letter'
import { Section } from '@components/Section'
import { Article } from '@components/Article'
import { StyleGuide } from '@components/StyleGuide'
import { Login } from '@components/Login'
import { Admin, EditIssue, EditSection, EditEntry } from '@components/Admin'

import Logger from './Logger'
const logger = new Logger('routes', 'color:blue')

function auth(nextState, replace) {
  try {

    // will throw reference error on server, in which case
    // auth will be checked in render >> match >> renderProps block
    window;

    const token = Cookies.get('token')

    if (!token) {
      logger.warn('User is not authenticated. Redirecting to "/login"')
      replace({ pathname: '/login' })
    }

  } catch (ignore) {
  }
}

export default {
  path: '/',
  component: App,
  indexRoute: {
    component: Home,
  },
  childRoutes: [
    { path: '/about', component: About },
    { path: '/home', component: Home },
    { path: '/issue', component: Home },
    { path: '/style-guide', component: StyleGuide },
    { path: '/issue/:issue', component: Home },
    { path: '/issue/:issue/letter-from-the-editor', component: Letter },
    { path: '/issue/:issue/:section', component: Section },
    { path: '/issue/:issue/:section/:article', component: Article },

    { path: '/login', component: Login },
    {
      path: '/admin',
      component: Admin,
      onEnter: auth
    },
    {
      path: '/admin/issue/:issue',
      component: EditIssue,
      onEnter: auth
    },
    {
      path: '/admin/issue/:issue/section/:section',
      component: EditSection,
      onEnter: auth
    },
    {
      path: '/admin/issue/:issue/section/:section/entry/:entry',
      component: EditEntry,
      onEnter: auth
    }
  ]
}
