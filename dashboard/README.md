# HashiCorp Services - Admin & User Dashboard

A secure web application with role-based authentication for HashiCorp Ltd, featuring separate admin and user dashboards with modern UI design.

## 🚀 Features

- **Role-Based Authentication**: Separate login flows for administrators and regular users
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Session Management**: Secure token-based authentication with 8-hour session timeout
- **Modern UI**: Clean, professional interface with smooth animations and transitions
- **Dashboard Analytics**: Comprehensive admin dashboard with user management and system monitoring
- **Security Features**: Session clearing, automatic redirects, and secure authentication

## 📁 Project Structure

```
dashboard/
├── index.html              # Landing page with auto-redirect to login
├── login.html              # Unified login page for admin and user access
├── admin-dashboard.html    # Comprehensive admin dashboard
├── dashboard.html          # User dashboard
├── styles.css              # Main stylesheet for dashboards
├── navbar.css              # Navigation bar styles
├── script.js               # Dashboard functionality scripts
├── navbar.js               # Navigation bar JavaScript
└── README.md               # Project documentation
```

## 🔐 Authentication

### Default Credentials

**Administrator Access:**
- Username: `admin`
- Password: `admin123`
- Redirects to: `admin-dashboard.html`

**User Access:**
- Username: `user`  
- Password: `user123`
- Redirects to: `dashboard.html`

### Session Management
- **Session Duration**: 8 hours
- **Token-Based**: Secure token generation and validation
- **Auto-Logout**: Automatic session expiry and cleanup
- **Cross-Tab Support**: Session data shared across browser tabs

## 🖥️ Usage

### Development Setup

1. **Start Local Server**:
   ```bash
   cd dashboard
   python -m http.server 3000
   ```

2. **Access Application**:
   - Open browser to `http://localhost:3000`
   - Will automatically redirect to login page
   - Choose Admin or User login option
   - Enter credentials and access respective dashboard

### Production Deployment

1. Upload all files to your web server
2. Ensure proper HTTPS configuration
3. Update authentication logic with secure backend
4. Configure proper session storage (Redis/Database)

## 🎨 UI Components

### Landing Page (`index.html`)
- Auto-redirect to login with visual countdown
- Session cleanup on page load
- Manual fallback link
- Responsive loading screen

### Login Page (`login.html`)
- Unified login interface
- Role selection (Admin/User)
- Form validation and error handling
- Loading states and success feedback
- Session creation and token management

### Admin Dashboard (`admin-dashboard.html`)
- User management interface
- System analytics and monitoring
- Administrative controls
- Responsive sidebar navigation
- Real-time data display

### User Dashboard (`dashboard.html`)
- Personal user interface
- Service access controls
- Profile management
- Simplified navigation
- User-specific features

## 🔧 Technical Details

### Frontend Technologies
- **HTML5**: Semantic markup and modern standards
- **CSS3**: Advanced styling with Flexbox and Grid
- **JavaScript (ES6+)**: Modern JavaScript features
- **Font Awesome**: Icon library for UI elements
- **Responsive Design**: Mobile-first approach

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance Features
- Embedded CSS for faster loading
- Optimized JavaScript execution
- CDN-based icon loading
- Minimal external dependencies

## 🛡️ Security Features

- **Session Validation**: Token-based authentication
- **Automatic Cleanup**: Session data clearing on logout
- **Role-Based Access**: Separate admin and user access levels
- **Input Validation**: Client-side form validation
- **Secure Redirects**: Proper authentication flow

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: 1200px+ (Full feature set)
- **Tablet**: 768px-1199px (Adapted layout)
- **Mobile**: Below 768px (Simplified interface)

## 🚀 Deployment Notes

1. **Environment Variables**: Update authentication endpoints for production
2. **Security Headers**: Implement proper security headers
3. **HTTPS**: Ensure SSL/TLS encryption
4. **Session Storage**: Use secure server-side session management
5. **Authentication Backend**: Integrate with secure authentication service

## 📝 License

This project is part of the ROSPL (Research Oriented Software Project Lab) coursework for HashiCorp Services implementation.

## 👥 Contributors

- **Student**: Satyam P
- **Course**: Sem 7 ROSPL Project
- **Institution**: [Your Institution Name]

---

**Note**: This is a demonstration project for educational purposes. For production use, implement proper backend authentication and security measures.