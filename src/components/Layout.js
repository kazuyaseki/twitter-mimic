/* @flow */
import React from 'react'
import { NavLink } from 'react-router-dom'

import styles from './styles.css'

export default function Layout (props: {children: any}) {
  return <div className={styles.Layout}>
    <div  className={styles.main}>
      {props.children}
    </div>
  </div>
}
