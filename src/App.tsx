
import './App.css'
import Logo from './components/Logo'
// import SiteBar from './components/SiteBar'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import PaymentMonitoring from './components/PaymentMonitoring'
import UserManagement from './pages/UserManagement'
import { ProductInventoryPage } from './pages/ProductInventory';
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import OrderManagement from './pages/Order_management'
function App() {

  return (
    <>
    <BrowserRouter>
   
      {/* <SiteBar/> */}
      <Routes>
         <Route path='/' element={<Logo/>} />
         <Route path="/user_management" element={<UserManagement/>}/>
         <Route path='/payment_monitoring' element={<PaymentMonitoring/>} />
         <Route path='/product_managment' element={<ProductInventoryPage/>}/>
                  <Route path='/analytics' element={<AnalyticsDashboard/>}/>
                                    <Route path='/order_management' element={<OrderManagement/>}/>


      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
