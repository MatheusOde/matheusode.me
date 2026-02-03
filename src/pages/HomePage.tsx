import "./homePage.css";
import { Header } from "../components/Header";

export function HomePage() {
  return (
    <>
      <section className="intro-section" id="introduction">
        <div className="introduction">
          <div className="intro-elements">
            <img
              src="/assets/other-stuff/photo.jpeg"
              alt="photo"
              className="photo"
            />
            <div className="about">
              <h1 className="about-title">
                About<span>.me</span>
              </h1>
              <p className="about-description">
                Hi! I'm Matheus, a researcher, software engineer and USP
                student. This is a website were I present my projects and
                information regarding my abilities. Hope you like it!
              </p>
            </div>
          </div>
        </div>
      </section>
      <Header />
      <section>
        <div className="story">
          <div className="left-column">
            <div className="interests">
              <h1>My interests</h1>
              <p>
                I am interested mainly in front-end, although I love Artificial
                Inteligence. Robots are the future and I make sure to keep up
                with new artificial inteligence techniques. Love Science and
                everything around it, especially space travel!
              </p>
            </div>
            <div className="objectives">
              <h1>But what are my objectives?</h1>
              <p>
                My main objective right now is exploring my options, I want to
                help people and find myself in the process. That's also a pretty
                cool way to improve myself and get some experience!
              </p>
            </div>
            <div className="personal-development">
              <h1>What I am actually doing right now</h1>
              <p>
                I am actually on a exchange program, and working for Franhofer
                IESE, I am exploring what I can and learning as much as possible
              </p>
            </div>
            <div className="building">
              <h1>Let's build stuff</h1>
              <p>
                I believe that the best way to enhance myself and help others is
                building a new idea or starting a project like developing a site
                for example ;)
              </p>
            </div>
          </div>
          <div className="right-column"></div>
        </div>
      </section>
      <section className="projects-section" id="projects">
        <div className="projects" id="proj">
          <h1>
            Projects I've worked <span>on</span>
          </h1>
          <ul>
            <li className="imagesGrid">
              <img src="assets/projects/matheusode.png" alt="matheusode.me" />
              <p>
                This is the website you're on right now.
                <a
                  href="https://www.github.com/MatheusOde/matheusode.me"
                  target="_blank"
                >
                  {" "}
                  Check the code right here!
                </a>
              </p>
            </li>

            <li className="imagesGrid">
              <img src="assets/projects/skooter.png" alt="skooter" />
              <p>
                This is a game developed in java, from scratch for my OOP class.
                It's called skooter and it's really old!
                <a
                  href="https://github.com/MatheusOde/oldJavaGame"
                  target="_blank"
                >
                  {" "}
                  Check it out here!
                </a>
              </p>
            </li>

            <li className="imagesGrid">
              <img src="assets/projects/eveio.png" alt="eveio" />
              <p>
                This is another website made in vue.js, it was made in a month
                and I had to learn vue.js for the first time in a month.
                <a
                  href="https://github.com/MatheusOde/eCommerce_eVeio"
                  target="_blank"
                >
                  {" "}
                  This project can be found here
                </a>
              </p>
            </li>

            <li className="imagesGrid">
              <img src="assets/projects/pong.png" alt="pong" />
              <p>
                This project is my attempt at making AI's in python to play the
                game in many ways.
                <a
                  href="https://github.com/MatheusOde/pongWithAI"
                  target="_blank"
                >
                  {" "}
                  Click to know more!
                </a>
              </p>
            </li>
          </ul>
        </div>
      </section>
      <section className="last-section" id="skills">
        <div className="skills" id="skill">
          <h1>
            I already <span>use:</span>
          </h1>
          <ul>
            <li className="skillsGrid">
              <img src="/assets/skills/html5.png" alt="HTML5" />
            </li>
            <li className="skillsGrid">
              <img src="/assets/skills/css3.png" alt="CSS3" />
            </li>
            <li className="skillsGrid">
              <img src="/assets/skills/javascript.png" alt="JavaScript" />
            </li>
            <li className="skillsGrid">
              <img src="/assets/skills/vuejs.png" alt="Vue.js" />
            </li>
            <li className="skillsGrid">
              <img src="/assets/skills/c.png" alt="C" />
            </li>
            <li className="skillsGrid">
              <img src="/assets/skills/java.png" alt="Java" />
            </li>
            <li className="skillsGrid">
              <img src="/assets/skills/python.png" alt="Python" />
            </li>
            <li className="skillsGrid">
              <img src="/assets/skills/c++.png" alt="C++" />
            </li>
            <li className="skillsGrid">
              <img src="/assets/skills/github.png" alt="GitHub" />
            </li>
          </ul>
        </div>
      </section>
      <section className="contact-section">
        <div className="contact">
          <div className="socialmedia">
            <a href="https://www.github.com/MatheusOde" target="_blank">
              <img src="assets/skills/github.png" alt="" />
            </a>
            <a
              href="https://www.linkedin.com/in/matheus-odebrecht-b0b0901b3/"
              target="_blank"
            >
              <img src="assets/socials/linkedin.png" alt="" />
            </a>
            <a href="https://www.instagram.com/_matheusode/" target="_blank">
              <img src="assets/socials/instagram.png" alt="" />
            </a>
          </div>
          <div className="smileyface"></div>
        </div>
      </section>
    </>
  );
}
