import React, { useEffect, useState } from 'react'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'

const Layout = ({ children }) => {
  const [optionSelect, setOptionSelect] = useState(null)

  return (
    <>
      <div className="wrapper">
        <Header setOptionSelect={setOptionSelect} />
        <Menu optionSelect={optionSelect} />
        <div className="content-wrapper">{children}</div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
