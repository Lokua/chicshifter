import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { autobind } from 'core-decorators'
import find from 'lodash.find'
import css from './style.scss'

const mapStateToProps = (state, props) => ({
  section: (() => {
    const sections = state.issues[props.params.issue - 1].sections

    return find(sections, { objectName: props.params.section })
  })()
})

class EditSection extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired
  }

  @autobind
  uploadSectionThumb() {
    alert('Sorry. This feature has not yet been implemented.')
  }

  @autobind
  considering() {
    const { section, params } = this.props
    const { issue, section: sectionId } = params

    const sections = section.content.map((entry, i) => {
      const link =
        `/admin/issue/${issue}/section/${sectionId}/entry/${entry.objectName}`
      return (
        <section key={i} className={css.editable}>
          <div>objectName (url endpoint): <b>{entry.objectName}</b></div>
          <div>title: <b>{entry.title}</b></div>
          <Link to={link}>
            <button className={css.button}>Edit</button>
          </Link>
        </section>
      )
    })

    return <div>{sections}</div>
  }

  render() {
    const { section, params } = this.props
    const { issue, section: sectionId } = params
    return (
      <div className={css.Admin}>
        <h1>[Issue: {issue} >> Edit Section] >> {sectionId}</h1>

        <section className={css.editable}>
          <h2>Section Thumb</h2>
          <img src={`/static/images/${section.image.src}`} />
          <br />
          <button
            className={css.button}
            onClick={this.uploadSectionThumb}
          >
            Replace
          </button>
        </section>

        <br />
        <h2>Content:</h2>
        {/*<div>{this[sectionId]()}</div>*/}
        <div>{this.considering()}</div>

        <hr />
        <pre>{JSON.stringify(section, null, 2)}</pre>
      </div>
    )
  }
}

export default connect(mapStateToProps)(EditSection)
