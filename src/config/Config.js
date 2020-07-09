const set = require('lodash.set');
const get = require('lodash.get');

class Config {
  /**
   * @param {string} name
   */
  constructor() {
    this.name = name;
  }

  /**
   * Get config name
   * 
   * @return {string}
   */
  getName() {
    return this.name;
  }

  /**
   * Get property value
   * 
   * @param {string} path
   * @return {string}
   */
  get(path) {
    return get(this, path);
  }

  /**
   * Set property value
   * 
   * @param {string} path
   * @param {string} value
   */
  set(path, value){
    set(this, path, value);
  }

  /**
   *
   */
  reset() {

  }
}

module.exports = Config;
