import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { selectors, capitalize } from '@common'
import { Slug } from '@components/Slug'

// seeing, shopping, touring
import { StandardArticle } from '@components/StandardArticle'
import { Limiting } from '@components/Limiting'
import { Considering } from '@components/Considering'
import { Street } from '@components/Street'

import css from './Article.scss'

const components = { Limiting, Considering, Street }

const mapStateToProps = (state, props) => ({
  slug: selectors.sectionSlug(state, props)
})

class Article extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    slug: PropTypes.array.isRequired
  }

  render() {
    const section = capitalize(this.props.params.section.split('-')[0])
    const ArticleComponent = /(see|shopp|tour)ing/i.test(section)
      ? StandardArticle
      : components[`${section}`]

    return (
      <div className={css.Article}>
        <Slug path={this.props.slug} />
        <main className={css.articleInner}>
          <ArticleComponent {...this.props} />
        </main>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Article)
