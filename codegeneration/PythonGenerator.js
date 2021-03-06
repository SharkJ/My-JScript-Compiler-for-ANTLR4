const ECMAScriptVisitor = require('../lib/ECMAScriptVisitor').ECMAScriptVisitor;

/**
 * This Visitor walks the tree generated by parsers and produces Python code
 *
 * @returns {object}
 */
class Visitor extends ECMAScriptVisitor {
  /**
   * Entry point of tree visiting
   *
   * @param {object} ctx
   * @returns {string}
   */
  start(ctx) {
    return this.visitExpressionSequence(ctx);
  }

/**
 * Visits children of current node
 *
 * @param {object} ctx
 * @returns {string}
 */
visitChildren(ctx) {
  let code = '';

  for (let i = 0; i < ctx.getChildCount(); i++) {
    code += this.visit(ctx.getChild(i));
  }

  return code.trim();
}

/**
 * Visits a leaf node and returns a string
 *
 * @param {object} ctx
 * @returns {string}
 */
visitTerminal(ctx) {
  return ctx.getText();
}

/**
 * Visits Property Expression Assignment
 *
 * @param {object} ctx
 * @returns {string}
 */
visitPropertyExpressionAssignment(ctx) {
  const key = this.visit(ctx.propertyName());
  const value = this.visit(ctx.singleExpression());

  return `'${key}': ${value}`;

  //Return the text of all tokens in the stream
  console.log(ctx.gettext());

  //How many children are there? If there is none, then this node represents a leaf node
  console.log(ctx.getChildCount());

  //console.log(ctx.propertyName().getText()) 'x' property
  console.log(ctx.getChild(0).getText());

  //:
  console.log(ctx.getChild(1).getText());

  //console.log(ctx.singleExpression().getText()) '1' value
  console.log(ctx.getChild(2).getText());
}

/**
 * Because Python doesn't need `New`, we can skip the first child
 *
 * @param {object} ctx
 * @returns {string}
 */
visitNewExpression(ctx) {
  return this.visit(ctx.singleExpression());
}

/**
 * Visits `Number` Keyword
 *
 * @param {object} ctx
 * @returns {string}
 */
visitNumberExpression(ctx) {
  const argumentList = ctx.arguments().argumentList();

  // JavaScript Number requires only one argument,
  // otherwise method returns error message 
  if (argumentList === null || argumentList.getChildCount() !== 1) {
    return 'Error: Number requires one argument';
  }

  const arg = argumentList.singleExpression()[0];
  const number = this.removeQuotes(this.visit(arg));

  return `int(${number})`;
}

/**
 * Removes quotes from string
 *
 * @param {String} str
 * @returns {String}
 */
removeQuotes(str) {
  let newStr = str;

  if (
    (str.charAt(0) === '"' && str.charAt(str.length - 1) === '"') ||
    (str.charAt(0) === '\'' && str.charAt(str.length - 1) === '\'')
  ) {
    newStr = str.substr(1, str.length - 2);
  }

  return newStr;
}

//const path = require('path');
//const {
//  SemanticArgumentCountMismatchError
//} = require(path.resolve('error', 'helper'));

/**
 * Visits `Number` Keyword
 *
 * @param {object} ctx
 * @returns {string}
 */
visitNumberExpression(ctx) {
  const argumentList = ctx.arguments().argumentList();

  if (argumentList === null || argumentList.getChildCount() !== 1) {
    throw new SemanticArgumentCountMismatchError();
  }

  const arg = argumentList.singleExpression()[0];
  const number = this.removeQuotes(this.visit(arg));

  return `int(${number})`;
}

}
module.exports = Visitor;