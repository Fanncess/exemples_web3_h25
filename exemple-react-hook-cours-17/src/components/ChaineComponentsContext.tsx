import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

export function Component1() {
    const { nomComplet } = useContext(UserContext);
  
    return (
      <>
        <h1>{`Hello ${nomComplet}!`}</h1>
        <Component2 />
      </>
    );
  }
  
  function Component2() {
    return (
      <>
        <h1>Component 2</h1>
        <Component3 />
      </>
    );
  }
  
  function Component3() {
    return (
      <>
        <h1>Component 3</h1>
        <Component4 />
      </>
    );
  }
  
  function Component4() {
    return (
      <>
        <h1>Component 4</h1>
        <Component5 />
      </>
    );
  }
  
  function Component5() {
    const { nomComplet } = useContext(UserContext);
  
    return (
      <>
        <h1>Component 5</h1>
        <h2>{`Hello ${nomComplet} again!`}</h2>
      </>
    );
  }