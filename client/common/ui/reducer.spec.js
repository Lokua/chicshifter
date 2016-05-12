import reducer from './reducer'
import actions from './actions'

describe('uiReducer', () => {

  describe('getPreviousFpfy', () => {

    it('should decrement counter', () => {
      const actual = reducer({
          currentFpfy: 1
        },
        actions.getPreviousFpfy()
      )
      eq(actual, { currentFpfy: 0 })
    })

    it('should leave at 0 when already 0', () => {
      const actual = reducer({
          currentFpfy: 0
        },
        actions.getPreviousFpfy()
      )
      eq(actual, { currentFpfy: 0 })
    })
  })

  describe('getNextFpfy', () => {

    it('should increment counter', () => {
      const actual = reducer({
          currentFpfy: 2
        },
        actions.getNextFpfy(10)
      )
      eq(actual, { currentFpfy: 3 })
    })

    it('should stay at max', () => {
      const actual = reducer({
          currentFpfy: 10
        },
        actions.getNextFpfy(10)
      )
      eq(actual, { currentFpfy: 10 })
    })
  })

  describe('toggleFpfyImageLoading', () => {

    it('act as set function when arg is passed', () => {
      eq(reducer({
          fpfyImageLoading: false
        },
        actions.toggleFpfyImageLoading(true)
      ), { fpfyImageLoading: true })
      eq(reducer({
          fpfyImageLoading: true
        },
        actions.toggleFpfyImageLoading(false)
      ), { fpfyImageLoading: false })
    })

    it('should toggle when no arg is passed', () => {
      eq(reducer({
          fpfyImageLoading: true
        },
        actions.toggleFpfyImageLoading()
      ), { fpfyImageLoading: false })
      eq(reducer({
          fpfyImageLoading: true
        },
        actions.toggleFpfyImageLoading()
      ), { fpfyImageLoading: false })
    })
  })

  describe('initImageSlider', () => {
    it('should create a new imageSlider entry', () => {
      const initialState = {
        imageSliders: {}
      }
      const actual = reducer(initialState, actions.initImageSlider('foo'))
      const expected = {
        imageSliders: {
          foo: { index: 0 }
        }
      }
      eq(actual, expected)
    })
    it('should create a new imageSlider with initialIndex', () => {
      const initialState = {
        imageSliders: {}
      }
      const actual = reducer(initialState, actions.initImageSlider('foo', 42))
      const expected = {
        imageSliders: {
          foo: { index: 42 }
        }
      }
      eq(actual, expected)
    })
  })

  describe('inc/dec/setImageIndex', () => {
    it('should inc index', () => {
      const initialState = {
        imageSliders: {
          '0': { index: 0 }
        }
      }
      const actual = reducer(initialState, actions.incImageIndex(0, 10))
      const expected = {
        imageSliders: {
          '0': { index: 1 }
        }
      }
      eq(actual, expected)
    })
    it('should not increment over max value', () => {
      const initialState = {
        imageSliders: {
          '0': { index: 10 }
        }
      }
      const actual = reducer(initialState, actions.incImageIndex(0, 10))
      const expected = {
        imageSliders: {
          '0': { index: 10 }
        }
      }
      eq(actual, expected)
    })
    it('should dec index', () => {
      const initialState = {
        imageSliders: {
          '0': { index: 10 }
        }
      }
      const actual = reducer(initialState, actions.decImageIndex(0))
      const expected = {
        imageSliders: {
          '0': { index: 9 }
        }
      }
      eq(actual, expected)
    })
    it('should not decrement below zero', () => {
      const initialState = {
        imageSliders: {
          '0': { index: 0 }
        }
      }
      const actual = reducer(initialState, actions.decImageIndex(0))
      const expected = {
        imageSliders: {
          '0': { index: 0 }
        }
      }
      eq(actual, expected)
    })
    it('should set image index', () => {
      const initialState = {
        imageSliders: {
          '0': { index: 0 }
        }
      }
      const actual = reducer(initialState, actions.setImageIndex(0, 42))
      const expected = {
        imageSliders: {
          '0': { index: 42 }
        }
      }
      eq(actual, expected)
    })
  })
})
