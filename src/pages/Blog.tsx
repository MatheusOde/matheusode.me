import { Header } from "../components/Header";
import "./blog.css";

export function Blog() {
  return (
    <>
      <title>Blog!</title>
      <Header></Header>
      <div className="article">
        <div className="thumbnail">
          <img src="" alt="" />
        </div>
        <div className="title">
          <h1>Título</h1>
        </div>
        <div className="text">
          <p>Texto</p>
        </div>
      </div>
    </>
  );
}
