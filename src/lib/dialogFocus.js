// Native dialogs make the background inert. Keep Tab on the dialog controls
// rather than allowing a transient stop on the document/browser chrome.
export function trapDialogTab(event) {
  if (event.key !== "Tab") return;
  const controls = event.currentTarget.querySelectorAll(
    "a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled])",
  );
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (!first) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
