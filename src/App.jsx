import './App.css'
import { Routes, Route, Link} from "react-router-dom"
import LoginPage from './loginPage.jsx'
import PlanetsPage from './planetsPage.jsx'

const App = () => {
  

  return (
    <>
     <div id="container">
      <div id= "navbar">

        <Link to = '/'>Home</Link>
        <Link to = '/planets'>Planets</Link>
        <Link to = '/login'>Login</Link>

      </div>
    </div>

    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="planets" element={<PlanetsPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
    </Routes>

      <h1>Welcome to PlanetsRUs! </h1>


    </>
  )
}

export default App
