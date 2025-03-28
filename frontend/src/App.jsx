import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./index.css";
import Home from './pages/boardingSeeker/Home.jsx'; 
import SearchAdd from './pages/boardingSeeker/searchAdd.jsx'; 
import UserviewNavBar from './components/user.viewNavBar.jsx';
import BoardingDetails from './components/boardingDetails.jsx';
import AddBoarding from './pages/admin/addBoarding.jsx';
import Sidebar from './components/Sidebar.jsx';

import PendingApproval from './pages/admin/PendingApprovel.jsx';
import MyBordings from './pages/admin/Mybordings.jsx';
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
                    <Route path="/pendingapproval" element={<LayoutWithSidebar><PendingApproval /></LayoutWithSidebar>} /> {/* PendingApproval at /pendingapproval */}
                    <Route path="/mybordings" element={<LayoutWithSidebar><MyBordings /></LayoutWithSidebar>} /> {/* MyBordings at /mybordings */}
                    {/* Add other routes as needed */}

                </Routes>
            </div>
        </Router>
    );
};

export default App;