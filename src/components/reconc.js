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
  );
};

export default ReconciliationTool;
