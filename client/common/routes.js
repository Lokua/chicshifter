import { App } from '@components/App'
import { Home } from '@components/Home'
import { About } from '@components/About'
import { Section } from '@components/Section'
import { Article } from '@components/Article'
import { StyleGuide } from '@components/StyleGuide'

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
    { path: '/issue/:issue/:section', component: Section },
    { path: '/issue/:issue/:section/:article', component: Article }
  ]
}

export default routes
