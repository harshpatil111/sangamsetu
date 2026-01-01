# SangamSetu - Missing Person Reunification Platform

A comprehensive web application designed for the Kumbh Mela to help reunite missing persons with their families. Built with Django REST Framework backend and React frontend.

## 🎯 Project Overview

SangamSetu is a platform that facilitates the registration and matching of missing and found persons during large-scale events like the Kumbh Mela. The system uses AI-powered matching algorithms to suggest potential matches between missing and found person reports.

## ✨ Features

- **User Authentication & Authorization**
  - Role-based access control (ADMIN, POLICE, VOLUNTEER)
  - JWT-based authentication
  - Secure session management

- **Missing Person Management**
  - Register missing persons with detailed information
  - View all missing person cases
  - Track case status (missing/found)

- **Found Person Management**
  - Register found persons with physical descriptions
  - View all found person cases
  - Record finder information

- **AI-Powered Matching**
  - Automatic matching algorithm based on:
    - Age similarity
    - Gender match
    - Location proximity
  - Confidence scoring for matches
  - Match confirmation/rejection workflow

- **Dashboard & Analytics**
  - Real-time statistics (Missing, Found, Matches)
  - Role-based dashboard views
  - Quick access to all features

## 🏗️ Tech Stack

### Backend
- **Django 5.1.5** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **JWT Authentication** - Secure authentication
- **Gunicorn** - Production WSGI server

### Frontend
- **React 18.2** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling (via utility classes)

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (for containerized deployment)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sangamsetu
   ```

2. **Set environment variables**
   Create a `.env` file in the root directory:
   ```env
   POSTGRES_PASSWORD=your_secure_password
   SECRET_KEY=your_django_secret_key
   DEBUG=False
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80
   REACT_APP_API_BASE_URL=http://localhost:8000/api
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Run migrations**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin Panel: http://localhost:8000/admin

### Option 2: Local Development

#### Backend Setup

1. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure database**
   - Create PostgreSQL database:
     ```sql
     CREATE DATABASE sangamsetu;
     CREATE USER postgres WITH PASSWORD 'your_password';
     GRANT ALL PRIVILEGES ON DATABASE sangamsetu TO postgres;
     ```

4. **Update settings**
   Edit `sangamsetu/settings.py` with your database credentials.

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start server**
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd sangamsetu-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL**
   Create `.env` file:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
sangamsetu/
├── accounts/              # User authentication app
├── cases/                 # Missing/Found person management
├── sangamsetu/            # Django project settings
├── sangamsetu-frontend/   # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/      # API services
│   │   └── contexts/      # React contexts
│   └── public/
├── manage.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔐 User Roles & Permissions

| Role | Permissions |
|------|------------|
| **ADMIN** | Full access to all features |
| **POLICE** | Register missing/found persons, view matches, confirm matches |
| **VOLUNTEER** | Register found persons, view matches |

## 🔌 API Endpoints

### Authentication
- `POST /api/accounts/login/` - User login
- `POST /api/accounts/register/` - User registration

### Missing Persons
- `POST /api/cases/missing/` - Register missing person
- `GET /api/cases/missing/list/` - List all missing persons

### Found Persons
- `POST /api/cases/found/` - Register found person
- `GET /api/cases/found/list/` - List all found persons

### Matches
- `GET /api/cases/matches/` - Get match suggestions
- `POST /api/cases/matches/confirm/<id>/` - Confirm match
- `DELETE /api/cases/matches/reject/<id>/` - Reject match

### Statistics
- `GET /api/cases/stats/` - Get dashboard statistics

## 🧪 Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
cd sangamsetu-frontend
npm test
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# Access backend shell
docker-compose exec backend python manage.py shell

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:

1. Runs backend tests with PostgreSQL
2. Runs frontend build and linting
3. Builds Docker images
4. Deploys to production (on main branch)

## 📝 Environment Variables

### Backend
```env
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_NAME=sangamsetu
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_HOST=db
DATABASE_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80
```

### Frontend
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

## 🚢 Deployment

### Production Checklist

- [ ] Set `DEBUG=False` in settings
- [ ] Generate new `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure static file serving
- [ ] Set up monitoring and logging
- [ ] Configure environment variables
- [ ] Test all features in production environment

### Deployment Options

1. **Docker Compose on VPS**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Kubernetes**
   - Use provided manifests (if available)
   - Configure ingress and services

3. **Cloud Platforms**
   - AWS (ECS, EKS, Elastic Beanstalk)
   - Google Cloud (Cloud Run, GKE)
   - Azure (Container Instances, AKS)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

- Built for Kumbh Mela event management
- Designed to help reunite families

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for reuniting families**

