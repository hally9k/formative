import { Link, graphql, useStaticQuery } from "gatsby"
import React from "react"
import { css } from "@emotion/core"

const leftAsideCss = css`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-right: #efefef solid 1px;
`
const navigationLinkCss = css`
  color: silver;
  text-decoration: none;
  margin-bottom: 1rem;

  &:hover {
    color: gray;
  }
`
export const LeftAside = () => {
  const {
    allMarkdownRemark: { edges: sections },
  } = useStaticQuery(graphql`
    query IndexQuery {
      allMarkdownRemark {
        edges {
          node {
            excerpt(pruneLength: 250)
            id
            frontmatter {
              title
              path
            }
          }
        }
      }
    }
  `)

  console.log(sections)

  return (
    <aside css={leftAsideCss}>
      {sections.map(({ node: section }) => (
        <Link css={navigationLinkCss} to={section.frontmatter.path}>
          {section.frontmatter.title}
        </Link>
      ))}
    </aside>
  )
}
