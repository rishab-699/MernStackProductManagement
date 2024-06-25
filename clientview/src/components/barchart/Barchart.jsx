import React, { useState, useEffect, useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function Barchart({ barchartData }) {
  const [dataSet, setDataSet] = useState([]);
  const [countVal, setCountVal] = useState([]);

  useEffect(() => {
    if (barchartData) {
      const dataArray = Object.values(barchartData);
      let xAxisData = [];
      let countValues = [];

      for (let i = 0; i < dataArray.length; i++) {
        const currentElement = dataArray[i];
        let element;

        if (i < dataArray.length - 1) {
          const nextElement = dataArray[i + 1];
          element = `${currentElement._id}-${nextElement._id}`;
        } else {
          element = `${currentElement._id}-Above`;
        }
        xAxisData.push(element);
        countValues.push(currentElement.count);
      }

      setDataSet(xAxisData);
      setCountVal(countValues);
    }
  }, [barchartData]);

  return (
    <div>
      {countVal.length > 0 && (
        <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: dataSet,
              scaleType: 'band',
            },
          ]}
          series={[
            {
              data: countVal,
            },
          ]}
          width={1200}
          height={400}
        />
      )}
    </div>
  );
}
