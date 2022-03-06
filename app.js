const express = require('express')
const app = express()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const mongoose = require('mongoose')

// var json = {
//     "btcinr": {
//     "base_unit": "btc",
//     "quote_unit": "inr",
//     "low": "3065101.0",
//     "high": "3320313.0",
//     "last": "3106104.0",
//     "type": "SPOT",
//     "open": "3286003",
//     "volume": "299.46722",
//     "sell": "3105676.0",
//     "buy": "3103906.0",
//     "at": 1646471423,
//     "name": "BTC/INR"
//     },
//     "xrpinr": {
//     "base_unit": "xrp",
//     "quote_unit": "inr",
//     "low": "55.3216",
//     "high": "58.6999",
//     "last": "57.934",
//     "type": "SPOT",
//     "open": "58.1405",
//     "volume": "593121.4",
//     "sell": "57.9342",
//     "buy": "57.8852",
//     "at": 1646471423,
//     "name": "XRP/INR"
//     },
//     "ethinr": {
//     "base_unit": "eth",
//     "quote_unit": "inr",
//     "low": "205000.0",
//     "high": "217962.9",
//     "last": "210071.8",
//     "type": "SPOT",
//     "open": "216510.1",
//     "volume": "589.5778",
//     "sell": "210071.7",
//     "buy": "209820.9",
//     "at": 1646471423,
//     "name": "ETH/INR"
//     },
//     "trxinr": {
//     "base_unit": "trx",
//     "quote_unit": "inr",
//     "low": "4.58",
//     "high": "4.7631",
//     "last": "4.7222",
//     "type": "SPOT",
//     "open": "4.6329",
//     "volume": "10921845.0",
//     "sell": "4.7222",
//     "buy": "4.722",
//     "at": 1646471423,
//     "name": "TRX/INR"
//     },
//     "eosinr": {
//     "base_unit": "eos",
//     "quote_unit": "inr",
//     "low": "156.85",
//     "high": "169.98",
//     "last": "160.14",
//     "type": "SPOT",
//     "open": "163.05",
//     "volume": "8330.24",
//     "sell": "160.16",
//     "buy": "159.51",
//     "at": 1646471423,
//     "name": "EOS/INR"
//     },
// }

app.use(express.static("views"))
app.use(express.static("public"))
app.set('view engine', 'ejs')

// DB Config
var Crypto = require('./models/crypto')
const url = "mongodb+srv://ace:<password>@cluster0.a5ivo.mongodb.net/Crypto?retryWrites=true&w=majority"

mongoose.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });


// ===========
//    Routes
// ============
app.get("/",function(req,res){
    res.render("home")
})


app.get("/index", function(req,res){
    Crypto.find({}, async function(err,foundArr){
        if(err) console.log(err)
        else{
            await fillData()
            res.render("index",{arr: foundArr,indx : 1})
        }
    })
})

app.listen(3000, function(){
    console.log("Listening on Port : 3000")
})


function fillData(){
    var url = "https://api.wazirx.com/api/v2/tickers"
    fetch(url, {method: "Get"})
    .then(res => res.json())
    .then((json) => {
        var cnt = 10;
        Crypto.deleteMany({},function(err){
            if(err) console.log(err)
            else{
                for(val in json){
                    if(cnt-- == 0) break;
                    var newCrypto = {
                        "name" : json[val]["name"],
                        "last" : json[val]["last"],
                        "buy" : json[val]["buy"],
                        "sell" : json[val]["sell"],
                        "volume" : json[val]["volume"],
                        "base_unit" : json[val]["base_unit"]    
                    }
                    Crypto.create(newCrypto,function(err,createdCrypto){
                        if(err) console.log(err)
                        else{
                            console.log("Created :",createdCrypto["name"])
                        }
                    })
                }
            }
        })
    });
}