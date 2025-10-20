// Check authentication
(function() {
    // Old code relied on a boolean 'isLoggedIn'. New flow uses JWT tokens stored
    // in sessionStorage/localStorage under userToken/adminToken. Keep backwards
    // compatibility by checking both.
    const isLoggedInFlag = localStorage.getItem('isLoggedIn') === 'true';
    const tokens = [
        sessionStorage.getItem('userToken'),
        localStorage.getItem('userToken'),
        sessionStorage.getItem('adminToken'),
        localStorage.getItem('adminToken')
    ];
    const hasToken = tokens.some(t => !!t);
    if (!isLoggedInFlag && !hasToken) {
        window.location.href = 'login.html';
    }
})();

// Sample data
const sampleData = {
    projects: [
        { id: 1, name: "E-Commerce Platform", client: "TechStore Inc.", progress: 75, status: "In Progress", deadline: "2025-01-15" },
        { id: 2, name: "Mobile Banking App", client: "SecureBank", progress: 90, status: "Review", deadline: "2025-01-20" },
        { id: 3, name: "CRM System", client: "SalesPro Ltd", progress: 45, status: "In Progress", deadline: "2025-02-10" },
        { id: 4, name: "Inventory Management", client: "RetailCorp", progress: 60, status: "In Progress", deadline: "2025-01-30" },
        { id: 5, name: "HR Portal", client: "WorkFlow Inc", progress: 25, status: "Planning", deadline: "2025-03-15" },
        { id: 6, name: "Analytics Dashboard", client: "DataViz Co", progress: 80, status: "Testing", deadline: "2025-01-25" }
    ],
    services: [
        { id: 1, name: "Web Development", description: "Full-stack web application development", clients: 45, revenue: "$1.2M" },
        { id: 2, name: "Mobile App Development", description: "iOS and Android mobile applications", clients: 28, revenue: "$800K" },
        { id: 3, name: "Cloud Services", description: "Cloud infrastructure and deployment", clients: 35, revenue: "$600K" },
        { id: 4, name: "Data Analytics", description: "Business intelligence and data visualization", clients: 22, revenue: "$450K" },
        { id: 5, name: "UI/UX Design", description: "User interface and experience design", clients: 40, revenue: "$300K" },
        { id: 6, name: "DevOps", description: "CI/CD and infrastructure automation", clients: 18, revenue: "$250K" }
    ],
    clients: [
        { id: 1, name: "TechStore Inc.", email: "contact@techstore.com", projects: 3, revenue: "$450K", status: "Active" },
        { id: 2, name: "SecureBank", email: "dev@securebank.com", projects: 2, revenue: "$320K", status: "Active" },
        { id: 3, name: "SalesPro Ltd", email: "info@salespro.com", projects: 4, revenue: "$280K", status: "Active" },
        { id: 4, name: "RetailCorp", email: "tech@retailcorp.com", projects: 1, revenue: "$150K", status: "Pending" },
        { id: 5, name: "WorkFlow Inc", email: "support@workflow.com", projects: 2, revenue: "$200K", status: "Active" },
        { id: 6, name: "DataViz Co", email: "hello@dataviz.com", projects: 1, revenue: "$180K", status: "Active" }
    ],
    activities: [
        { id: 1, action: "Project completed", project: "E-Commerce Platform", time: "2 hours ago" },
        { id: 2, action: "New client added", client: "TechCorp", time: "4 hours ago" },
        { id: 3, action: "Meeting scheduled", project: "Mobile Banking App", time: "6 hours ago" },
        { id: 4, action: "Invoice sent", client: "SecureBank", time: "1 day ago" },
        { id: 5, action: "Project milestone reached", project: "CRM System", time: "2 days ago" },
        { id: 6, action: "New service launched", service: "DevOps", time: "3 days ago" }
    ]
};

// Router functionality
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
        this.setupNavigation();
        this.populateContent();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const route = item.getAttribute('data-route');
                this.navigateTo(route);
            });
        });
    }

    navigateTo(route) {
        window.location.hash = `#/${route}`;
    }

    handleRouteChange() {
        const hash = window.location.hash.slice(2) || 'dashboard';
        this.currentRoute = hash;
        
        // Update active navigation
        this.updateActiveNav(hash);
        
        // Show corresponding page
        this.showPage(hash);
        
        // Update page title
        this.updatePageTitle(hash);
    }

    updateActiveNav(route) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-route') === route) {
                item.classList.add('active');
            }
        });
    }

    showPage(route) {
        const pages = document.querySelectorAll('.page-content');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(`route-${route}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    updatePageTitle(route) {
        const titles = {
            dashboard: 'Dashboard',
            projects: 'Projects Management',
            services: 'Services Overview',
            clients: 'Client Management',
            analytics: 'Analytics Dashboard',
            settings: 'Settings'
        };
        
        const titleElement = document.getElementById('page-title');
        if (titleElement) {
            titleElement.textContent = titles[route] || 'Dashboard';
        }
    }

    populateContent() {
        this.populateRecentProjects();
        this.populateActivity();
        this.populateProjects();
        this.populateServices();
        this.populateClients();
        this.populateAnalytics();
        this.populateSettings();
    }

    populateRecentProjects() {
        const container = document.getElementById('recent-projects-list');
        if (!container) return;

        const recentProjects = sampleData.projects.slice(0, 4);
        container.innerHTML = recentProjects.map(project => `
            <div class="project-item">
                <div class="project-info">
                    <h4>${project.name}</h4>
                    <p>Client: ${project.client}</p>
                </div>
                <div class="project-progress">
                    <div class="progress-text">${project.progress}%</div>
                    <div class="mini-progress">
                        <div class="mini-progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    populateActivity() {
        const container = document.getElementById('activity-timeline');
        if (!container) return;

        const activities = sampleData.activities.slice(0, 5);
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-info">
                    <h4>${activity.action}</h4>
                    <p>${activity.project || activity.client || activity.service || 'System'}</p>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    populateProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) return;

        container.innerHTML = sampleData.projects.map(project => {
            const statusClass = project.status === 'Review' ? 'success' : 
                               project.status === 'Planning' ? 'warning' : 'primary';
            return `
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">${project.name}</h3>
                        <span class="card-badge ${statusClass}">${project.status}</span>
                    </div>
                    <p>Client: ${project.client}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                    <div class="card-meta">
                        <span>Progress: ${project.progress}%</span>
                        <span>Due: ${new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    populateServices() {
        const container = document.getElementById('services-grid');
        if (!container) return;

        container.innerHTML = sampleData.services.map(service => `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">${service.name}</h3>
                    <span class="card-badge success">Active</span>
                </div>
                <p>${service.description}</p>
                <div class="card-meta">
                    <span>${service.clients} Clients</span>
                    <span>Revenue: ${service.revenue}</span>
                </div>
            </div>
        `).join('');
    }

    populateClients() {
        const container = document.getElementById('clients-grid');
        if (!container) return;

        container.innerHTML = sampleData.clients.map(client => {
            const statusClass = client.status === 'Active' ? 'success' : 'warning';
            return `
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">${client.name}</h3>
                        <span class="card-badge ${statusClass}">${client.status}</span>
                    </div>
                    <p>Email: ${client.email}</p>
                    <div class="card-meta">
                        <span>${client.projects} Projects</span>
                        <span>Revenue: ${client.revenue}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    populateAnalytics() {
        const container = document.getElementById('analytics-content');
        if (!container) return;

        container.innerHTML = `
            <div class="chart-card">
                <h3>Revenue Trends</h3>
                <div class="chart-placeholder">Revenue Chart Placeholder</div>
            </div>
            <div class="chart-card">
                <h3>Project Progress</h3>
                <div class="chart-placeholder">Progress Chart Placeholder</div>
            </div>
            <div class="chart-card">
                <h3>Client Distribution</h3>
                <div class="chart-placeholder">Client Chart Placeholder</div>
            </div>
            <div class="chart-card">
                <h3>Service Performance</h3>
                <div class="chart-placeholder">Service Chart Placeholder</div>
            </div>
        `;
    }

    populateSettings() {
        const container = document.getElementById('settings-content');
        if (!container) return;

        container.innerHTML = `
            <div class="settings-section">
                <h3>Account Settings</h3>
                <div class="form-group">
                    <label for="company-name">Company Name</label>
                    <input type="text" id="company-name" value="HashiCorp Ltd">
                </div>
                <div class="form-group">
                    <label for="admin-email">Admin Email</label>
                    <input type="email" id="admin-email" value="admin@hashicorp.com">
                </div>
                <div class="form-group">
                    <label for="timezone">Timezone</label>
                    <select id="timezone">
                        <option>UTC</option>
                        <option selected>EST</option>
                        <option>PST</option>
                    </select>
                </div>
            </div>
            <div class="settings-section">
                <h3>Notification Settings</h3>
                <div class="form-group">
                    <label>
                        <input type="checkbox" checked> Email notifications
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" checked> Project updates
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox"> Weekly reports
                    </label>
                </div>
            </div>
            <div class="settings-section">
                <h3>Security</h3>
                <div class="form-group">
                    <label for="current-password">Current Password</label>
                    <input type="password" id="current-password">
                </div>
                <div class="form-group">
                    <label for="new-password">New Password</label>
                    <input type="password" id="new-password">
                </div>
                <div class="form-group">
                    <button class="btn btn-primary">Update Password</button>
                </div>
            </div>
        `;
    }
}

// Utility functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            if (query.length === 0) {
                hideSearchResults();
                return;
            }
            
            // Debounce search to avoid too many calls
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    performSearch(query);
                } else {
                    hideSearchResults();
                }
            }, 300);
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                hideSearchResults();
            }
        });
        
        // Handle keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const items = searchResults.querySelectorAll('.search-result-item');
            const activeItem = searchResults.querySelector('.search-result-item.active');
            let activeIndex = Array.from(items).indexOf(activeItem);
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (activeIndex < items.length - 1) {
                        activeIndex++;
                    } else {
                        activeIndex = 0;
                    }
                    highlightSearchResult(items, activeIndex);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (activeIndex > 0) {
                        activeIndex--;
                    } else {
                        activeIndex = items.length - 1;
                    }
                    highlightSearchResult(items, activeIndex);
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (activeItem) {
                        activeItem.click();
                    }
                    break;
                    
                case 'Escape':
                    hideSearchResults();
                    searchInput.blur();
                    break;
            }
        });
    }
}

function performSearch(query) {
    const searchResults = document.querySelector('#search-results');
    const searchResultsData = [];
    const queryLower = query.toLowerCase();
    
    // Search projects
    sampleData.projects.forEach(project => {
        if (project.name.toLowerCase().includes(queryLower) || 
            project.client.toLowerCase().includes(queryLower) ||
            project.status.toLowerCase().includes(queryLower)) {
            searchResultsData.push({
                type: 'project',
                typeName: 'Project',
                name: project.name,
                description: `Client: ${project.client} • Status: ${project.status}`,
                action: () => navigateToProject(project.id),
                icon: 'fas fa-project-diagram'
            });
        }
    });
    
    // Search clients
    sampleData.clients.forEach(client => {
        if (client.name.toLowerCase().includes(queryLower) || 
            client.email.toLowerCase().includes(queryLower)) {
            searchResultsData.push({
                type: 'client',
                typeName: 'Client',
                name: client.name,
                description: `${client.email} • ${client.projects} projects`,
                action: () => navigateToClient(client.id),
                icon: 'fas fa-users'
            });
        }
    });
    
    // Search services
    sampleData.services.forEach(service => {
        if (service.name.toLowerCase().includes(queryLower) || 
            service.description.toLowerCase().includes(queryLower)) {
            searchResultsData.push({
                type: 'service',
                typeName: 'Service',
                name: service.name,
                description: service.description,
                action: () => navigateToService(service.id),
                icon: 'fas fa-cog'
            });
        }
    });
    
    displaySearchResults(searchResultsData, query);
}

function displaySearchResults(results, query) {
    const searchResultsContainer = document.querySelector('#search-results');
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>No results found for "${query}"</p>
            </div>
        `;
    } else {
        const resultsHtml = `
            <div class="search-results-header">
                Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"
            </div>
            ${results.map((result, index) => `
                <div class="search-result-item ${index === 0 ? 'active' : ''}" 
                     data-action="${result.type}" 
                     onclick="handleSearchResultClick('${result.type}', ${JSON.stringify(result).replace(/"/g, '&quot;')})">
                    <div class="search-result-icon ${result.type}">
                        <i class="${result.icon}"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">${highlightSearchTerm(result.name, query)}</div>
                        <div class="search-result-description">${highlightSearchTerm(result.description, query)}</div>
                    </div>
                    <div class="search-result-type">${result.typeName}</div>
                </div>
            `).join('')}
        `;
        searchResultsContainer.innerHTML = resultsHtml;
    }
    
    searchResultsContainer.classList.add('show');
}

function highlightSearchTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<strong style="background: rgba(116, 185, 255, 0.2); color: #0984e3;">$1</strong>');
}

function highlightSearchResult(items, activeIndex) {
    items.forEach(item => item.classList.remove('active'));
    if (items[activeIndex]) {
        items[activeIndex].classList.add('active');
        items[activeIndex].scrollIntoView({ block: 'nearest' });
    }
}

function hideSearchResults() {
    const searchResults = document.querySelector('#search-results');
    if (searchResults) {
        searchResults.classList.remove('show');
    }
}

function handleSearchResultClick(type, result) {
    const data = typeof result === 'string' ? JSON.parse(result) : result;
    hideSearchResults();
    
    // Clear search input
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Navigate based on type
    switch(type) {
        case 'project':
            router.navigateTo('projects');
            break;
        case 'client':
            router.navigateTo('clients');
            break;
        case 'service':
            router.navigateTo('services');
            break;
    }
    
    // Add a brief highlight effect to show what was selected
    setTimeout(() => {
        showNotification(`Navigated to ${data.typeName}: ${data.name}`, 'success');
    }, 300);
}

function navigateToProject(projectId) {
    router.navigateTo('projects');
}

function navigateToClient(clientId) {
    router.navigateTo('clients');
}

function navigateToService(serviceId) {
    router.navigateTo('services');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize application
let router; // Make router global

document.addEventListener('DOMContentLoaded', () => {
    router = new Router();
    setupSearch();
    updateBadges();
    setupAddButtonHandlers();
    setupFormHandlers();
    
    // Add smooth animations
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('HashiCorp Dashboard initialized successfully');
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Update badges with current counts
function updateBadges() {
    const projectsBadge = document.getElementById('projects-badge');
    const servicesBadge = document.getElementById('services-badge');
    const clientsBadge = document.getElementById('clients-badge');
    
    if (projectsBadge) projectsBadge.textContent = sampleData.projects.length;
    if (servicesBadge) servicesBadge.textContent = sampleData.services.length;
    if (clientsBadge) clientsBadge.textContent = sampleData.clients.length;
}

// Function to create project cards
function createProjectCards() {
    const projectList = document.querySelector('.project-list');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-header">
                <h3>${project.name}</h3>
                <span class="status ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
            </div>
            <p class="client">Client: ${project.client}</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${project.progress}%"></div>
            </div>
            <p class="progress-text">${project.progress}% Complete</p>
        `;
        projectList.appendChild(projectCard);
    });
}

// Function to create activity timeline
function createActivityTimeline() {
    const timeline = document.querySelector('.timeline');
    
    activities.forEach(activity => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <h4>${activity.action}</h4>
                <p>${activity.description}</p>
                <span class="time">${activity.time}</span>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });
}

// Add styles for dynamically created elements
const styles = `
    .project-card {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 15px;
    }

    .project-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .status {
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
    }

    .status.in-progress {
        background: #fff2e6;
        color: #ff8c1a;
    }

    .status.review {
        background: #e6f3ff;
        color: #0066cc;
    }

    .status.completed {
        background: #e6ffe6;
        color: #00cc00;
    }

    .client {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 15px;
    }

    .progress-bar {
        background: #eee;
        height: 8px;
        border-radius: 4px;
        margin-bottom: 5px;
    }

    .progress {
        background: #0066cc;
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
    }

    .progress-text {
        font-size: 0.8rem;
        color: #666;
    }

    .timeline-item {
        padding: 15px;
        border-left: 2px solid #0066cc;
        margin-left: 20px;
        position: relative;
    }

    .timeline-item::before {
        content: '';
        width: 12px;
        height: 12px;
        background: #0066cc;
        border-radius: 50%;
        position: absolute;
        left: -7px;
        top: 20px;
    }

    .timeline-content h4 {
        margin-bottom: 5px;
        color: #2d3436;
    }

    .timeline-content p {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 5px;
    }

    .time {
        font-size: 0.8rem;
        color: #999;
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    createProjectCards();
    createActivityTimeline();
});

// Add event listeners for interactive elements
document.querySelector('.fa-bell').addEventListener('click', () => {
    // Add notification functionality here
    alert('Notifications feature coming soon!');
});

// Add responsive menu toggle for mobile
if (window.innerWidth <= 768) {
    const menuItems = document.querySelectorAll('.sidebar nav ul li a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.parentElement.classList.remove('active'));
            item.parentElement.classList.add('active');
        });
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        const firstInput = modal.querySelector('input, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        
        // Hide any messages
        const message = modal.querySelector('.modal-message');
        if (message) {
            message.style.display = 'none';
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function showModalMessage(modalId, type, text) {
    const modal = document.getElementById(modalId);
    const message = modal.querySelector('.modal-message');
    if (message) {
        message.className = `modal-message ${type}`;
        message.textContent = text;
        message.style.display = 'block';
        
        // Auto hide success messages
        if (type === 'success') {
            setTimeout(() => {
                message.style.display = 'none';
                closeModal(modalId);
            }, 2000);
        }
    }
}

// Add Button Event Handlers
function setupAddButtonHandlers() {
    // Add Project Button
    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            openModal('add-project-modal');
        });
    }

    // Add Service Button
    const addServiceBtn = document.getElementById('add-service-btn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', () => {
            openModal('add-service-modal');
        });
    }

    // Add Client Button
    const addClientBtn = document.getElementById('add-client-btn');
    if (addClientBtn) {
        addClientBtn.addEventListener('click', () => {
            openModal('add-client-modal');
        });
    }
}

// Form Submission Handlers
function setupFormHandlers() {
    // Add Project Form
    const addProjectForm = document.getElementById('add-project-form');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(addProjectForm);
            const projectData = {
                id: sampleData.projects.length + 1,
                name: formData.get('name'),
                client: formData.get('client'),
                progress: 0,
                status: 'Planning',
                deadline: formData.get('deadline'),
                description: formData.get('description')
            };
            
            // Add to sample data
            sampleData.projects.push(projectData);
            
            // Update UI
            router.populateProjects();
            updateProjectsBadge();
            
            showModalMessage('add-project-modal', 'success', 'Project added successfully!');
        });
    }

    // Add Service Form
    const addServiceForm = document.getElementById('add-service-form');
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(addServiceForm);
            const serviceData = {
                id: sampleData.services.length + 1,
                name: formData.get('name'),
                description: formData.get('description'),
                clients: 0,
                revenue: formData.get('price') || '$0'
            };
            
            // Add to sample data
            sampleData.services.push(serviceData);
            
            // Update UI
            router.populateServices();
            updateServicesBadge();
            
            showModalMessage('add-service-modal', 'success', 'Service added successfully!');
        });
    }

    // Add Client Form
    const addClientForm = document.getElementById('add-client-form');
    if (addClientForm) {
        addClientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(addClientForm);
            const clientData = {
                id: sampleData.clients.length + 1,
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                contact: formData.get('contact'),
                projects: 0,
                revenue: '$0',
                status: 'Active'
            };
            
            // Add to sample data
            sampleData.clients.push(clientData);
            
            // Update UI
            router.populateClients();
            updateClientsBadge();
            
            showModalMessage('add-client-modal', 'success', 'Client added successfully!');
        });
    }
}

// Update Badge Functions
function updateProjectsBadge() {
    const badge = document.getElementById('projects-badge');
    if (badge) {
        badge.textContent = sampleData.projects.length;
    }
}

function updateServicesBadge() {
    const badge = document.getElementById('services-badge');
    if (badge) {
        badge.textContent = sampleData.services.length;
    }
}

function updateClientsBadge() {
    const badge = document.getElementById('clients-badge');
    if (badge) {
        badge.textContent = sampleData.clients.length;
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});