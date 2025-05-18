import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "../src/index.css";
// import Home from '../src/pages/home.jsx'; 
import SearchAdd from '../src/pages/ad Management/searchAdd.jsx'; 
import UserviewNavBar from '../src/components/user.viewNavBar.jsx'; 
import BoardingDetails from '../src/components/boardingDetails.jsx'; 
import AddBoarding from './pages/ad Management/owner/addAdvertisement.jsx'; 
import Pending from './pages/ad Management/owner/pending.jsx';  
import Sidebar from './components/OwnerSidebar.jsx'; 
import AdminSidebar from './components/AdminSidebar.jsx';
import PendingApproval from './pages/ad Management/admin/PendingApproval.jsx';
import MyAdvertisements from './pages/ad Management/owner/MyAdvertisements.jsx'; 
import RejectedListings from './pages/ad Management/owner/rejectedListings.jsx';
import Reports from '../src/pages/ad Management/owner/reports.jsx'
import HomePage from '../src/pages/home.jsx';
import LoginPage from '../src/pages/LoginPage.jsx';
import PaymentForm from './pages/finance/PaymentForm.jsx';
// import SubmissionModal from './pages/finance/SubmissionModal.jsx';
import OwnerPaymentManagement from './pages/finance/Admin/OwnerPaymentManagement.jsx';
import EditAdvertisement from './pages/ad Management/owner/editAdvertisement.jsx';

// Layout component that includes the navbar

const Layout = ({ children }) => {
  return (
    <>
      <UserviewNavBar />
      <main>{children}</main>
    </>
  );
};

const LayoutWithAdminSidebar = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 p-6">{children}</div>
    </div>
  );
};


const LayoutWithSidebar = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-6">{children}</div>
    </div>
  );
};


const App = () => {
    return (
        <Router>
            <div >
                {/* <h1>App Root</h1> */}
                <Routes>
                    <Route path="/" element={ <Layout> <HomePage /> </Layout> } /> 
                    <Route path="/searchadd" element={<Layout> <SearchAdd /></Layout>} /> 
                    <Route path="/advertisement/:id" element={<Layout> <BoardingDetails /> </Layout>} /> 
                    <Route path="/login" element={<LoginPage/>} />

                    {/* owner dashboard */}
                    <Route path="/addAds" element={<LayoutWithSidebar><AddBoarding /></LayoutWithSidebar>} />
                    <Route path="/advertisement/:id" element={<BoardingDetails />} />
                    <Route path="/myAds" element={<LayoutWithSidebar><MyAdvertisements /></LayoutWithSidebar>} /> 
                    <Route path="/Pending" element={<LayoutWithSidebar><Pending/></LayoutWithSidebar>} />
                    <Route path="/rejected" element={<LayoutWithSidebar><RejectedListings /></LayoutWithSidebar>} /> 
                    <Route path="/edit-ad/:id" element={<LayoutWithSidebar><EditAdvertisement /></LayoutWithSidebar>} />

                   
                    <Route path="/payment/:adId" element={<LayoutWithSidebar><PaymentForm /></LayoutWithSidebar>} />
                    {/* admin dashboard */}
                   
                    <Route path="/pendingApprovals" element={<LayoutWithAdminSidebar><PendingApproval /></LayoutWithAdminSidebar>} />
                    <Route path="/reports" element={<LayoutWithAdminSidebar><Reports /></LayoutWithAdminSidebar>} /> 
                    <Route path="/allPayments" element={<LayoutWithAdminSidebar><OwnerPaymentManagement /></LayoutWithAdminSidebar>} />   

                   

                </Routes>
            </div>
        </Router>
    );
};

export default App;