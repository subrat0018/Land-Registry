
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Web3Context from "../contexts";
import { getAllrequests,getLand, } from "../contexts/useContract/readContract";
import { approve } from "../contexts/useContract/writeContract";

import Navbar from "../Components/Navbar";



export default function Requests() {
  const [data, setdata] = useState(null);
  const {Contract,account} = useContext(Web3Context)

  useEffect(()=>{
    getAllrequests(Contract).then(data=>{
        const temp = data.filter(data.currOwner === account.currentOwner);
        setdata(temp);
        
        
    })
  })
  const handleApprove = (reqId,approvedOwner)=>{
        approve(reqId,approvedOwner).then(res=>alert("Approved"))
  }
  //Requesting All the appointments of the Execs to Display
 

  return (
    <>
    <Navbar></Navbar>
      <div class="mx-10 mt-5 relative overflow-x-auto shadow-md rounded-t-md">

        <div className="text-lg font-bold mt-7">Requests by Interested Party to Approve</div>
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-t-md">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 rounded-t-md dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
               Land Id
              </th>
              <th scope="col" class="px-6 py-3">
                Land Name
              </th>
              <th scope="col" class="px-6 py-3">
                Bid Amount
              </th>
              <th scope="col" class="px-6 py-3">
               Bid By
              </th>
              <th scope="col" class="px-6 py-3">
              Action
              </th>
            </tr>
          </thead>
          {data &&
            data.map((res) => {
              const {bid,reqId,id,state,wallet} = res;
              let land = 0;
              getLand(Contract,id).then(lan=>{
                land = lan;
              })
              return (
                <tbody>
                  <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {land && land.id}
                    </th>
                    <td class="px-6 py-4">{land.name}</td>
                    <td class="px-6 py-4">
                     
                    </td>
                    <td class="px-6 py-4">{bid}</td>
                    <td class="px-6 py-4">{wallet} Hrs</td>
                    <td class="px-6 py-4">
                     
                        <button
                          onClick={() => handleApprove(reqId,wallet)}
                          class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Approve
                        </button>
                      
                    </td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </div>
    </>
  );
}
