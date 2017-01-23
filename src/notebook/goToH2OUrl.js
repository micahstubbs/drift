export default function goToH2OUrl(url) {
  console.log('window.Flow.ContextPath from goToH2OUrl', window.Flow.ContextPath);
  return () => window.open(window.Flow.ContextPath + url, '_blank');
}
