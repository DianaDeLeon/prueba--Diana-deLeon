import { BrowserRouter,Route,Routes} from "react-router-dom";
import ShowEmpleado from './componentes/ShowEmpleado';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<ShowEmpleado></ShowEmpleado>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
