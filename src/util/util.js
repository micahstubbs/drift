import { sanitizeName } from '../coreUtils/sanitizeName';

export function util() {
  const Flow = window.Flow;
  const H2O = window.H2O;
  const validateFileExtension = (filename, extension) => filename.indexOf(extension, filename.length - extension.length) !== -1;
  const getFileBaseName = (filename, extension) => sanitizeName(filename.substr(0, filename.length - extension.length));
  H2O.Util = {
    validateFileExtension,
    getFileBaseName,
  };
}
