import React from 'react';

const DownloadCSV = ({ data, fileName }) => {
  
  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    // Extract the keys (headers) from the first object
    const headers = Object.keys(array[0]);
    str += headers.join(',') + '\r\n';

    // Iterate over each object in the array
    for (let i = 0; i < array.length; i++) {
      let line = '';
      
      for (let index in array[i]) {
        if (line !== '') line += ',';

        // Check if the value is an object, convert it to JSON string if true
        const value = typeof array[i][index] === 'object' ? JSON.stringify(array[i][index]) : array[i][index];
        line += value;
      }
      str += line + '\r\n';
    }
    return str;
  };

  const downloadCSV = () => {
    const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className="btn btn-outline-success btn-sm ms-2" onClick={downloadCSV}>Download CSV</button>
  );
};

export default DownloadCSV;
