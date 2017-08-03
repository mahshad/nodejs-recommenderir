'use strict'

const request = require('request')
const srequest = require('sync-request')

var Helper = {

  url: process.env.RECOM_URI || undefined,

  request: function(method, callback, params = {}, request_as = 'GET') {
    if(typeof this.url == 'undefined' || !(this.url && this.url.length > 0))
      throw new Error("URL is undefined or is empty!\nSet RECOM_URI variable on the server you deploy to or use setUrl method to set URL. Thanks :)")

    var url = this.url
    if (url.substr(-1) != '/') url += '/'
    url += method

    var options = {
      url: url,
      method: request_as,
      headers: {
        'User-Agent': 'nodejs-recommenderir (https://github.com/mahshad/nodejs-recommenderir)',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    switch (request_as) {
      case 'GET':
        options.qs = params
        break

      case 'POST':
        options.body = Object.keys(params).map(function(k){return params[k]}).join(",")
        break
    }

    if(typeof callback == 'function')
      request(options, callback)
    else {
      var res = srequest(request_as, url, options)
      
      return res.getBody().toString()
    }
  }

}

module.exports = Helper
