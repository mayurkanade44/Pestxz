import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
  Landing,
  Dashboard,
  Error,
  Report,
  RegisterClient,
  Stats,
  SingleClient,
} from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Stats />} />
          <Route path="add-client" element={<RegisterClient />} />
          <Route path="report" element={<Report />} />
          <Route path="client/:id" element={<SingleClient />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
