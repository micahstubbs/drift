export function util() {
  var Flow = window.Flow;
  var getFileBaseName;
  var validateFileExtension;
  validateFileExtension = function (filename, extension) {
    return filename.indexOf(extension, filename.length - extension.length) !== -1;
  };
  getFileBaseName = function (filename, extension) {
    return Flow.Util.sanitizeName(filename.substr(0, filename.length - extension.length));
  };
  H2O.Util = {
    validateFileExtension,
    getFileBaseName
  };
}
