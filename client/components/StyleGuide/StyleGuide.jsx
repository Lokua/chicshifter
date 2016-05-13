import React from 'react'
import css from './StyleGuide.scss'

const StyleGuide = () => (
  <div className={css.StyleGuide}>
    <div className="markdown">
      <label>headings</label>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>

      <hr />
      <label>paragraphs</label>
      <p className={css.sans}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <p className={css.serif}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <p className={css.mono}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>

      <hr />
      <label>form elements</label>
      <button>SUBMIT</button>
      <button>CANCEL</button>

      <hr />
      <label>icons</label>
      <div>i-angle-left</div>
      <span className="icon i-angle-left" />
      <div>i-angle-right</div>
      <span className="icon i-angle-right" />
      <div>i-close</div>
      <span className="icon i-close" />
      <div>i-chevron-left</div>
      <span className="icon i-chevron-left" />
      <div>i-chevron-right</div>
      <span className="icon i-chevron-right" />
      <div>i-bars</div>
      <span className="icon i-bars" />
      <div>i-caret-left</div>
      <span className="icon i-caret-left" />
      <div>i-caret-right</div>
      <span className="icon i-caret-right" />
    </div>

    <hr />
    <label>colors</label>
    <div className={css.swatches}>
      <div className={`${css.swatch} ${css.textColor}`}>
        $text-color
      </div>
      <div className={`${css.swatch} ${css.textColorLight}`}>
        $text-color-light
      </div>
      <div className={`${css.swatch} ${css.backgroundColor}`}>
        $background-color
      </div>
      <div className={`${css.swatch} ${css.foregroundColor}`}>
        $foreground-color
      </div>
      <div className={`${css.swatch} ${css.primaryColor}`}>
        $primary-color
      </div>
    </div>
  </div>
)

export default StyleGuide
