import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="main-footer">
      <strong>
        Copyright © {currentYear}: &nbsp; 
        <a href="https://ideasysolucionestecnologicas.com" target="_blank" rel="noopener noreferrer">
          https://ideasysolucionestecnologicas.com
        </a>
      </strong>
      <div className="float-right d-none d-sm-inline-block">
        <b>Version</b> 1.0.0
      </div>
    </footer>
  )
}

export default Footer
