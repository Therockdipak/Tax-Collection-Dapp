import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./contract/TaxCollection.json";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [taxAmount, setTaxAmount] = useState(0);
  const [taxCollector, setTaxCollector] = useState();
  const [taxPayerBalance, setTaxPayerBalance] = useState(0);
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();

  useEffect(() => {
    async function connectToBlockchain() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const contractABI = abi.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const taxAmount = await contract.taxAmount();
      const taxCollector = await contract.taxCollector();
      const taxPayerBalance = await contract.getBalance(signer.getAddress());

      if (taxAmount != null) {
        setTaxAmount(taxAmount.toString());
      }
      setTaxCollector(taxCollector);
      setTaxPayerBalance(taxPayerBalance.toString());
      setProvider(provider);
      setContract(contract);
    }
    connectToBlockchain();
  }, [provider]);

  //  paying Taxex
  async function payTax() {
    if (contract != null && taxAmount > 0) {
      const amount = ethers.utils.parseEther(taxAmount.toString());
      try {
        const accounts = await provider.listAccounts();
        const sender = accounts[0];
        const receiver = taxCollector;
        const overrides = {
          value: amount,
          gasPrice: ethers.utils.parseUnits("20", "gwei"),
          gasLimit: 200000,
        };
        const tx = await contract.payTax(receiver, overrides);
        await tx.wait();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <Navbar title="Home" bc="Contact" new="HRD" abc="Finance" />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card shadow-lg border-0">
              <div className="card-body">
                <h1
                  className="card-title text-center mb-4"
                  style={{ color: "#198754" }}
                >
                  Tax Collection Dapp
                </h1>
                <h3
                  className="card-subtitle text-center mb-4"
                  style={{ color: "#0d6efd" }}
                >
                  Pay Your Taxes Here
                </h3>
                <p className="card-text mb-4"></p>
                <div
                  style={{
                    backgroundColor: "#0d6efd",
                    borderRadius: "3px",
                    padding: "0.5rem",
                  }}
                >
                  <p style={{ color: "#fff", margin: 0 }}>
                    Tax amount: {taxAmount} ETH
                  </p>
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "2rem" }}>
                    {taxCollector}
                  </h3>
                </div>
                <p></p>
                <div
                  style={{
                    backgroundColor: "#0d6efd",
                    borderRadius: "3px",
                    padding: "0.5rem",
                  }}
                >
                  <p style={{ color: "#fff", margin: 0 }}>
                    Tax collector: Gov. of India
                  </p>
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "2rem" }}>
                    {taxCollector}
                  </h3>
                </div>
                <p></p>
                <div
                  style={{
                    backgroundColor: "#0d6efd",
                    borderRadius: "3px",
                    padding: "0.5rem",
                  }}
                >
                  <p style={{ color: "#fff", margin: 0 }}>Your balance: ETH</p>
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "2rem" }}>
                    {taxCollector}
                  </h3>
                </div>
                <p></p>
                <div
                  style={{
                    backgroundColor: "#0d6efd",
                    borderRadius: "3px",
                    padding: "0.5rem",
                  }}
                >
                  <label htmlFor="taxAmount" style={{ color: "#fff" }}>
                    Enter Tax Amount (in ETH)
                  </label>
                  <input
                    type="number"
                    id="taxAmount"
                    className="form-control"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-primary btn-lg px-5"
                    onClick={async () => {
                      // window.ethereum.request({ method: "eth_requestAccounts"})
                      const tx = await contract.payTax();
                      await tx.wait();
                    }}
                    disabled={taxAmount === 0}
                  >
                    Pay Tax
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
