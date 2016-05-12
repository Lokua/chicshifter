import { stub } from 'sinon'
import { assert } from 'chai'
import Logger from 'lokua.net.logger'
import injectLogger from './injectLogger'

describe('injectLogger', () => {

  const loggerMethods = ['log', 'trace', 'debug', 'info', 'warn', 'error']

  it('should pass', () => {
    assert.isTrue(true)
  })

  it('should add logging methods', () => {

    @injectLogger
    class Component {
    }

    const instance = new Component()

    assert.isTrue(instance.logger instanceof Logger)

    loggerMethods.forEach(method => {
      assert.isTrue(typeof instance[method] === 'function')
      const m = method === 'debug' ? 'log' : method
      stub(console, m)
      instance[method]('foo')
      assert.isTrue(console[m].calledOnce)
      console[m].restore()
    })
  })

  it('should apply level and style args', () => {

    @injectLogger(Logger.ERROR, 'red')
    class Component {
    }

    const instance = new Component()
    assert.deepEqual(instance.logger.options.nameStyle, 'color:red')
    assert.isTrue(instance.logger.level === Logger.ERROR)

    loggerMethods.forEach(method => {
      assert.isTrue(typeof instance[method] === 'function')
      const m = method === 'debug' ? 'log' : method
      stub(console, m)
      instance[method]('foo')
      if (m === 'error') {
        assert.isTrue(console[m].calledOnce)
      } else {
        assert.isFalse(console[m].called)
      }
      console[m].restore()
    })
  })
})
