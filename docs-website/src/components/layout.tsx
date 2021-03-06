import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { Global } from "@emotion/core"
import { Header } from "./header"
import { LeftAside } from "./left-aside"

import { globalCss } from "../style/global-css"
import { colorCss } from "../style/color-css"
import { markdownCss } from "../style/markdown-css"

export const Layout = ({ children, noLeftAside = false }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <React.Fragment>
      <Global styles={globalCss} />
      <Global styles={colorCss} />
      <Global styles={markdownCss} />
      <Header siteTitle={data.site.siteMetadata.title} />
      {!noLeftAside && <LeftAside />}
      <main>{children}</main>
      <footer></footer>
    </React.Fragment>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
