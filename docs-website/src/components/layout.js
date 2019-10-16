/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { Global } from "@emotion/core"
import { Header } from "./header"
import { LeftAside } from "./left-aside"

import { globalCss } from "../style/global.css.js"
import { markdownCss } from "../style/markdown.css.js"
import "prismjs/themes/prism.css"

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
    <>
      <Global styles={globalCss} />
      <Global styles={markdownCss} />
      <Header siteTitle={data.site.siteMetadata.title} />
      {!noLeftAside && <LeftAside />}
      <main>{children}</main>
      <footer></footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
