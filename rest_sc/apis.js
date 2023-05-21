let instance
let globalState = {
  color: ""
}

class APISocal {
  constructor() {
    if (instance) {
      throw new Error("New instance cannot be created!!")
    }

    instance = this
  }

  getPropertyByName(propertyName) {
    return globalState[propertyName]
  }

  setPropertyValue(propertyName, propertyValue) {
    globalState[propertyName] = propertyValue
  }

  async test(input){
    return `test successful. Input was : ${input}`
  }
}

let apis = Object.freeze(new APISocal())

export default apis
