import shallowCompare from 'react-addons-shallow-compare'

export default function shallowUpdate(target) {
  target.prototype.shouldComponentUpdate = shouldComponentUpdate
}

function shouldComponentUpdate(nextProps, nextState) {
  return shallowCompare(this, nextProps, nextState)
}
