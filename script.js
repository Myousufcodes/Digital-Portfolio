// Theme Management
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'default';

document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

// Theme toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Smooth Scrolling for both desktop and mobile
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            
            // Update mobile nav active state
            updateMobileNav(this.getAttribute('href'));
        }
    });
});

// Update mobile nav active state
function updateMobileNav(href) {
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === href) {
            item.classList.add('active');
        }
    });
}

// Mobile nav click handlers
document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', function() {
        updateMobileNav(this.getAttribute('href'));
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active section for mobile nav
    updateActiveSection();
});

// Update active section based on scroll position
function updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    // Update mobile nav
    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });

    // Update desktop nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Special case for home
    if (window.scrollY < 100) {
        document.querySelector('.nav-link[href="#home"]').classList.add('active');
        document.querySelector('.mobile-nav-item[href="#home"]').classList.add('active');
    }
}

// Animate Skills on Scroll
const skillBars = document.querySelectorAll('.skill-bar');

function animateSkills() {
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        const rect = bar.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isInView && !bar.classList.contains('animated')) {
            bar.style.width = level + '%';
            bar.classList.add('animated');
        }
    });
}

// Animate Counter Numbers
const counters = document.querySelectorAll('.stat-number');

function animateCounters() {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const rect = counter.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isInView && !counter.classList.contains('animated')) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    counter.classList.add('animated');
                }
                counter.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
            }, 30);
        }
    });
}

// Form Submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', { name, email, message });
    
    // Show success message
    const button = contactForm.querySelector('button');
    const originalText = button.innerHTML;
    
    button.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        contactForm.reset();
    }, 3000);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Touch device improvements
document.addEventListener('touchstart', function() {}, {passive: true});

// Initialize everything
window.addEventListener('DOMContentLoaded', () => {
    updateActiveSection();
    animateSkills();
    animateCounters();
    
    // Update copyright year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Scroll events
window.addEventListener('scroll', () => {
    animateSkills();
    animateCounters();
});

// Handle resize events
window.addEventListener('resize', () => {
    // Recalculate anything that might need it
});
 // Formspree submit (inline success/error)
      const form = document.getElementById("contactForm");
      const statusEl = document.getElementById("formStatus");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        statusEl.textContent = "Sending...";
        try {
          const res = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
          });
          if (res.ok) {
            form.reset();
            statusEl.textContent = "Thanks! Your message was sent.";
          } else {
            const data = await res.json();
            statusEl.textContent =
              (data.errors || []).map((x) => x.message).join(" ") ||
              "Something went wrong.";
          }
        } catch {
          statusEl.textContent = "Network error. Try again.";
        }
      });