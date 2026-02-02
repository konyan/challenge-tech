import type React from 'react';
import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';

// Dynamic imports for child components/pages
const Problem1 = lazy(() => import('./problem1/Problem1'));
// Problem2 uses vanilla HTML/CSS/JS - displayed in iframe
const Problem3 = lazy(() => import('./problem3/Problem3'));

// Iframe component for Problem 2 (vanilla HTML/CSS/JS)
const Problem2: React.FC = () => {
  const iframeSrc = import.meta.env.BASE_URL + 'src/problem2/index.html';
  return (
    <div className="iframe-container">
      <iframe src={iframeSrc} title="Problem 2 - Currency Swap" className="problem-iframe" />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="app">
      <nav className="navigation">
        <h1>Code Challenge</h1>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/problem1">Problem 1</Link>
          </li>
          <li>
            <Link to="/problem2">Problem 2</Link>
          </li>
          <li>
            <Link to="/problem3">Problem 3</Link>
          </li>
        </ul>
      </nav>

      <main className="content">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problem1" element={<Problem1 />} />
            <Route path="/problem2" element={<Problem2 />} />
            <Route path="/problem3" element={<Problem3 />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="home">
      <h2>Welcome to Code Challenge</h2>
      <p>Select a problem from the navigation menu to get started.</p>
      <div className="problem-grid">
        <Link to="/problem1" className="problem-card">
          Problem 1
        </Link>
        <Link to="/problem2" className="problem-card">
          Problem 2
        </Link>
        <Link to="/problem3" className="problem-card">
          Problem 3
        </Link>
      </div>
    </div>
  );
};

export default App;
