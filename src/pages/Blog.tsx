import { Header } from "../components/Header";
import { BlogPost } from "../components/BlogPost";
import { blogPosts } from "../testData";
import "./blog.css";

export function Blog() {
  return (
    <>
      <title>Blog!</title>
      <Header></Header>
      {blogPosts.map((post, index) => (
        <BlogPost
          key={index}
          title={post.title}
          text={post.text}
          imageSrc={post.imageSrc}
        />
      ))}
    </>
  );
}
