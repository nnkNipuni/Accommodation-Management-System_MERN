import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./index.css";
import Home from './pages/boardingSeeker/Home.jsx'; // Import Home
import SearchAdd from './pages/boardingSeeker/searchAdd.jsx'; // Import SearchAdd
import UserviewNavBar from './components/user.viewNavBar.jsx';
import BoardingDetails from './components/boardingDetails.jsx';
//Import other pages as needed
// Layout component that includes the navbar

const Layout = ({ children }) => {
  return (
    <>
      <UserviewNavBar />
      <main>{children}</main>
    </>
  );
};

const App = () => {
    return (
        <Router>
            <div >
                {/* <h1>App Root</h1> */}
                <Routes>
                    <Route path="/" element={ <Layout> <Home /> </Layout> } /> {/* Home at root */}
                    <Route path="/searchadd" element={<Layout> <SearchAdd /></Layout>} /> {/* SearchAdd at /searchadd */}
                    <Route path="/advertisement/:id" element={<Layout> <BoardingDetails /> </Layout>} /> {/* BoardingDetails at /boarding/:id */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;