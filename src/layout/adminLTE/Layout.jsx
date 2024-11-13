import React, { useEffect, useState } from 'react'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'

const Layout = ({ children, setRefreshCheckLogin }) => {
  const [optionSelect, setOptionSelect] = useState(null)

  return (
    <>
      <div className="wrapper">
        <Header setRefreshCheckLogin={setRefreshCheckLogin} setOptionSelect={setOptionSelect} />
        <Menu optionSelect={optionSelect} />
        <div className="content-wrapper">{children}</div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
