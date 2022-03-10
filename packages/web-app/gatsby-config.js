module.exports = {
  ...(process.env.WEBAPP_PATH_PREFIX
    ? { pathPrefix: process.env.WEBAPP_PATH_PREFIX }
    : {}),
  plugins: [`gatsby-plugin-react-helmet`],
  siteMetadata: {
    author: `@gatsbyjs`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    title: `Gatsby Default Starter`
  }
}
