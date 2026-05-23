require('./mock-browser.js');
require('../src/dotwave.js');
const assert = require('assert');

// Test suite for _mergeOptions
const dw = new global.window.DotWave();

try {
    // Test 1: Basic merge, options override defaults
    const defaults1 = { a: 1, b: 2 };
    const options1 = { b: 3, c: 4 }; // Note: _mergeOptions only includes keys present in defaults!
    assert.deepStrictEqual(dw._mergeOptions(defaults1, options1), { a: 1, b: 3 });

    // Test 2: Empty options
    const defaults2 = { x: 10, y: 20 };
    const options2 = {};
    assert.deepStrictEqual(dw._mergeOptions(defaults2, options2), { x: 10, y: 20 });

    // Test 3: Undefined options values fall back to defaults
    const defaults3 = { foo: 'bar', baz: 'qux' };
    const options3 = { foo: undefined, baz: 'new' };
    assert.deepStrictEqual(dw._mergeOptions(defaults3, options3), { foo: 'bar', baz: 'new' });

    // Test 4: Falsy options values (like 0, false, null, '') should override defaults
    const defaults4 = { num: 1, bool: true, obj: {}, str: 'hello' };
    const options4 = { num: 0, bool: false, obj: null, str: '' };
    assert.deepStrictEqual(dw._mergeOptions(defaults4, options4), { num: 0, bool: false, obj: null, str: '' });

    // Test 5: Keys in options but not in defaults are ignored
    const defaults5 = { key1: 'value1' };
    const options5 = { key1: 'value1', key2: 'value2' };
    assert.deepStrictEqual(dw._mergeOptions(defaults5, options5), { key1: 'value1' });

    console.log('✅ All _mergeOptions tests passed!');
} catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
}
