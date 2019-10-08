import React from "react"
import { Link } from "gatsby"

import { Layout } from "../components/layout"
import { SEO } from "../components/seo"

const IndexPage = () => (
  <Layout noLeftAside>
    <SEO title="Home" />

    <Link to="/quick-start">
      <button>Get Started</button>
    </Link>
  </Layout>
)

export default IndexPage
