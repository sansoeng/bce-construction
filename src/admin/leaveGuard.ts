/**
 * A single in-app guard against leaving a dirty editor.
 *
 * The content editor registers a confirm callback while it has unsaved changes;
 * anything that moves the admin to another route (sidebar, command palette,
 * breadcrumbs, the back link, browser history) asks it first.
 */

type Guard = () => boolean;

let guard: Guard | null = null;

export const setLeaveGuard = (next: Guard | null) => {
  guard = next;
};

/** True when it is safe to navigate away. */
export const canLeaveEditor = () => (guard ? guard() : true);
