const express = require('express')
const app = express()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const mongoose = require('mongoose')

const port =  process.env.PORT || 5000
app.use(express.static("views"))
app.use(express.static("public"))
app.set('view engine', 'ejs')

// DB Config
var Crypto = require('./models/crypto')
const url = process.env.MONGODB_URL

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

app.listen(port, function(){
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