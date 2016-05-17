import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectLogger, selectors } from '@common'
import { Thumb } from '@components/Thumb'
import { Prose } from '@components/Prose'
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

    this.debug('section:', section)

    return (
      <div className={css.Section}>
        {section.hasOwnProperty('description') && section.description &&
          <section className={css.description}>
            <Prose text={section.description} />
          </section>
        }
        <ul className={css.thumbs}>
          {section.content.map((c, i) => {
            const id = params.issue
            const src =
              `static/issues/${id}/${section.objectName}/${c.image.src}`
            const image = { ...c.image, src }
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
