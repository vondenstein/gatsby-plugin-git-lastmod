const simpleGit = require(`simple-git`)
import { pluginOptionsSchema } from "./options-validation"

exports.pluginOptionsSchema = pluginOptionsSchema

const cacheKey = "gatsby-plugin-git-lastmod-repo-exists"

exports.onPreBootstrap = async ({ cache, reporter }, pluginOptions) => {
  const activity = reporter.activityTimer(`checking for git repo`)
  activity.start()

  const exists = await simpleGit().checkIsRepo()

  if (!exists) {
    ;(pluginOptions.continueWithoutRepo
      ? reporter.error
      : reporter.panicOnBuild)(
      "No git repository found.",
      Error("fatal: not a git repository (or any parent up to mount point /)")
    )
  }

  await cache.set(cacheKey, exists)
  activity.end()
}

exports.onCreatePage = async (
  { page, actions, reporter, cache },
  pluginOptions
) => {
  // Exit if lastMod has already been added to page context
  if ("lastMod" in page.context) {
    return
  }

  const { createPage } = actions

  // Add last modified date for sitemap using component name
  // unless it is an mdx blog post, in which case use contentFilePath
  const filePath = page.component.split("?__contentFilePath=").pop()

  // Check cache for status of Git repository
  const repoExists = await cache.get(cacheKey)

  let lastMod
  if (repoExists) {
    lastMod = (
      await simpleGit().log({
        file: filePath,
        maxCount: 1,
        strictDate: true,
      })
    )?.latest?.date
  }

  // Handle fallback method
  if (pluginOptions.useFallback && lastMod === undefined) {
    reporter.info(`Using fallback date for (${filePath}).`)
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
