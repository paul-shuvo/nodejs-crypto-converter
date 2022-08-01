const cheerio = require("cheerio")
const got = require("got")
class CryptoConverter {
    currencies = {
        "ZRX": "0x",
        "AION": "Aion",
        "ARDR": "Ardor",
        "ARK": "Ark",
        "REP": "Augur",
        "BNT": "Bancor",
        "BAT": "Basic Attention Token",
        "BNB": "Binance Coin",
        "BTS": "BitShares",
        "BTC": "Bitcoin",
        "BCH": "Bitcoin Cash",
        "BTG": "Bitgem",
        "BCN": "Bytecoin",
        "BTM": "Bytom",
        "ADA": "Cardano",
        "LINK": "ChainLink",
        "DASH": "Dash",
        "MANA": "Decentraland",
        "DCR": "Decred",
        "DGB": "DigiByte",
        "XDN": "DigitalNote",
        "DGD": "DigixDAO",
        "DOGE": "Dogecoin",
        "EOS": "EOS",
        "ENG": "Enigma",
        "ETH": "Ether",
        "ETC": "Ethereum Classic",
        "BQX": "Ethos",
        "FCT": "Factom",
        "FUN": "FunFair",
        "GAME": "GameCredits",
        "GAS": "Gas",
        "GNO": "Gnosis",
        "GNT": "Golem",
        "GRS": "Groestlcoin",
        "HSR": "Hshare",
        "ICX": "ICON",
        "KNC": "KingN Coin",
        "KMD": "Komodo",
        "LSK": "Lisk",
        "LTC": "Litecoin",
        "MAID": "MaidSafeCoin",
        "MONA": "MonaCoin",
        "XMR": "Monero",
        "XEM": "NEM",
        "NEO": "NEO",
        "NANO": "Nano",
        "NEBL": "Neblio",
        "NXS": "Nexus",
        "NXT": "Nxt",
        "OMG": "OmiseGO",
        "ONT": "Ontology",
        "PIVX": "PIVX",
        "PPT": "Populous",
        "POWR": "Power Ledger",
        "QASH": "QASH",
        "QTUM": "Qtum",
        "QSP": "Quantstamp",
        "RDN": "Raiden Network Token",
        "RDD": "ReddCoin",
        "REQ": "Request Network",
        "SALT": "SALT",
        "SAN": "Santiment Network Token",
        "SC": "Siacoin",
        "SNT": "Status",
        "STEEM": "Steem",
        "XLM": "Stellar",
        "STRAT": "Stratis",
        "SUB": "Substratum",
        "SYS": "Syscoin",
        "TRX": "TRON",
        "PAY": "TenX",
        "USDT": "Tether",
        "TNB": "Time New Bank",
        "XVG": "Verge",
        "VERI": "Veritaseum",
        "WTC": "Waltonchain",
        "WAN": "Wanchain",
        "WAVES": "Waves",
        "XRP": "XRP",
        "ZCL": "ZClassic",
        "ZIL": "Zilliqa",
        "ELF": "aelf",
        "ICN": "iCoin"
    }
    currencyCode = ["ZRX", "AION", "ARDR", "ARK", "REP", "BNT", "BAT", "BNB", "BTS", "BTC", "BCH", "BTG", "BCN", "BTM", "ADA", "LINK", "DASH", "MANA", "DCR", "DGB", "XDN", "DGD", "DOGE", "EOS", "ENG", "ETH", "ETC", "BQX", "FCT", "FUN", "GAME", "GAS", "GNO", "GNT", "GRS", "HSR", "ICX", "KNC", "KMD", "LSK", "LTC", "MAID", "MONA", "XMR", "XEM", "NEO", "NANO", "NEBL", "NXS", "NXT", "OMG", "ONT", "PIVX", "PPT", "POWR", "QASH", "QTUM", "QSP", "RDN", "RDD", "REQ", "SALT", "SAN", "SC", "SNT", "STEEM", "XLM", "STRAT", "SUB", "SYS", "TRX", "PAY", "USDT", "TNB", "XVG", "VERI", "WTC", "WAN", "WAVES", "XRP", "ZCL", "ZIL", "ELF", "ICN"]
    constructor(params) {
        this.currencyFrom = ""
        this.currencyTo = ""
        this.currencyAmount = 1
        this.convertedValue = 0;
        this.isRatesCaching = false;
        this.ratesCacheDuration = 0; // Defaults to 3600 seconds (1 hour)
        this.ratesCache = {};

        if(params != undefined){
            if(params["from"] !== undefined)
                this.from(params["from"])

            if(params["to"] !== undefined)
                this.to(params["to"])

            if(params["amount"] !== undefined)
                this.amount(params["amount"])
        }

    }
    from (currencyFrom) {
        if(typeof currencyFrom !== "string")
            throw new TypeError("currency code should be a string")

        if(!this.currencyCode.includes(currencyFrom.toUpperCase()))
            throw new Error(`${currencyFrom} is not a valid currency code`)

        this.currencyFrom = currencyFrom.toUpperCase()
        return this
    }
    to (currencyTo) {
        if(typeof currencyTo !== "string")
            throw new TypeError("currency code should be a string")

        if(!this.currencyCode.includes(currencyTo.toUpperCase()))
            throw new Error(`${currencyTo} is not a valid currency code`)

        this.currencyTo = currencyTo
        return this
    }
    amount (currencyAmount){
        if(typeof currencyAmount !== "number")
            throw new TypeError("amount should be a number")

        if(currencyAmount <= 0)
            throw new Error("amount should be a positive number")

        this.currencyAmount = currencyAmount
        return this
    }

    setupRatesCache(ratesCacheOptions) {
        if (typeof ratesCacheOptions != "object")
            throw new TypeError("ratesCacheOptions should be an object")

        if (ratesCacheOptions.isRatesCaching === undefined)
            throw new Error(`ratesCacheOptions should have a property called isRatesCaching`)

        if (typeof ratesCacheOptions.isRatesCaching != "boolean")
            throw new TypeError("ratesCacheOptions.isRatesCaching should be a boolean")

        if (typeof ratesCacheOptions.ratesCacheDuration != "number")
            throw new TypeError("ratesCacheOptions.ratesCacheDuration should be a number")

        if(ratesCacheOptions.ratesCacheDuration <= 0)
            throw new Error("ratesCacheOptions.ratesCacheDuration should be a positive number of seconds")

        this.isRatesCaching = ratesCacheOptions.isRatesCaching;

        if (ratesCacheOptions.ratesCacheDuration === undefined)
            this.ratesCacheDuration = 3600000; // Defaults to 3600 seconds (1 hour)
        else
            this.ratesCacheDuration = ratesCacheOptions.ratesCacheDuration * 1000;

        return this
    }

    rates(){
        if(this.currencyFrom === this.currencyTo) {
            return new Promise((resolve, _) => {resolve(1) })
        } else {
            let currencyPair = this.currencyFrom.toUpperCase() + this.currencyTo.toUpperCase();
            if (currencyPair in this.ratesCache) {
                return new Promise((resolve, _) => {
                    resolve(this.ratesCache[currencyPair])
                });
            } else {
                return got(`https://www.google.com/finance/quote/${this.currencyFrom}-${this.currencyTo}`)
                    .then((html) => {return cheerio.load(html.body)})
                    .then(($) => {return $(".fxKbKc").text()})
                    .then((rates) => {
                        rates = rates.replace(",", "")
                        if (this.isRatesCaching) {
                            this.ratesCache[currencyPair] = parseFloat(rates)
                            this.removeCurrencyPairFromRatesCache(currencyPair)
                        }
                        return parseFloat(rates)
                    })
            }
        }
    }

    convert(currencyAmount){
        if(currencyAmount !== undefined){
            this.amount(currencyAmount)
        }

        if(this.currencyFrom == "")
            throw new Error("currency code cannot be an empty string")

        if(this.currencyTo == "")
            throw new Error("currency code cannot be an empty string")

        if(this.currencyAmount == 0)
            throw new Error("currency amount should be a positive value")

        return this.rates().then((rates) =>{
            this.convertedValue = rates * this.currencyAmount
            return this.convertedValue
        })
    }

    currencyName(currencyCode_){
        if(typeof currencyCode_ != "string")
            throw new TypeError("currency code should be a string")

        if(!this.currencyCode.includes(currencyCode_.toUpperCase()))
            throw new Error(`${currencyCode_} is not a valid currency code`)

        return this.currencies[currencyCode_]
    }

    removeCurrencyPairFromRatesCache(currencyPair) {
        // Deletes cached currencyPair rate an hour later
        setTimeout(function() {
            delete this.ratesCache[currencyPair];
        }, this.ratesCacheDuration);
    }
  }

module.exports = CryptoConverter
