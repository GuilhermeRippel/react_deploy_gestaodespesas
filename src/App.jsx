import './App.css'
import  Cadastro  from './pages/cadastro/index'
import Login from './pages/login/index'
import Main from './pages/main/index'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import PrivateRoute from './components/privateRoute'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Cadastro/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/main" 
          element={<PrivateRoute element={<Main/>}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
