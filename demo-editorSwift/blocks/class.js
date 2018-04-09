/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Colour blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */

'use strict';

goog.provide('Blockly.Blocks.class');

goog.require('Blockly.Blocks');

Blockly.Blocks['text_class'] = {
  init: function() {
    this.appendValueInput("input")
        .setCheck("Number")
        .appendField("number");
    this.setInputsInline(true);
    this.setColour(65);
 this.setTooltip("");
 this.setHelpUrl("customer");
  }
}; 

Blockly.Blocks['class_type'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("Boolean")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("class");
    this.appendStatementInput("NAME")
        .setCheck(null)
        .appendField("property");
    this.appendStatementInput("NAME")
        .setCheck(null)
        .appendField("method");
    this.setInputsInline(true);
    this.setColour(65);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};