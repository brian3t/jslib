import axios from "axios";
import _ from "lodash";
import store from "store2";

let instance
let globalState = {
  color: ""
}

/**
 * The REST API helper
 * Usage: import apis; apis.setup(env); apis.c() apis.g() apis.p() apis.put() apis.d()
 */
class APISocal {
  static ENV = {
    url: ''
  }

  static axios_config = {
    headers: {
      "content-type": "application/json"
    }
  }


  constructor() {
    if (instance) {
      throw new Error("New instance cannot be created!!")
    }
    instance = this
  }

  /** Should be called just once */
  setup(env) {
    APISocal.ENV = Object.assign(APISocal.ENV, env) //no need for _.cloneDeep for now. Keep it simple
  }

  //CRUD
  /**
   * GET
   * @param ep e.g. cuser
   * @param query Object {}
   */
  async g(ep, query) {
    if (!query.maxrows) query.maxrows = 100
    Object.keys(query).forEach(key => {
      if (typeof query[key] == 'undefined') delete query[key]
    })
    const query_str = new URLSearchParams(query)
    const res = await axios.get(APISocal.ENV.url + ep + '?' + query_str.toString())
    if (!res.data) {
      console.error(`Error getting data from backend: `, res.headers)
      return []
    }
    return res.data
  }

  /**
   * POST
   * @param ep e.g. cuser
   * @param new_obj Object {}
   * @param extra_headers
   * @return [success_boolean, created_data/error msg]
   */
  async c(ep, new_obj, extra_headers = {}) {
    Object.keys(new_obj).forEach(key => {
      if (typeof new_obj[key] == 'undefined') delete new_obj[key]
    })
    if (APISocal.ENV.auth == 'ls'){
      const userid=parseInt(store('userid'))
      if (!_.isInteger(userid) && !(ep.endsWith('signin'))) return [false, 'Please log in first']
      extra_headers.userid = userid
      extra_headers.created_by = userid
    }
    let res = false
    const axios_config = APISocal.axios_config
    axios_config.headers = _.extend(axios_config.headers, extra_headers)
    try {
      res = await axios.post(APISocal.ENV.url + ep, new_obj, axios_config)
    } catch (e) {
      return [false, e.response?.data]
    }
    if (!res.data) {
      console.error(`Error getting data from backend: `, res.headers)
      return [false, res.headers.toString()]
    }
    return [true, res.data]
  }

  getPropertyByName(propertyName) {
    return globalState[propertyName]
  }

  setPropertyValue(propertyName, propertyValue) {
    globalState[propertyName] = propertyValue
  }

  async test(input) {
    //console.info('ENV: ', APISocal.ENV)
    return `test successful. Input was : ${input}`
  }
}

let apis = Object.freeze(new APISocal())

export default apis
