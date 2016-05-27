import React, { PropTypes } from 'react'
import { loadFile } from '@common'

const FileButton = ({ className, handler, text }) => (
  <button
    className={className}
    onClick={e => {
      const input = document.createElement('input')
      input.type = 'file'
      input.style.display = 'hidden'
      document.body.appendChild(input)
      input.addEventListener('change', event => {
        loadFile(event, (fileName, data) => {
          handler(fileName, data)
          document.body.removeChild(input)
        })
      })
      input.click()
    }}
  >
    {text}
  </button>
)

FileButton.defaultProps = {
  className: '',
  text: 'Click me!'
}

FileButton.propTypes = {
  className: PropTypes.string,
  handler: PropTypes.func.isRequired,
  text: PropTypes.string
}

export default FileButton
