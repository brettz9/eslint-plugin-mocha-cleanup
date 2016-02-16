"use strict";

var rule = require("../../../lib/rules/disallowed-usage"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var Jsonium = require('jsonium');
var j = new Jsonium();

var ruleTester = new RuleTester();

var disallowed = [
  {CODE: "obj.subObj.prop = 1;", MESSAGE: "obj.subObj.prop", "options.0.test": [{o: "obj.subObj", p: ["prop"]}], "options.0.hook": [{o: "obj.subObj", p: ["prop"]}]},
  {CODE: "obj['subObj'].prop = 1;", MESSAGE: "obj.subObj.prop", "options.0.test": [{o: "obj.subObj", p: ["prop"]}], "options.0.hook": [{o: "obj.subObj", p: ["prop"]}]},
  {CODE: "obj.subObj['prop'] = 1;", MESSAGE: "obj.subObj.prop", "options.0.test": [{o: "obj.subObj", p: ["prop"]}], "options.0.hook": [{o: "obj.subObj", p: ["prop"]}]},
  {CODE: "obj.prop = '1';", MESSAGE: "obj.prop", "options.0.test": [{o: "obj", p: ["prop"]}], "options.0.hook": [{o: "obj", p: ["prop"]}]},
  {CODE: "obj['prop'] = '1';", MESSAGE: "obj.prop", "options.0.test": [{o: "obj", p: ["prop"]}], "options.0.hook": [{o: "obj", p: ["prop"]}]},
  {CODE: "expect(obj.property).to.be.equal('1');", MESSAGE: "obj.property", "options.0.test": [{o: "obj", p: ["property"]}], "options.0.hook": [{o: "obj", p: ["property"]}]},
  {CODE: "expect(obj['property']).to.be.equal('1');", MESSAGE: "obj.property", "options.0.test": [{o: "obj", p: ["property"]}], "options.0.hook": [{o: "obj", p: ["property"]}]},
  {CODE: "obj.subObj.method(1, 2);", MESSAGE: "obj.subObj.method", "options.0.test": [{o: "obj.subObj", m: ["method"]}], "options.0.hook": [{o: "obj.subObj", m: ["method"]}]},
  {CODE: "obj['subObj'].method(1, 2);", MESSAGE: "obj.subObj.method", "options.0.test": [{o: "obj.subObj", m: ["method"]}], "options.0.hook": [{o: "obj.subObj", m: ["method"]}]},
  {CODE: "obj.subObj['method'](1, 2);", MESSAGE: "obj.subObj.method", "options.0.test": [{o: "obj.subObj", m: ["method"]}], "options.0.hook": [{o: "obj.subObj", m: ["method"]}]},
  {CODE: "obj.method('1');", MESSAGE: "obj.method", "options.0.test": [{o: "obj", m: ["method"]}], "options.0.hook": [{o: "obj", m: ["method"]}]},
  {CODE: "method();", MESSAGE: "method", "options.0.test": [{f: "method"}], "options.0.hook": [{f: "method"}]}
];

var hooks = [
  {HOOK: "before"},
  {HOOK: "beforeEach"},
  {HOOK: "after"},
  {HOOK: "afterEach"}
];

var validTestTemplates = [
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('4321', function () {" +
          "{{CODE}};" +
        "})" +
      "})",
    options: [
      {
        skipSkipped: true,
        test: true
      }
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{HOOK}}(function () {" +
          "{{CODE}};" +
        "})" +
      "})",
    options: [
      {
        skipSkipped: true,
        test: true
      }
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{TESTSKIP}}('4321', function () {" +
          "{{CODE}};" +
        "})" +
      "})",
    options: [
      {
        skipSkipped: true,
        test: true
      }
    ]
  }
];
var invalidTestTemplates = [
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{TEST}}('4321', function () {" +
          "{{CODE}};" +
        "})" +
      "})",
    options: [
      {
        test: true
      }
    ],
    errors: [
      {message: "`{{MESSAGE}}` is not allowed here."}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{HOOK}}('4321', function () {" +
          "{{CODE}};" +
        "})" +
      "})",
    options: [
      {
        hook: true
      }
    ],
    errors: [
      {message: "`{{MESSAGE}}` is not allowed here."}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{TEST}}('4321', function () {" +
          "{{CODE}}" +
          "{{CODE}}" +
          "{{CODE}}" +
        "})" +
      "})",
    options: [
      {
        test: true
      }
    ],
    errors: [
      {message: "`{{MESSAGE}}` is not allowed here."},
      {message: "`{{MESSAGE}}` is not allowed here."},
      {message: "`{{MESSAGE}}` is not allowed here."}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{HOOK}}('4321', function () {" +
          "{{CODE}}" +
          "{{CODE}}" +
          "{{CODE}}" +
        "})" +
      "})",
    options: [
      {
        hook: true
      }
    ],
    errors: [
      {message: "`{{MESSAGE}}` is not allowed here."},
      {message: "`{{MESSAGE}}` is not allowed here."},
      {message: "`{{MESSAGE}}` is not allowed here."}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{HOOK}}('4321', function () {" +
          "{{CODE}}" +
        "});" +
        "{{TEST}}('4321', function () {" +
          "{{CODE}}" +
        "});" +
      "});",
    options: [
      {
        hook: true,
        test: true
      }
    ],
    errors: [
      {message: "`{{MESSAGE}}` is not allowed here."},
      {message: "`{{MESSAGE}}` is not allowed here."}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(['code'], hooks)
  .useCombosAsTemplates()
  .createCombos(['code', 'options.0.{test,hook}'], disallowed)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();
var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(['code'], hooks)
  .useCombosAsTemplates()
  .createCombos(['code', 'options.0.{test,hook}', 'errors.@each.message'], disallowed)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();

ruleTester.run("disallowed-usage", rule, {
  valid: validTests,
  invalid: invalidTests
});