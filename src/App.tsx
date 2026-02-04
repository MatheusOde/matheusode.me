import { HomePage } from "./pages/HomePage";
import { Blog } from "./pages/Blog";
import { Routes, Route } from "react-router";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />}/>
      <Route path="/blog" element={<Blog />}/>
    </Routes>
  );
}

export default App;
