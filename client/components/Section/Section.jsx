import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { injectLogger } from '@common'
import selectors from '@common/selectors'
import { Thumb } from '@components/Thumb'
import { Prose } from '@components/Prose'
import css from './Section.scss'

@connect((state, props) => ({
  section: state.v2.sections.find(section => (
    section.fields.Slug === props.params.section
  )),
  meta: selectors.sectionMeta(state, props),
  activeIssueNumber: state.ctx.activeIssueNumber
}))
@injectLogger
export default class Section extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired,
    meta: PropTypes.array.isRequired,
    activeIssueNumber: PropTypes.number.isRequired
  }

  render() {
    this.debug(`this.props.activeIssueNumber:`, this.props.activeIssueNumber)
    const { params, section, meta } = this.props
    const fields = section.fields
    let data = meta

    if (params.section === `limiting`) {
      data = data.sort((a, b) => a.fields.WeekNumber - b.fields.WeekNumber)
    }

    return (
      <div className={css.Section}>
        {fields.hasOwnProperty(`Description`) && fields.Description &&
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

            if (params.section === `limiting`) {
              link += fields.WeekNumber
              caption = `Week ${fields.WeekNumber}: ${fields.Title}`

            } else {
              link += fields.Slug
              if (params.section === `street`) {
                caption = fields.Neighborhood
              } else {
                caption = fields.Name
              }
            }

            return (
              <li key={c.id} className={css[className] || ``}>
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
          {!data || !data.length &&
            <h3 style={{
              fontStyle: `italic`,
              marginTop: `32px`
            }}>
              Articles Coming Soon...
            </h3>
          }
        </ul>
      </div>
    )
  }
}
