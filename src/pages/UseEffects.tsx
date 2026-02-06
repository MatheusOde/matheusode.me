import {
  useEffect,
  useLayoutEffect,
  useInsertionEffect,
  useState,
} from "react";
import "./useEffects.css";

export function UseEffects() {
  useInsertionEffect(() => {
    console.log("useInsertionEffect → before DOM mutations");

    const style = document.createElement("style");
    style.textContent = `
      .insertion-effect {
        border: 2px dashed #38bdf8;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [layoutCount, setLayoutCount] = useState(0);
  useLayoutEffect(() => {
    console.log("useLayoutEffect → after DOM mutation, before paint");

    const box = document.getElementById("layout-box");
    if (box) {
      box.textContent = "Updated in useLayoutEffect";
    }
    document.title = `You clicked ${layoutCount} times`;

  }, [layoutCount]);

  const [count, setCount] = useState(0);
  useEffect(() => {
    //document.title = `You clicked ${count} times`;
  }, [count]);
  return (
    <main className="container insertion-effect">
      <h1>React Effects Playground</h1>

      <section className="card">
        <p>
          This page has <strong>no interactions</strong>. Open DevTools →
          Console and observe execution order.
        </p>
      </section>

      <section className="card">
        <h2>useLayoutEffect</h2>
        <div id="layout-box" className="box">
          Initial content
        </div>
        <button onClick={() => setLayoutCount(count + 1)}>Click this</button>
      </section>

      <section className="card">
        <h2>useEffect</h2>
        <div id="effect-box" className="box">
          Initial content
        </div>
        <button onClick={() => setCount(count + 1)}>Click this</button>
      </section>

      <section className="card">
        <h2>Static State</h2>
        <p>Count value: {count}</p>
      </section>
    </main>
  );
}
