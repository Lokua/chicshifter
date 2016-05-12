import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { selectors, capitalize } from '@common'
import { Slug } from '@components/Slug'

import { Limiting } from '@components/Limiting'
import { Considering } from '@components/Considering'
import { Seeing } from '@components/Seeing'
import { Shopping } from '@components/Shopping'
import { Street } from '@components/Street'
import { Touring } from '@components/Touring'

import css from './Article.scss'

const components = { Limiting, Considering, Seeing, Shopping, Street, Touring }

const mapStateToProps = (state, props) => ({
  slug: selectors.articleSlug(state, props)
})

class Article extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    slug: PropTypes.array.isRequired
  }

  render() {
    const section = capitalize(this.props.params.section.split('-')[0])
    const ArticleComponent = components[`${section}`]

    return (
      <div className={css.Article}>
        <header className={css.slugContainer}>
          <Slug path={this.props.slug} />
        </header>
        <main className={css.articleInner}>
          <ArticleComponent {...this.props} />
        </main>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Article)
