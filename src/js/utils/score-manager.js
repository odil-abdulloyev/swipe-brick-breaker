function formatDate(date) {
  const dt = new Date(date);
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const day = dt.getDate();
  return `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month}.${year}`;
}

function findByField(objects, field, x) {
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

export default class ScoreManager {
  constructor(data = []) {
    this.assign(data);
  }

  assign(data) {
    this.data = data;
  }

  add({ name, score }) {
    const record = { name, score, date: formatDate(Date.now()) };
    const i = findByField(this.data, 'score', score);
    this.data.splice(i, 0, record);
  }

  getRecords(n = 10) {
    return this.data.slice(0, n);
  }

  clear() {
    this.data = [];
  }
}
