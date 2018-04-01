'use strict';

Blockly.Swift.variables = {};

Blockly.Swift.variables_get = function() {
  // Variable getter.
  var code = Blockly.Swift.variableDB_.getName(this.getTitleValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Swift.ORDER_ATOMIC];
};

Blockly.Swift.variables_set = function() {
  // Variable setter.
  var argument0 = Blockly.Swift.valueToCode(this, 'VALUE',
      Blockly.Swift.ORDER_ASSIGNMENT) || 'null';
  var varName = Blockly.Swift.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + '\n';
};
