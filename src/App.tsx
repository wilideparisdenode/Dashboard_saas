
import './App.css'
import Logo from './components/Logo'
import SiteBar from './components/SiteBar'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import PaymentMonitoring from './components/PaymentMonitoring'
function App() {

  return (
    <>
    <BrowserRouter>
    <Logo/>
      <SiteBar/>
      <Routes>
         <Route path='/' element={<Logo/>} />
         <Route path='/payment_monitoring' element={<PaymentMonitoring/>} />
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
