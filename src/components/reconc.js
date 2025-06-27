import React, { useState } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReconciliationTool = () => {
  const [internalData, setInternalData] = useState([]);
  const [providerData, setProviderData] = useState([]);
  const [matched, setMatched] = useState([]);
  const [internalOnly, setInternalOnly] = useState([]);
  const [providerOnly, setProviderOnly] = useState([]);

  const handleFileUpload = (event, setData) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  const reconcile = () => {
    const internalMap = new Map();
    const matchedTemp = [];
    const internalOnlyTemp = [];
    const providerOnlyTemp = [];

    internalData.forEach((tx) => {
      internalMap.set(tx.transaction_reference, tx);
    });

    const matchedKeys = new Set();

    providerData.forEach((tx) => {
      const match = internalMap.get(tx.transaction_reference);
      if (match) {
        matchedKeys.add(tx.transaction_reference);
        const mismatch = match.amount !== tx.amount || match.status !== tx.status;
        matchedTemp.push({
          ...match,
          _matched: !mismatch,
          _providerAmount: tx.amount,
          _providerStatus: tx.status,
        });
      } else {
        providerOnlyTemp.push(tx);
      }
    });

    internalData.forEach((tx) => {
      if (!matchedKeys.has(tx.transaction_reference)) {
        internalOnlyTemp.push(tx);
      }
    });

    setMatched(matchedTemp);
    setInternalOnly(internalOnlyTemp);
    setProviderOnly(providerOnlyTemp);
  };

  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4">
        <h2 className="mb-4 text-center">🧾 Mini Reconciliation Tool</h2>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Upload Internal CSV</label>
            <input type="file" className="form-control" accept=".csv" onChange={(e) => handleFileUpload(e, setInternalData)} />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Upload Provider CSV</label>
            <input type="file" className="form-control" accept=".csv" onChange={(e) => handleFileUpload(e, setProviderData)} />
          </div>
        </div>

        <div className="text-center mb-4">
          <button onClick={reconcile} className="btn btn-primary w-50">🔍 Reconcile</button>
        </div>

        <div>
          <h4 className="text-success">✅ Matched Transactions ({matched.length})</h4>
          <button className="btn btn-outline-success btn-sm mb-2" onClick={() => exportCSV(matched, 'matched.csv')}>Export CSV</button>
          <ul className="list-group mb-4">
            {matched.map((tx, idx) => (
              <li
                key={idx}
                className={`list-group-item ${tx._matched ? 'text-success' : 'text-warning fw-bold'}`}
              >
                {tx.transaction_reference} - Amount: {tx.amount} vs {tx._providerAmount} | Status: {tx.status} vs {tx._providerStatus}
              </li>
            ))}
          </ul>

          <h4 className="text-warning">⚠️ Internal Only ({internalOnly.length})</h4>
          <button className="btn btn-outline-warning btn-sm mb-2" onClick={() => exportCSV(internalOnly, 'internal_only.csv')}>Export CSV</button>
          <ul className="list-group mb-4">
            {internalOnly.map((tx, idx) => (
              <li key={idx} className="list-group-item">
                {tx.transaction_reference} - Amount: {tx.amount}
              </li>
            ))}
          </ul>

          <h4 className="text-danger">❌ Provider Only ({providerOnly.length})</h4>
          <button className="btn btn-outline-danger btn-sm mb-2" onClick={() => exportCSV(providerOnly, 'provider_only.csv')}>Export CSV</button>
          <ul className="list-group">
            {providerOnly.map((tx, idx) => (
              <li key={idx} className="list-group-item">
                {tx.transaction_reference} - Amount: {tx.amount}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationTool;
