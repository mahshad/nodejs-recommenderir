'use strict'

const _validator = require('./lib/validator'),
      _helper = require('./lib/helper')

var Recommender = {

  /**
   * Set the service url
   * 
   * @param {String}  url
   */
  setUrl: function(url) {
    _validator.string(url,'url')

    _helper.url = url
  },

  /**
   * @param  {Number}    userID
   * @param  {String}    itemID
   * @param  {Number}    value
   * @param  {Function}  callback
   */
  ingest: function(userID, itemID, value, callback) {
    _validator.integer(userID,'userID')
    _validator.string(itemID,'itemID')
    _validator.value(value,'value')

    var params = {
      id: userID,
      url: `'${itemID}'`,
      value: value
    }

    _helper.request('ingest', callback, params, 'POST')
  },

  /**
   * @param  {Number}    userID
   * @param  {String}    body
   * @param  {String}    itemID
   * @param  {Function}  callback
   */
  ingestComment: function(userID, body, itemID, callback) {
    _validator.integer(userID,'userID')
    _validator.string(itemID,'itemID')

    var params = {
      userId: userID,
      body: `'${body}'`,
      itemId: itemID
    }

    _helper.request('ingestComment', callback, params, 'POST')
  },

  /**
   * @param  {Function} callback
   * @return {object}   if no callback is passed
   */
  allItems: function(callback) {
    var response = _helper.request('allItems', callback)

    if(response) return JSON.parse(response)
  },

  /**
   * @param  {Function}  callback
   * @return {object}    if no callback is passed
   */
  allUsers: function(callback) {
    var response = _helper.request('allUsers', callback)

    if(response) return JSON.parse(response)
  },

  /**
   * @param  {Array}     itemIDs
   * @param  {Number}    remember
   * @param  {Function}  callback
   */
  forget: function(itemIDs, remember, callback) {
    _validator.array(itemIDs,'itemIDs')

    if(typeof remember == 'function') callback = remember, remember = undefined;

    var params = {}
    if(remember) params.remember = remember

    var items = itemIDs.join('/')
    _helper.request('forget/' + items, callback, params)
  },

  /**
   * @param  {Function}  callback
   * @return {object}    if no callback is passed
   */
  forgetList: function(callback) {
    var params = { list: true }

    var response = _helper.request('forget', callback, params)

    if(response) {
      return response.split("\n").filter(Boolean).filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      })
    }
  },

  /**
   * @param  {Array}     itemIDs
   * @param  {Function}  callback
   */
  remember: function(itemIDs, callback) {
    this.forget(itemIDs, 1, callback)
  },

  /**
   * @param  {String}              itemID
   * @param  {Array}               locations
   * @param  {(Boolean|Function)}  overwrite
   * @param  {(Boolean|Function)}  nocheck
   * @param  {Function}            callback
   */
  itemLocationAdd: function(itemID, locations, overwrite = true, nocheck = true, callback) {
    _validator.string(itemID,'itemID')
    _validator.array(locations,'locations')

    if(typeof overwrite == 'function') callback = overwrite, overwrite = undefined;
    if(typeof nocheck == 'function') callback = nocheck, nocheck = undefined;

    var params = {}
    if(overwrite) params.overwrite = overwrite
    if(nocheck) params.nocheck = nocheck

    var locs = locations.join('/')
    _helper.request('itemLocationAdd/' + itemID + '/' + locs, callback, params)
  },

  /**
   * @param  {String}              itemID
   * @param  {(Boolean|Function)}  nocheck
   * @param  {Function}            callback
   * @return {object}              if no callback is passed
   */
  itemLocationList: function(itemID, nocheck = true, callback) {
    _validator.string(itemID,'itemID')

    if(typeof nocheck == 'function') callback = nocheck, nocheck = undefined;

    var params = {}
    if(nocheck) params.nocheck = nocheck

    var response = _helper.request('itemLocationList/' + itemID, callback, params)
    if(response) return JSON.parse(response)
  },

  /**
   * @param  {Array}              itemIDs
   * @param  {(Number|Function)}  howMany
   * @param  {(Number|Function)}  fresh
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  similarity: function(itemIDs, howMany, fresh, callback) {
    _validator.array(itemIDs,'itemIDs')

    if(typeof howMany == 'function') callback = howMany, howMany = undefined;
    if(typeof fresh == 'function') callback = fresh, fresh = undefined;

    var params = {}
    if(howMany) {
      _validator.integer(howMany,'howMany')
      params.howMany = howMany
    }
    if(fresh) params.fresh = fresh

    var items = itemIDs.join('/')

    var response = _helper.request('similarity/' + items, callback, params)
    if(response) return JSON.parse(response)
  },

  /**
   * @param  {Number}             userID
   * @param  {(Number|Function)}  howMany
   * @param  {(Number|Function)}  fresh
   * @param  {(Number|Function)}  dither
   * @param  {(Number|Function)}  radius
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  recommend: function(userID, howMany, fresh, dither, radius, callback) {
    _validator.integer(userID,'userID')

    if(typeof howMany == 'function') callback = howMany, howMany = undefined;
    if(typeof radius == 'function') callback = radius, radius = undefined;
    if(typeof fresh == 'function') callback = fresh, fresh = undefined;
    if(typeof dither == 'function') callback = dither, dither = undefined;

    var params = {}
    if(howMany) {
      _validator.integer(howMany,'howMany')
      params.howMany = howMany
    }
    if(radius) {
      _validator.integer(radius,'radius')
      params.radius = radius
    }
    if(fresh) params.fresh = fresh
    if(dither) params.dither = dither

    var response = _helper.request('recommend/' + userID, callback, params)
    if(response) return JSON.parse(response)
  },

  /**
   * @param  {Array}              userIDs
   * @param  {(Number|Function)}  howMany
   * @param  {(Number|Function)}  fresh
   * @param  {(Number|Function)}  dither
   * @param  {(Number|Function)}  radius
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  recommendToGroup: function(userIDs, howMany, fresh, dither, radius, callback) {
    _validator.array(userIDs,'userIDs','integer')

    if(typeof howMany == 'function') callback = howMany, howMany = undefined;
    if(typeof radius == 'function') callback = radius, radius = undefined;
    if(typeof fresh == 'function') callback = fresh, fresh = undefined;
    if(typeof dither == 'function') callback = dither, dither = undefined;

    var params = {}
    if(howMany) {
      _validator.integer(howMany,'howMany')
      params.howMany = howMany
    }
    if(radius) {
      _validator.integer(radius,'radius')
      params.radius = radius
    }
    if(fresh) params.fresh = fresh
    if(dither) params.dither = dither

    var users = userIDs.join('/')
    var response = _helper.request('recommendToGroup/' + users, callback, params)
    if(response) return JSON.parse(response)
  },

  /**
   * @param  {Array}              itemIDs
   * @param  {(Number|Function)}  howMany
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  recommendToNewcomer: function(itemIDs, howMany, callback) {
    _validator.array(itemIDs,'itemIDs')

    if(typeof howMany == 'function') callback = howMany, howMany = undefined;

    var params = {}
    if(howMany) {
      _validator.integer(howMany,'howMany')
      params.howMany = howMany
    }

    var items = itemIDs.join('/')
    var response = _helper.request('recommendToNewcomer/' + items, callback, params)
    if(response) return JSON.parse(response)
  },

  /**
   * @param  {String}              itemID
   * @param  {Array}               terms
   * @param  {(Boolean|Function)}  overwrite
   * @param  {(Boolean|Function)}  nocheck
   * @param  {Function}            callback
   */
  termItemAdd: function(itemID, terms, overwrite = true, nocheck = true, callback) {
    _validator.string(itemID,'itemID')
    _validator.array(terms,'terms')

    if(typeof overwrite == 'function') callback = overwrite, overwrite = undefined;
    if(typeof nocheck == 'function') callback = nocheck, nocheck = undefined;

    var params = {}
    if(overwrite) params.overwrite = overwrite
    if(nocheck) params.nocheck = nocheck

    var term = terms.join('/')
    _helper.request('termItemAdd/' + itemID + '/' + term, callback, params)
  },

  /**
   * @param  {String}              itemID
   * @param  {(Boolean|Function)}  nocheck
   * @param  {Function}            callback
   * @return {object}              if no callback is passed
   */
  termItemList: function(itemID, nocheck = true, callback) {
    _validator.string(itemID,'itemID')

    if(typeof nocheck == 'function') callback = nocheck, nocheck = undefined;

    var params = {}
    if(nocheck) params.nocheck = nocheck

    var response = _helper.request('termItemList/' + itemID, callback, params)

    if(response) return JSON.parse(response)
  },

  /**
   * @param  {String}    itemID
   * @param  {String}    term
   * @param  {Function}  callback
   */
  termItemRemove: function(itemID, term, callback) {
    _validator.string(itemID,'itemID')
    _validator.string(term,'term')

    _helper.request('termItemRemove/' + itemID + '/' + term, callback)
  },

  /**
   * @param  {Number}             userID
   * @param  {(Number|Function)}  howMany
   * @param  {(Number|Function)}  fresh
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  termRecommend: function(userID, howMany, fresh, callback) {
    _validator.integer(userID,'userID')

    if(typeof howMany == 'function') callback = howMany, howMany = undefined;
    if(typeof fresh == 'function') callback = fresh, fresh = undefined;

    var params = {}
    if(howMany) {
      _validator.integer(howMany,'howMany')
      params.howMany = howMany
    }
    if(fresh) params.fresh = fresh

    var response = _helper.request('termRecommend/' + userID, callback, params)
    
    if(response) return JSON.parse(response)
  },

  /**
   * @param  {Number}              userID
   * @param  {(Array|Function)}    terms
   * @param  {(Boolean|Function)}  profileBased
   * @param  {(Number|Function)}   howMany
   * @param  {(Number|Function)}   fresh
   * @param  {(Number|Function)}   radius
   * @param  {(Number|Function)}   dither
   * @param  {(Boolean|Function)}  inclusive
   * @param  {Function}            callback
   * @return {object}              if no callback is passed
   */
  termBasedRecommend: function(userID, terms, profileBased = false, howMany, fresh, radius, dither, inclusive = false, callback) {
    _validator.integer(userID,'userID')

    if(typeof terms == 'function') callback = terms, terms = [];
    if(typeof profileBased == 'function') callback = profileBased, profileBased = false;
    if(typeof howMany == 'function') callback = howMany, howMany = undefined;
    if(typeof fresh == 'function') callback = fresh, fresh = undefined;
    if(typeof radius == 'function') callback = radius, radius = undefined;
    if(typeof dither == 'function') callback = dither, dither = undefined;
    if(typeof inclusive == 'function') callback = inclusive, inclusive = false;

    var path = ''
    if(!inclusive) path = 'termBasedRecommend'
    else path = 'termBasedRecommendInclusive'

    var term = ''
    if(profileBased == false) {
      _validator.array(terms,'terms')

      term = terms.join('/')
    }

    var params = {}
    if(howMany) {
      _validator.integer(howMany,'howMany')
      params.howMany = howMany
    }
    if(radius) {
      _validator.integer(radius,'radius')
      params.radius = radius
    }
    if(profileBased) params.profileBased = profileBased
    if(fresh) params.fresh = fresh
    if(dither) params.dither = dither

    var response = _helper.request(path + '/' + userID + '/' + term, callback, params)
    if(response) return JSON.parse(response)
  },

  /**
   * @param  {Number}              userID
   * @param  {(Array|Function)}    terms
   * @param  {(Boolean|Function)}  profileBased
   * @param  {(Number|Function)}   howMany
   * @param  {(Number|Function)}   fresh
   * @param  {(Number|Function)}   radius
   * @param  {(Number|Function)}   dither
   * @param  {Function}            callback
   * @return {object}              if no callback is passed
   */
  termBasedRecommendInclusive: function(userID, terms, profileBased = false, howMany, fresh, radius, dither, callback) {
    return this.termBasedRecommend(userID, terms, profileBased, howMany, fresh, radius, dither, true, callback)
  },

  /**
   * @param  {Array}               terms
   * @param  {(Number|Function)}   howMany
   * @param  {(Number|Function)}   fresh
   * @param  {(Boolean|Function)}  inclusive
   * @param  {Function}            callback
   * @return {object}              if no callback is passed
   */
  termBasedMostPopularItems: function(terms, howMany, fresh, inclusive = false, callback) {
    _validator.array(terms,'terms')

    if(typeof howMany == 'function') callback = howMany, howMany = undefined;
    if(typeof fresh == 'function') callback = fresh, fresh = undefined;
    if(typeof inclusive == 'function') callback = inclusive, inclusive = false;

    var params = {}
    if(howMany) {
      _validator.integer(howMany,'howMany')
      params.howMany = howMany
    }
    if(fresh) params.fresh = fresh

    var path = ''
    if(!inclusive) path = 'termBasedMostPopularItems'
    else path = 'termBasedMostPopularItemsInclusive'

    var term = terms.join('/')
    var response = _helper.request(path + '/' + term, callback, params)
    if(response) return JSON.parse(response)
  },

  /**
   * @param  {Array}              terms
   * @param  {(Number|Function)}  howMany
   * @param  {(Number|Function)}  fresh
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  termBasedMostPopularItemsInclusive: function(terms, howMany, fresh, callback) {
    return this.termBasedMostPopularItems(terms, howMany, fresh, true, callback)
  },

  /**
   * @param  {String}              itemID
   * @param  {Array}               terms
   * @param  {(Number|Function)}   howMany
   * @param  {(Number|Function)}   fresh
   * @param  {(Boolean|Function)}  inclusive
   * @param  {Function}            callback
   * @return {object}              if no callback is passed
   */
  termBasedSimilarity: function(itemID, terms, howMany, fresh, inclusive = false, callback) {
    _validator.string(itemID,'itemID')
    _validator.array(terms,'terms')

    if(typeof howMany == 'function') callback = howMany, howMany = undefined;
    if(typeof fresh == 'function') callback = fresh, fresh = undefined;
    if(typeof inclusive == 'function') callback = inclusive, inclusive = false;

    var params = {}
    if(howMany) {
      _validator.integer(howMany,'howMany')
      params.howMany = howMany
    }
    if(fresh) params.fresh = fresh

    var path = ''
    if(!inclusive) path = 'termBasedSimilarity'
    else path = 'termBasedSimilarityInclusive'

    var term = terms.join('/')
    var response = _helper.request(path + '/' + itemID + '/' + term, callback, params)
    if(response) return JSON.parse(response)
  },

  /**
   * @param  {String}             itemID
   * @param  {Array}              terms
   * @param  {(Number|Function)}  howMany
   * @param  {(Number|Function)}  fresh
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  termBasedSimilarityInclusive: function(itemID, terms, howMany, fresh, callback) {
    return this.termBasedSimilarity(itemID, terms, howMany, fresh, true)
  },

  /**
   * @param  {Number}             userID
   * @param  {String}             itemID
   * @param  {(Number|Function)}  howMany
   * @param  {(Number|Function)}  fresh
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  luckyUser: function(userID, itemID, howMany, fresh, callback) {
    _validator.integer(userID,'userID')
    _validator.string(itemID,'itemID')

    if(typeof howMany == 'function') callback = howMany, howMany = undefined;
    if(typeof fresh == 'function') callback = fresh, fresh = undefined;

    var params = {}
    if(howMany) {
      _validator.integer(howMany,'howMany')
      params.howMany = howMany
    }
    if(fresh) params.fresh = fresh

    var response = _helper.request('luckyUser/' + userID + '/' + itemID, callback, params)

    if(response) return JSON.parse(response)
  },

  /**
   * @param  {String}             type
   * @param  {(Number|Function)}  howMany
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  trend: function(type, howMany, callback) {
    if(typeof howMany == 'function') callback = howMany, howMany = undefined;

    var params = {}
    if(howMany) {
      _validator.integer(howMany,'howMany')
      params.howMany = howMany
    }

    var response = _helper.request(type, callback, params)

    if(response) return JSON.parse(response)
  },

  /**
   * @param  {(Number|Function)}  howMany
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  trendShortTime: function(howMany, callback) {
    return this.trend('trendShortTime', howMany, callback)
  },

  /**
   * @param  {(Number|Function)}  howMany
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  trendMidTime: function(howMany, callback) {
    return this.trend('trendMidTime', howMany, callback)
  },

  /**
   * @param  {(Number|Function)}  howMany
   * @param  {Function}           callback
   * @return {object}             if no callback is passed
   */
  trendLongTime: function(howMany, callback) {
    return this.trend('trendLongTime', howMany, callback)
  }
}

module.exports = Recommender
