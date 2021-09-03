// wersja podstawowa 

const express = require('express');
const app = express();

app.get('/', function(req,res){
    res.send('Serwer działa...');
});

app.listen(3000, function(){
    console.log('serwers słucha...');
});