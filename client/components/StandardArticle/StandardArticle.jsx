import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { selectors, shallowUpdate, injectLogger } from '@common'
import { actions as articleActions } from '@components/Article'
import { Prose } from '@components/Prose'
import { ImageSlider } from '@components/ImageSlider'

import css from './StandardArticle.scss'

const mapStateToProps = (state, props) => {
  const { params } = props

  return {
    id: `${params.issue}/${params.section}/${params.article}`,
    info: selectors.article(state, props),
    text: state.article
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  getArticle() {
    const { issue, section, article } = props.params
    dispatch(articleActions.fetchArticle(issue, section, article, 'text.html'))
  }
})

@injectLogger
@shallowUpdate
class StandardArticle extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    info: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    getArticle: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getArticle()
  }

  render() {
    const { id, info, text } = this.props

    const images = info.content.images.map(image => ({
      ...image,
      src: `/static/issues/${id}/${image.src}`
    }))

    return (
      <div className={css.StandardArticle}>
        <header>
          <h1 className={css.title}>{info.title}</h1>
        </header>
        {images && !!images.length && <ImageSlider id={id} images={images} />}
        {text && <Prose text={text} />}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StandardArticle)
