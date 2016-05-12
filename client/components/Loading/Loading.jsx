import React, { PropTypes } from 'react'
import css from './Loading.scss'

const Loading = ({ loading, size }) => (
  <div className={css.Loading}>
    {loading &&
      <div
        className={css.loading}
        style={{
          width: size[0],
          height: size[1]
        }}
      >
        <span className={css.bullet} />
        <span className={css.bullet} />
        <span className={css.bullet} />
      </div>
    }
  </div>
)

Loading.defaultProps = {
  size: [512, 512]
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  size: PropTypes.array
}

export default Loading
