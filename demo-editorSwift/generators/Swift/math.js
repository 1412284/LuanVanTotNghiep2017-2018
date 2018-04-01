'use strict';

Blockly.Swift.math = {};

Blockly.Swift.math_number = function() {
  // Numeric value.
  var code = window.parseFloat(this.getTitleValue('NUM'));
  return [code, Blockly.Swift.ORDER_ATOMIC];
};

Blockly.Swift.math_arithmetic = function() {
  // Basic arithmetic operators, and power.
  var mode = this.getTitleValue('OP');
  var tuple = Blockly.Swift.math_arithmetic.OPERATORS[mode];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Swift.valueToCode(this, 'A', order) || '0.0';
  var argument1 = Blockly.Swift.valueToCode(this, 'B', order) || '0.0';
  var code;
  // Power in Swift requires a special case since it has no operator.
  if (!operator) {
    code = 'pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Swift.math_arithmetic.OPERATORS = {
  ADD: [' + ', Blockly.Swift.ORDER_ADDITION],
  MINUS: [' - ', Blockly.Swift.ORDER_SUBTRACTION],
  MULTIPLY: [' * ', Blockly.Swift.ORDER_MULTIPLICATION],
  DIVIDE: [' / ', Blockly.Swift.ORDER_DIVISION],
  POWER: [null, Blockly.Swift.ORDER_COMMA]  // Handle power separately.
};

Blockly.Swift.math_single = function() {
  // Math operators with single operand.
  var operator = this.getTitleValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.Swift.valueToCode(this, 'NUM',
        Blockly.Swift.ORDER_UNARY_NEGATION) || '0.0';
    if (arg[0] == '-') {
      // --3 is not allowed
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Blockly.Swift.ORDER_UNARY_NEGATION];
  }
  if (operator == 'sin' || operator == 'cos' || operator == 'tan') {
    arg = Blockly.Swift.valueToCode(this, 'NUM',
        Blockly.Swift.ORDER_DIVISION) || '0';
  } else {
    arg = Blockly.Swift.valueToCode(this, 'NUM',
        Blockly.Swift.ORDER_NONE) || '0.0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = 'abs(' + arg + ')';
      break;
    case 'ROOT':
      code = 'sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'log(' + arg + ')';
      break;
    case 'LOG10':
      code = 'log10(' + arg + ')';
      break;
    case 'EXP':
      code = 'exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'pow(' + arg + ', 10)';
      break;
    case 'ROUND':
      code = 'round(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = 'ceil(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      code = 'floor(' + arg + ')';
      break;
    case 'SIN':
      code = 'sin(' + arg + ' / 180 *M_ PI)';
      break;
    case 'COS':
      code = 'cos(' + arg + ' / 180 * M_PI)';
      break;
    case 'TAN':
      code = 'tan(' + arg + ' / 180 * M_PI)';
      break;
  }
  if (code) {
    return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ASIN':
      code = 'asin(' + arg + ') / M_PI * 180';
      break;
    case 'ACOS':
      code = 'acos(' + arg + ') /M_ PI * 180';
      break;
    case 'ATAN':
      code = 'atan(' + arg + ') / M_PI * 180';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.Swift.ORDER_DIVISION];
};

Blockly.Swift.math_constant = function() {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  var constant = this.getTitleValue('CONSTANT');
  return Blockly.Swift.math_constant.CONSTANTS[constant];
};

Blockly.Swift.math_constant.CONSTANTS = {
  PI: ['M_PI', Blockly.Swift.ORDER_MEMBER],
  E: ['E', Blockly.Swift.ORDER_MEMBER],
  GOLDEN_RATIO: ['(1 + sqrt(5)) / 2', Blockly.Swift.ORDER_DIVISION],
  SQRT2: ['sqrt(2)', Blockly.Swift.ORDER_MEMBER],
  SQRT1_2: ['sqrt(1.0 / 2)', Blockly.Swift.ORDER_MEMBER],
  INFINITY: ['positiveInfinity', Blockly.Swift.ORDER_ATOMIC]
};

Blockly.Swift.math_number_property = function() {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var number_to_check = Blockly.Swift.valueToCode(this, 'NUMBER_TO_CHECK',
      Blockly.Swift.ORDER_MODULUS) || 'double.NaN';
  var dropdown_property = this.getTitleValue('PROPERTY');
  var code;
  if (dropdown_property == 'PRIME') {
    // Prime is a special case as it is not a one-liner test.
    if (!Blockly.Swift.definitions_['isPrime']) {
      var functionName = Blockly.Swift.variableDB_.getDistinctName(
          'isPrime', Blockly.Generator.NAME_TYPE);
      Blockly.Swift.logic_prime= functionName;
      var func = [];
      func.push('var ' + functionName + ' = new Func<double, bool>((n) => {');
      func.push('  // http://en.wikipedia.org/wiki/Primality_test#Naive_methods');
      func.push('  if (n == 2.0 || n == 3.0)');
      func.push('    return true;');
      func.push('  // False if n is NaN, negative, is 1, or not whole. And false if n is divisible by 2 or 3.');
      func.push('  if (double.IsNaN(n) || n <= 1 || n % 1 != 0.0 || n % 2 == 0.0 || n % 3 == 0.0)');
      func.push('    return false;');
      func.push('  // Check all the numbers of form 6k +/- 1, up to sqrt(n).');
      func.push('  for (var x = 6; x <= Math.Sqrt(n) + 1; x += 6) {');
      func.push('    if (n % (x - 1) == 0.0 || n % (x + 1) == 0.0)');
      func.push('      return false;');
      func.push('  }');
      func.push('  return true;');
      func.push('});');
      Blockly.Swift.definitions_['isPrime'] = func.join('\n');
    }
    code = Blockly.Swift.logic_prime + '(' + number_to_check + ')';
    return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
  }
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + ' % 2 == 0';
      break;
    case 'ODD':
      code = number_to_check + ' % 2 == 1';
      break;
    case 'WHOLE':
      code = number_to_check + ' % 1 == 0';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.Swift.valueToCode(this, 'DIVISOR',
          Blockly.Swift.ORDER_MODULUS) || 'double.NaN';
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.Swift.ORDER_EQUALITY];
};

Blockly.Swift.math_change = function() {
  // Add to a variable in place.
  var argument0 = Blockly.Swift.valueToCode(this, 'DELTA',
      Blockly.Swift.ORDER_ADDITION) || '0.0';
  var varName = Blockly.Swift.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = (' + varName + '.GetType().Name == "Double" ? ' + varName + ' : 0.0) + ' + argument0 + ';\n';
};

// Rounding functions have a single operand.
Blockly.Swift.math_round = Blockly.Swift.math_single;
// Trigonometry functions have a single operand.
Blockly.Swift.math_trig = Blockly.Swift.math_single;

Blockly.Swift.math_on_list = function() {
  // Math functions for lists.
  var func = this.getTitleValue('OP');
  var list, code;
  switch (func) {
    case 'SUM':
      list = Blockly.Swift.valueToCode(this, 'LIST',
          Blockly.Swift.ORDER_MEMBER) || 'new List<dynamic>()';
      code = list + '.Aggregate((x, y) => x + y)';
      break;
    case 'MIN':
      list = Blockly.Swift.valueToCode(this, 'LIST',
          Blockly.Swift.ORDER_COMMA) || 'new List<dynamic>()';
      code = list + '.min()';
      break;
    case 'MAX':
      list = Blockly.Swift.valueToCode(this, 'LIST',
          Blockly.Swift.ORDER_COMMA) || 'new List<dynamic>()';
      code = list + '.max()';
      break;
    case 'AVERAGE':
      list = Blockly.Swift.valueToCode(this, 'LIST',
          Blockly.Swift.ORDER_COMMA) || 'new List<dynamic>()';
      code = list + '.Average()';
      break;
    case 'MEDIAN':
      // math_median([null,null,1,3]) == 2.0.
      if (!Blockly.Swift.definitions_['math_median']) {
        var functionName = Blockly.Swift.variableDB_.getDistinctName(
            'math_median', Blockly.Generator.NAME_TYPE);
        Blockly.Swift.math_on_list.math_median = functionName;
        var func = [];
        func.push('var ' + functionName + ' = new Func<List<dynamic>,dynamic>((vals) => {');
        func.push('  vals.Sort();');
        func.push('  if (vals.Count % 2 == 0)');
        func.push('    return (vals[vals.Count / 2 - 1] + vals[vals.Count / 2]) / 2;');
        func.push('  else');
        func.push('    return vals[(vals.Count - 1) / 2];');
        func.push('});');
        Blockly.Swift.definitions_['math_median'] = func.join('\n');
      }
      list = Blockly.Swift.valueToCode(this, 'LIST',
          Blockly.Swift.ORDER_NONE) || 'new List<dynamic>()';
      code = Blockly.Swift.math_on_list.math_median + '(' + list + ')';
      break;
    case 'MODE':
      if (!Blockly.Swift.definitions_['math_modes']) {
        var functionName = Blockly.Swift.variableDB_.getDistinctName(
            'math_modes', Blockly.Generator.NAME_TYPE);
        Blockly.Swift.math_on_list.math_modes = functionName;
        // As a list of numbers can contain more than one mode,
        // the returned result is provided as an array.
        // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
        var func = [];
        func.push('var ' + functionName + ' = new Func<List<dynamic>,List<dynamic>>((values) => {');
        func.push('  var modes = new List<dynamic>();');
        func.push('  var counts = new Dictionary<double, int>();');
        func.push('  var maxCount = 0;');
        func.push('  foreach (var value in values) {');
        func.push('    int storedCount;');
        func.push('    if (counts.TryGetValue(value, out storedCount)) {');
        func.push('      maxCount = Math.Max(maxCount, ++counts[value]);');
        func.push('    }');
        func.push('    else {');
        func.push('      counts.Add(value, 1);');
        func.push('      maxCount = 1;');
        func.push('    }');
        func.push('  }');
        func.push('  foreach (var pair in counts) {');
        func.push('    if (pair.Value == maxCount)');
        func.push('      modes.Add(pair.Key);');
        func.push('  }');
        func.push('  return modes;');
        func.push('});');
        Blockly.Swift.definitions_['math_modes'] = func.join('\n');
      }
      list = Blockly.Swift.valueToCode(this, 'LIST',
          Blockly.Swift.ORDER_NONE) || 'new List<dynamic>()';
      code = Blockly.Swift.math_on_list.math_modes + '(' + list + ')';
      break;
    case 'STD_DEV':
      if (!Blockly.Swift.definitions_['math_standard_deviation']) {
        var functionName = Blockly.Swift.variableDB_.getDistinctName(
            'math_standard_deviation', Blockly.Generator.NAME_TYPE);
        Blockly.Swift.math_on_list.math_standard_deviation = functionName;
        var func = [];
        func.push('var ' + functionName + ' = new Func<List<dynamic>,double>((numbers) => {');
        func.push('  var n = numbers.Count;');
        func.push('  var mean = numbers.Average(val => val);');
        func.push('  var variance = 0.0;');
        func.push('  for (var j = 0; j < n; j++) {');
        func.push('    variance += Math.Pow(numbers[j] - mean, 2);');
        func.push('  }');
        func.push('  variance = variance / n;');
        func.push('  return Math.Sqrt(variance);');
        func.push('});');
        Blockly.Swift.definitions_['math_standard_deviation'] =
            func.join('\n');
      }
      list = Blockly.Swift.valueToCode(this, 'LIST',
          Blockly.Swift.ORDER_NONE) || 'new List<dynamic>()';
      code = Blockly.Swift.math_on_list.math_standard_deviation +
          '(' + list + ')';
      break;
    case 'RANDOM':
      if (!Blockly.Swift.definitions_['math_random_item']) {
        var functionName = Blockly.Swift.variableDB_.getDistinctName(
            'math_random_item', Blockly.Generator.NAME_TYPE);
        Blockly.Swift.math_on_list.math_random_item = functionName;
        var func = [];
        func.push('var ' + functionName + ' = new Func<List<dynamic>,dynamic>((list) => {');
        func.push('  var x = (new Random()).Next(list.Count);');
        func.push('  return list[x];');
        func.push('});');
        Blockly.Swift.definitions_['math_random_item'] = func.join('\n');
      }
      list = Blockly.Swift.valueToCode(this, 'LIST',
          Blockly.Swift.ORDER_NONE) || 'new List<dynamic>()';
      code = Blockly.Swift.math_on_list.math_random_item +
          '(' + list + ')';
      break;
    default:
      throw 'Unknown operator: ' + func;
  }
  return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};

Blockly.Swift.math_modulo = function() {
  // Remainder computation.
  var argument0 = Blockly.Swift.valueToCode(this, 'DIVIDEND',
      Blockly.Swift.ORDER_MODULUS) || '0.0';
  var argument1 = Blockly.Swift.valueToCode(this, 'DIVISOR',
      Blockly.Swift.ORDER_MODULUS) || '0.0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.Swift.ORDER_MODULUS];
};

Blockly.Swift.math_constrain = function() {
  // Constrain a number between two limits.
  var argument0 = Blockly.Swift.valueToCode(this, 'VALUE',
      Blockly.Swift.ORDER_COMMA) || '0.0';
  var argument1 = Blockly.Swift.valueToCode(this, 'LOW',
      Blockly.Swift.ORDER_COMMA) || '0.0';
  var argument2 = Blockly.Swift.valueToCode(this, 'HIGH',
      Blockly.Swift.ORDER_COMMA) || 'double.PositiveInfinity';
  var code = 'min(max(' + argument0 + ', ' + argument1 + '), ' +
      argument2 + ')';
  return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};

Blockly.Swift.math_random_int = function() {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.Swift.valueToCode(this, 'FROM',
      Blockly.Swift.ORDER_COMMA) || '0.0';
  var argument1 = Blockly.Swift.valueToCode(this, 'TO',
      Blockly.Swift.ORDER_COMMA) || '0.0';
  if (!Blockly.Swift.definitions_['math_random_int']) {
    var functionName = Blockly.Swift.variableDB_.getDistinctName(
        'math_random_int', Blockly.Generator.NAME_TYPE);
    Blockly.Swift.math_random_int.random_function = functionName;
    var func = [];
    func.push('var ' + functionName + ' new Func<int,int,int>((a, b) => {');
    func.push('  if (a > b) {');
    func.push('    // Swap a and b to ensure a is smaller.');
    func.push('    var c = a;');
    func.push('    a = b;');
    func.push('    b = c;');
    func.push('  }');
    func.push('  return (int)Math.Floor(a + (new Random()).Next(b - a));');
    func.push('});');
    Blockly.Swift.definitions_['math_random_int'] = func.join('\n');
  }
  var code = Blockly.Swift.math_random_int.random_function +
      '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};

Blockly.Swift.math_random_float = function() {
  // Random fraction between 0 and 1.
  return ['(new Random()).NextDouble()', Blockly.Swift.ORDER_FUNCTION_CALL];
};
