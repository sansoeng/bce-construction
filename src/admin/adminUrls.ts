/** The admin lives on its own host; links back to the public site must leave it. */
export const publicSiteUrl = (path = "/") => {
  if (location.hostname.startsWith("admin.")) return `https://bce-construction.com${path}`;
  return path;
};
