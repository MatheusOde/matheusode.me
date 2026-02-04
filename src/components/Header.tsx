import "./header.css";
function openPopup() {
  document.getElementById("contact-popup").style.display = "block";
}

function closePopup() {
  document.getElementById("contact-popup").style.display = "none";
}
function switchMenu() {
  document.getElementById("dropdown").classList.toggle("show");
}

export function Header() {
  return (
    <>
      <div className="navigation-bar">
        <div className="logo">
          <a> MatheusOde </a>
        </div>
        <div className="menu">
          <a href="#introduction" id="home-btn">
            Home
          </a>
          <a href="#projects" id="projects-btn">
            Projects
          </a>
          <a href="#skills" id="skills-btn">
            Skills
          </a>
          <a href="#" id="blog-btn">
              Blog
            </a>
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
            <a href="#introduction" id="home-btn">
              Home
            </a>
            <a href="#projects" id="projects-btn">
              Projects
            </a>
            <a href="#skills" id="skills-btn">
              Skills
            </a>
            <a href="#" id="blog-btn">
              Blog
            </a>
            <a href="#" id="contact-btn">
              Contact
            </a>
          </div>
        </button>
      </div>
    </>
  );
}
