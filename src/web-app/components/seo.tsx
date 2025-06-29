import { Helmet } from 'react-helmet';

type IProps = {
  description: string;
  lang: string;
  meta: Array<{ content: string; name: string }>;
  title: string;
};

function SEO({ description = '', lang = 'en', meta = [], title }: IProps) {
  const metaDescription = description || '';

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      meta={[
        {
          content: metaDescription,
          name: `description`,
        },
        {
          content: title,
          property: `og:title`,
        },
        {
          content: metaDescription,
          property: `og:description`,
        },
        {
          content: `website`,
          property: `og:type`,
        },
        {
          content: `summary`,
          name: `twitter:card`,
        },
        {
          content: title,
          name: `twitter:title`,
        },
        {
          content: metaDescription,
          name: `twitter:description`,
        },
      ].concat(meta)}
      title={title}
      titleTemplate="%s"
    />
  );
}

export default SEO;
