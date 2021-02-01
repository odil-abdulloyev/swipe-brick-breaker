export default class DBManager {
  constructor(url) {
    this.url = url;
  }

  async addRecord(record) {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        body: JSON.stringify(record),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (err) {
      return null;
    }
  }

  async getRecords() {
    try {
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const records = await response.json();
      return records
        ? Object.keys(records).map((key) => ({ ...records[key] }))
        : [];
    } catch (err) {
      return null;
    }
  }
}
