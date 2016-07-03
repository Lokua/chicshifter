import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import find from 'lodash.find'

import { shallowUpdate, injectLogger } from '@common'
import css from '@components/Article/Article.scss'

const mapStateToProps = (state, props) => ({
  data: find(state.v2.considering.data, x => (
    x.fields.Slug === props.params.article
  )).fields
})

@shallowUpdate
@injectLogger
class Considering extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const { data } = this.props

    return (
      <div className={css.wrapper}>
        <div
          className={css.backgroundImage}
          style={{ backgroundImage: `url("${data.Image[0].url}")` }}
        />
        <div className={css.article}>
          <main
            className="markdown"
            dangerouslySetInnerHTML={{ __html: data.HTML }}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Considering)
