"use strict";

var rule = require("../../../lib/rules/asserts-limit"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

var assertions = ["expect(1).to.be.equal(1);", "'1'.should.equal('1');", "assert.equal(1, 1);", "sinon.assert.calledOn(sp, {});"];

ruleTester.run("asserts-limit", rule, {
  valid: [
    {
      code:
        "it('1234', function () {" +
          assertions.join('') +
        "});",
      options: [4]
    },
    {
      code:
        assertions.join('') +
        assertions.join('') +
        "it('1234', function () {});"
    },
    {
      code:
        "it('1234', function () {" +
          assertions.join('') +
        "});",
      options: [5]
    },
    {
      code:
        "it('1234', function () {" +
          "assert;" +
        "});"
    },
    {
      code:
        "it('1234', function () {" +
          "should;" +
        "});"
    },
    {
      code:
        "it('1234', function () {" +
          "should();" +
        "});"
    },
    {
      code:
        "it('1234', function () {" +
          "expect;" +
        "});"
    },
    {
      code:
        "it('1234', function () {" +
          "var expect = {};" +
        "});"
    },
    {
      code:
        "it('1234', function () {" +
          "var should = {};" +
        "});"
    },
    {
      code:
        "it('1234', function () {" +
          "var assert = {};" +
        "});"
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "it('1234', function () {" +
            assertions.join('') +
          "});" +
         "});",
      options: [1, true],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2."}]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "it('1234', function () {" +
            assertions[0] + assertions[0] + assertions[0] +
          "});" +
        "});",
      options: [1, true]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "it('1234', function () {" +
            assertions[1] + assertions[1] + assertions[1] +
          "});" +
        "});",
      options: [1, true]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "it('1234', function () {" +
            assertions[3] + assertions[3] + assertions[3] +
          "});" +
        "});",
      options: [1, true]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "describe('4321', function () { " +
            "it('1234', function () {" +
              assertions[1] + assertions[1] + assertions[1] +
            "});" +
          "});" +
        "});",
      options: [1, true]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "describe('4321', function () { " +
            "it('1234', function () {" +
              assertions[3] + assertions[3] + assertions[3] +
            "});" +
          "});" +
        "});",
      options: [1, true]
    },
    {
      code:
       "it.skip('1234', function () {" +
          assertions[1] + assertions[1] + assertions[1] +
        "});",
      options: [1, true]
    },
    {
      code:
       "it.skip('1234', function () {" +
          assertions[3] + assertions[3] + assertions[3] +
        "});",
      options: [1, true]
    }
  ],

  invalid: [
    {
      code:
        "it('1234', function () {" +
          assertions.join('') +
        "});",
      options: [2],
      errors: [{message: "Too many assertions (4). Maximum allowed is 2."}]
    },
    {
      code:
        "it('1234', function () {" +
          assertions[0] + assertions[0] + assertions[0] +
        "});",
      options: [2],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2."}]
    },
    {
      code:
        "it('1234', function () {" +
          assertions[1] + assertions[1] + assertions[1] +
        "});",
      options: [2],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2."}]
    },
    {
      code:
        "it('1234', function () {" +
          assertions[3] + assertions[3] + assertions[3] +
        "});",
      options: [2],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2."}]
    },
    {
      code:
        "it('1234', function () {" +
          assertions[2] + assertions[2] + assertions[2] +
        "});",
      options: [2],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2."}]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "it('1234', function () {" +
            assertions.join('') +
          "});" +
        "});",
      options: [1],
      errors: [{message: "Too many assertions (4). Maximum allowed is 1."}]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "it('1234', function () {" +
            assertions[0] + assertions[0] + assertions[0] +
          "});" +
        "});",
      options: [1],
      errors: [{message: "Too many assertions (3). Maximum allowed is 1."}]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "it('1234', function () {" +
            assertions[1] + assertions[1] + assertions[1] +
          "});" +
        "});",
      options: [1],
      errors: [{message: "Too many assertions (3). Maximum allowed is 1."}]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "it('1234', function () {" +
            assertions[3] + assertions[3] + assertions[3] +
          "});" +
        "});",
      options: [1],
      errors: [{message: "Too many assertions (3). Maximum allowed is 1."}]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "describe('4321', function () { " +
            "it('1234', function () {" +
              assertions[1] + assertions[1] + assertions[1] +
            "});" +
          "});" +
        "});",
      options: [1],
      errors: [{message: "Too many assertions (3). Maximum allowed is 1."}]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "describe('4321', function () { " +
            "it('1234', function () {" +
              assertions[3] + assertions[3] + assertions[3] +
            "});" +
          "});" +
        "});",
      options: [1],
      errors: [{message: "Too many assertions (3). Maximum allowed is 1."}]
    },
    {
      code:
        "it.skip('1234', function () {" +
          assertions[1] + assertions[1] + assertions[1] +
        "});",
      options: [1],
      errors: [{message: "Too many assertions (3). Maximum allowed is 1."}]
    },
    {
      code:
        "it.skip('1234', function () {" +
          assertions[3] + assertions[3] + assertions[3] +
        "});",
      options: [1],
      errors: [{message: "Too many assertions (3). Maximum allowed is 1."}]
    }
  ]
});