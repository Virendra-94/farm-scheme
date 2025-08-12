# Farm Scheme - Agricultural Technology Platform

A modern web-based application designed to empower farmers with e-farming solutions, crop insurance, and online bidding platforms. Built with Angular and Tailwind CSS.

## 🚀 Features

### Core Modules
- **Bidding System**: Online crop bidding platform for farmers and traders
- **Fasal Bima Yojna**: Government-backed crop insurance with minimal premium rates
- **Insurance Calculator**: Calculate insurance premiums based on crop type and area
- **Marketplace**: Transparent marketplace for crop trading
- **User Management**: Separate dashboards for Admin, Farmer, and Bidder

### Key Features
- Modern, responsive UI with Tailwind CSS
- Real-time bidding system
- Insurance claim processing
- Market analytics and insights
- 24/7 support system
- Mobile-friendly design

## 🛠️ Technology Stack

- **Frontend**: Angular 17 (Standalone Components)
- **Styling**: Tailwind CSS
- **Icons**: Lucide Angular
- **State Management**: Angular Services
- **Routing**: Angular Router

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Angular CLI** (v17 or higher)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd farm-scheme
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
ng serve
```

The application will be available at `http://localhost:4200`

### 4. Build for Production
```bash
ng build
```

## 👥 Demo Users

For testing purposes, the following demo accounts are available:

### Admin User
- **Email**: admin@farmscheme.com
- **Password**: password
- **Features**: User management, bid approval, insurance claim processing

### Farmer User
- **Email**: farmer@farmscheme.com
- **Password**: password
- **Features**: Crop listing, insurance application, marketplace access

### Bidder User
- **Email**: bidder@farmscheme.com
- **Password**: password
- **Features**: Crop bidding, marketplace browsing

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # User dashboards
│   │   ├── bidding/        # Bidding system components
│   │   ├── insurance/      # Insurance system components
│   │   ├── shared/         # Shared components (header, footer)
│   │   ├── home/           # Home page
│   │   ├── about/          # About page
│   │   └── contact/        # Contact page
│   ├── models/             # TypeScript interfaces
│   ├── services/           # Angular services
│   ├── app.component.ts    # Main app component
│   ├── app.routes.ts       # Routing configuration
│   └── app.css            # Global styles
├── assets/                 # Static assets
└── styles.css             # Tailwind CSS imports
```

## 🎨 Design System

### Color Palette
- **Primary**: Green shades (agricultural theme)
- **Secondary**: Yellow/Orange shades (harvest theme)
- **Neutral**: Gray shades for text and backgrounds

### Typography
- **Display Font**: Poppins (for headings)
- **Body Font**: Inter (for body text)

### Components
- Modern card-based layouts
- Responsive grid systems
- Interactive hover effects
- Smooth animations and transitions

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom configuration in `tailwind.config.js`:
- Custom color palette
- Custom animations
- Responsive breakpoints
- Form styling plugins

### Angular Configuration
- Standalone components
- Lazy loading for better performance
- Route guards for authentication
- Service-based state management

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- Form validation
- Input sanitization
- Route protection
- Session management
- CSRF protection (when integrated with backend)

## 🚀 Deployment

### Build for Production
```bash
ng build --configuration production
```

### Deploy to Static Hosting
The built files in `dist/farm-scheme/browser/` can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## 🔗 Backend Integration

This frontend is designed to integrate with a Java Spring Boot backend. The services are structured to easily connect to REST APIs:

- **AuthService**: Handles authentication and user management
- **BiddingService**: Manages crop bidding operations
- **InsuranceService**: Handles insurance applications and claims
- **UserService**: User profile and management

## 📊 API Endpoints (Expected)

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### Bidding
- `GET /api/crops`
- `POST /api/crops`
- `POST /api/bids`
- `GET /api/bids/{cropId}`

### Insurance
- `POST /api/insurance/apply`
- `POST /api/insurance/claim`
- `GET /api/insurance/calculate`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Development Team

- **RPS Consulting Pvt. Ltd.** - Agricultural Technology Solutions Provider
- **Farm Scheme Team** - Expert developers and agricultural specialists

## 📞 Support

For support and queries:
- **Email**: support@farmscheme.com
- **Phone**: +91 98765 43210
- **Address**: RPS Consulting Pvt. Ltd., 123 Tech Park, Bangalore, Karnataka, India - 560001

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - User authentication system
  - Bidding platform
  - Insurance management
  - Responsive design
  - Demo user accounts

---

**Note**: This is a frontend application designed to work with a Java Spring Boot backend. The current version includes demo data and simulated API calls for demonstration purposes.
