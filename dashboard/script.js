// Check authentication
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'login.html';
}

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
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                performSearch(query);
            }
        });
    }
}

function performSearch(query) {
    // Simple search implementation
    const searchResults = [];
    
    // Search projects
    sampleData.projects.forEach(project => {
        if (project.name.toLowerCase().includes(query) || 
            project.client.toLowerCase().includes(query)) {
            searchResults.push({
                type: 'Project',
                name: project.name,
                description: `Client: ${project.client}`
            });
        }
    });
    
    // Search clients
    sampleData.clients.forEach(client => {
        if (client.name.toLowerCase().includes(query) || 
            client.email.toLowerCase().includes(query)) {
            searchResults.push({
                type: 'Client',
                name: client.name,
                description: client.email
            });
        }
    });
    
    // Search services
    sampleData.services.forEach(service => {
        if (service.name.toLowerCase().includes(query) || 
            service.description.toLowerCase().includes(query)) {
            searchResults.push({
                type: 'Service',
                name: service.name,
                description: service.description
            });
        }
    });
    
    console.log('Search results:', searchResults);
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    const router = new Router();
    setupSearch();
    updateBadges();
    
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
document.querySelector('.search-bar input').addEventListener('input', (e) => {
    // Add search functionality here
    console.log('Searching for:', e.target.value);
});

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