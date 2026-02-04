import "./blogPost.css";

interface BlogPostProps {
  title: string;
  text: string;
  imageSrc: string;
}

export function BlogPost({ title, text, imageSrc }: BlogPostProps) {
  return (
    <>
      <div className="article">
        <div className="thumbnail">
          <img src={imageSrc} alt={title} />
        </div>
        <div className="title">
          <h1>{title}</h1>
        </div>
        <div className="text">
          <p>{text}</p>
        </div>
      </div>
    </>
  );
}
