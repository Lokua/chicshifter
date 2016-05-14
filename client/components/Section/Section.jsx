import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectLogger, selectors } from '@common'
import { Thumb } from '@components/Thumb'
import css from './Section.scss'

const mapStateToProps = (state, props) => ({
  section: selectors.section(state, props)
})

@injectLogger
class Section extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired
  }

  render() {
    const { params, section } = this.props

    return (
      <div className={css.Section}>
        <ul className={css.thumbs}>
          {section.content.map((c, i) => {
            const id = params.issue
            const url = `/issues/${id}/${section.objectName}/${c.image.url}`
            const image = { ...c.image, url }
            const className = section.objectName.split('-')[0]
            return (
              <li key={i} className={css[className] || ''}>
                <Thumb
                  link={`/issue/${id}/${section.objectName}/${c.objectName}`}
                  image={image}
                  caption={c.title}
                />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Section)
