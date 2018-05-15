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
        });

      });

    }

  });
});
// router.get('/Jsonlabel', (req, res, next) => {
//   var xmlfile = path.join('public/component/textfield.xml');
//   fs.readFile(xmlfile, "utf-8", function (error, text) {
//     if (error) {
//       throw error;
//     } else {
//       parser.parseString(text, function (err, result) {
//         // res.send(JSON.stringify(result));
//         fs.writeFile('public/component/textfield.json', JSON.stringify(result), function (err) {
//           if (err) throw err;
//           console.log('complete');
//           addSubviews();
//           res.send('complete');
//         }
//         );
//       });

//     }
//   });
// });
router.get('/addSubviews', (req, res, next) => {
  addSubviews();
  res.send('complete');
});
function addSubviews() {
  var jsonSubviews = { "subviews": [] };
  console.log('complete');
  var objLabel = getTemplateLabel();
  jsonSubviews['subviews'].push(objLabel);
  //console.log(objLabel);
  objLabel = setRectLabel(objLabel,"uj-ai6-oa", "10", "20", "100", "30");
  console.log(objLabel.label['$']);
  console.log(objLabel.label.rect[0]);
  var objButton = getTemplateButton();
  jsonSubviews['subviews'].push(objButton);
  var objTextField =  getTemplateTextfield();
  jsonSubviews['subviews'].push(objTextField);
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(jsonSubviews);
  fs.writeFile('public/component/subviews.xml', xml, function (err, data) {
    if (err) console.log(err);
  });
};
function getTemplateLabel() {
  var jsonfile = path.join('public/component/label.json');
  var jsonLabel = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
  return jsonLabel;
}
function getTemplateButton() {
  var jsonfile = path.join('public/component/Button.json');
  var jsonButton = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
  return jsonButton;
}
function getTemplateTextfield() {
  var jsonfile = path.join('public/component/textfield.json');
  var jsonTextfield = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
  return jsonTextfield;
}
function setRectLabel(objLabel,id, x, y, width, height) {
  //var arr = new Array(label.rect);
  //console.log(arr);
  objLabel.label['$'].id = id;
  objLabel.label.rect[0]['$'].x = x;
  objLabel.label.rect[0]['$'].y = y;
  objLabel.label.rect[0]['$'].width = width;
  objLabel.label.rect[0]['$'].height = height;
  return objLabel;
};
function setRectButton(objButton,id, x, y, width, height) {
  objButton.button['$'].id = id;
  objButton.button.rect[0]['$'].x = x;
  objButton.button.rect[0]['$'].y = y;
  objButton.button.rect[0]['$'].width = width;
  objButton.button.rect[0]['$'].height = height;
  return objButton;
};
function setRectTextField(objTextField,id, x, y, width, height) {
  objTextField.textField['$'].id = id;
  objTextField.textField.rect[0]['$'].x = x;
  objTextField.textField.rect[0]['$'].y = y;
  objTextField.textField.rect[0]['$'].width = width;
  objTextField.textField.rect[0]['$'].height = height;
  return objTextField;
};

// function addSubviews() {
//   var xmlfile = path.join('public/component/label.xml');
//   var jsonSubviews = {"subviews":[]};
//   fs.readFile(xmlfile, "utf-8", function (error, text) {
//     if (error) {
//       throw error;
//     } else {
//       parser.parseString(text, function (err, result) {
//         var json = result;
//        // console.log(json.label['$'].text);
//         //json.document.objects[0].view[0]['subviews'] = jsonSubviews.subviews;
//         jsonSubviews['subviews'].push(json);
//         jsonSubviews['subviews'].push(json);
//         var builder = new xml2js.Builder();
//         var xml = builder.buildObject(jsonSubviews);
//         fs.writeFile('public/component/subviews.xml', xml, function (err, data) {
//           if (err) console.log(err);
//         })
//       });
//     }
//   });
// };

module.exports = router;
