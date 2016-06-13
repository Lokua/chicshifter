import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectLogger, selectors } from '@common'
import { Thumb } from '@components/Thumb'
import { Prose } from '@components/Prose'
import css from './Section.scss'

const mapStateToProps = (state, props) => ({
  section: selectors.section(state, props),
  sectionV2: (() => {
    const section = props.params.section
    let found

    state.issues[0].v2.sections.some(sect => {
      if (sect.fields.Slug === section) {
        return (found = sect)
      }
    })

    return found
  })(),
  content: state.issues[0].v2[props.params.section]
})

@injectLogger
class Section extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired,
    sectionV2: PropTypes.object.isRequired,
    content: PropTypes.object.isRequired
  }

  render() {
    const { params, sectionV2, section, content } = this.props
    const _section = sectionV2.fields

    let data = content.meta ? content.meta : content.data
    if (params.section === 'limiting') {
      data = data.sort((a, b) => {
        return a.fields.WeekNumber - b.fields.WeekNumber
      })
    }

    return (
      <div className={css.Section}>
        {_section.hasOwnProperty('Description') && _section.Description &&
          <section className={css.description}>
            <Prose text={_section.Description} />
          </section>
        }
        <ul className={css.thumbs}>
          {data && data.map((c, i) => {
            const fields = c.fields
            const className = section.objectName.split('-')[0]
            let link = `/issue/${params.issue}/${section.objectName}/`
            let caption

            if (params.section === 'limiting') {
              this.debug('fields:', fields)
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
