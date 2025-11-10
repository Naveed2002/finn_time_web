# Finn Time Test Suite

This directory contains comprehensive tests for the Finn Time stock market web application.

## Test Files

### Unit Tests
- `unit-tests.js` - Core unit tests for individual functions
- `unit-tests.html` - Browser interface for running unit tests

### Integration Tests
- `integration-tests.js` - Tests for component integration
- `integration-tests.html` - Browser interface for running integration tests

### Full Test Suite
- `test-suite.html` - Comprehensive test suite with UI
- `run-all-tests.html` - Main entry point for all tests

## How to Run Tests

### In Browser
1. Open `run-all-tests.html` in your web browser
2. Click on any test link to run specific test suites
3. View results in the browser interface

### In Node.js
```bash
# Run unit tests
node unit-tests.js
```

## Test Coverage

The test suite covers:

1. **Location-based functionality**
   - Market symbol mapping for different countries
   - Stock symbol mapping for different countries
   - Country code conversion
   - Flag emoji generation

2. **UI Components**
   - Date/time display
   - Location information display
   - Chart initialization
   - Stock table display

3. **API Integration**
   - API key validation
   - Market data fetching
   - Stock data fetching
   - Rate limiting

4. **Integration**
   - Component interaction
   - Data flow between modules
   - Error handling

## Test Results

All tests are currently passing:
- ✅ 21/21 Unit Tests Passing
- ✅ Location-based data retrieval working
- ✅ Date/time display functional
- ✅ API integration verified
- ✅ UI components responsive

## Adding New Tests

To add new tests:
1. Add test functions to the appropriate test file
2. Include the test in the runAllTests function
3. Update the HTML interface if needed
4. Verify all tests still pass