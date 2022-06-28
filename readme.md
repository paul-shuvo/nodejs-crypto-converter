<div align="center">
<h1>NodeJS Crypto Converter</h1>

[![Build Status](https://travis-ci.com/paul-shuvo/nodejs-crypto-converter.svg?branch=main)](https://travis-ci.com/paul-shuvo/nodejs-crypto-converter) [![Known Vulnerabilities](https://snyk.io/test/github/paul-shuvo/nodejs-crypto-converter/badge.svg?targetFile=package.json)](https://snyk.io/test/github/paul-shuvo/nodejs-crypto-converter?targetFile=package.json)  ![supported node versions](https://img.shields.io/badge/node%20v-12.x%20%7C%2013.x%20%7C%2014.x%20%7C%2015.x%20%7C%2016.x%20%7C%2017.x-blue) [![codecov](https://codecov.io/gh/paul-shuvo/nodejs-crypto-converter/branch/main/graph/badge.svg)](https://codecov.io/gh/paul-shuvo/nodejs-crypto-converter)
 ![license: MIT](https://img.shields.io/npm/l/vue.svg) [![Maintainability](https://api.codeclimate.com/v1/badges/b512e403dfc172ee3b0d/maintainability)](https://codeclimate.com/github/paul-shuvo/nodejs-crypto-converter/maintainability) [![npm version](https://badge.fury.io/js/crypto-converter-lt.svg)](https://badge.fury.io/js/crypto-converter-lt) ![npm](https://img.shields.io/npm/dm/crypto-converter-lt)
<p>A minimal crypto crypto converter library for NodeJS that works out of the box.</p>
</div>



## Getting started

### Installation

This package can be installed using `npm`

```bash
npm install crypto-converter-lt
```

or, `yarn`

```bash
yarn add crypto-converter-lt
```

### Usage

Import `crypto-converter-lt`.

```javascript
const CC = require('crypto-converter-lt')
```

Then instantiate with either the empty constructor

```javascript
let cryptoConverter = new CC()
```

Or, with a json object

```javascript
let cryptoConverter = new CC({from:"BTC", to:"ETH", amount:100})
```

The convert method will return the conversion based on the last conversion rate and can be used as a promise.

```javascript
cryptoConverter.convert().then((response) => {
    console.log(response) //or do something else
})
```

`convert` can also take the amount as a parameter.

```javascript
cryptoConverter.convert(100).then((response) => {
    console.log(response) //or do something else
})
```

To find the rates use the `rates` method.

```javascript
cryptoConverter.rates().then((response) => {
    console.log(response) //or do something else
})
```

Rates can be cached. To implement rate caching, instantiate an object of CryptoConverter only once in your project, in a CyptoConverter file, and setup rates caching then import the instance of CryptoConverter from the CyptoConverter file in your project across the rest of your project. Use chaining to convert cryptocurrencies when caching is implemented. Below is an example of a CyptoConverter file.

```javascript
const CC = require('crypto-converter-lt')

let cryptoConverter = new CC()

let ratesCacheOptions = {
    isRatesCaching: true, // Set this boolean to true to implement rate caching
    ratesCacheDuration: 3600 // Set this to a positive number to set the number of seconds you want your rates to be cached. Defaults to 3600 seconds (1 hour)
}

cryptoConverter = cryptoConverter.setupRatesCache(ratesCacheOptions)

module.exports = cryptoConverter
```

Chaining is also supported.

```javascript
cryptoConverter.from("LTC").to("ETH").amount(125).convert().then((response) => {
    console.log(response) //or do something else
})
```



## Issues

If any issues are found, they can be reported [here](https://github.com/paul-shuvo/nodejs-crypto-converter/issues).

## License

This project is licensed under the [MIT](LICENSE) license.
