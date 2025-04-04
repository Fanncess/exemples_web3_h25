import { useEffect, useState } from "react";

export function Timer() {
    const [compte, setCompte] = useState(0);
  const [bond, setBond] = useState(1);

  useEffect(() => {
    let annule = false;
    const intervalId = setInterval(() => {
      if (annule) {
        return;
      }
      setCompte((c) => c + bond);
    }, 1000);

    return () => {
      annule = true;
      clearInterval(intervalId);
    }
  }, [bond])

  return(
    <>
      <h1>{compte}</h1>
      <input type="number" value={bond} onChange={(e) => setBond(+e.target.value)} />
    </>
  );
}