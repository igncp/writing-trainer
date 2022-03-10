import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ description, lang, meta, title }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      meta={[
        {
          content: metaDescription,
          name: `description`
        },
        {
          content: title,
          property: `og:title`
        },
        {
          content: metaDescription,
          property: `og:description`
        },
        {
          content: `website`,
          property: `og:type`
        },
        {
          content: `summary`,
          name: `twitter:card`
        },
        {
          content: site.siteMetadata.author,
          name: `twitter:creator`
        },
        {
          content: title,
          name: `twitter:title`
        },
        {
          content: metaDescription,
          name: `twitter:description`
        }
      ].concat(meta)}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
    />
  )
}

SEO.defaultProps = {
  description: ``,
  lang: `en`,
  meta: []
}

export default SEO
