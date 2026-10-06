# Kabhyan Technologies — Enterprise Laravel Backend

Enterprise RESTful API and Backend Infrastructure for **Kabhyan Technologies Private Limited** (*Intelligence. Innovation. Impact.*).

---

## 🏗️ Architecture Overview

- **Framework**: Laravel 11.x
- **PHP Version**: 8.2+
- **Database**: MySQL 8.0+ / PostgreSQL 15+
- **Caching & Queues**: Redis
- **Security**: Laravel Sanctum, Rate Limiting (Throttle), CSRF Defense, SQL Injection Prevention, Input Validation

---

## 📁 Directory Structure

```
laravel-backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           └── InquiryController.php   # Handles enterprise contact/inquiry API
│   └── Models/
│       └── Inquiry.php                    # Eloquent Model with mass-assignment protection
├── database/
│   └── migrations/
│       └── 2026_10_06_000001_create_inquiries_table.php  # Optimized schema with indexes
├── routes/
│   └── api.php                            # RESTful routes with v1 prefix & rate-limiting
├── .env.example                           # Enterprise environment configuration
└── composer.json                          # Composer package configuration
```

---

## 🚀 Quick Setup & Deployment

1. **Install Dependencies** (Once PHP & Composer are installed in your deployment environment):
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Configuration**:
   Update your database credentials in `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=kabhyan_enterprise
   DB_USERNAME=your_user
   DB_PASSWORD=your_password
   ```

4. **Run Migrations**:
   ```bash
   php artisan migrate --force
   ```

5. **Start Local Development Server**:
   ```bash
   php artisan serve --port=8000
   ```

---

## 📡 API Endpoints

### 1. Health Check
- **Endpoint**: `GET /api/v1/health`
- **Response**:
  ```json
  {
    "status": "healthy",
    "company": "Kabhyan Technologies Private Limited",
    "tagline": "Intelligence. Innovation. Impact.",
    "version": "1.0.0"
  }
  ```

### 2. Submit Inquiry (Public)
- **Endpoint**: `POST /api/v1/inquiries`
- **Rate Limit**: 10 requests / minute per IP
- **Payload**:
  ```json
  {
    "name": "Jane Enterprise",
    "email": "jane@company.com",
    "phone": "+91 9876543210",
    "service": "Enterprise Software Development",
    "budget": "$15,000 - $50,000",
    "message": "We need to re-architect our legacy ERP system into a modern microservice architecture."
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "status": "success",
    "message": "Thank you for contacting Kabhyan Technologies. Our engineering leads will review your requirements and respond within 24 hours.",
    "data": {
      "id": 1,
      "created_at": "2026-10-06T11:45:00.000000Z"
    }
  }
  ```

---

## 🏢 Contact & Corporate Office
- **Company**: Kabhyan Technologies Private Limited
- **Address**: Ward No. 9, Rangia, Kamrup District, Assam - 781354, India
- **Phone**: +91 70869 59737
- **Email**: info@kabhyan.com
- **Google Maps**: [https://maps.app.goo.gl/vBjVmAvmamZSQBzy9](https://maps.app.goo.gl/vBjVmAvmamZSQBzy9)
