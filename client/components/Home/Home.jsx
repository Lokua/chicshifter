import React from 'react'
import { Issue } from '@components/Issue'
import { SideBar } from '@components/SideBar'
import css from './Home.scss'

const Home = () => (
  <div className={css.Home}>
    <Issue />
    <SideBar />
  </div>
)

export default Home
