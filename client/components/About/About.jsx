import React from 'react'
import css from './About.scss'

const About = () => (
  <div className={css.About}>

    <section className={`${css.section} ${css.missionStatement}`}>
      {/*<h1 className={css.sectionHeading}>Mission Statement</h1>*/}
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
      <div className={css.contrib}>
        <h2 className={css.contribHeading}>Jacqueline Alcántara</h2>
        <aside>
          Considering Chic fashion sketches, Chic Shifter icons,
          Faux Pas/Faux Yeah sketches, Flamingo background pattern
        </aside>
      </div>
      <hr />
      <div className={css.contrib}>
        <h2 className={css.contribHeading}>Street Chic:</h2>
        <ul className={css.streetChic}>
          <li>
            <h3>Constance Kostrevski: Pilsen</h3>
            <aside>
              <a
                className="link"
                href="http://eyeshotcha.com"
                target="_blank"
              >
                eyeshotcha.com
              </a>
            </aside>
          </li>
          <li>
            <h3>Milena Basic: Lakeview</h3>
          </li>
        </ul>
      </div>
      <hr />
      <div className={css.contrib}>
        <h2 className={css.contribHeading}>Joshua Kleckner</h2>
        <aside>Web design, development, and deployment</aside>
        <aside>
          <a
            className="link"
            href="https://lokua.net"
            target="_blank"
          >
            lokua.net
          </a>
        </aside>
      </div>
    </section>

    <section className={`${css.section} ${css.contact}`}>
      <h1 className={css.sectionHeading}>Contact</h1>
      <p>chicshifter16@gmail.com</p>
    </section>
  </div>
)

export default About
