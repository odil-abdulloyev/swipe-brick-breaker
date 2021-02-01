export function getCachedRandom(a, b) {
  const cache = [];
  let calls = 0;
  return function fn() {
    if (calls >= b - a) {
      throw new Error(`Too much calls. This function can be called no more than ${b - a - 1} times`);
    }
    const res = Math.floor(a + Math.random() * (b - a));
    if (cache.includes(res)) {
      return fn();
    }
    cache.push(res);
    ++calls;
    return res;
  };
}

export function formatDate(date) {
  const dt = new Date(date);
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const day = dt.getDate();
  return `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month}.${year}`;
}

export function findByField(objects, field, x) {
  let begin = 0;
  let end = objects.length - 1;
  let middle = Math.floor((begin + end) / 2);
  while (begin <= end) {
    if (x > objects[middle][field]) {
      end = middle - 1;
    } else if (x < objects[middle][field]) {
      begin = middle + 1;
    } else {
      return middle;
    }
    middle = Math.floor((begin + end) / 2);
  }
  return begin;
}
