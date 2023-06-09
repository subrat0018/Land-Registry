import React, { useEffect, useContext } from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Home from "./Pages/Home";
import AddLand from "./Pages/AddLand";
import SellLand from "./Pages/SellLand";
import BuyLand from "./Pages/BuyLand";
import DashBoard from "./Pages/DashBoard";
import MapContainer from "./Components/MapContainer";
import Preview from "./Pages/Preview";
import MyLands from "./Pages/MyLands"


// import Maptest from "./Components/Maptest/Maptest";

// import Map from "./Components/Maptest/Map";
import Input from "./Components/Input";
import Web3Context from "./contexts";
import Requests from "./Pages/Requests";
import Mybids from "./Pages/Mybids";

const App = () => {
  const { checkIfWalletIsConnected, Contract,account } = useContext(Web3Context);
  window.ethereum &&
    window.ethereum.on("accountsChanged", function (accounts) {
      setTimeout(window.location.reload(false), 1000);
    });
  // console.log(Contract)
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addLand" element={<AddLand />} />
        <Route path="/buy-land" element={<BuyLand />} />
        <Route path="/sell-land" element={<SellLand />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/:id/preview" element={<Preview />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/mylands" element={<MyLands />} />
        <Route path="/mybids" element={<Mybids />} />
      </Routes>
    </>
  );
};

export default App;
