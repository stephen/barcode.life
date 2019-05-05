import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import JsBarcode from "jsbarcode";

const App: React.FC = () => {
  const svgRef = useRef(null);

  const [value, setValue] = useLocalStorageState("barcode", "");
  const [err, setError] = useState("" as string | undefined);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    try {
      JsBarcode(svgRef.current, value, {
        format: "CODE39",
      });
      setError(undefined);
    } catch (err) {
      setError(`Failed to create barcode: ${err}`);
    }
  }, [svgRef, value]);

  return (
    <div className="App">
      <div>
        <input
          value={value}
          onChange={evt => setValue(evt.currentTarget.value)}
        />
      </div>
      {err ? <div>{err}</div> : undefined}
      <div>{value ? <svg ref={svgRef} /> : undefined}</div>
    </div>
  );
};

function useLocalStorageState(
  localStorageKey: string,
  initialValue: string,
): [string, (v: string) => void] {
  const [value, setValue] = useState(initialValue);

  let returnValue = value;
  const lsValue = localStorage.getItem(localStorageKey);
  if (lsValue !== null) {
    returnValue = lsValue;
  }

  return [
    returnValue,
    (v: string) => {
      localStorage.setItem(localStorageKey, v);
      setValue(v);
    },
  ];
}

export default App;
