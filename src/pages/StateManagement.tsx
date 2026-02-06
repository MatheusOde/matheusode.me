import { useReducer, useState } from "react";
import "./stateMan.css";

export function StateManagement() {
  //Use state
  const [name, setName] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const [isVisible, setIsVisible] = useState(false);

  // Use reducer
  const reducer = (state: number, action: string) => {
    switch (action) {
      case "increment":
        return state + 1;
      case "decrement":
        return state - 1;
      default:
        return state;
    }
  };
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <main className="container">
      <h1>State Management Playground</h1>

      <section className="card">
        <label>
          Name
          <input
            name="name"
            placeholder="John Doe"
            type="text"
            value={name}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input name="email" placeholder="john@email.com" />
        </label>

        <label>
          Age
          <input name="age" type="number" />
        </label>

        <div className="actions"></div>
      </section>
      <button
        onClick={() => {
          setIsVisible(!isVisible);
          dispatch("increment");
        }}
      >
        Toggle Btn
      </button>
      <>{isVisible && <div>Content to show: {count}</div>}</>
      <button
        onClick={() => {
          dispatch("decrement");
        }}
      >
        Decrement BTN
      </button>
      <section className="card debug">
        <h2>Live State</h2>
        <p>Result: {name}</p>
      </section>
    </main>
  );
}
