import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="main-footer">
      <strong>
        Copyright © {currentYear}.<a href=""></a>
      </strong>
      All rights reserved.
      <div className="float-right d-none d-sm-inline-block">
        <b>Version</b> 1.0.0
      </div>
    </footer>
  )
}

export default Footer
