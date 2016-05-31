import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import { loadFile, injectLogger } from '@common'
import { Slug } from '@components/Slug'
import { Button } from '@components/Button'

// eslint-disable-next-line no-unused-vars
import { FileButton } from '@components/FileButton'

import actions from './actions'
import css from './style.scss'

const mapStateToProps = state => ({
  fpfys: state.fpfys.filter(fpfy => !fpfy.disabled)
})

const mapDispatchToProps = (dispatch, props) => ({
  update: data => dispatch(actions.updateFpfy(data)),
  delete: data => dispatch(actions.deleteFpfy(data)),
  add: () => dispatch(actions.addFpfy()),
  replaceImage: data => dispatch(actions.replaceImageFpfy(data)),
})


@injectLogger
class EditFpfys extends Component {

  static propTypes = {
    fpfys: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    replaceImage: PropTypes.func.isRequired
  }

  @autobind
  replaceImage(nativeEvent, fpfy) {
    loadFile(nativeEvent, (fileName, data) => {
      this.props.replaceImage({
        fpfy,
        fileName,
        data
      })
    })
  }

  @autobind
  renderImageReplacer(fpfy) {
    this.debug('fpfy:', fpfy)

    return (
      <div>
        <h2>Image:</h2>
        {fpfy.image && fpfy.image.src &&
          <img
            style={{ width: '128px', height: 'auto' }}
            src={`/static/images/fpfys/${fpfy.image.src}`}
          />
        }
        {!fpfy.image || !fpfy.image.src && 'No Image'}
        <br />

        <aside className={css.well}>
          <b>Important:</b><br />
          Selecting "Choose File" will replace the current file
          immediately and without confirmation. This action
          cannot be undone.
        </aside>

        <input
          type="file"
          onChange={e => this.replaceImage(e.nativeEvent, fpfy)}
        />
      </div>
    )
  }

  render() {
    const { fpfys } = this.props

    const slug = [
      { href: '/admin', text: 'admin' },
      { href: '/admin/fpfys', text: 'fpfys' }
    ]

    return (
      <div className={css.Admin}>

        <Slug path={slug} />

        <Button onClick={() => this.props.add()} text="New" />

        <section>
          {fpfys.map((fpfy, i) => (
            <div key={i} className={css.editable}>
              <h1>{fpfy.id}</h1>

              {this.renderImageReplacer(fpfy)}

              <div>
                <div className={css.formGroup}>
                  <label>Name:</label>
                  <input
                    type="text"
                    defaultValue={fpfy.name}
                    ref={`nameInput:${i}`}
                  />
                </div>
                <div className={css.formGroup}>
                  <label>Text:</label>
                  <input
                    type="text"
                    style={{ width: '100%' }}
                    defaultValue={fpfy.name}
                    ref={`textInput:${i}`}
                  />
                </div>
                <div className={css.formGroup}>
                  <label>Response Type:</label>
                  <select
                    defaultValue={fpfy.response.type}
                    ref={`responseTypeSelect:${i}`}
                  >
                    <option>Faux Yeah</option>
                    <option>Faux Pas</option>
                  </select>
                </div>
                <div className={css.formGroup}>
                  <label>Response Text:</label>
                  <input
                    type="text"
                    style={{ width: '100%' }}
                    defaultValue={fpfy.response.text}
                    ref={`responseTextInput:${i}`}
                  />
                </div>
                <hr />
                <Button
                  onClick={() => {
                    this.props.update({
                      id: fpfy.id,
                      name: this.refs[`nameInput:${i}`].value,
                      text: this.refs[`textInput:${i}`].value,
                      response: {
                        type: this.refs[`responseTypeSelect:${i}`].value,
                        text: this.refs[`responseTextInput:${i}`].value
                      }
                    })
                  }}
                  text="Save"
                />
                <Button
                  onClick={() => this.props.delete(fpfy)}
                  text="Delete"
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(EditFpfys)
