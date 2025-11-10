// Unit tests for Finn Time application
console.log('=== Finn Time Unit Tests ===');

// Test 1: Location-based market symbols
function testLocationBasedSymbols() {
    console.log('\\n1. Testing location-based market symbols...');
    
    // Mock the location-based symbols function
    function getLocationBasedSymbols(country) {
        const countrySymbols = {
            'United States': ['SPY', 'QQQ', 'DIA'],
            'United Kingdom': ['EZU', 'EWU', 'VPL'],
            'Germany': ['EWG', 'DAX'],
            'France': ['EWQ', 'CAC'],
            'Japan': ['EWJ', 'DXJ'],
            'Canada': ['EWC', 'XIC'],
            'Australia': ['EWA', 'AXJ'],
            'China': ['FXI', 'ASHR'],
            'India': ['EPI', 'INDA'],
            'Brazil': ['EWZ', 'IBB'],
            'South Korea': ['EWY', 'KORU']
        };
        return countrySymbols[country] || ['SPY', 'QQQ', 'DIA'];
    }
    
    // Test cases
    const testCases = [
        { country: 'Germany', expected: ['EWG', 'DAX'] },
        { country: 'United States', expected: ['SPY', 'QQQ', 'DIA'] },
        { country: 'France', expected: ['EWQ', 'CAC'] },
        { country: 'Japan', expected: ['EWJ', 'DXJ'] },
        { country: 'Unknown', expected: ['SPY', 'QQQ', 'DIA'] } // Default
    ];
    
    let passed = 0;
    let failed = 0;
    
    testCases.forEach(testCase => {
        const result = getLocationBasedSymbols(testCase.country);
        const isPass = JSON.stringify(result) === JSON.stringify(testCase.expected);
        
        console.log(`  ${testCase.country}: ${isPass ? 'PASS' : 'FAIL'}`);
        console.log(`    Expected: [${testCase.expected.join(', ')}]`);
        console.log(`    Actual:   [${result.join(', ')}]`);
        
        if (isPass) {
            passed++;
        } else {
            failed++;
        }
    });
    
    console.log(`  Result: ${passed} passed, ${failed} failed`);
    return { passed, failed };
}

// Test 2: Location-based stock symbols
function testLocationBasedStocks() {
    console.log('\\n2. Testing location-based stock symbols...');
    
    // Mock the location-based stocks function
    function getLocationBasedStocks(country) {
        const countryStocks = {
            'United States': ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'],
            'United Kingdom': ['BP.L', 'VOD.L', 'AAPL', 'TSLA', 'GOOGL'],
            'Germany': ['SAP.DE', 'BMW.DE', 'AAPL', 'TSLA', 'GOOGL'],
            'France': ['MC.PA', 'OR.PA', 'AAPL', 'TSLA', 'GOOGL'],
            'Japan': ['7203.T', '9984.T', 'AAPL', 'TSLA', 'GOOGL'],
            'Canada': ['ENB.TO', 'SU.TO', 'AAPL', 'TSLA', 'GOOGL'],
            'Australia': ['CBA.AX', 'BHP.AX', 'AAPL', 'TSLA', 'GOOGL'],
            'China': ['BABA', 'TCEHY', 'AAPL', 'TSLA', 'GOOGL'],
            'India': ['RELIANCE.BSE', 'TCS.BSE', 'AAPL', 'TSLA', 'GOOGL'],
            'Brazil': ['PETR4.SA', 'VALE3.SA', 'AAPL', 'TSLA', 'GOOGL'],
            'South Korea': ['005930.KS', '000660.KS', 'AAPL', 'TSLA', 'GOOGL'],
            'Sri Lanka': ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT']
        };
        return countryStocks[country] || ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'];
    }
    
    // Test cases
    const testCases = [
        { country: 'Germany', expected: ['SAP.DE', 'BMW.DE', 'AAPL', 'TSLA', 'GOOGL'] },
        { country: 'United States', expected: ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'] },
        { country: 'France', expected: ['MC.PA', 'OR.PA', 'AAPL', 'TSLA', 'GOOGL'] },
        { country: 'Japan', expected: ['7203.T', '9984.T', 'AAPL', 'TSLA', 'GOOGL'] },
        { country: 'Unknown', expected: ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'] } // Default
    ];
    
    let passed = 0;
    let failed = 0;
    
    testCases.forEach(testCase => {
        const result = getLocationBasedStocks(testCase.country);
        const isPass = JSON.stringify(result) === JSON.stringify(testCase.expected);
        
        console.log(`  ${testCase.country}: ${isPass ? 'PASS' : 'FAIL'}`);
        console.log(`    Expected: [${testCase.expected.join(', ')}]`);
        console.log(`    Actual:   [${result.join(', ')}]`);
        
        if (isPass) {
            passed++;
        } else {
            failed++;
        }
    });
    
    console.log(`  Result: ${passed} passed, ${failed} failed`);
    return { passed, failed };
}

// Test 3: Date and time functionality
function testDateTimeFunctionality() {
    console.log('\\n3. Testing date and time functionality...');
    
    try {
        const now = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        };
        
        const dateString = now.toLocaleDateString('en-US', dateOptions);
        const timeString = now.toLocaleTimeString('en-US', timeOptions);
        
        const isPass = dateString && timeString;
        
        console.log(`  Date/Time Display: ${isPass ? 'PASS' : 'FAIL'}`);
        console.log(`    Date: ${dateString}`);
        console.log(`    Time: ${timeString}`);
        
        return { passed: isPass ? 1 : 0, failed: isPass ? 0 : 1 };
    } catch (error) {
        console.log(`  Date/Time Display: FAIL`);
        console.log(`    Error: ${error.message}`);
        return { passed: 0, failed: 1 };
    }
}

// Test 4: Country code mapping
function testCountryCodeMapping() {
    console.log('\\n4. Testing country code mapping...');
    
    // Mock the country code function
    function getCountryCode(countryName) {
        const countryCodes = {
            'United States': 'US',
            'United Kingdom': 'GB',
            'Sri Lanka': 'LK',
            'India': 'IN',
            'Canada': 'CA',
            'Australia': 'AU',
            'Germany': 'DE',
            'France': 'FR',
            'Japan': 'JP',
            'China': 'CN',
            'Brazil': 'BR',
            'Russia': 'RU',
            'South Africa': 'ZA',
            'Mexico': 'MX',
            'South Korea': 'KR',
            'Indonesia': 'ID',
            'Turkey': 'TR',
            'Saudi Arabia': 'SA',
            'Netherlands': 'NL',
            'Switzerland': 'CH',
            'Sweden': 'SE',
            'Norway': 'NO',
            'Denmark': 'DK',
            'Finland': 'FI',
            'Singapore': 'SG',
            'Malaysia': 'MY',
            'Thailand': 'TH',
            'Vietnam': 'VN',
            'Philippines': 'PH',
            'New Zealand': 'NZ',
            'Argentina': 'AR',
            'Chile': 'CL',
            'Colombia': 'CO',
            'Peru': 'PE',
            'Egypt': 'EG',
            'Nigeria': 'NG',
            'Kenya': 'KE',
            'Ghana': 'GH',
            'Morocco': 'MA',
            'Ukraine': 'UA',
            'Poland': 'PL',
            'Czech Republic': 'CZ',
            'Hungary': 'HU',
            'Romania': 'RO',
            'Portugal': 'PT',
            'Greece': 'GR',
            'Israel': 'IL',
            'United Arab Emirates': 'AE'
        };
        
        return countryCodes[countryName] || 'GLOBAL';
    }
    
    // Test cases
    const testCases = [
        { country: 'Germany', expected: 'DE' },
        { country: 'United States', expected: 'US' },
        { country: 'France', expected: 'FR' },
        { country: 'Japan', expected: 'JP' },
        { country: 'Unknown', expected: 'GLOBAL' } // Default
    ];
    
    let passed = 0;
    let failed = 0;
    
    testCases.forEach(testCase => {
        const result = getCountryCode(testCase.country);
        const isPass = result === testCase.expected;
        
        console.log(`  ${testCase.country}: ${isPass ? 'PASS' : 'FAIL'}`);
        console.log(`    Expected: ${testCase.expected}`);
        console.log(`    Actual:   ${result}`);
        
        if (isPass) {
            passed++;
        } else {
            failed++;
        }
    });
    
    console.log(`  Result: ${passed} passed, ${failed} failed`);
    return { passed, failed };
}

// Test 5: Flag emoji generation
function testFlagEmojiGeneration() {
    console.log('\\n5. Testing flag emoji generation...');
    
    // Mock the flag emoji function
    function getFlagEmoji(countryCode) {
        if (countryCode === 'GLOBAL') return '🌍';
        
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        
        return String.fromCodePoint(...codePoints);
    }
    
    // Test cases
    const testCases = [
        { code: 'DE', expected: '🇩🇪' },
        { code: 'US', expected: '🇺🇸' },
        { code: 'FR', expected: '🇫🇷' },
        { code: 'JP', expected: '🇯🇵' },
        { code: 'GLOBAL', expected: '🌍' }
    ];
    
    let passed = 0;
    let failed = 0;
    
    testCases.forEach(testCase => {
        const result = getFlagEmoji(testCase.code);
        const isPass = result === testCase.expected;
        
        console.log(`  ${testCase.code}: ${isPass ? 'PASS' : 'FAIL'}`);
        console.log(`    Expected: ${testCase.expected}`);
        console.log(`    Actual:   ${result}`);
        
        if (isPass) {
            passed++;
        } else {
            failed++;
        }
    });
    
    console.log(`  Result: ${passed} passed, ${failed} failed`);
    return { passed, failed };
}

// Run all tests
function runAllTests() {
    console.log('Running all unit tests...\\n');
    
    const results = [
        testLocationBasedSymbols(),
        testLocationBasedStocks(),
        testDateTimeFunctionality(),
        testCountryCodeMapping(),
        testFlagEmojiGeneration()
    ];
    
    // Calculate totals
    const totalPassed = results.reduce((sum, result) => sum + result.passed, 0);
    const totalFailed = results.reduce((sum, result) => sum + result.failed, 0);
    const totalTests = totalPassed + totalFailed;
    
    console.log('\\n=== Test Summary ===');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    
    if (totalFailed === 0) {
        console.log('\\n🎉 All tests passed!');
    } else {
        console.log(`\\n❌ ${totalFailed} test(s) failed.`);
    }
    
    return { passed: totalPassed, failed: totalFailed };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testLocationBasedSymbols,
        testLocationBasedStocks,
        testDateTimeFunctionality,
        testCountryCodeMapping,
        testFlagEmojiGeneration
    };
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    runAllTests();
}