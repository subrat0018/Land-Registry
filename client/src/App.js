import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Home from "./Pages/Home";
import BuySell from "./Pages/BuySell";
import SellLand from "./Pages/SellLand";
import BuyLand from "./Pages/BuyLand";
import DashBoard from "./Pages/DashBoard";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/buy-sell" element={<BuySell />} />
      <Route path="/buy-land" element={<BuyLand />} />
      <Route path="/sell-land" element={<SellLand />} />
      <Route path="/dashboard" element={<DashBoard/>}/>
    </Routes>
  );
};

export default App;