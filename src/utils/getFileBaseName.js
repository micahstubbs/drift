import { sanitizeName } from '../coreUtils/sanitizeName';

export function getFileBaseName(filename, extension) {
  return sanitizeName(filename.substr(0, filename.length - extension.length));
}
