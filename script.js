/* --- 1. Loading Screen --- */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
        initThreeJS(); // Start 3D animation after load
    }, 500);
});

/* --- 2. Custom Cursor Logic --- */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button, .close-modal, input, textarea');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Slight delay for follower
    setTimeout(() => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    }, 50);
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        follower.classList.add('cursor-hover');
    });
    link.addEventListener('mouseleave', () => {
        follower.classList.remove('cursor-hover');
    });
});

/* --- 3. Three.js 3D Hero Section --- */
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000; // Optimal for performance
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15; // Spread
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x64ffda,
        transparent: true,
        opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.001;

        // Interactive movement
        particlesMesh.rotation.y += 0.05 * (mouseX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (mouseY - particlesMesh.rotation.x);

        renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* --- 4. Scroll Animations & Skill Bars --- */
const observerOptions = { threshold: 0.2 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate Progress Bars if the skills section is visible
            if (entry.target.querySelector('.progress')) {
                const bars = entry.target.querySelectorAll('.skill-bar-container');
                bars.forEach(bar => {
                    const percent = bar.getAttribute('data-percent');
                    bar.querySelector('.progress').style.width = percent;
                });
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.hidden-element, #skills').forEach((el) => {
    observer.observe(el);
});

/* --- 5. Project Filtering --- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 100);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

/* --- 6. Modals --- */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal if clicked outside content
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

/* --- 7. Leaflet Map (Hamilton, ON) --- */
// Centered roughly on McMaster University/Hamilton area
const map = L.map('map').setView([43.2609, -79.9192], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([43.2609, -79.9192]).addTo(map)
    .bindPopup('Kenil Sachapara<br>Hamilton, ON')
    .openPopup();

/* --- 8. Contact Form Validation --- */
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if(name && email) {
        // Here you would typically send data to a backend
        // For demo, we show an alert
        const btn = this.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = 'Sent!';
        btn.style.background = 'var(--primary)';
        btn.style.color = 'var(--bg-color)';
        
        setTimeout(() => {
            this.reset();
            btn.innerText = originalText;
            btn.style.background = '';
            btn.style.color = '';
            alert(`Thanks ${name}! I'll get back to you at ${email} soon.`);
        }, 2000);
    }
});

/* --- 9. Mobile Menu --- */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
});
