import { Link } from "gatsby"
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
export const LeftAside = () => (
  <aside css={leftAsideCss}>
    <Link css={navigationLinkCss} href="/intro">
      Introduction
    </Link>
    <Link css={navigationLinkCss} href="/quick-start">
      Quick Start
    </Link>
    <Link css={navigationLinkCss} href="/examples">
      Examples
    </Link>
    <Link css={navigationLinkCss} href="/api">
      API
    </Link>
  </aside>
)
