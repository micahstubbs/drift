import createOutput from './createOutput';

export default function _refresh(_, refresh) {
  const lodash = window._;
  refresh((error, model) => {
    if (!error) {
      _.output(createOutput(_));
      if (_.isLive()) {
        return lodash.delay(_refresh, 2000);
      }
    }
  });
}
