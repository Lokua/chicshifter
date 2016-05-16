import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { selectors, shallowUpdate, injectLogger } from '@common'
import { Prose } from '@components/Prose'
import { actions as articleActions } from '@components/Article'
import { ImageSlider } from '@components/ImageSlider'

import css from './Seeing.scss'

const mapStateToProps = (state, props) => ({
  info: selectors.article(state, props),
  text: state.article
})

const mapDispatchToProps = (dispatch, props) => ({
  getArticle() {
    const { issue, section, article } = props.params
    const fileName = `${article}.md`
    dispatch(articleActions.fetchArticle(issue, section, article, fileName))
  }
})

@shallowUpdate
@injectLogger
class Seeing extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    info: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    getArticle: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getArticle()
  }

  render() {
    const { info, text, params } = this.props
    const { issue, section, article } = params
    const { firstName, lastName } = info.credits.text.author

    // fully qualify image src attr
    const images = info.content.images.map(image => {
      return {
        ...image,
        src: `/issues/${issue}/${section}/${article}/${image.src}`
      }
    })

    return (
      <div className={css.Seeing}>
        <article>
          <header>
            <h1 className={css.title}>{info.title}</h1>
          </header>
          <ImageSlider id={`${issue}/${section}/${article}`} images={images} />
          <h2 className={css.author}>by {`${firstName} ${lastName}`}</h2>
          <Prose text={text} />
        </article>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Seeing)
