import Web3 from "web3";
import React, { useState, useEffect } from "react";
import {
  ABI,
  CONTRACT_ADDRESS
} from "./constants/data";
import { ReactComponent as Setting } from "./assets/images/setting.svg";
import { ReactComponent as ArrowDown } from "./assets/images/arrow-down.svg";
import { Dropdown, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/index.css";

function App() {
  const [errorState, setErrorState] = useState(false);
  const [account, setAccount] = useState(null);
  const [allowance, setAllowance] = useState(0);
  const [decimals, setDecimals] = useState(1);
  const [loading, setLoading] = useState(false);
  const [OT, setOT] = useState(0);
  const [YT, setYT] = useState(0);
  const [usdc, setUsdc] = useState(0);

  const mint = async () => {
    hexContract()
      .methods.mint(usdc)
      .send({
        from: account,
      })
      .on("transactionHash", async (hash) => {
        toast.success("Swap in progress", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .on("receipt", async (receipt) => {
        toast.success("Swap complete", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .on("error", async (error) => {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log("error", error);
      });
  };

  const getApproval = async () => {
    await hexContract()
      .methods.approve(
        CONTRACT_ADDRESS,
        (Math.pow(10, decimals) * usdc).toString()
      )
      .send({ from: account })
      .on("transactionHash", async (hash) => {
        toast.error("USDC spend approval processing", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .on("receipt", async (receipt) => {
        mint();
        toast.success("USDC spend approval successful", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .on("error", async (error) => {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log("error", error);
      });
  };
 

 
  const hexContract = () => {
    return new window.web3.eth.Contract(ABI, CONTRACT_ADDRESS);
  };

  const web3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      return true;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      return true;
    } else {
      setErrorState(true);
      toast.error("Whoops..., Metamask is not connected.");
      return false;
    }
  };

  const accounts = async () => {
    const accounts = await window.web3.eth.getAccounts();
    setAccount(accounts[0]);
    return accounts;
  };

  const metamask = async () => {
    let isConnected = false;

    try {
      setErrorState(false);

      isConnected = await web3();

      if (isConnected === true) {
        toast.success("Wallet connected", {
          position: toast.POSITION.TOP_RIGHT,
        });

        const web3 = window.web3;

        let _accounts = await accounts();

        window.ethereum.on("accountsChanged", async (account) => {
          setAccount(account);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCommision = async (e) => {
    setUsdc(e.target.value);

   
  };
 
  return (
    <div className="w-100 overflow-hidden " style={{ background: "#FEFEFF" }}>
      <ToastContainer />
      <header className="container-fluid header-section overflow-hidden">
        <nav className="navbar navbar-expand custom-nav-container">
          <ul className="navbar-nav me-auto ms-auto d-flex align-items-end">
            <li className="nav-item">
              <a className="nav-link header-link" href="#">
              Mint
              </a>
            </li>
            <li className="nav-item">
              <a className=" nav-link header-link-unselected"
              //  href="https://github.com/Pehon1/pendle-swapper" 
               target="_blank">
                Redeem
              </a>
            </li>
          </ul>
          <button className="header-connect-btn" onClick={() => metamask()}>
            {account
              ? `${account.slice(0, 4)}...${account.slice(
                  account.length - 4,
                  account.length
                )}`
              : "Connect Wallet"}
          </button>
        </nav>
      </header>
      <div className="row p-5">
        <div className="card-container d-flex justify-content-center align-items-center mt-5 col-12 ">
          <div className="card d-flex justify-content-center align-items-center">
            <div className="card-body col-11">
              <div className="row">
                <div className="col-6 me-auto">
                  <span>
                    <b>Mint</b>
                  </span>
                </div>
                {/* <div className="col-6 ms-auto d-flex px-4 justify-content-end">
                  <span>
                    <Setting />
                  </span>
                </div> */}
              </div>
              <div className="row swap-heading">
                <div className="col-12">
                  <span> YalaHEX</span>
                </div>
              </div>
            

              <div className="stake-container bg-light">
                <div className="row">
                  <div className="col-12">
                    <span>Amount</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 py-3 d-flex align-items-center">
                    <input
                      type="number"
                      style={{ width: "100%" }}
                      id="quantity"
                      name="quantity"
                      value={usdc}
                      onChange={(e) => {
                        getCommision(e);
                      }}
                    />
                  </div>
                 
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  {account ? (
                    <button
                      className="card-connect-btn"
                      onClick={
                       getApproval
                      }
                    >
                      {allowance >= usdc ? "Swap" : "Approve"}
                    </button>
                  ) : (
                    <button className="card-connect-btn" onClick={metamask}>
                      Connect wallet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
