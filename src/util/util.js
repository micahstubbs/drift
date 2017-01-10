import { sanitizeName } from '../coreUtils/sanitizeName';

export function util() {
  const Flow = window.Flow;
  const H2O = window.H2O;
  const getFileBaseName = (filename, extension) => sanitizeName(filename.substr(0, filename.length - extension.length));
  H2O.Util = {
    getFileBaseName,
  };
}
