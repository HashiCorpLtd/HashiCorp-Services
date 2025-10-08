// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarToggle.setAttribute('aria-expanded', 
            sidebarToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
        );
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = sidebar.contains(event.target) || sidebarToggle.contains(event.target);
        if (!isClickInside && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // Handle keyboard navigation
    navLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Sticky navbar functionality
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        lastScroll = currentScroll;
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && navbarMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Initialize ARIA attributes
    navbarToggle.setAttribute('aria-expanded', 'false');
    navbarToggle.setAttribute('aria-controls', 'navbar-menu');
    navbarMenu.setAttribute('id', 'navbar-menu');
});

// Make toggleMenu function globally available
function toggleMenu() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    navbarMenu.classList.toggle('active');
    navbarToggle.setAttribute('aria-expanded', 
        navbarToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
}