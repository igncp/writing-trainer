import { Link } from 'gatsby'
import React from 'react'

type IProps = {
  siteTitle: string
}

const Header = ({ siteTitle }: IProps) => (
  <header
    style={{
      background: `rebeccapurple`,
      marginBottom: `1.45rem`,
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
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
          to="/"
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
)

Header.defaultProps = {
  siteTitle: '',
}

export default Header
