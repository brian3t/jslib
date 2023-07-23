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
    axios.interceptors.request.use(function (config) {
      if (APISocal.ENV.auth == 'ls') {
        const userid = parseInt(store('userid'))
        if (_.isInteger(userid)) {
          config.headers.loggedin_userid = userid.toString()
        }
      }
      return config
    })
  }

  //CRUD
  /**
   * GET
   * @param ep e.g. cuser
   * @param query Object {}
   * @param extra_headers
   * @param skipped_param //do not send these query params. For example, do not send user_id; in order to get all
   */
  async g(ep, query, extra_headers = {}, skipped_param = []) {
    if (!query.maxrows) query.maxrows = 100
    Object.keys(query).forEach(key => {
      if (typeof query[key] == 'undefined') delete query[key]
    })
    const query_str = new URLSearchParams(query)
    const axios_config = APISocal.axios_config

    const url = APISocal.ENV.url + ep + '?' + query_str.toString()
    const res = await axios.get(url)
    if (!res.data) {
      console.error(`Error getting data from backend: `, res.headers)
      return []
    }
    return res.data
  }

  /**
   * Get first record
   * see g()
   * @param ep
   * @param query
   * @param extra_headers
   * @param skipped_params
   * @return {Promise<void>}
   */
  async g1(ep, query, extra_headers, skipped_params){
    query.maxrows = 1
    const get_response = await this.g(ep, query, extra_headers, skipped_params)
    if (get_response instanceof Array) return get_response[0]
    else return get_response
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
    if (APISocal.ENV.auth == 'ls') {
      const userid = parseInt(store('userid'))
      const do_i_need_to_be_a_user = (!ep.endsWith('signin') && !ep.endsWith('signup')) //if not doing sign in
                                                                    // / sign up; then yes, need to be a user to POST
      if (do_i_need_to_be_a_user && !_.isInteger(userid)) return [false, 'Please log in first']
      extra_headers.userid = userid
      if (!new_obj.hasOwnProperty('userid')) new_obj['userid'] = userid
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

let
  apis = Object.freeze(new APISocal())

export default apis
