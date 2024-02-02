export const pluginOptionsSchema = ({ Joi }) =>
  Joi.object({
    useFallback: Joi.boolean()
      .default(false)
      .description(
        `Whether to use the current date as a fallback lastmod value.`
      ),
    continueWithoutRepo: Joi.boolean()
      .default(false)
      .description(
        `Whether to continue the Gatsby build if no git repository is found.`
      ),
  })
