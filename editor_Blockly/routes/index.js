var express = require('express');
var router = express.Router();

/* GET home page. */

var Blockly = require('node-blockly');
var locale = require('node-blockly/lib/i18n/de');
Blockly.setLocale(locale)

// var editor;
// var code = document.getElementById('startBlocks')
//
// function render(element, toolbox) {
//     if( editor ) {
//         editor.removeChangeListener(updateCode);
//         code = Blockly.Xml.workspaceToDom(editor)
//         editor.dispose()
//     }
//     editor = Blockly.inject(element, {
//         toolbox: document.getElementById(toolbox)
//     })
//
//     Blockly.Xml.domToWorkspace(code, editor);
//
//    editor.addChangeListener(updateCode);
//
//     return editor
// }
//
// function updateCode() {
//     document.getElementById('js').innerText = Blockly.JavaScript.workspaceToCode(editor)
//     document.getElementById('php').innerText = Blockly.PHP.workspaceToCode(editor)
//     document.getElementById('lua').innerText = Blockly.Lua.workspaceToCode(editor)
//     document.getElementById('dart').innerText = Blockly.Dart.workspaceToCode(editor)
//     document.getElementById('python').innerText = Blockly.Python.workspaceToCode(editor)
// }
//
// editor = render('editor', 'toolbox');

//updateCode();
router.get('/', function(req, res, next) {
  res.render('index',{title:"Editor_blockly"});
});
module.exports = router;
