/**
 * Simplified WeWeb wrapper for debugging
 * This file helps isolate potential import/build issues
 */

// Simple test to ensure basic imports work
console.log('WeWeb wrapper loading...');

try {
  // Test React import
  const React = require('react');
  console.log('React loaded successfully:', React.version);
  
  // Test React DOM import
  const ReactDOM = require('react-dom/client');
  console.log('ReactDOM loaded successfully');
  
  // Test our component import
  const FehlzeitenPageWrapper = require('./FehlzeitenPageWrapper.js');
  console.log('FehlzeitenPageWrapper loaded successfully');
  
  console.log('All imports successful');
} catch (error) {
  console.error('Import error:', error.message);
  console.error('Stack:', error.stack);
}

// Export a simple function for testing
module.exports = {
  testFunction: () => {
    return 'WeWeb wrapper is working';
  }
};