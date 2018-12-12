module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/preprocessor.js',
  },
  testURL: 'http://localhost',
  testMatch: ['**/tests/*.(ts|js)'],
  testPathIgnorePatterns: ['<rootDir>/.history/', '<rootDir>/node_modules/'],
  moduleDirectories: ['node_modules'],
};
