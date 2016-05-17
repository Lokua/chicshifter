import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectors, shallowUpdate, injectLogger } from '@common'
import { actions as articleActions } from '@components/Article'
import { Prose } from '@components/Prose'
import { ImageSlider } from '@components/ImageSlider'
import css from './Touring.scss'

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
    const fileName = `${article}.md`
    dispatch(articleActions.fetchArticle(issue, section, article, fileName))
  }
})

@injectLogger
@shallowUpdate
class Touring extends Component {

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
      src: `/static/issues/${id}/${image}`
    }))

    return (
      <div className={css.Touring}>
        <header>
          <h1 className={css.title}>{info.title}</h1>
        </header>
        <ImageSlider id={id} images={images} />
        <Prose text={text} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Touring)
