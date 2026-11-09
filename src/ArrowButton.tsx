// Fluid Glass's BaseButton (fluid.glass): mono uppercase label with an L-shaped arrow ending in a diamond head.
// On hover the label rolls up to its twin, the arrow's line retracts and its chevron sweeps round into a full
// diamond (DrawSVG "0% 50%" -> "50% 150%"), all over 1s power3.out. The motion lives in index.css (.fg-btn).
type Theme = "black" | "white" | "alpha" | "outline" | "outline-white" | "glass";

// Without `href` it renders a <button> (`type` defaults to "button"), e.g. a form's submit.
export default function ArrowButton({ href, label, theme = "black", className = "", onClick, tabIndex, type = "button", disabled }: {
  href?: string;
  label: string;
  theme?: Theme;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const inner = (
    <>
      <svg viewBox="0 0 14 11" fill="none" aria-hidden className="fg-btn-arrow">
        <path d="M0.600006 0V6H13.1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9.18887" y="2.2251" width="5.56065" height="5.56065" transform="rotate(45 9.18887 2.2251)" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="fg-btn-label">
        <span className="fg-btn-line" aria-hidden>{label}</span>
        <span className="fg-btn-line">{label}</span>
      </span>
    </>
  );
  if (!href) {
    return (
      <button type={type} className={`fg-btn is-${theme} ${className}`} onClick={onClick} tabIndex={tabIndex} disabled={disabled}>{inner}</button>
    );
  }
  return (
    <a href={href} className={`fg-btn is-${theme} ${className}`} onClick={onClick} tabIndex={tabIndex}>{inner}</a>
  );
}
