recommenderir
===============================

`recommenderir` is the official nodejs api from recommender.ir

[![NPM](https://nodei.co/npm/recommenderir.png?downloads=true&downloadRank=true)](https://nodei.co/npm/recommenderir/)

 * **[Installation](#Installation)**
 * **[Usage](#Usage)**
 * **[Documents](#Documents)**
 * **[Methods](#Methods)**
 * **[Contributing](#Contributing)**

<a name="Installation"></a>
# Installation
 - `npm i recommenderir`

<a name="Usage"></a>
## Usage

First, please enter your recommender.ir service address as shown below:

```js
const recommender = require('recommenderir')

var url = "http://127.0.0.1:1234" // recommender.ir service address

recommender.setUrl(url)
```

Then, call available methods which is exists in [Methods](#Methods) section. For example:

```js
var userID = 1 // must be integer
var itemID = 'node-123' // must be string
var value = 10 // must be between 0 and 255

var callback = function (error, response, body) {
   if (!error && response.statusCode == 200) {
     // Do what you want
     console.log(body)
   }
}

recommender.ingest(userID, itemID, value, callback)

/********** OR **********/

var result = recommender.ingest(userID, itemID, value)
console.log(result)
```

**Note:** You can use this package for sync or async purposes. So, if no callback is passed, results will be returned.

<a name="Documents"></a>
## Documents

For more information about methods and usage, please visit [Wiki](https://github.com/mahshad/nodejs-recommenderir/wiki) page.

<a name="Methods"></a>
## Methods

 * ingest
 * ingestComment
 * allItems
 * allUsers
 * forget
 * forgetList
 * remember
 * itemLocationAdd
 * itemLocationList
 * similarity
 * recommend
 * recommendToGroup
 * recommendToNewcomer
 * termItemAdd
 * termItemList
 * termItemRemove
 * termRecommend
 * termBasedRecommend
 * termBasedRecommendInclusive
 * termBasedMostPopularItems
 * termBasedMostPopularItemsInclusive
 * termBasedSimilarity
 * termBasedSimilarityInclusive
 * luckyUser
 * trendShortTime
 * trendMidTime
 * trendLongTime

<a name="Contributing"></a>
## Contributing

Pull requests are welcome.