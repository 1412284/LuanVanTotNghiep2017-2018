'use strict';

Blockly.Swift.logic = {};

Blockly.Swift.controls_if = function() {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Swift.valueToCode(this, 'IF' + n,
      Blockly.Swift.ORDER_NONE) || 'false';
  var branch = Blockly.Swift.statementToCode(this, 'DO' + n);
  var code = 'if ' + argument + ' {\n' + branch + '}';
  for (n = 1; n <= this.elseifCount_; n++) {
    argument = Blockly.Swift.valueToCode(this, 'IF' + n,
        Blockly.Swift.ORDER_NONE) || 'false';
    branch = Blockly.Swift.statementToCode(this, 'DO' + n);
    code += ' else if ' + argument + ' {\n' + branch + '}\n';
  }
  if (this.elseCount_) {
    branch = Blockly.Swift.statementToCode(this, 'ELSE');
    code += ' else {\n' + branch + '}\n';
  }
  return code + '\n';
};

Blockly.Swift.logic_compare = function() {
  // Comparison operator.
  var mode = this.getTitleValue('OP');
  var operator = Blockly.Swift.logic_compare.OPERATORS[mode];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Swift.ORDER_EQUALITY : Blockly.Swift.ORDER_RELATIONAL;
  var argument0 = Blockly.Swift.valueToCode(this, 'A', order) || 'null';
  var argument1 = Blockly.Swift.valueToCode(this, 'B', order) || 'null';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Swift.logic_compare.OPERATORS = {
  EQ: '==',
  NEQ: '!=',
  LT: '<',
  LTE: '<=',
  GT: '>',
  GTE: '>='
};

Blockly.Swift.logic_operation = function() {
  // Operations 'and', 'or'.
  var operator = (this.getTitleValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Swift.ORDER_LOGICAL_AND :
      Blockly.Swift.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Swift.valueToCode(this, 'A', order) || 'false';
  var argument1 = Blockly.Swift.valueToCode(this, 'B', order) || 'false';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Swift.logic_negate = function() {
  // Negation.
  var order = Blockly.Swift.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.Swift.valueToCode(this, 'BOOL', order) ||
      'false';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.Swift.logic_boolean = function() {
  // Boolean values true and false.
  var code = (this.getTitleValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Swift.ORDER_ATOMIC];
};

Blockly.Swift.logic_null = function() {
  // Null data type.
  return ['null', Blockly.Swift.ORDER_ATOMIC];
};

Blockly.Swift.logic_ternary = function() {
  // Ternary operator.
  var value_if = Blockly.Swift.valueToCode(this, 'IF',
      Blockly.Swift.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.Swift.valueToCode(this, 'THEN',
      Blockly.Swift.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.Swift.valueToCode(this, 'ELSE',
      Blockly.Swift.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else
  return [code, Blockly.Swift.ORDER_CONDITIONAL];
};
