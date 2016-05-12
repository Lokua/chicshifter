import { assert } from 'chai'
import shallowUpdate from './shallowUpdate'

describe('shallowUpdate', () => {

  @shallowUpdate
  class Component {
    constructor(props, state) {
      this.props = props
      this.state = state
    }
  }

  it('should decorate class with shallow shouldComponentUpdate', () => {
    const instance = new Component()
    assert.isTrue(typeof instance.shouldComponentUpdate === 'function')
  })

  it('should return true/false props/state do/don\'t differ', () => {
    const instance = new Component({ a: 1 }, { a: 1 })
    assert.isFalse(instance.shouldComponentUpdate({ a: 1 }, { a: 1 }))
    assert.isTrue(instance.shouldComponentUpdate({ a: 2 }, { a: 1 }))
    assert.isTrue(instance.shouldComponentUpdate({ a: 1 }, { a: 2 }))
    assert.isTrue(instance.shouldComponentUpdate({ a: 2 }, { a: 2 }))
  })

  it('should ignore same reference changes', () => {
    const obj = { c: 1 }

    const instance = new Component(
      { a: 1, b: obj },
      { a: 1, b: obj }
    )

    assert.isFalse(instance.shouldComponentUpdate(
      { a: 1, b: obj },
      { a: 1, b: obj }
    ))

    obj.c++
    assert.isFalse(instance.shouldComponentUpdate(
      { a: 1, b: obj },
      { a: 1, b: obj }
    ))

    const newObj = Object.assign({}, obj)
    assert.isTrue(instance.shouldComponentUpdate(
      { a: 1, b: newObj },
      { a: 1, b: newObj }
    ))
  })

})
