import { App } from '@components/App'
import { Home } from '@components/Home'
import { About } from '@components/About'
import { Letter } from '@components/Letter'
import { Section } from '@components/Section'
import { Article } from '@components/Article'
import { StyleGuide } from '@components/StyleGuide'
import { Admin, EditIssue, EditSection, EditEntry } from '@components/Admin'

const routes = {
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

    { path: '/admin', component: Admin },
    { path: '/admin/issue/:issue', component: EditIssue },
    { path: '/admin/issue/:issue/section/:section', component: EditSection },
    {
      path: '/admin/issue/:issue/section/:section/entry/:entry',
      component: EditEntry
    }
  ]
}

export default routes
