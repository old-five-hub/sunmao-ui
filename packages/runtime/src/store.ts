import _ from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { reactive } from '@vue/reactivity';
import { watch } from '@vue-reactivity/watch';

dayjs.extend(relativeTime);

type ExpChunk = {
  expression: string;
  isDynamic: boolean;
};

// TODO: use web worker
const builtIn = {
  dayjs,
};

function isNumeric(x: string | number) {
  return !isNaN(Number(x));
}

export const stateStore = reactive<Record<string, any>>({});

function parseExpression(str: string): ExpChunk[] {
  let l = 0;
  let r = 0;
  let isInBrackets = false;
  const res = [];

  while (r < str.length - 1) {
    if (!isInBrackets && str.substr(r, 2) === '{{') {
      if (l !== r) {
        const substr = str.substring(l, r);
        res.push({
          expression: substr,
          isDynamic: false,
        });
      }
      isInBrackets = true;
      r += 2;
      l = r;
    } else if (isInBrackets && str.substr(r, 2) === '}}') {
      const substr = str.substring(l, r);
      res.push({
        expression: substr,
        isDynamic: true,
      });
      isInBrackets = false;
      r += 2;
      l = r;
    } else {
      r++;
    }
  }

  if (r > l) {
    res.push({
      expression: str.substring(l, r + 1),
      isDynamic: false,
    });
  }
  return res;
}

function maskedEval(raw: string) {
  if (isNumeric(raw)) {
    return _.toNumber(raw);
  }
  if (raw === 'true') {
    return true;
  }
  if (raw === 'false') {
    return false;
  }

  const expChunks = parseExpression(raw);
  const evaled = expChunks.map(({ expression: exp, isDynamic }) => {
    if (!isDynamic) {
      return exp;
    }

    try {
      const result = new Function(`with(this) { return ${exp} }`).call({
        ...stateStore,
        ...builtIn,
      });
      return result;
    } catch (e) {
      console.error(Error(`Cannot eval value '${exp}' in '${raw}'`));
      return undefined;
    }
  });

  return evaled.length === 1 ? evaled[0] : evaled.join('');
}

export const mapValuesDeep = (
  obj: any,
  fn: (params: {
    value: any;
    key: string;
    obj: any;
    path: Array<string | number>;
  }) => void,
  path: Array<string | number> = []
): any => {
  return _.mapValues(obj, (val, key) => {
    return _.isArray(val)
      ? val.map((innerVal, idx) => {
          return _.isPlainObject(innerVal)
            ? mapValuesDeep(innerVal, fn, path.concat(key, idx))
            : fn({ value: innerVal, key, obj, path: path.concat(key, idx) });
        })
      : _.isPlainObject(val)
      ? mapValuesDeep(val, fn, path.concat(key))
      : fn({ value: val, key, obj, path: path.concat(key) });
  });
};

export function deepEval(
  obj: object,
  watcher?: (params: { result: ReturnType<typeof mapValuesDeep> }) => void
) {
  const stops: ReturnType<typeof watch>[] = [];

  const evaluated = mapValuesDeep(obj, ({ value: v, path }) => {
    if (typeof v === 'string') {
      const isDynamicExpression = parseExpression(v).some(
        ({ isDynamic }) => isDynamic
      );
      const result = maskedEval(v);
      if (isDynamicExpression && watcher) {
        const stop = watch(
          () => {
            return maskedEval(v);
          },
          newV => {
            _.set(evaluated, path, newV);
            watcher({ result: evaluated });
          }
        );
        stops.push(stop);
      }

      return result;
    }
    return v;
  });

  return {
    result: evaluated,
    stop: () => stops.forEach(s => s()),
  };
}
