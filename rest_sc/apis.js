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
    return res
  }

  getPropertyByName(propertyName) {
    return globalState[propertyName]
  }

  setPropertyValue(propertyName, propertyValue) {
    globalState[propertyName] = propertyValue
  }

  async test(input) {
    console.info('ENV: ', APISocal.ENV)
    return `test successful. Input was : ${input}`
  }
}

let apis = Object.freeze(new APISocal())

export default apis
