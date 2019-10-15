import React from "react"
import { Helmet } from "react-helmet"
import { Layout } from "../components/layout"
import { graphql } from "gatsby"

export default function Template({ data }) {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <div className="blog-post-container">
        <Helmet title={post.frontmatter.title} />

        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`
