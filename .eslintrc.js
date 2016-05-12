module.exports = {
  // extends: 'airbnb',
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  globals: {
    assert: true,
    expect: true,
    eq: true
  },
  plugins: [
    'react',
    'babel'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      classes: true,
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {

    'import/no-unresolved': 0,

    // @connect decorator does not work with stateless functions
    'react/prefer-stateless-function': 0,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    // we are preloading React in webpack.ProvidePlugin
    'react/react-in-jsx-scope': 0,
    'react/prop-types': [2, {
      ignore: ['children', 'params']
    }],


    'array-callback-return': 0,

    // good rule, but doesn't play nice with debugging
    'arrow-body-style': 0,

    'new-cap': [2, {

      // allow Immutable.js types
      capIsNewExceptions: [
        'List',
        'Map',
        'Record',
        'Seq',
        'Set',
        'Iterable',
        'Repeat'
      ]
    }],

    // this is the dumbest rule in all of js linting
    radix: 0,

    'semi': 0,
    'comma-dangle': 0,
    'consistent-return': 0,
    'curly': 0,
    'global-require': 0,
    'space-before-function-paren': 0,
    'key-spacing': 0,
    'padded-blocks': 0,
    'no-confusing-arrow': 0,
    'no-console': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'no-return-assign': 0,
    'no-sequences': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'no-unused-vars': [2, {

      argsIgnorePattern: 'e|err|event|stats|_*',

      // add exceptions for decorators
      varsIgnorePattern: [
        'autobind',
        'injectLogger',
        'immutableUpdate',
        'shallowUpdate',
        'override',
        'debounce',
        'deprecate',
        'connect',
        'bindActionCreators',
        'transportActions',
        'rackActions',
        'deviceActions',
        'globalActions',
        'actions',
        'autoproxy',
        'makeMapStateToProps',
        'getAllDevices'
      ].join('|')
    }],

    'no-use-before-define': 0,
    'space-infix-ops': 0,
    'spaced-comment': 0,

    // because I debug arguments often
    'prefer-rest-params': 0,
  }
}
