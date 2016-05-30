import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { capitalize, shallowUpdate, injectLogger, selectors } from '@common'
import { Prose } from '@components/Prose'
import { ImageSlider } from '@components/ImageSlider'
import actions from './actions'
import css from './Limiting.scss'

const mapStateToProps = (state, props) => ({
  articleMeta: selectors.article(state, props),
  articles: state.limiting
})

const mapDispatchToProps = (dispatch, props) => ({
  fetchLimitingArticles(persons) {
    const { params } = props
    return dispatch(actions.fetchLimitingArticles(
      params.issue,

      // params.article is actually week #
      params.article,
      persons.join(',')
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
    const persons = Object.keys(this.props.articleMeta.content)

    if (persons.length) {
      this.props.fetchLimitingArticles(persons)

    } else {
      this.props.clearLimitingArticles()
    }
  }

  render() {
    const { articleMeta, params, articles } = this.props

    const prefix = `${params.issue}/${params.section}/${params.article}`
    const imagePrefix = `static/issues/${prefix}`

    return (
      <div className={css.Limiting}>
        <header>
          <h1 className={css.title}>
            Week {params.article}: {articleMeta.title}
          </h1>
        </header>
        <hr />
        <main>
          {Object.keys(articleMeta.content).map((contributor, i) => {
            const contrib = articleMeta.content[contributor]
            return (
              <div key={contributor}>
                {i > 0 && <hr />}
                <h2 style={{ textAlign: 'center' }}>
                  {capitalize(contributor)}
                </h2>
                <ImageSlider
                  id={`${prefix}/${contributor}`}
                  images={contrib.images.map((image, i) => ({
                    ...image,
                    src: `/${imagePrefix}/${contributor}/${image.src}`
                  }))}
                />
                {articles[i] &&
                  <div className={css.prose}>
                    <Prose text={articles[i]} />
                  </div>
                }
              </div>
            )
          })}
        </main>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Limiting)
