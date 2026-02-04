import "./header.css";
import { NavLink } from "react-router";
function openPopup() {
  const popup = document.getElementById("contact-popup");
  if (!popup) return;

  popup.style.display = "block";
}

function closePopup() {
  const popup = document.getElementById("contact-popup");
  if (!popup) return;

  popup.style.display = "none";
}

function switchMenu() {
  const dropdown = document.getElementById("dropdown");
  if (!dropdown) return;

  dropdown.classList.toggle("show");
}

export function Header() {
  return (
    <>
      <div className="navigation-bar">
        <div className="logo">
          <NavLink to="/"> MatheusOde </NavLink>
        </div>
        <div className="menu">
          <NavLink to="/" id="home-btn">
            Home
          </NavLink>
          <NavLink to="/#projects" id="projects-btn">
            Projects
          </NavLink>
          <NavLink to="/#skills" id="skills-btn">
            Skills
          </NavLink>
          <NavLink to="/blog" id="blog-btn">
            Blog
          </NavLink>
          <a id="contact-btn" onClick={openPopup}>
            Contact
          </a>
          <div id="contact-popup" className="popup">
            <span className="close" onClick={closePopup}>
              X
            </span>
            <h1>Contact Information</h1>
            <p>Email: matheusode@gmail.com</p>
            <p>Phone number: +5516994242382</p>
          </div>
        </div>
        <button onClick={switchMenu} className="dropdown-btn">
          <img
            src="/assets/site-UI/menu.svg"
            className="menu-btn"
            alt="menu button"
          />
          <div className="dropdown" id="dropdown">
            <NavLink to="/" id="home-btn">
              Home
            </NavLink>
            <NavLink to="/#projects" id="projects-btn">
              Projects
            </NavLink>
            <NavLink to="/#skills" id="skills-btn">
              Skills
            </NavLink>
            <NavLink to="/blog" id="blog-btn">
              Blog
            </NavLink>
            <a id="contact-btn">Contact</a>
          </div>
        </button>
      </div>
    </>
  );
}
