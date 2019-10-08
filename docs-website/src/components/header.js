import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import { Logo } from "./logo"

export const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `white`,
      // marginBottom: `1.45rem`,
      boxShadow: `3px 3px 6px 1px #efefef`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
            height: "100%",
          }}
        >
          <Logo />
        </Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}
