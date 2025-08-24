const React = require('react');
const { createRoot } = require('react-dom/client');

// Load our component - need to handle both ES modules and CommonJS
let FehlzeitenPageWrapper;

try {
  // Try ES module import first
  FehlzeitenPageWrapper = require('./FehlzeitenPageWrapper.js').default;
} catch (error) {
  console.error('Failed to load FehlzeitenPageWrapper:', error);
  // Fallback: create a simple placeholder component
  FehlzeitenPageWrapper = function() {
    return React.createElement('div', {}, 'Component loading failed: ' + error.message);
  };
}

module.exports = {
  React,
  createRoot,
  FehlzeitenPageWrapper
};