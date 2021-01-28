export default function getCachedRandom(a, b) {
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
