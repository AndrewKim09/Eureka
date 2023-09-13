
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import {Navigate} from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';

function App() {
  return (
    <div className="relative z-0 App">
      <Router>
        <NavBar/>
        <Routes>

          <Route path="/Home" component={Home} />
          <Route path="/" component={<Navigate to="/Home"/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
