'use strict';

const request = require('request');
var fs = require('fs');

let subscriptionKey = '6895702685404ec2b5e9f6aa623d3359';
//let endpoint = process.env['COMPUTER_VISION_ENDPOINT']
if (!subscriptionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }

var uriBase = 'https://westus2.api.cognitive.microsoft.com/vision/v2.1/ocr';

//const imageUrl = 'https://d1y8sb8igg2f8e.cloudfront.net/images/shutterstock_1375463840.width-800.jpg';
const imageUrl = './image3.jpg'
// ./image2.png     ./image3.jpg      ./image4.jpg      ./image5.png

// Request parameters.
const params = {
    'language': 'unk',
    'detectOrientation': 'true',
};

const options = {
    uri: uriBase,
    qs: params,
    body: fs.readFileSync(imageUrl),
   // body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        //'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/octet-stream'
    }
};

request.post(options, (error, response, body) => {
    if (error) {
        console.log('Error: ', error);
        return;
    }
    //let jsonResponse = JSON.stringify(JSON.parse(body));
    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');

   // var obj = JSON.parse(body);
   // console.log(obj.regions[1].lines[0].words.text);
    //fs.writeFile('output.json', JSON.stringify(JSON.parse(body)), (err) => { //json output
   // fs.writeFile('output.txt', jsonResponse, (err) => { //txt output

        // In case of a error throw err. 
     //   if(err) throw err;
   // });

    var result = jsonResponse.match((/"text": (.*)/g));
    var i;
    for (i = 0; i < result.length; i++){
        result[i] = result[i].replace('"text": ', '').toLowerCase();
        result[i] = result[i].replace('"', '');
        result[i] = result[i].replace('"', '');
        result[i] = result[i].replace('day', 'daily');
       // result[i] = result[i].replace('#', '');
    }
    console.log(result);
    let instructions = [];
 //   var rx = result.match((/"rx" (.*)/g));
    var flag = false;
    //instructions
    for (i = 0; i < result.length; i++) {
        if (result[i] === ('take')) {
            flag = true;
        }
        if (flag) {
           // console.log(result[i]);
            instructions.push(result[i]);
        }
        
        if (result[i] === ('daily')) {
            break;
        }
    }
    //rx

    let medName = [];
    //med name
    for (i = 0; i < result.length; i++) {
        if (result[i].includes('mg')) {
            medName.push(result[i - 2]);
            medName.push(result[i - 1]);
            medName.push(result[i]);
            medName.push(result[i + 1]);
           // console.log(result[i - 1]);
           // console.log(result[i - 2]);
        }


    }
   // console.log(rx);
    let amountP = [];
    //amount of pills u have
    for (i = 0; i < result.length; i++) {
        if (result[i].includes('qty')) {
            amountP.push(result[i + 1]);
           // console.log(result[i + 1]);
        }
    }
    
    let megaArray = [instructions, medName, amountP];
    for (i = 0; i < megaArray.length; i++){
        console.log(megaArray[i]);
    }


});