const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
  };
  
  // header container
  ScrollReveal().reveal(".header__icons", {
    ...scrollRevealOption,
  });
  
  ScrollReveal().reveal(".header__container h1", {
    ...scrollRevealOption,
    delay: 500,
  });
  ScrollReveal().reveal(".header__container a", {
    ...scrollRevealOption,
    delay: 1000,
  });
  ScrollReveal().reveal(".header__container .crew h4", {
    ...scrollRevealOption,
    delay: 1500,
  });
  
  // about container
  ScrollReveal().reveal(".about__container .about__image", {
    ...scrollRevealOption,
    origin: "left",
  });
  
  ScrollReveal().reveal(".about__container .about__image.image__1", {
    ...scrollRevealOption,
    origin: "right",
  });
  
  ScrollReveal().reveal(".about__content", {
    ...scrollRevealOption,
    delay: 500,
  });
  
  // cast container
  ScrollReveal().reveal(".cast__card", {
    ...scrollRevealOption,
    interval: 500,
  });
  
  // media container
  ScrollReveal().reveal(".media__card", {
    ...scrollRevealOption,
    interval: 500,
  });
  
  // Navbar functionality
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.querySelector('.nav__menu');
  
  // Toggle menu
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.querySelector('i').classList.toggle('ri-menu-line');
    navToggle.querySelector('i').classList.toggle('ri-close-line');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle.querySelector('i').classList.add('ri-menu-line');
      navToggle.querySelector('i').classList.remove('ri-close-line');
    }
  });
  
  // Smooth scroll for nav links
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        navMenu.classList.remove('active');
        navToggle.querySelector('i').classList.add('ri-menu-line');
        navToggle.querySelector('i').classList.remove('ri-close-line');
        
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add this to your app.js file
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorOutline = document.createElement('div');
cursorOutline.className = 'custom-cursor-outline';
document.body.appendChild(cursorOutline);

document.addEventListener('mousemove', (e) => {
    // Update cursor position
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Update outline position with smooth animation
    cursorOutline.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, {
        duration: 500,
        fill: "forwards"
    });
});

// Add hover effect for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .nav__link, .cast__card, .gallery__grid img, .connect__socials a, .nav__btn');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorOutline.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorOutline.classList.remove('cursor-hover');
    });
});

// Add click effect
document.addEventListener('mousedown', () => {
    cursor.classList.add('cursor-clicking');
    cursorOutline.classList.add('cursor-outline-clicking');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('cursor-clicking');
    cursorOutline.classList.remove('cursor-outline-clicking');
});

// Hide cursor when leaving the window
document.addEventListener('mouseout', () => {
    cursor.style.display = 'none';
    cursorOutline.style.display = 'none';
});

document.addEventListener('mouseover', () => {
    cursor.style.display = 'block';
    cursorOutline.style.display = 'block';
});