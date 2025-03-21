import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/boardingSeeker/Home.jsx'; // Import Home
import SearchAdd from './pages/boardingSeeker/searchAdd.jsx'; // Import SearchAdd

const App = () => {
    return (
        <Router>
            <div>
                {/* <h1>App Root</h1> */}
                <Routes>
                    <Route path="/" element={<Home />} /> {/* Home at root */}
                    <Route path="/searchadd" element={<SearchAdd />} /> {/* SearchAdd at /searchadd */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;