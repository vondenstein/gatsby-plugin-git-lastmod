const simpleGit = require(`simple-git`)
import { pluginOptionsSchema } from "./options-validation"

exports.pluginOptionsSchema = pluginOptionsSchema

exports.onCreatePage = async ({ page, actions }, pluginOptions) => {
  // Exit if lastMod has already been added to page context
  if ("lastMod" in page.context) {
    return
  }

  const { createPage } = actions

  /***
   * Add last modified date for sitemap using component name
   * unless it is an mdx blog post, in which case use contentFilePath
   ***/
  const filePath = page.component.split("?__contentFilePath=").pop()
  const fileLog = await simpleGit().log({
    file: filePath,
    maxCount: 1,
    strictDate: true,
  })
  let lastMod = fileLog?.latest?.date

  // Handle fallback method
  if (pluginOptions.useFallback && lastMod === undefined) {
    lastMod = new Date().toISOString()
  }

  return createPage({
    ...page,
    context: {
      ...page.context,
      lastMod: lastMod,
    },
  })
}
