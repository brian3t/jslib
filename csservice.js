const axios = require('axios')

class Csservice{
  static API_HOST //e.g. http://mtapi.wagapi/
  /**
   * Patch data using an endpoint
   * @param ep, such as game/wager/user/profile
   * @param id
   * @param changed_attr
   * @returns {Promise<AxiosResponse<any>>}
   */
  static patch = async function(ep, id, changed_attr){
    if (!id) reject(`Need id!`)
    let url = `${this.prototype.constructor.API_HOST}${ep}/${id}`
    return axios.patch(url, changed_attr)
  }
}

module.exports = Csservice
