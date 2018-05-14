var express = require('express');
var path = require('path');
var router = express.Router();
var zipFolder = require('zip-folder');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
//define a route to download a file 
router.get('/parseXmlUI', (req, res, next) => {
  var xmlfile = path.join('public/component/UIViewController.xib');
  var xmlSubviewsfile = path.join('public/component/subviews.xml');
  var jsonSubviews;
  //
  fs.readFile(xmlSubviewsfile, "utf-8", function (error, content) {
    if (error) {
      throw error;
    } else {
      parser.parseString(content, function (err, result) {
        jsonSubviews = result;
      });
    };
  });

  fs.readFile(xmlfile, "utf-8", function (error, text) {

    if (error) {

      throw error;

    } else {
      parser.parseString(text, function (err, result) {
        var json = result;
        json.document.objects[0].view[0]['subviews'] = jsonSubviews.subviews;
        // our json back to xml.
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(json);
        fs.writeFile('public/uploads/folder/demoApp/demoApp/demoViewController.xib', xml, function (err, data) {
          if (err) console.log(err);
          res.send(json);
        })

      });

    }

  });
});
module.exports = router;
