import Actions from 'redux-actions-class'

export default new Actions({
  GET_PREVIOUS_FPFY: null,
  GET_NEXT_FPFY: 'tailIndex',
  TOGGLE_FPFY_IMAGE_LOADING: 'bool',
  INIT_IMAGE_SLIDER: ['id', 'initialIndex'],
  INC_IMAGE_INDEX: ['id', 'tailIndex'],
  DEC_IMAGE_INDEX: 'id',
  SET_IMAGE_INDEX: ['id', 'index'],
  OPEN_FPFY_MODAL: 'open',
  OPEN_IMAGE_MODAL: 'open',
  SET_IMAGE_CLASS: 'imageClass',
  SHOW_DIALOG: 'show'
})
