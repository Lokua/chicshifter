import app from './server'
import { agent } from 'supertest'

const request = agent(app.listen())

describe('server:api', () => {
  describe('fpfys vote', () => {
    it('should...', done => {
      request.post('/api/fpfys/vote')
        .send({ vote: true, fpfyId: 99 })
        .expect(200, done)
    })
  })
})
