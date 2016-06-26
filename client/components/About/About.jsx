import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import css from './About.scss'

const mapStateToProps = state => ({
  credits: state.v2.about.sort((a, b) => a.fields.Order - b.fields.Order)
})

class About extends Component {

  static propTypes = {
    credits: PropTypes.array.isRequired
  }

  render() {
    const { credits } = this.props

    return (
      <div className={css.About}>

        <section className={`${css.section} ${css.missionStatement}`}>
          <p>
            <em>Chic Shifter</em>, a digital fashion journal with an altered hem,
            is a biannual publication that examines the fashion cultures of Chicago
            and builds a fashion-focused community within the city and larger
            Midwest.  <em>Chic Shifter deviate</em>s from mainstream fashion publications
            by giving priority to text over image. Addressing a lack of criticality
            in fashion publications, <em>Chic Shifter create</em>s and initiates dialogue
            around important issues in fashion; in other words, criticality over
            frivolity. Thus a <em>Chic Shifter i</em>s an individual who shifts and
            transforms definitions of chic.
          </p>
        </section>

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
