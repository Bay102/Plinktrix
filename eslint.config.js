// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const simpleImportSort = require('eslint-plugin-simple-import-sort')

module.exports = defineConfig([
 ...expoConfig,
 {
  ignores: ['dist/*'],
 },
 {
  plugins: {
   'simple-import-sort': simpleImportSort,
  },
  rules: {
   // Import sorting rules
   'simple-import-sort/imports': [
    'error',
    {
     groups: [
      // React imports first
      ['^react$', '^react/'],
      // React Native imports
      ['^react-native$', '^react-native/'],
      // Other external packages starting with @
      ['^@'],
      // Other external packages
      ['^[a-z]'],
      // Internal packages (your app's imports)
      ['^(@|components|hooks|utils|services|types|constants|providers)(/.*|$)'],
      // Parent imports
      ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
      // Same-folder imports
      ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
      // Side effect imports
      ['^\\u0000'],
     ],
    },
   ],
   'simple-import-sort/exports': 'error',
  },
 },
])
