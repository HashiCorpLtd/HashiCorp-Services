// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('#sidebar-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        sidebarToggle.setAttribute('aria-expanded', 
            sidebarToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
        );
    }

    // Add event listener to sidebar toggle button
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992) {
            const isClickInside = sidebar.contains(event.target) || 
                                 sidebarToggle.contains(event.target);
            if (!isClickInside && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                sidebarToggle.setAttribute('aria-expanded', 'false');
            }
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

    // Close mobile sidebar on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            sidebarToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Initialize ARIA attributes
    if (sidebarToggle) {
        sidebarToggle.setAttribute('aria-expanded', 'false');
        sidebarToggle.setAttribute('aria-controls', 'sidebar');
        sidebarToggle.setAttribute('aria-label', 'Toggle sidebar menu');
    }
    
    if (sidebar) {
        sidebar.setAttribute('id', 'sidebar');
    }
});