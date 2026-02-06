import { HomePage } from "./pages/HomePage";
import { Blog } from "./pages/Blog";
import { StateManagement } from "./pages/StateManagement";
import { UseEffects } from "./pages/UseEffects";

import { Routes, Route } from "react-router";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />}/>
      <Route path="/blog" element={<Blog />}/>
      <Route path="/stateman" element={<StateManagement/>}/>
      <Route path="/usefx" element={<UseEffects/>}/>

    </Routes>
  );
}

export default App;
