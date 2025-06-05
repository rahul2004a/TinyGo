import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import { getApps } from '/src/utils/Helper'

function App() {
  const CurrentApp = getApps();

  return (
    <Router>
      <CurrentApp />
    </Router>
  )
}

export default App
