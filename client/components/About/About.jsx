import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import css from './About.scss'

const mapStateToProps = state => ({
  missionStatement: state.v2.issues[0].fields.MissionStatement,
  credits: state.v2.about.sort((a, b) => a.fields.Order - b.fields.Order)
})

class About extends Component {

  static propTypes = {
    credits: PropTypes.array.isRequired,
    missionStatement: PropTypes.string.isRequired
  }

  render() {
    const { credits, missionStatement } = this.props

    return (
      <div className={css.About}>

        <section
          className={`${css.section} ${css.missionStatement}`}
          dangerouslySetInnerHTML={{ __html: missionStatement }}
        />


        <section className={`${css.section} ${css.credits}`}>
          <h1 className={css.sectionHeading}>Credits</h1>
          {credits.map((entry, i) => {
            const credit = entry.fields
            return (
              <div key={i} className={css.contrib}>
                <h2 className={css.contribHeading}>{credit.Name}</h2>
                <aside dangerouslySetInnerHTML={{ __html: credit.HTML }} />
                {credit.Url &&
                  <a
                    className="link"
                    href={credit.Url}
                    title={credit.UrlText || credit.Url}
                    target="_blank"
                  >
                    {credit.UrlText || credit.Url}
                  </a>
                }
                {i !== credits.length-1 && <hr />}
              </div>
            )
          })}
        </section>

        <section className={`${css.section} ${css.contact}`}>
          <h1 className={css.sectionHeading}>Contact</h1>
          <p>chicshifter16@gmail.com</p>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps)(About)
