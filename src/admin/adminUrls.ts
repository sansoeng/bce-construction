const PRODUCTION_ORIGIN = "https://bce-construction.com";
const STAGING_ORIGIN = "https://staging.bce-construction.com";

const onAdminHost = () => location.hostname.startsWith("admin.");

/** The admin lives on its own host; links back to the public site must leave it. */
export const publicSiteUrl = (path = "/") => (onAdminHost() ? `${PRODUCTION_ORIGIN}${path}` : path);

/**
 * Where to look at a document you are editing. Staged edits only render on the
 * staging site (the Worker serves `mode=staging` there), so an unpublished
 * document must be previewed there rather than on production.
 */
export const previewSiteUrl = (path = "/", staged = false) => {
  if (!onAdminHost()) return path;
  return `${staged ? STAGING_ORIGIN : PRODUCTION_ORIGIN}${path}`;
};
