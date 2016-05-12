import 'babel-register'
import 'babel-polyfill'
import '../server/cssHook'
import chai, { assert, expect } from 'chai'
import sinon from 'sinon'
import jsdom from 'jsdom'

chai.config.includeStack = true

global.assert = assert
global.expect = expect
global.sinon = sinon
global.eq = assert.deepEqual

global.document = jsdom.jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator
