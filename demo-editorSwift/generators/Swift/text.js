'use strict';

Blockly.Swift.text = {};

Blockly.Swift.text = function() {
  // Text value.
  var code = Blockly.Swift.quote_(this.getTitleValue('TEXT'));
  return [code, Blockly.Swift.ORDER_ATOMIC];
};

Blockly.Swift.text_join = function() {
  // Create a string made up of any number of elements of any type.
  var code;
  if (this.itemCount_ == 0) {
    return ['""', Blockly.Swift.ORDER_ATOMIC];
  } else if (this.itemCount_ == 1) {
    var argument0 = Blockly.Swift.valueToCode(this, 'ADD0', Blockly.Swift.ORDER_NONE) || '""';
    code = 'String('+ argument0 +')';
    return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
  } else if (this.itemCount_ == 2) {
    var argument0 = Blockly.Swift.valueToCode(this, 'ADD0', Blockly.Swift.ORDER_NONE) || '""';
    var argument1 = Blockly.Swift.valueToCode(this, 'ADD1', Blockly.Swift.ORDER_NONE) || '""';
    code = 'String.Concat(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.Swift.ORDER_ADDITION];
  } else {
    code = new Array(this.itemCount_);
    for (var n = 0; n < this.itemCount_; n++) {
      code[n] = Blockly.Swift.valueToCode(this, 'ADD' + n, Blockly.Swift.ORDER_COMMA) || '""';
    }
    code = 'String.Concat(' + code.join(', ') + ')';
    return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
  }
};

Blockly.Swift.text_append = function() {
  // Append to a variable in place.
  var varName = Blockly.Swift.variableDB_.getName(this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Swift.valueToCode(this, 'TEXT',
      Blockly.Swift.ORDER_NONE) || '""';
  return varName + ' = String.Concat(' + varName + ', ' + argument0 + ');\n';
};

Blockly.Swift.text_length = function() {
  // String length.
  var argument0 = Blockly.Swift.valueToCode(this, 'VALUE', Blockly.Swift.ORDER_FUNCTION_CALL) || '""';
  return [argument0 + '.length', Blockly.Swift.ORDER_MEMBER];
};

Blockly.Swift.text_isEmpty = function() {
  // Is the string null?
  var argument0 = Blockly.Swift.valueToCode(this, 'VALUE', Blockly.Swift.ORDER_MEMBER) || '""';
  return [argument0 + '.length == 0', Blockly.Swift.ORDER_EQUALITY];
};

Blockly.Swift.text_indexOf = function() {
  // Search the text for a substring.
  var operator = this.getTitleValue('END') == 'FIRST' ?
      'IndexOf' : 'LastIndexOf';
  var argument0 = Blockly.Swift.valueToCode(this, 'FIND', Blockly.Swift.ORDER_NONE) || '""';
  var argument1 = Blockly.Swift.valueToCode(this, 'VALUE', Blockly.Swift.ORDER_MEMBER) || '""';
  var code = argument1 + '.' + operator + '(' + argument0 + ') + 1';
  return [code, Blockly.Swift.ORDER_MEMBER];
};

Blockly.Swift.text_charAt = function() {
  var where = this.getTitleValue('WHERE') || 'FROM_START';
  var at = Blockly.Swift.valueToCode(this, 'AT',
      Blockly.Swift.ORDER_UNARY_NEGATION) || '1';
  var text = Blockly.Swift.valueToCode(this, 'VALUE',
      Blockly.Swift.ORDER_MEMBER) || '""';

  // Blockly uses one-based indicies.

  switch (where) {
    case 'FIRST':
      var code = text + '.First()';
      return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
    case 'LAST':
      var code = text + '.Last()';
      return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
    case 'FROM_START':
      var code = text + '[' + at + ' - 1]';
      return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
    case 'FROM_END':
        var code = text + '[text.Length - ' + at + ']';
      return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
    case 'RANDOM':
      if (!Blockly.Swift.definitions_['text_random_letter']) {
        var functionName = Blockly.Swift.variableDB_.getDistinctName(
            'text_random_letter', Blockly.Generator.NAME_TYPE);
        Blockly.Swift.text_charAt.text_random_letter = functionName;
        var func = [];
        func.push('var ' + functionName + ' = new Func<string, char>((text) => {');
        func.push('  var x = (new Random()).Next(text.length);');
        func.push('  return text[x];');
        func.push('});');
        Blockly.Swift.definitions_['text_random_letter'] = func.join('\n');
      }
      code = Blockly.Swift.text_charAt.text_random_letter +
          '(' + text + ')';
      return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
  }
  throw 'Unhandled option (text_charAt).';
};

Blockly.Swift.text_getSubstring = function() {
  // Get substring.
  var text = Blockly.Swift.valueToCode(this, 'STRING', Blockly.Swift.ORDER_MEMBER) || 'null';
  var where1 = this.getTitleValue('WHERE1');
  var where2 = this.getTitleValue('WHERE2');
  var at1 = Blockly.Swift.valueToCode(this, 'AT1', Blockly.Swift.ORDER_NONE) || '1';
  var at2 = Blockly.Swift.valueToCode(this, 'AT2', Blockly.Swift.ORDER_NONE) || '1';
  if (where1 == 'FIRST' && where2 == 'LAST') {
    var code = text;
  } else {
    if (!Blockly.Swift.definitions_['text_get_substring']) {
      var functionName = Blockly.Swift.variableDB_.getDistinctName(
          'text_get_substring', Blockly.Generator.NAME_TYPE);
      Blockly.Swift.text_getSubstring.func = functionName;
      var func = [];
      func.push('var ' + functionName + ' = new Func<string, dynamic, int, dynamic, int, string>((text, where1, at1, where2, at2) => {');
      func.push('  var getAt =new Func<dynamic, int, int>((where, at) => {');
      func.push('    if (where == "FROM_START") {');
      func.push('      at--;');
      func.push('    } else if (where == "FROM_END") {');
      func.push('      at = text.Length - at;');
      func.push('    } else if (where == "FIRST") {');
      func.push('      at = 0;');
      func.push('    } else if (where == "LAST") {');
      func.push('      at = text.Length - 1;');
      func.push('    } else {');
      func.push('      throw new ApplicationException("Unhandled option (text_getSubstring).");');
      func.push('    }');
      func.push('    return at;');
      func.push('  });');
      func.push('  at1 = getAt(where1, at1);');
      func.push('  at2 = getAt(where2, at2) + 1;');
      func.push('  return text.Substring(at1, at2 - at1);');
      func.push('});');
      Blockly.Swift.definitions_['text_get_substring'] =
          func.join('\n');
    }
    var code = Blockly.Swift.text_getSubstring.func + '(' + text + ', "' + where1 + '", ' + at1 + ', "' + where2 + '", ' + at2 + ')';
  }
  return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};

Blockly.Swift.text_changeCase = function() {
  // Change capitalization.
  var mode = this.getTitleValue('CASE');
  var operator = Blockly.Swift.text_changeCase.OPERATORS[mode];
  var code;
  if (operator) {
    // Upper and lower case are functions built into Swift.
    var argument0 = Blockly.Swift.valueToCode(this, 'TEXT', Blockly.Swift.ORDER_MEMBER) || '""';
    code = argument0 + operator;
  } else {
    if (!Blockly.Swift.definitions_['text_toTitleCase']) {
      // Title case is not a native Swift function.  Define one.
      var functionName = Blockly.Swift.variableDB_.getDistinctName('text_toTitleCase', Blockly.Generator.NAME_TYPE);
      Blockly.Swift.text_changeCase.toTitleCase = functionName;
      var func = [];
      func.push('var ' + functionName + ' = new Func<string, string>((str) => {');
      func.push('  var buf = new StringBuilder(str.Length);');
      func.push('  var toUpper = true;');
      func.push('  foreach (var ch in str) {');
      func.push('    buf.Append(toUpper ? Char.ToUpper(ch) : ch);');
      func.push('    toUpper = Char.IsWhiteSpace(ch);');
      func.push('  }');
      func.push('  return buf.ToString();');
      func.push('});');
      Blockly.Swift.definitions_['text_toTitleCase'] = func.join('\n');
    }
    var argument0 = Blockly.Swift.valueToCode(this, 'TEXT',
        Blockly.Swift.ORDER_NONE) || '""';
    code = Blockly.Swift.text_changeCase.toTitleCase + '(' + argument0 + ')';
  }
  return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};

Blockly.Swift.text_changeCase.OPERATORS = {
  UPPERCASE: '.uppercased()',
  LOWERCASE: '.lowercased()',
  TITLECASE: null
};

Blockly.Swift.text_trim = function() {
  // Trim spaces.
  var mode = this.getTitleValue('MODE');
  var operator = Blockly.Swift.text_trim.OPERATORS[mode];
  var argument0 = Blockly.Swift.valueToCode(this, 'TEXT', Blockly.Swift.ORDER_MEMBER) || '""';
  return [argument0 + operator, Blockly.Swift.ORDER_FUNCTION_CALL];
};

Blockly.Swift.text_trim.OPERATORS = {
  LEFT: '.TrimStart()',
  RIGHT: '.TrimEnd()',
  BOTH: '.Trim()'
};

Blockly.Swift.text_print = function() {
  // Print statement.
  var argument0 = Blockly.Swift.valueToCode(this, 'TEXT', Blockly.Swift.ORDER_NONE) || '""';
  return 'print(' + argument0 + ')\n';
};

Blockly.Swift.text_prompt_ext = function () {
    var msg = Blockly.Swift.quote_(this.getTitleValue('TEXT'));
    var toNumber = this.getTitleValue('TYPE') == 'NUMBER';

    var functionName = Blockly.Swift.variableDB_.getDistinctName('text_prompt_extInput', Blockly.Generator.NAME_TYPE);
    Blockly.Swift.text_prompt_ext.promptInput = functionName;
    var func = [];
    func.push('var ' + functionName + ' = new Func<string, bool, dynamic>((msg, toNumber) => {');
    func.push('  Console.WriteLine(msg);');
    func.push('  var res = Console.ReadLine();');
    func.push('  if (toNumber)');
    func.push('    return Double.Parse(res);');
    func.push('  return res;');
    func.push('});');
    Blockly.Swift.definitions_['text_prompt_extInput'] = func.join('\n');

    var code = Blockly.Swift.text_prompt_ext.promptInput + '(' + msg + ', ' + toNumber + ')';
    return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};
