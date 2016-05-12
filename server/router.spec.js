import app from './server'
import { agent } from 'supertest'

const request = agent(app.listen())

function testRoute(route, done) {
  request.get(route)
    .expect('Content-Type', /text\/html/)
    .expect(res => {
      assert.isTrue(res.text.startsWith(`<!-- ${route} -->`))
    })
    .expect(200, done)
}

describe('server:router', () => {
  ['/', '/home', '/about'/*, '/issue/:id/:section'*/].map(route => {
    it(`should return html for ${route}`, done => {
      testRoute(route, done)
    })
  })
})
