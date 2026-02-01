function switchMenu() {
        document.getElementById("dropdown").classList.toggle("show");
}

const home = document.getElementById('home-btn');
home.addEventListener('click', () => {
        document.getElementById("intro").scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
});

const projects = document.getElementById('projects-btn');
projects.addEventListener('click', () => {
        document.getElementById('proj').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
});

const skills = document.getElementById('skills-btn');
skills.addEventListener('click', () => {
        console.log("shite");
        document.getElementById("skill").scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });

});

function openPopup() {
  document.getElementById("contact-popup").style.display = "block";
}

function closePopup() {
  document.getElementById("contact-popup").style.display = "none";
}

const contact = document.getElementById('contact-btn');
skills.addEventListener('click', () => {
        console.log("shit");
        openPopup();
});
