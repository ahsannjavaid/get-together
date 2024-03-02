import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import UIKit from "./components/VideoCall/Kits/UIKit";
import SDK from "./components/VideoCall/Kits/SDK";
import Error from "./components/Error/Error";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/sdk" element={<SDK />} />
        <Route path="/ui-kit" element={<UIKit />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
