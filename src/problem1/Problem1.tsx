import type React from 'react';
import { useState } from 'react';
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './index';
import './Problem1.css';

type SumFn = (n: number) => number;

interface TestCase {
  input: number;
  expected: number;
}

const Problem1: React.FC = () => {
  const [inputNumber, setInputNumber] = useState<string>('');
  const [results, setResults] = useState<Array<{ name: string; result: number }>>([]);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const implementations: Array<[string, SumFn]> = [
    ['sum_to_n_a (Loop)', sum_to_n_a],
    ['sum_to_n_b (Formula)', sum_to_n_b],
    ['sum_to_n_c (Recursive)', sum_to_n_c],
  ];

  const testCases: TestCase[] = [
    { input: 0, expected: 0 },
    { input: 1, expected: 1 },
    { input: 2, expected: 3 },
    { input: 5, expected: 15 },
    { input: 10, expected: 55 },
    { input: 100, expected: 5050 },
  ];

  const handleShowResult = () => {
    const num = parseInt(inputNumber);
    if (isNaN(num)) {
      alert('Please enter a valid number');
      return;
    }

    const newResults = implementations.map(([name, fn]) => ({
      name,
      result: fn(num),
    }));

    setResults(newResults);
  };

  const getLogClass = (log: string): string => {
    if (log.includes('✅')) return 'log-success';
    if (log.includes('❌')) return 'log-error';
    if (log.includes('🧪') || log.includes('📦')) return 'log-info';
    if (log.includes('✨')) return 'log-complete';
    return '';
  };

  const runTests = async () => {
    setIsTestRunning(true);
    setTestLogs([]);
    const logs: string[] = [];

    logs.push('🧪 Starting test suite for sum_to_n functions...\n');
    logs.push('='.repeat(60));
    setTestLogs([...logs]);

    await sleep(500);

    for (const [name, fn] of implementations) {
      logs.push(`\n📦 Testing: ${name}`);
      logs.push('-'.repeat(60));
      setTestLogs([...logs]);
      await sleep(300);

      let passedCount = 0;
      let failedCount = 0;

      for (const testCase of testCases) {
        const { input, expected } = testCase;

        try {
          const actual = fn(input);
          const passed = actual === expected;

          if (passed) {
            logs.push(`  ✅ ${name}(${input}) = ${actual} (Expected: ${expected})`);
            passedCount++;
          } else {
            logs.push(`  ❌ ${name}(${input}) = ${actual} (Expected: ${expected}) - FAILED`);
            failedCount++;
          }
        } catch (error) {
          logs.push(`  ❌ ${name}(${input}) - Error: ${error}`);
          failedCount++;
        }

        setTestLogs([...logs]);
        await sleep(200);
      }

      logs.push(`  Summary: ${passedCount} passed, ${failedCount} failed`);
      setTestLogs([...logs]);
      await sleep(300);
    }

    logs.push('\n' + '='.repeat(60));
    logs.push('✨ All tests completed!');
    setTestLogs([...logs]);
    setIsTestRunning(false);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleShowResult();
    }
  };

  return (
    <div className="problem-container">
      <h2>Problem 1: Sum from 1 to n</h2>
      <p className="description">
        Calculate the sum of numbers from 1 to n using three different approaches: loop,
        mathematical formula, and recursion.
      </p>

      <div className="problem-content">
        <div className="input-section">
          <label htmlFor="number-input">Enter a number (n):</label>
          <div className="input-group">
            <input
              id="number-input"
              type="number"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a number..."
              className="number-input"
            />
            <button type="button" onClick={handleShowResult} className="btn btn-primary">
              Show Result
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="results-section">
            <h3>Results for n = {inputNumber}:</h3>
            <div className="results-grid">
              {results.map(({ name, result }) => (
                <div key={name} className="result-card">
                  <div className="result-name">{name}</div>
                  <div className="result-value">{result.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="test-section">
          <div className="test-cases-display">
            <h3>Test Cases:</h3>
            <div className="test-cases-grid">
              {testCases.map((testCase, index) => (
                <div key={`${testCase.input}-${testCase.expected}`} className="test-case-card">
                  <div className="test-case-label">Test #{index + 1}</div>
                  <div className="test-case-content">
                    <span className="test-input">n = {testCase.input}</span>
                    <span className="test-arrow">→</span>
                    <span className="test-expected">Expected: {testCase.expected}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={runTests}
            disabled={isTestRunning}
            className="btn btn-test"
            type="button"
          >
            {isTestRunning ? '⏳ Running Tests...' : '🧪 Run Test Cases'}
          </button>

          {testLogs.length > 0 && (
            <div className="test-logs">
              <h3>Test Execution Log:</h3>
              <pre className="log-output">
                {testLogs.map((log) => (
                  <div key={log} className={`log-line ${getLogClass(log)}`}>
                    {log}
                  </div>
                ))}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problem1;
