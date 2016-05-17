import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectors, shallowUpdate, injectLogger } from '@common'
import { actions as articleActions } from '@components/Article'
import { Prose } from '@components/Prose'
import { ImageSlider } from '@components/ImageSlider'
import css from './Shopping.scss'

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

@injectLogger
@shallowUpdate
class Shopping extends Component {

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
    const { firstName, lastName } = info.author

    const images = info.content.images.map(image => ({
      src: `/static/issues/${issue}/${section}/${article}/${image}`
    }))

    let reviewHeader
    if (info.content.title) {
      reviewHeader = (
        <header>
          <h1 className={css.title}>{info.content.title}</h1>
          <h2 className={css.author}>by {`${firstName} ${lastName}`}</h2>
        </header>
      )
    } else {
      reviewHeader = (
        <header>
          <h2 className={css.author}>
            by {`${firstName} ${lastName}`}
          </h2>
        </header>
      )
    }

    return (
      <div className={css.Shopping}>
        <article>
          <header>
            <h1 className={css.title}>{info.title}</h1>
            <address>
              {info.address.street}<br />
              {info.address.neighborhood}, {info.address.city}<br />
            </address>
          </header>
          <ImageSlider id={`${issue}/${section}/${article}`} images={images} />
          <main>
            {reviewHeader}
            <Prose text={text} />
          </main>
        </article>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shopping)
