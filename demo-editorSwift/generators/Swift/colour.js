'use strict';

Blockly.Swift.colour = {};

Blockly.Swift.colour_picker = function() {
  // Colour picker.
    var code = 'ColorTranslator.FromHtml("' + this.getTitleValue('COLOUR') + '")';
  return [code, Blockly.Swift.ORDER_ATOMIC];
};

Blockly.Swift.colour_random = function() {
  // Generate a random colour.
  if (!Blockly.Swift.definitions_['colour_random']) {
    var functionName = Blockly.Swift.variableDB_.getDistinctName(
        'colour_random', Blockly.Generator.NAME_TYPE);
    Blockly.Swift.colour_random.functionName = functionName;
    var func = [];
    func.push('var ' + functionName + ' = new Func<Color>(() => {');
    func.push('  var random = new Random();');
    func.push('  var res = Color.FromArgb(1, random.Next(256), random.Next(256), random.Next(256));');
    func.push('  return res;');
    func.push('});');
    Blockly.Swift.definitions_['colour_random'] = func.join('\n');
  }
  var code = Blockly.Swift.colour_random.functionName + '()';
  return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};

Blockly.Swift.colour_rgb = function() {
  // Compose a colour from RGB components expressed as percentages.
  var red = Blockly.Swift.valueToCode(this, 'RED',
      Blockly.Swift.ORDER_COMMA) || 0;
  var green = Blockly.Swift.valueToCode(this, 'GREEN',
      Blockly.Swift.ORDER_COMMA) || 0;
  var blue = Blockly.Swift.valueToCode(this, 'BLUE',
      Blockly.Swift.ORDER_COMMA) || 0;

  if (!Blockly.Swift.definitions_['colour_rgb']) {
    var functionName = Blockly.Swift.variableDB_.getDistinctName(
        'colour_rgb', Blockly.Generator.NAME_TYPE);
    Blockly.Swift.colour_rgb.functionName = functionName;
    var func = [];
    func.push('var ' + functionName + ' = new Func<dynamic, dynamic, dynamic, Color>((r, g, b) => {');
    func.push('  r = (int)Math.Round(Math.Max(Math.Min((int)r, 100), 0) * 2.55);');
    func.push('  g = (int)Math.Round(Math.Max(Math.Min((int)g, 100), 0) * 2.55);');
    func.push('  b = (int)Math.Round(Math.Max(Math.Min((int)b, 100), 0) * 2.55);');
    func.push('  var res = Color.FromArgb(1, r, g, b);');
    func.push('  return res;');
    func.push('});');
    Blockly.Swift.definitions_['colour_rgb'] = func.join('\n');
  }
  var code = Blockly.Swift.colour_rgb.functionName +
      '(' + red + ', ' + green + ', ' + blue + ')';
  return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};

Blockly.Swift.colour_blend = function() {
  // Blend two colours together.
  var c1 = Blockly.Swift.valueToCode(this, 'COLOUR1',
      Blockly.Swift.ORDER_COMMA) || 'Color.Black';
  var c2 = Blockly.Swift.valueToCode(this, 'COLOUR2',
      Blockly.Swift.ORDER_COMMA) || 'Color.Black';
  var ratio = Blockly.Swift.valueToCode(this, 'RATIO',
      Blockly.Swift.ORDER_COMMA) || 0.5;

  if (!Blockly.Swift.definitions_['colour_blend']) {
    var functionName = Blockly.Swift.variableDB_.getDistinctName(
        'colour_blend', Blockly.Generator.NAME_TYPE);
    Blockly.Swift.colour_blend.functionName = functionName;
    var func = [];
    func.push('var ' + functionName + ' = new Func<Color, Color, double, Color>((c1, c2, ratio) => {');
    func.push('  ratio = Math.Max(Math.Min((double)ratio, 1), 0);');
    func.push('  var r = (int)Math.Round(c1.R * (1 - ratio) + c2.R * ratio);');
    func.push('  var g = (int)Math.Round(c1.G * (1 - ratio) + c2.G * ratio);');
    func.push('  var b = (int)Math.Round(c1.B * (1 - ratio) + c2.B * ratio);');
    func.push('  var res = Color.FromArgb(1, r, g, b);');
    func.push('  return res;');
    func.push('});');
    Blockly.Swift.definitions_['colour_blend'] = func.join('\n');
  }
  var code = Blockly.Swift.colour_blend.functionName +
      '(' + c1 + ', ' + c2 + ', ' + ratio + ')';
  return [code, Blockly.Swift.ORDER_FUNCTION_CALL];
};
