export function uuid() {
  return (typeof window !== 'undefined' && window !== null ? window.uuid : void 0) ? window.uuid : null;
}
