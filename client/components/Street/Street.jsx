import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectors, shallowUpdate, injectLogger } from '@common'
import { ImageSlider } from '@components/ImageSlider'
import css from './Street.scss'

const mapStateToProps = (state, props) => {
  const { params } = props
  const id = `${params.issue}/${params.section}/${params.article}`

  let index
  try {
    index = state.ui.imageSliders[id].index
  } catch (err) {
    index = 0
  }

  return {
    id,
    index,
    info: selectors.article(state, props)
  }
}

@injectLogger
@shallowUpdate
class Street extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    params: PropTypes.object.isRequired,
    info: PropTypes.object.isRequired
  }

  render() {
    const { id, index, info } = this.props

    const images = info.content.map(entry => ({
      src: `/static/issues/${id}/${entry.image}`
    }))

    const content = info.content[index]
    this.debug('content:', content)

    return (
      <div className={css.Street}>
        <article>
          <header>
            <h1 className={css.title}>{info.title}</h1>
            <h5>{info.question}</h5>
          </header>
          <ImageSlider
            id={id}
            images={images}
          />
          <main className={css.main}>
            <h4>
              {content.person},&nbsp;
              <small style={{ fontSize: '0.7em' }}>30s</small>
            </h4>
            <h5>"{content.answer}"</h5>
          </main>
        </article>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Street)
