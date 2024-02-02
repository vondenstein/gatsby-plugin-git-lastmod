# gatsby-plugin-git-lastmod

Generate `lastmod` values for your sitemap using git commit dates.

Including a `lastmod` value in your sitemap is important for SEO. [Google says](https://support.google.com/webmasters/answer/183668?hl=en) that they only read the `loc` and `lastmod` values in your sitemap when crawling your site. If you're using `gatsby-plugin-sitemap` to generate your sitemap, it is recommended to supply it with proper `lastmod` values, as explained in the [gatsby-plugin-sitemap documentation](https://www.gatsbyjs.com/plugins/gatsby-plugin-sitemap/#recommended-usage).

If you're storing your page content in git, you'll probably want to use this plugin to generate your `lastmod` values based on the commit date.

**Please note:** `gatsby-plugin-sitemap` only generates output when run in `production` mode! To test your `lastmod` values, run: `gatsby build && gatsby serve`.

## Install

```shell
npm install gatsby-plugin-git-lastmod
```

## How to use

```javascript:title=gatsby-config.js
module.exports = {
  siteMetadata: {
    // This needs to be set to get the correct page path
    siteUrl: `https://www.example.com`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            nodes {
              path
              pageContext
            }
          }
        }
        `,
        serialize: ({ path, pageContext }) => {
          return {
            url: path,
            lastmod: pageContext?.lastMod,
          }
        },
      },
    },
    `gatsby-plugin-git-lastmod`,
  ],
}
```

Above is the configuration required to get everything working with `gatsby-plugin-sitemap`. This setup should result in an output similar to what is shown below.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.net/blog/</loc>
    <lastmod>2023-03-22T01:00:00.000Z</lastmod>
  </url>
  <url>
    <loc>https://example.net/</loc>
    <lastmod>2023-03-22T01:00:00.000Z</lastmod>
  </url>
</urlset>
```

If you would like to use the `lastMod` value in a different way, you can simply install the plugin as shown below and query the `lastMod` field on the page context.

```javascript:title=gatsby-config.js
module.exports = {
  plugins: [`gatsby-plugin-git-lastmod`],
}
```

## Options

the [`default config`](https://github.com/vondenstein/gatsby-plugin-git-lastmod/blob/main/src/options-validation.js) can be overridden.

The options are as follows:

- `useFallback` (boolean=false) Whether to use the current date as a fallback if the git commit date cannot be retrieved for a given page. If set to false, the date will be `undefined` and no `lastmod` value will be set in the sitemap for affected pages.

- `continueWithoutRepo` (boolean=false) Whether to continue the Gatsby build if no git repository is found. If set to false, production builds will throw an error if a git repository cannot be found.
