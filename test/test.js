const chai = require("chai")
const assert = chai.assert
const expect = chai.expect
const chaiAsPromised = require("chai-as-promised")
// const chaiJestMock = require('chai-jest-mocks')

chai.use(chaiAsPromised)
// chai.use(chaiJestMock)

const CC = require("../index.js")

let currencyConverter = new CC()

describe("currencyConverter", () =>  {
    describe("constructor", () =>  {
        it("should instantiate an object without parameters", () =>  {
            let CC_ = new CC()
            assert.equal(CC_.currencyFrom, "")
        })
    
        it("should instantiate an object with json object as a parameter", () =>  {
            let CC_ = new CC({from:"BTC", to:"ETH", amount: 100})
            assert.equal(CC_.currencyFrom, "BTC")
        })

        it("should instantiate an object with json object with partial parameters", () =>  {
            let CC_ = new CC({from:"BTC", amount: 100})
            assert.equal(CC_.currencyFrom, "BTC")
            assert.equal(CC_.currencyTo, "")

            CC_ = new CC({to:"BTC", amount: 100})
            assert.equal(CC_.currencyTo, "BTC")
            assert.equal(CC_.currencyFrom, "")

            CC_ = new CC({from:"BTC", to: "LTC"})
            assert.equal(CC_.currencyFrom, "BTC")
            assert.equal(CC_.currencyAmount, 1)
        })

        it("should throw a TypeError", () =>  {
            expect(() => new CC({from:20, amount: 100})).to.throw(TypeError)
        })
    })

    describe("currencyFrom", () =>  {
        it("should equal to LTC", () =>  {
            currencyConverter.currencyFrom = "LTC"
            assert.equal(currencyConverter.currencyFrom, "LTC")
        })

        it("should equal to XMR", () =>  {
            currencyConverter.from("XMR")
            assert.equal(currencyConverter.currencyFrom, "XMR")
        })

        it("should throw a TypeError", () =>  {
            expect(() => currencyConverter.from(5)).to.throw(TypeError);
        })

        it("should throw an Error", () =>  {
            expect(() => currencyConverter.from("UDD")).to.throw(Error);
        })

    })

    describe("currencyTo", () =>  {
        it("should equal to ETH", () =>  {
            currencyConverter.currencyTo = "ETH"
            assert.equal(currencyConverter.currencyTo, "ETH");
        })

        it("should equal to EOS", () =>  {
            currencyConverter.to("EOS")
            assert.equal(currencyConverter.currencyTo, "EOS");
        })

        it("should throw a TypeError", () =>  {
            expect(() => currencyConverter.to(5)).to.throw(TypeError);
        })

        it("should throw an Error", () =>  {
            expect(() => currencyConverter.to("UDD")).to.throw(Error);
        })
    })

    describe("currencyAmount", () =>  {
        it("should equal to 10", () =>  {
            currencyConverter.amount(10)
            assert.equal(currencyConverter.currencyAmount, 10);
        })

        it("should throw TypeError", () =>  {
            expect(() => currencyConverter.amount("10")).to.throw(TypeError);
        })

        it("should throw an Error", () =>  {
            expect(() => currencyConverter.amount(-1)).to.throw(Error);
        })
    })

    describe("rates", () =>  {
        it("should not return undefined values", () => {
            currencyConverter.from("LTC").to("EOS")
            return expect(currencyConverter.rates()).to.eventually.not.equal(undefined)
        })
    })

    describe("convert", () =>  {
        it("should set the amount value if a paramter is passed", () => {
            currencyConverter.from("LTC").to("LTC")
            return expect(currencyConverter.convert(100)).to.eventually.equal(100)
        })

        it("should throw an Error", () =>  {
            currencyConverter.currencyFrom = ""
            currencyConverter.to("ETH").amount(100)
            expect(() => currencyConverter.convert()).to.throw(Error)
        })

        it("should throw an Error", () =>  {
            currencyConverter.currencyTo = ""
            currencyConverter.from("ETH").amount(100)
            expect(() => currencyConverter.convert()).to.throw(Error)
        })

        it("should throw an Error", () =>  {
            currencyConverter.currencyAmount = 0
            currencyConverter.from("LTC").to("ETH")
            expect(() => currencyConverter.convert()).to.throw(Error)
        })
    })

    describe("currencyName", () =>  {
        it("should return name of the currency from the currency code", () =>  {
            assert.equal(currencyConverter.currencyName("BTC"), "Bitcoin")
        })

        it("should throw a TypeError", () =>  {
            expect(() => currencyConverter.currencyName(5)).to.throw(TypeError);
        })

        it("should throw an Error", () =>  {
            expect(() => currencyConverter.currencyName("DDD")).to.throw(Error);
        })
    })
})

// console.log(cf)


// console.log(c.currencies)