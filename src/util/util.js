export function util() {
  const Flow = window.Flow;
  let getFileBaseName;
  let validateFileExtension;
  validateFileExtension = (filename, extension) => filename.indexOf(extension, filename.length - extension.length) !== -1;
  getFileBaseName = (filename, extension) => Flow.Util.sanitizeName(filename.substr(0, filename.length - extension.length));
  H2O.Util = {
    validateFileExtension,
    getFileBaseName
  };
}
