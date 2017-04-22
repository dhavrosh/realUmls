export function getWidth() {
  return __CLIENT__ && window.innerWidth;
}

export function getHeight() {
  return __CLIENT__ && window.innerHeight;
}

export function getElementHeight(title) {
  const el = document.querySelector(title);
  const styles = window.getComputedStyle(el);
  const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}