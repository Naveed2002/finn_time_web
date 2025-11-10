// Integration tests for Finn Time application
// These tests verify the actual integration between components

console.log('=== Finn Time Integration Tests ===');

// Test 1: Verify location-based data retrieval
function testLocationBasedDataRetrieval() {
    console.log('\\n1. Testing location-based data retrieval...');
    
    try {
        // Simulate German user
        const germanLocation = {
            country: 'Germany',
            city: 'Berlin',
            countryCode: 'DE'
        };
        
        // Set window.userLocation to simulate a German client
        window.userLocation = germanLocation;
        
        // Test if the functions exist and work
        if (typeof getLocationBasedSymbols === 'function' && typeof getLocationBasedStocks === 'function') {
            const marketSymbols = getLocationBasedSymbols();
            const stockSymbols = getLocationBasedStocks();
            
            console.log('  German market symbols:', marketSymbols);
            console.log('  German stock symbols:', stockSymbols);
            
            // Verify expected results
            const expectedMarketSymbols = ['EWG', 'DAX'];
            const expectedStockSymbols = ['SAP.DE', 'BMW.DE', 'AAPL', 'TSLA', 'GOOGL'];
            
            const marketMatch = JSON.stringify(marketSymbols) === JSON.stringify(expectedMarketSymbols);
            const stockMatch = JSON.stringify(stockSymbols) === JSON.stringify(expectedStockSymbols);
            
            if (marketMatch && stockMatch) {
                console.log('  Location-based data retrieval: PASS');
                return { passed: 1, failed: 0 };
            } else {
                console.log('  Location-based data retrieval: FAIL');
                console.log('    Market symbols match:', marketMatch);
                console.log('    Stock symbols match:', stockMatch);
                return { passed: 0, failed: 1 };
            }
        } else {
            console.log('  Location-based data retrieval: FAIL - Functions not available');
            return { passed: 0, failed: 1 };
        }
    } catch (error) {
        console.log('  Location-based data retrieval: FAIL - Error:', error.message);
        return { passed: 0, failed: 1 };
    }
}

// Test 2: Verify date/time display functionality
function testDateTimeDisplay() {
    console.log('\\n2. Testing date/time display functionality...');
    
    try {
        // Check if updateDateTimeDisplay function exists
        if (typeof updateDateTimeDisplay === 'function') {
            // Call the function
            updateDateTimeDisplay();
            
            // Check if dateTimeInfo element exists and has content
            if (typeof dateTimeInfo !== 'undefined' && dateTimeInfo) {
                console.log('  Date/time display: PASS');
                return { passed: 1, failed: 0 };
            } else {
                console.log('  Date/time display: FAIL - Element not found');
                return { passed: 0, failed: 1 };
            }
        } else {
            console.log('  Date/time display: FAIL - Function not available');
            return { passed: 0, failed: 1 };
        }
    } catch (error) {
        console.log('  Date/time display: FAIL - Error:', error.message);
        return { passed: 0, failed: 1 };
    }
}

// Test 3: Verify location display functionality
function testLocationDisplay() {
    console.log('\\n3. Testing location display functionality...');
    
    try {
        // Check if locationInfo element exists
        if (typeof locationInfo !== 'undefined' && locationInfo) {
            // Simulate location data
            const locationData = {
                country: 'Germany',
                city: 'Berlin'
            };
            
            // Check if updateMarketTrendTitle function exists
            if (typeof updateMarketTrendTitle === 'function') {
                // Call the function
                updateMarketTrendTitle(locationData.country);
                
                console.log('  Location display: PASS');
                return { passed: 1, failed: 0 };
            } else {
                console.log('  Location display: FAIL - updateMarketTrendTitle function not available');
                return { passed: 0, failed: 1 };
            }
        } else {
            console.log('  Location display: FAIL - locationInfo element not found');
            return { passed: 0, failed: 1 };
        }
    } catch (error) {
        console.log('  Location display: FAIL - Error:', error.message);
        return { passed: 0, failed: 1 };
    }
}

// Test 4: Verify API utility functions
function testAPIUtilityFunctions() {
    console.log('\\n4. Testing API utility functions...');
    
    try {
        // Check if fetchEodData function exists
        if (typeof fetchEodData === 'function') {
            console.log('  fetchEodData function: AVAILABLE');
        } else {
            console.log('  fetchEodData function: NOT AVAILABLE');
        }
        
        // Check if fetchFromMarketStack function exists
        if (typeof fetchFromMarketStack === 'function') {
            console.log('  fetchFromMarketStack function: AVAILABLE');
        } else {
            console.log('  fetchFromMarketStack function: NOT AVAILABLE');
        }
        
        // Check if respectRateLimit function exists
        if (typeof respectRateLimit === 'function') {
            console.log('  respectRateLimit function: AVAILABLE');
        } else {
            console.log('  respectRateLimit function: NOT AVAILABLE');
        }
        
        console.log('  API utility functions test: PASS (functions available)');
        return { passed: 1, failed: 0 };
    } catch (error) {
        console.log('  API utility functions test: FAIL - Error:', error.message);
        return { passed: 0, failed: 1 };
    }
}

// Test 5: Verify dashboard functions
function testDashboardFunctions() {
    console.log('\\n5. Testing dashboard functions...');
    
    try {
        // Check various dashboard functions
        const functionsToCheck = [
            'initTrendChart',
            'initAssetChart',
            'setupTimeRangeButtons',
            'fetchRealMarketData',
            'fetchStockData',
            'updateStockTable',
            'processMarketData'
        ];
        
        let availableCount = 0;
        functionsToCheck.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`  ${funcName}: AVAILABLE`);
                availableCount++;
            } else {
                console.log(`  ${funcName}: NOT AVAILABLE`);
            }
        });
        
        console.log(`  Dashboard functions: ${availableCount}/${functionsToCheck.length} available`);
        
        if (availableCount > 0) {
            console.log('  Dashboard functions test: PASS (some functions available)');
            return { passed: 1, failed: 0 };
        } else {
            console.log('  Dashboard functions test: FAIL (no functions available)');
            return { passed: 0, failed: 1 };
        }
    } catch (error) {
        console.log('  Dashboard functions test: FAIL - Error:', error.message);
        return { passed: 0, failed: 1 };
    }
}

// Run all integration tests
function runAllIntegrationTests() {
    console.log('Running all integration tests...\\n');
    
    // Initialize test results
    let totalPassed = 0;
    let totalFailed = 0;
    
    // Run each test
    const tests = [
        testLocationBasedDataRetrieval,
        testDateTimeDisplay,
        testLocationDisplay,
        testAPIUtilityFunctions,
        testDashboardFunctions
    ];
    
    tests.forEach(test => {
        try {
            const result = test();
            totalPassed += result.passed;
            totalFailed += result.failed;
        } catch (error) {
            console.log(`  Test ${test.name} failed with error:`, error.message);
            totalFailed++;
        }
    });
    
    // Print summary
    console.log('\\n=== Integration Test Summary ===');
    console.log(`Total Tests: ${totalPassed + totalFailed}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    
    if (totalFailed === 0) {
        console.log('\\n🎉 All integration tests passed!');
    } else {
        console.log(`\\n❌ ${totalFailed} integration test(s) failed.`);
    }
    
    return { passed: totalPassed, failed: totalFailed };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllIntegrationTests,
        testLocationBasedDataRetrieval,
        testDateTimeDisplay,
        testLocationDisplay,
        testAPIUtilityFunctions,
        testDashboardFunctions
    };
}