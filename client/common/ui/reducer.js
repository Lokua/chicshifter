import { createReducer } from 'redux-create-reducer'
import actions from './actions'

const initialState = {
  currentFpfy: 0,
  fpfyImageLoading: true,
  imageSliders: {},
  fpfyModalActive: false,
  imageModalActive: false,
  imageClass: 'wide', // or `tall`
  dialogActive: false,
  imageModalImage: null
}

export default createReducer(initialState, {

  [actions.GET_PREVIOUS_FPFY] (state) {
    const currentFpfy = state.currentFpfy
    if (currentFpfy === 0) return state
    return { ...state,  currentFpfy: currentFpfy - 1 }
  },

  [actions.GET_NEXT_FPFY] (state, { tailIndex }) {
    const currentFpfy = state.currentFpfy
    if (currentFpfy === tailIndex) return state
    return { ...state, currentFpfy: currentFpfy + 1 }
  },

  [actions.TOGGLE_FPFY_IMAGE_LOADING] (state, { bool }) {
    if (bool === void 0) {
      return { ...state, fpfyImageLoading: !state.fpfyImageLoading }
    }

    return { ...state, fpfyImageLoading: bool }
  },

  [actions.INIT_IMAGE_SLIDER] (state, { id, initialIndex = 0 }) {
    const imageSlider = { index: initialIndex }
    const imageSliders = { ...state.imageSliders, [id]: imageSlider }

    return { ...state, imageSliders }
  },

  [actions.INC_IMAGE_INDEX] (state, { id, tailIndex }) {
    const imageSlider = state.imageSliders[String(id)]

    const index = imageSlider.index === tailIndex
      ? tailIndex
      : imageSlider.index + 1

    const imageSliders = {
      ...state.imageSliders,
      [String(id)]: { index }
    }

    return { ...state, imageSliders }
  },

  [actions.DEC_IMAGE_INDEX] (state, { id }) {
    const imageSlider = state.imageSliders[String(id)]

    const index = imageSlider.index === 0 ? 0 : imageSlider.index - 1

    const imageSliders = {
      ...state.imageSliders,
      [String(id)]: { index }
    }

    return { ...state, imageSliders }
  },

  [actions.SET_IMAGE_INDEX] (state, { id, index }) {
    const imageSliders = {
      ...state.imageSliders,
      [String(id)]: { index }
    }

    return { ...state, imageSliders }
  },

  [actions.OPEN_FPFY_MODAL] (state, { open }) {
    return { ...state, fpfyModalActive: open }
  },

  [actions.OPEN_IMAGE_MODAL] (state, { open }) {
    return { ...state, imageModalActive: open }
  },

  [actions.SET_IMAGE_CLASS] (state, { imageClass }) {
    return { ...state, imageClass }
  },

  [actions.SHOW_DIALOG] (state, { show }) {
    return { ...state, dialogActive: show }
  },

  [actions.SET_IMAGE_MODAL_IMAGE] (state, { image }) {
    return { ...state, imageModalImage: image }
  }
})
