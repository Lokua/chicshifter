import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { shallowUpdate, injectLogger, selectors } from '@common'
import { Prose } from '@components/Prose'
import { ImageSlider } from '@components/ImageSlider'
import actions from './actions'
import css from './Limiting.scss'

const mapStateToProps = (state, props) => ({
  articleMeta: selectors.article(state, props),
  articles: state.limiting
})

const mapDispatchToProps = (dispatch, props) => ({
  fetchLimitingArticles(fileNames) {
    const { params } = props
    return dispatch(actions.fetchLimitingArticles(
      params.issue,

      // params.article is actually week #
      params.article,
      fileNames.join(',')
    ))
  },
  clearLimitingArticles() {
    return dispatch(actions.clearLimitingArticles())
  }
})

@shallowUpdate
@injectLogger
class Limiting extends Component {

  static propTypes = {
    articleMeta: PropTypes.object.isRequired,
    articles: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    fetchLimitingArticles: PropTypes.func.isRequired,
    clearLimitingArticles: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.debug('this.props:', this.props)
    const fileNames = []

    Object.keys(this.props.articleMeta.content).forEach(author => {
      const entry = this.props.articleMeta.content[author]
      if (entry.textUrl) {
        fileNames.push(entry.textUrl)
      }
    })

    if (fileNames.length) {
      this.props.fetchLimitingArticles(fileNames)

    } else {
      this.props.clearLimitingArticles()
    }
  }

  render() {
    const { articleMeta, params, articles } = this.props

    const prefix = `${params.issue}/${params.section}/${params.article}`
    const imagePrefix = `issues/${prefix}`

    return (
      <div className={css.Limiting}>
        <header>
          <h1 className={`h4 ${css.title}`}>{articleMeta.title}</h1>
        </header>
        <main>
          {Object.keys(articleMeta.content).map((contributor, i) => {
            const contrib = articleMeta.content[contributor]
            return (
              <div key={contributor}>
                {i > 0 && <hr />}
                <Prose text={articles[i]} />
                <ImageSlider
                  id={`${prefix}/${contributor}`}
                  images={contrib.images.map((image, i) => ({
                    ...image,
                    src: `/${imagePrefix}/${image.url}`
                  }))}
                />
              </div>
            )
          })}
        </main>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Limiting)
