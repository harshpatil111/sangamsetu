# Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Docker and Docker Compose installed
- Domain name configured (optional)
- SSL certificate (for HTTPS)

### Step 1: Environment Setup

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` file with production values**
   ```env
   DEBUG=False
   SECRET_KEY=generate-a-strong-secret-key-here
   POSTGRES_PASSWORD=strong-database-password
   DATABASE_NAME=sangamsetu
   DATABASE_USER=postgres
   CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   REACT_APP_API_BASE_URL=https://api.yourdomain.com/api
   ```

3. **Generate Django secret key**
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

### Step 2: Build and Deploy

1. **Build and start services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

2. **Run migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
   ```

3. **Create superuser**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
   ```

4. **Collect static files**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
   ```

### Step 3: Verify Deployment

1. **Check service status**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

2. **View logs**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

3. **Test endpoints**
   - Frontend: http://your-server-ip
   - Backend API: http://your-server-ip:8000/api
   - Admin: http://your-server-ip:8000/admin

### Step 4: SSL/HTTPS Setup (Recommended)

#### Using Nginx Reverse Proxy

1. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx
   ```

2. **Configure Nginx**
   Create `/etc/nginx/sites-available/sangamsetu`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **Enable site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/sangamsetu /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Get SSL certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

### Step 5: Database Backup

1. **Create backup script**
   ```bash
   #!/bin/bash
   docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U postgres sangamsetu > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Schedule automated backups**
   Add to crontab:
   ```bash
   0 2 * * * /path/to/backup-script.sh
   ```

### Step 6: Monitoring

1. **Set up log rotation**
   ```bash
   # Configure Docker log rotation in /etc/docker/daemon.json
   {
     "log-driver": "json-file",
     "log-opts": {
       "max-size": "10m",
       "max-file": "3"
     }
   }
   ```

2. **Monitor resources**
   ```bash
   docker stats
   ```

## 🔄 Updates and Maintenance

### Update Application

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Rebuild and restart**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
   ```

### Rollback

1. **Stop services**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

2. **Checkout previous version**
   ```bash
   git checkout <previous-commit-hash>
   ```

3. **Rebuild and start**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

## 🔒 Security Checklist

- [ ] `DEBUG=False` in production
- [ ] Strong `SECRET_KEY` generated
- [ ] Strong database password
- [ ] HTTPS/SSL configured
- [ ] CORS properly configured
- [ ] Firewall rules configured
- [ ] Regular security updates
- [ ] Database backups scheduled
- [ ] Log monitoring set up
- [ ] Access logs reviewed regularly

## 📊 Performance Optimization

1. **Database Indexing**
   - Ensure indexes on frequently queried fields
   - Run `EXPLAIN ANALYZE` on slow queries

2. **Caching**
   - Consider Redis for session caching
   - Enable Django caching framework

3. **Static Files**
   - Use CDN for static assets
   - Configure proper cache headers

4. **Gunicorn Workers**
   - Adjust worker count based on CPU cores
   - Formula: (2 × CPU cores) + 1

## 🆘 Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check container status
docker-compose -f docker-compose.prod.yml ps
```

### Database connection issues
```bash
# Test database connection
docker-compose -f docker-compose.prod.yml exec backend python manage.py dbshell
```

### Frontend not loading
```bash
# Rebuild frontend
docker-compose -f docker-compose.prod.yml build frontend
docker-compose -f docker-compose.prod.yml up -d frontend
```

