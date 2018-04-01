'use strict';

Blockly.Swift.lists = {}

Blockly.Swift.lists_create_empty = function() {
  return ['null', Blockly.Swift.ORDER_ATOMIC];
};

Blockly.Swift.lists_create_with = function() {
  // Create a list with any number of elements of any type.
  var code = new Array(this.itemCount_);
  for (var n = 0; n < this.itemCount_; n++) {
    code[n] = Blockly.Swift.valueToCode(this, 'ADD' + n,
        Blockly.Swift.ORDER_COMMA) || 'null';
  }
  code = 'new List<dynamic> {' + code.join(', ') + '}';
  return [code, Blockly.Swift.ORDER_ATOMIC];
};

Blockly.Swift.lists_repeat = function() {
  // Create a list with one element repeated.
  if (!Blockly.Swift.definitions_['lists_repeat']) {
    // Function copied from Closure's goog.array.repeat.
    var functionName = Blockly.Swift.variableDB_.getDistinctName(
        'lists_repeat', Blockly.Generator.NAME_TYPE);
    Blockly.Swift.lists_repeat.repeat = functionName;
    var func = [];
    func.push('var ' + functionName + ' = new Func<dynamic, dynamic, List<dynamic>>((value, n) => {');
    func.push('  var array = new List<dynamic>(n);');
    func.push('  for (var i = 0; i < n; i++) {');
    func.push('    array.Add(value);');
    func.push('  }');
    func.push('  return array;');
    func.push('});');
    Blockly.Swift.definitions_['lists_repeat'] = func.join('\n');
  }
  var argument0 = Blockly.Swift.valueToCode(this, 'ITEM',
      Blockly.Swift.ORDER_COMMA) || 'null';
  var argument1 = Blockly.Swift.valueToCode(this, 'NUM',
      Blockly.Swift.ORDER_COMMA) || '0';
  var code = Blockly.Swift.lists_repeat.repeat +
      '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};

Blockly.Swift.lists_length = function() {
  // List length.
  var argument0 = Blockly.Swift.valueToCode(this, 'VALUE', Blockly.Swift.ORDER_FUNCTION_CALL) || 'null';
  return [argument0 + '.Count', Blockly.Swift.ORDER_MEMBER];
};

Blockly.Swift.lists_isEmpty = function() {
  // Is the list empty?
  var argument0 = Blockly.Swift.valueToCode(this, 'VALUE',
      Blockly.Swift.ORDER_MEMBER) || 'null';
  return [argument0 + '.Count == 0', Blockly.Swift.ORDER_LOGICAL_NOT];
};

Blockly.Swift.lists_indexOf = function() {
  // Find an item in the list.
  var operator = this.getTitleValue('END') == 'FIRST' ?
      'IndexOf' : 'LastIndexOf';
  var argument0 = Blockly.Swift.valueToCode(this, 'FIND',
      Blockly.Swift.ORDER_NONE) || 'null';
  var argument1 = Blockly.Swift.valueToCode(this, 'VALUE',
      Blockly.Swift.ORDER_MEMBER) || 'null';
  var code = argument1 + '.' + operator + '(' + argument0 + ') + 1';
  return [code, Blockly.Swift.ORDER_MEMBER];
};

Blockly.Swift.lists_getIndex = function() {
  var mode = this.getTitleValue('MODE') || 'GET';
  var where = this.getTitleValue('WHERE') || 'FROM_START';
  var at = Blockly.Swift.valueToCode(this, 'AT',
      Blockly.Swift.ORDER_UNARY_NEGATION) || '1';
  var list = Blockly.Swift.valueToCode(this, 'VALUE',
      Blockly.Swift.ORDER_MEMBER) || 'null';

  if (mode == 'GET_REMOVE') {
      if (where == 'FIRST') {
          at = 1;
      }
      else if (where == 'LAST') {
          at = list + '.Count - 1';
      }
      else {
          // Blockly uses one-based indicies.
          if (Blockly.isNumber(at)) {
              // If the index is a naked number, decrement it right now.
              at = parseFloat(at) - 1;
          } else {
              // If the index is expression, decrement it in code.
              at = '(' + at + ' - 1)';
          }
      }

      if (where == 'FROM_END') {
          at = '(' + list + '.Count) - ' + (at + 1);
      }

    if (!Blockly.Swift.definitions_['lists_get_remove_at']) {
    var functionName = Blockly.Swift.variableDB_.getDistinctName(
        'lists_get_remove_at', Blockly.Generator.NAME_TYPE);
    Blockly.Swift.lists_getIndex.lists_get_remove_at = functionName;
    var func = [];
    func.push('var ' + functionName + ' = new Func<List<dynamic>, int, dynamic>((list, index) => {');
    func.push('  var res = list[index];');
    func.push('  list.RemoveAt(index);');
    func.push('  return res;');
    func.push('});');
    Blockly.Swift.definitions_['lists_get_remove_at'] =
        func.join('\n');
    }
    code = Blockly.Swift.lists_getIndex.lists_get_remove_at +
        '(' + list + ', ' + at + ')';
    return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
  }

  if (where == 'FIRST') {
    if (mode == 'GET') {
      var code = list + '.First()';
      return [code, Blockly.Swift.ORDER_MEMBER];
    } else if (mode == 'REMOVE') {
      return list + '.RemoveAt(0);\n';
    }
  } else if (where == 'LAST') {
    if (mode == 'GET') {
      var code = list + '.Last()';
      return [code, Blockly.Swift.ORDER_MEMBER];
    } else if (mode == 'REMOVE') {
    return list + '.RemoveAt(' + list + '.Count - 1);\n';
    }
  } else if (where == 'FROM_START') {
    if (mode == 'GET') {
      var code = list + '[' + at + ']';
      return [code, Blockly.Swift.ORDER_MEMBER];
    } else if (mode == 'REMOVE') {
      return list + '.RemoveAt(' + at + ');\n';
    }
  } else if (where == 'FROM_END') {
      if (mode == 'GET') {
          var code = list + '[list.Count - ' + at + ']';
          return [code, Blockly.Swift.ORDER_MEMBER];
      } else if (mode == 'REMOVE') {
          return list + '.RemoveAt(list.Count - ' + at + ');\n';
      }
  } else if (where == 'RANDOM') {
    if (!Blockly.Swift.definitions_['lists_get_random_item']) {
      var functionName = Blockly.Swift.variableDB_.getDistinctName(
          'lists_get_random_item', Blockly.Generator.NAME_TYPE);
      Blockly.Swift.lists_getIndex.random = functionName;
      var func = [];
      func.push('var ' + functionName + ' = new Func<List<dynamic>, bool, dynamic>((list, remove) => {');
      func.push('  var x = (new Random()).Next(list.Count);');
      func.push('  if (remove) {');
      func.push('    var res = list[x];');
      func.push('    list.RemoveAt(x);');
      func.push('    return res;');
      func.push('  } else {');
      func.push('    return list[x];');
      func.push('  }');
      func.push('});');
      Blockly.Swift.definitions_['lists_get_random_item'] =
          func.join('\n');
    }
    code = Blockly.Swift.lists_getIndex.random +
        '(' + list + ', ' + (mode != 'GET') + ')';
    if (mode == 'GET') {
      return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
    } else if (mode == 'REMOVE') {
      return code + ';\n';
    }
  }
  throw 'Unhandled combination (lists_getIndex).';
};

Blockly.Swift.lists_setIndex = function() {
  // Set element at index.
  var list = Blockly.Swift.valueToCode(this, 'LIST',
      Blockly.Swift.ORDER_MEMBER) || 'null';
  var mode = this.getTitleValue('MODE') || 'GET';
  var where = this.getTitleValue('WHERE') || 'FROM_START';
  var at = Blockly.Swift.valueToCode(this, 'AT',
      Blockly.Swift.ORDER_NONE) || '1';
  var value = Blockly.Swift.valueToCode(this, 'TO',
      Blockly.Swift.ORDER_ASSIGNMENT) || 'null';

  if (where == 'FIRST') {
    if (mode == 'SET') {
      return list + '[0] = ' + value + ';\n';
    } else if (mode == 'INSERT') {
      return list + '.Insert(0, ' + value + ');\n';
    }
  } else if (where == 'LAST') {
    if (mode == 'SET') {
      var code = list + '[' + list + '.Count - 1] = ' + value + ';\n';
      return code;
    } else if (mode == 'INSERT') {
      return list + '.Add(' + value + ');\n';
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at)) {
      // If the index is a naked number, decrement it right now.
      at = parseFloat(at) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
        at = '(' + list + '.Count) - ' + (at + 1);
    }
    if (mode == 'SET') {
      return list + '[' + at + '] = ' + value + ';\n';
    } else if (mode == 'INSERT') {
      return list + '.Insert(' + at + ', ' + value + ');\n';
    }
  } else if (where == 'FROM_END') {
    if (mode == 'SET') {
      var code = list + '[' + list + '.Count - ' + at + '] = ' + value + ';\n';
      return code;
    } else if (mode == 'INSERT') {
      var code = list + '.Insert(' + list + '.Count - ' + at + ', ' + value + ');\n';
      return code;
    }
  } else if (where == 'RANDOM') {
    var xVar = Blockly.Swift.variableDB_.getDistinctName(
        'tmp_x', Blockly.Variables.NAME_TYPE);
    var code = 'var ' + xVar + ' = (new Random()).Next(' + list + '.Count);\n';
    if (mode == 'SET') {
      var code = list + '[' + xVar + '] = ' + value + ';\n';
      return code;
    } else if (mode == 'INSERT') {
        var code = list + '.Insert(' + xVar + ', ' + value + ');\n';
      return code;
    }
  }
  throw 'Unhandled combination (lists_setIndex).';
};

Blockly.Swift.lists_getSublist = function() {
  // Get sublist.
  var list = Blockly.Swift.valueToCode(this, 'LIST',
      Blockly.Swift.ORDER_MEMBER) || 'null';
  var where1 = this.getTitleValue('WHERE1');
  var where2 = this.getTitleValue('WHERE2');
  var at1 = Blockly.Swift.valueToCode(this, 'AT1',
      Blockly.Swift.ORDER_NONE) || '1';
  var at2 = Blockly.Swift.valueToCode(this, 'AT2',
      Blockly.Swift.ORDER_NONE) || '1';
  if (where1 == 'FIRST' && where2 == 'LAST') {
    var code = 'new List<dynamic>(' + list + ')';
  } else {
    if (!Blockly.Swift.definitions_['lists_get_sublist']) {
      var functionName = Blockly.Swift.variableDB_.getDistinctName(
          'lists_get_sublist', Blockly.Generator.NAME_TYPE);
      Blockly.Swift.lists_getSublist.func = functionName;
      var func = [];
      func.push('var ' + functionName + ' = new Func<List<dynamic>, dynamic, int, dynamic, int, List<dynamic>>((list, where1, at1, where2, at2) => {');
      func.push('  var getIndex = new Func<dynamic, int, int>((where, at) => {');
      func.push('    if (where == "FROM_START") {');
      func.push('      at--;');
      func.push('    } else if (where == "FROM_END") {');
      func.push('      at = list.Count - at;');
      func.push('    } else if (where == "FIRST") {');
      func.push('      at = 0;');
      func.push('    } else if (where == "LAST") {');
      func.push('      at = list.Count - 1;');
      func.push('    } else {');
      func.push('      throw new ApplicationException("Unhandled option (lists_getSublist).");');
      func.push('    }');
      func.push('    return at;');
      func.push('  });');
      func.push('  at1 = getIndex(where1, at1);');
      func.push('  at2 = getIndex(where2, at2);');
      func.push('  return list.GetRange(at1, at2 - at1 + 1);');
      func.push('});');
      Blockly.Swift.definitions_['lists_get_sublist'] =
          func.join('\n');
    }
    var code = Blockly.Swift.lists_getSublist.func + '(' + list + ', "' +
        where1 + '", ' + at1 + ', "' + where2 + '", ' + at2 + ')';
  }
  return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};
