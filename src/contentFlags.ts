/**
 * Editorial gates for records that BCE has not yet approved.
 *
 * The bundled defaults are marked with `sample: true`, but Cloudflare D1 can still serve older documents that
 * predate that field. These flags are the fallback for those documents. An explicit `sample: false` from the admin
 * always wins, so an editor can clear the label after review. Flip a flag to false only if BCE approves all legacy
 * records without re-saving them.
 */
export const SAMPLE_PORTFOLIO = true;
export const SAMPLE_JOURNAL = true;
