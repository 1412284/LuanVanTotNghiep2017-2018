const express = require('express'); // import express js library
const app = express(); //create express js instance 
const path = require('path');
var zipFolder = require('zip-folder');
var fs = require('fs');
 
 
// define a route to download a file 
app.get('/download/:file(*)',(req, res) => {
  
  console.log(req.params.file);
  var fileLocation = path.join('./uploads',file);
  console.log(fileLocation);
  res.download(fileLocation, file,function(err){
    if (err){
      console.log('downloading fail');
      console.log(err);
    } else {
      console.log('downloading successful');
      fs.unlink('./uploads/archive.zip', function(error) {
        if (error) {
            throw error;
        }
        console.log('Deleted ./uploads/archive.zip');
    });
    }
  });
});
app.get('/zip',(req, res) => {
zipFolder('./uploads/folder', './uploads/archive.zip', function(err) {
    if(err) {
        console.log('oh no!', err);
    } else {
        console.log('EXCELLENT');
    }
});
});
app.listen(8000,() => {
  console.log(`application is running at: http://localhost:8000`);
});