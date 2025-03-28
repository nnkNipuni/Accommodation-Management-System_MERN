import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./index.css";
import Home from './pages/boardingSeeker/Home.jsx'; 
import SearchAdd from './pages/boardingSeeker/searchAdd.jsx'; 
import UserviewNavBar from './components/user.viewNavBar.jsx';
import BoardingDetails from './components/boardingDetails.jsx';
import AddBoarding from './pages/admin/addBoarding.jsx';
import Sidebar from './components/Sidebar.jsx';


const Layout = ({ children }) => {
  return (
    <>
      <UserviewNavBar />
      <main>{children}</main>
    </>
  );
};

const LayoutWithSidebar = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar only for AddBoarding page */}
      <div className="flex-1">{children}</div>
    </div>
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
                    <Route path="/addboarding" element={<LayoutWithSidebar><AddBoarding /></LayoutWithSidebar>} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;