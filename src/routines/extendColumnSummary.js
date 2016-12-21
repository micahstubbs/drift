import { render_ } from './render_';
import { inspect_ } from './inspect_';

import { h2oColumnSummaryOutput } from '../h2oColumnSummaryOutput';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function extendColumnSummary(_, frameKey, frame, columnName) {
  const lodash = window._;

  const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
  if (lightning.settings) {
    lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
    lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
  }
  const createVector = lightning.createVector;
  const createDataframe = lightning.createFrame;
  const createFactor = lightning.createFactor;

  let inspectCharacteristics;
  let inspectDomain;
  let inspectSummary;
  let inspections;
  const column = lodash.head(frame.columns);
  const rowCount = frame.rows;
  const inspectPercentiles = () => {
    const vectors = [
      createVector('percentile', 'Number', frame.default_percentiles),
      createVector('value', 'Number', column.percentiles),
    ];
    return createDataframe('percentiles', vectors, lodash.range(frame.default_percentiles.length), null, {
      description: `Percentiles for column \'${column.label}\' in frame \'${frameKey}\'.`,
      origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
    });
  };
  const inspectDistribution = () => {
    let binCount;
    let binIndex;
    let count;
    let countData;
    let i;
    let intervalData;
    let m;
    let n;
    let widthData;
    let _i;
    let _j;
    let _k;
    let _l;
    let _len;
    let _ref1;
    const minBinCount = 32;
    const base = column.histogram_base;
    const stride = column.histogram_stride;
    const bins = column.histogram_bins;
    const width = Math.ceil(bins.length / minBinCount);
    const interval = stride * width;
    const rows = [];
    if (width > 0) {
      binCount = minBinCount + (bins.length % width > 0 ? 1 : 0);
      intervalData = new Array(binCount);
      widthData = new Array(binCount);
      countData = new Array(binCount);

      // Trim off empty bins from the end
      for (i = _i = 0; binCount >= 0 ? _i < binCount : _i > binCount; i = binCount >= 0 ? ++_i : --_i) {
        m = i * width;
        n = m + width;
        count = 0;
        for (binIndex = _j = m; m <= n ? _j < n : _j > n; binIndex = m <= n ? ++_j : --_j) {
          if (binIndex < bins.length) {
            count += bins[binIndex];
          }
        }
        intervalData[i] = base + i * interval;
        widthData[i] = interval;
        countData[i] = count;
      }
    } else {
      binCount = bins.length;
      intervalData = new Array(binCount);
      widthData = new Array(binCount);
      countData = new Array(binCount);
      for (i = _k = 0, _len = bins.length; _k < _len; i = ++_k) {
        count = bins[i];
        intervalData[i] = base + i * stride;
        widthData[i] = stride;
        countData[i] = count;
      }
    }
    for (i = _l = _ref1 = binCount - 1; _ref1 <= 0 ? _l <= 0 : _l >= 0; i = _ref1 <= 0 ? ++_l : --_l) {
      if (countData[i] !== 0) {
        binCount = i + 1;
        intervalData = intervalData.slice(0, binCount);
        widthData = widthData.slice(0, binCount);
        countData = countData.slice(0, binCount);
        break;
      }
    }
    const vectors = [
      createFactor('interval', 'String', intervalData),
      createVector('width', 'Number', widthData),
      createVector('count', 'Number', countData),
    ];
    return createDataframe('distribution', vectors, lodash.range(binCount), null, {
      description: `Distribution for column \'${column.label}\' in frame \'${frameKey}\'.`,
      origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
      plot: `plot inspect \'distribution\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
    });
  };
  inspectCharacteristics = () => {
    let characteristicData;
    let count;
    let countData;
    let missing_count;
    let negative_infinity_count;
    let other;
    let percentData;
    let positive_infinity_count;
    let vectors;
    let zero_count;
    missing_count = column.missing_count, zero_count = column.zero_count, positive_infinity_count = column.positive_infinity_count, negative_infinity_count = column.negative_infinity_count;
    other = rowCount - missing_count - zero_count - positive_infinity_count - negative_infinity_count;
    characteristicData = [
      'Missing',
      '-Inf',
      'Zero',
      '+Inf',
      'Other',
    ];
    countData = [
      missing_count,
      negative_infinity_count,
      zero_count,
      positive_infinity_count,
      other,
    ];
    percentData = (() => {
      let _i;
      let _len;
      let _results;
      _results = [];
      for (_i = 0, _len = countData.length; _i < _len; _i++) {
        count = countData[_i];
        _results.push(100 * count / rowCount);
      }
      return _results;
    })();
    vectors = [
      createFactor('characteristic', 'String', characteristicData),
      createVector('count', 'Number', countData),
      createVector('percent', 'Number', percentData),
    ];
    return createDataframe('characteristics', vectors, lodash.range(characteristicData.length), null, {
      description: `Characteristics for column \'${column.label}\' in frame \'${frameKey}\'.`,
      origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
      plot: `plot inspect \'characteristics\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
    });
  };
  inspectSummary = () => {
    let defaultPercentiles;
    let maximum;
    let mean;
    let minimum;
    let outliers;
    let percentiles;
    let q1;
    let q2;
    let q3;
    let vectors;
    defaultPercentiles = frame.default_percentiles;
    percentiles = column.percentiles;
    mean = column.mean;
    q1 = percentiles[defaultPercentiles.indexOf(0.25)];
    q2 = percentiles[defaultPercentiles.indexOf(0.5)];
    q3 = percentiles[defaultPercentiles.indexOf(0.75)];
    outliers = lodash.unique(column.mins.concat(column.maxs));
    minimum = lodash.head(column.mins);
    maximum = lodash.head(column.maxs);
    vectors = [
      createFactor('column', 'String', [columnName]),
      createVector('mean', 'Number', [mean]),
      createVector('q1', 'Number', [q1]),
      createVector('q2', 'Number', [q2]),
      createVector('q3', 'Number', [q3]),
      createVector('min', 'Number', [minimum]),
      createVector('max', 'Number', [maximum]),
    ];
    return createDataframe('summary', vectors, lodash.range(1), null, {
      description: `Summary for column \'${column.label}\' in frame \'${frameKey}\'.`,
      origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
      plot: `plot inspect \'summary\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
    });
  };
  inspectDomain = () => {
    let counts;
    let i;
    let labels;
    let level;
    let levels;
    let percents;
    let sortedLevels;
    let vectors;
    let _i;
    let _len;
    let _ref1;
    levels = lodash.map(column.histogram_bins, (count, index) => ({
      count,
      index,
    }));
    sortedLevels = lodash.sortBy(levels, level => -level.count);
    _ref1 = createArrays(3, sortedLevels.length), labels = _ref1[0], counts = _ref1[1], percents = _ref1[2];
    for (i = _i = 0, _len = sortedLevels.length; _i < _len; i = ++_i) {
      level = sortedLevels[i];
      labels[i] = column.domain[level.index];
      counts[i] = level.count;
      percents[i] = 100 * level.count / rowCount;
    }
    vectors = [
      createFactor('label', 'String', labels),
      createVector('count', 'Number', counts),
      createVector('percent', 'Number', percents),
    ];
    return createDataframe('domain', vectors, lodash.range(sortedLevels.length), null, {
      description: `Domain for column \'${column.label}\' in frame \'${frameKey}\'.`,
      origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
      plot: `plot inspect \'domain\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
    });
  };
  inspections = { characteristics: inspectCharacteristics };
  switch (column.type) {
    case 'int':
    case 'real':
      // Skip for columns with all NAs
      if (column.histogram_bins.length) {
        inspections.distribution = inspectDistribution;
      }
      // Skip for columns with all NAs
      if (!lodash.some(column.percentiles, a => a === 'NaN')) {
        inspections.summary = inspectSummary;
        inspections.percentiles = inspectPercentiles;
      }
      break;
    case 'enum':
      inspections.domain = inspectDomain;
      break;
    default:
      // do nothing
  }
  inspect_(frame, inspections);
  return render_(_, frame, h2oColumnSummaryOutput, frameKey, frame, columnName);
}
