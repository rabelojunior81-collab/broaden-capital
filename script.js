document.body.classList.add('js-enabled');

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
const progressLine = document.getElementById('progress-line');
const menuButton = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');
const menuOverlay = document.getElementById('menu-overlay');
const form = document.getElementById('contact-form');

let particles = [];
let animationFrame;

function particleCount() {
    if (window.innerWidth < 640) return 42;
    if (window.innerWidth < 980) return 64;
    return 92;
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
}

class Particle {
    constructor() {
        this.reset(true);
    }

    reset(randomizeY = false) {
        this.x = Math.random() * canvas.width;
        this.y = randomizeY ? Math.random() * canvas.height : canvas.height + 20;
        this.size = Math.random() * 1.9 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.26;
        this.speedY = -(Math.random() * 0.34 + 0.08);
        this.alpha = Math.random() * 0.55 + 0.18;
        this.tint = Math.random() > 0.68 ? '255,90,69' : '255,255,255';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < -24 || this.x < -24 || this.x > canvas.width + 24) this.reset(false);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.tint}, ${this.alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgba(${this.tint}, ${Math.min(this.alpha + 0.15, 0.8)})`;
        ctx.fill();
    }
}

function createParticles() {
    particles = Array.from({ length: particleCount() }, () => new Particle());
}

function connectParticles() {
    for (let a = 0; a < particles.length; a += 1) {
        for (let b = a + 1; b < particles.length; b += 1) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 118) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 90, 69, ${0.08 * (1 - distance / 118)})`;
                ctx.lineWidth = 0.55;
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });
    connectParticles();
    animationFrame = requestAnimationFrame(animateParticles);
}

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressLine.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function toggleMenu(forceState) {
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !navMenu.classList.contains('is-open');
    navMenu.classList.toggle('is-open', shouldOpen);
    menuOverlay.classList.toggle('is-open', shouldOpen);
    menuButton.classList.toggle('is-active', shouldOpen);
    menuButton.setAttribute('aria-expanded', String(shouldOpen));
    document.body.classList.toggle('menu-open', shouldOpen);
}

function setupReveal() {
    const items = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach((item) => observer.observe(item));
}

function setupInteractions() {
    menuButton.addEventListener('click', () => toggleMenu());
    menuOverlay.addEventListener('click', () => toggleMenu(false));
    document.querySelectorAll('.nav-link-item').forEach((link) => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrame);
        resizeCanvas();
        animateParticles();
        updateProgress();
    });

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Protótipo demonstrativo: para contato real, utilize contato@broadencapital.com.br ou o telefone institucional informado.');
        });
    }
}

resizeCanvas();
setupReveal();
setupInteractions();
updateProgress();
animateParticles();
