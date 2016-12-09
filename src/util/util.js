export function util() {
  var Flow = window.Flow;
  var getFileBaseName;
  var validateFileExtension;
  validateFileExtension = (filename, extension) => filename.indexOf(extension, filename.length - extension.length) !== -1;
  getFileBaseName = (filename, extension) => Flow.Util.sanitizeName(filename.substr(0, filename.length - extension.length));
  H2O.Util = {
    validateFileExtension,
    getFileBaseName
  };
}
