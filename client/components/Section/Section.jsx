import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import find from 'lodash.find'

import { injectLogger } from '@common'
import { Thumb } from '@components/Thumb'
import { Prose } from '@components/Prose'
import css from './Section.scss'

const mapStateToProps = (state, props) => ({
  section: find(state.v2.sections,  section => (
    section.fields.Slug === props.params.section
  )),
  content: state.v2[props.params.section]
})

@injectLogger
class Section extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired,
    content: PropTypes.object.isRequired
  }

  render() {
    const { params, section, content } = this.props
    const fields = section.fields

    let data = content.meta ? content.meta : content.data
    if (params.section === 'limiting') {
      data = data.sort((a, b) => {
        return a.fields.WeekNumber - b.fields.WeekNumber
      })
    }

    return (
      <div className={css.Section}>
        {fields.hasOwnProperty('Description') && fields.Description &&
          <section className={css.description}>
            <Prose text={fields.Description} />
          </section>
        }
        <ul className={css.thumbs}>
          {data && data.map((c, i) => {
            const fields = c.fields
            const className = params.section
            let link = `/issue/${params.issue}/${params.section}/`
            let caption

            if (params.section === 'limiting') {
              link += fields.WeekNumber
              caption = `Week ${fields.WeekNumber}: ${fields.Title}`

            } else {
              link += fields.Slug
              if (params.section === 'street') {
                caption = fields.Neighborhood
              } else {
                caption = fields.Name
              }
            }

            return (
              <li key={i} className={css[className] || ''}>
                <Thumb
                  link={link}
                  image={{
                    title: fields.Image[0].filename,
                    src: fields.Image[0].thumbnails.large.url
                  }}
                  caption={caption}
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
