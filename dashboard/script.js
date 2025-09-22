// Sample data for projects and activities
const projects = [
    {
        name: "E-Commerce Platform",
        client: "TechStore Inc.",
        progress: 75,
        status: "In Progress"
    },
    {
        name: "Mobile Banking App",
        client: "SecureBank",
        progress: 90,
        status: "Review"
    },
    {
        name: "CRM System",
        client: "Global Solutions",
        progress: 30,
        status: "In Progress"
    },
    {
        name: "Cloud Migration",
        client: "DataCorp",
        progress: 100,
        status: "Completed"
    }
];

const activities = [
    {
        action: "New Project Created",
        description: "E-Commerce Platform for TechStore Inc.",
        time: "2 hours ago"
    },
    {
        action: "Milestone Completed",
        description: "Mobile Banking App - Phase 2",
        time: "5 hours ago"
    },
    {
        action: "Client Meeting",
        description: "Requirements discussion with DataCorp",
        time: "Yesterday"
    },
    {
        action: "Project Completed",
        description: "Cloud Migration for DataCorp",
        time: "2 days ago"
    }
];

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