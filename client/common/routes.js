import { App } from '@components/App'
import { Home } from '@components/Home'
import { About } from '@components/About'
import { Letter } from '@components/Letter'
import { Section } from '@components/Section'
import { Article } from '@components/Article'

export default {
  path: `/`,
  component: App,
  indexRoute: {
    component: Home,
  },
  childRoutes: [
    { path: `/about`, component: About },
    { path: `/home`, component: Home },
    { path: `/issue`, component: Home },
    { path: `/issue/:issue`, component: Home },
    { path: `/issue/:issue/letter-from-the-editor`, component: Letter },
    { path: `/issue/:issue/:section`, component: Section },
    { path: `/issue/:issue/:section/:article`, component: Article },
  ]
}
