'use strict'

var Validator = {

  integer: function(value, key = 'item') {
    if (!Number.isInteger(value))
      throw new Error(key + " must be integer")

    return true
  },

  string: function(value, key = 'item') {
    var match = /^[a-zA-Z]/.test(value)

    if(!match)
      throw new Error(key + " must be string and starts with alphabet")

    return true
  },

  array: function(value, key = 'item', func = 'string') {
    console.log(value.length)
    if(typeof value == 'undefined' || !(value && value.length > 0))
      throw new Error(key + " must be array and contains at least one index")

    value.map(function(val){
      return Validator[func](val, key)
    })

    return true
  },

  value: function(value, key = 'value') {
    if(value < 0 || value > 255)
      throw new Error(key + " must be between 0 and 255")

    return true
  }

}

module.exports = Validator
