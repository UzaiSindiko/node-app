const checkType = function (subject) {
  return Object.prototype.toString.call(subject).slice(8, -1).toLowerCase()
}

const checkTypeHelper = function (items, requiredType) {
  items.forEach((argument) => {
    if (checkType(argument) !== requiredType) {
      throw {
        status: 400,
        msg: `${argument} is not a ${requiredType}`,
      }
    }
  })
  if (process.env.NODE_ENV === "testing") {
    return true
  }
}

const isString = function () {
  const requiredType = "string"
  checkTypeHelper([...arguments], requiredType)
  return true
}
const isArray = function () {
  const requiredType = "array"
  checkTypeHelper([...arguments], requiredType)
  return true
}
const isObject = function () {
  const requiredType = "object"
  checkTypeHelper([...arguments], requiredType)
  return true
}
const isBoolean = function () {
  const requiredType = "boolean"
  checkTypeHelper([...arguments], requiredType)
  return true
}
const isNumber = function () {
  const requiredType = "number"
  checkTypeHelper([...arguments], requiredType)
  return true
}

const isDate = function () {
  const requiredType = "date"
  checkTypeHelper([...arguments], requiredType)
  return true
}

module.exports = {
  checkType,
  isString,
  isArray,
  isObject,
  isBoolean,
  isNumber,
  isDate,
}
