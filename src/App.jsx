import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import store from "./utils/appStore";
import { Provider } from "react-redux";
import Feed from "./components/Feed";
import Request from "./components/Request";
import SearchPage from "./components/SearchPage";
import Report from "./components/Report";
import AdminPage from "./components/AdminPage"; 

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/request" element={<Request />}></Route>
              <Route path="/search" element={<SearchPage />}></Route>
              <Route path="/report" element={<Report />}></Route>
              <Route path="/admin" element={<AdminPage />}></Route> 
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;