import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { selectors, shallowUpdate } from '@common'
import actions from '@components/Article/actions'
import css from '@components/Article/Article.scss'

const mapStateToProps = (state, props) => ({
  article: selectors.article(state, props),
  content: state.article
})

const mapDispatchToProps = (dispatch, props) => ({
  getArticle() {
    const { issue, section, article } = props.params
    dispatch(actions.fetchArticle(issue, section, article))
  }
})

@shallowUpdate
class Considering extends Component {

  static propTypes = {
    article: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    content: PropTypes.string.isRequired,
    getArticle: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.getArticle()
  }

  @autobind
  getImageUrl() {
    const { params, article } = this.props
    return [
      '/static',
      'issues',
      params.issue,
      params.section,
      article.image.src
    ].join('/')
  }

  render() {
    return (
      <div className={css.wrapper}>
        <div
          className={css.backgroundImage}
          style={{ backgroundImage: `url(${this.getImageUrl()})` }}
        />
        <div className={css.article}>
          <main
            className="markdown"
            dangerouslySetInnerHTML={{ __html: this.props.content }}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Considering)
