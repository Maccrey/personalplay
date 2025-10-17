export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("pp_consent");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setConsent(obj) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("pp_consent", JSON.stringify(obj));
    // dispatch event for listeners
    window.dispatchEvent(
      new CustomEvent("pp:consent:changed", { detail: obj })
    );
  } catch (e) {}
}
