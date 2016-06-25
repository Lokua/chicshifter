import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import find from 'lodash.find'

import { shallowUpdate, injectLogger } from '@common'
import { Prose } from '@components/Prose'
import { ImageSlider } from '@components/ImageSlider'

import css from './StandardArticle.scss'

const mapStateToProps = (state, props) => {
  const { params: p } = props

  return {
    id: `${p.issue}/${p.section}/${p.article}`,
    data: find(state.v2[p.section].data, x => (
      x.fields.Slug === p.article
    )).fields
  }
}

@injectLogger
@shallowUpdate
class StandardArticle extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
  }

  render() {
    const { id, data } = this.props

    const images = data.Images.map(image => ({
      title: image.filename,
      src: image.url
    }))

    return (
      <div className={css.StandardArticle}>
        <header>
          <h1 className={css.title}>{data.Name}</h1>
        </header>
        {images && !!images.length && <ImageSlider id={id} images={images} />}
        {data.HTML && <Prose text={data.HTML} />}
      </div>
    )
  }
}

export default connect(mapStateToProps)(StandardArticle)
