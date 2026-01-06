# Saraha Application

A Node.js backend application for an anonymous messaging platform, similar to Saraha. Users can send and receive anonymous messages, manage profiles, and authenticate securely.

## Features

- **User Authentication**
  - User registration with email verification
  - Login with email/password or Google OAuth
  - JWT-based authentication with access and refresh tokens
  - Password reset via OTP
  - Email update with dual OTP confirmation

- **User Management**
  - Profile management (update basic info)
  - Profile and cover image uploads (local and cloud storage)
  - Soft delete and restore accounts (admin only)
  - Account sharing

- **Security**
  - Password hashing with bcrypt
  - Data encryption for sensitive fields (phone number)
  - OTP-based email confirmations with rate limiting
  - Role-based access control (user/admin)

- **Utilities**
  - Email sending with Nodemailer
  - File uploads with Multer
  - Cloud storage integration
  - Error handling and success responses

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcryptjs
- **Validation**: Joi
- **Email**: Nodemailer
- **File Uploads**: Multer
- **OAuth**: Google Auth Library
- **Other**: crypto-js, nanoid, cors, dotenv

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sarahaApplication
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

The server will start and watch for file changes.

## API Endpoints

### Authentication Routes (`/auth`)

- `POST /auth/signup` - Register a new user
- `GET /auth/login` - Login with email and password
- `POST /auth/social-login` - Login with Google OAuth
- `GET /auth/getUserProfile` - Get authenticated user's profile
- `POST /auth/refreshToken` - Refresh access token
- `POST /auth/confirm-email` - Confirm email with OTP
- `POST /auth/resend-otp` - Resend email confirmation OTP
- `POST /auth/forget-pass` - Request password reset OTP
- `POST /auth/change-pass` - Change password with OTP
- `POST /auth/add-pass` - Add password to Google-authenticated account
- `PATCH /auth/update_email` - Update email address
- `PATCH /auth/confirm-new-email` - Confirm new email update

### User Routes (`/user`)

- `PATCH /user/soft-delete/:id` - Soft delete user (admin only)
- `PATCH /user/restore-account/:id` - Restore soft-deleted account (admin only)
- `DELETE /user/hard-delete` - Permanently delete account
- `GET /user/getUserProfileById/:id` - Get user profile by ID
- `GET /user/shareProfile` - Get shareable profile data
- `PATCH /user/updateBasicInfo` - Update basic user information
- `PATCH /user/profile-image` - Upload profile image (local)
- `PATCH /user/profile-image-cloud` - Upload profile image (cloud)
- `PATCH /user/cover-images-cloud` - Upload cover images (cloud)
- `DELETE /user/delete-images` - Delete uploaded images

### Message Routes (`/message`)

*(Not implemented yet)*

## Project Structure

```
sarahaApplication/
├── index.js                    # Application entry point
├── package.json                # Dependencies and scripts
├── src/
│   ├── startApp.js             # Server setup and middleware
│   ├── DB/
│   │   ├── connection.js       # MongoDB connection
│   │   ├── DBServices.js       # Database utility functions
│   │   └── models/
│   │       ├── user.model.js   # User schema
│   │       └── message.model.js # Message schema (empty)
│   ├── middleware/
│   │   ├── auth.middleware.js  # Authentication middleware
│   │   └── validation.middleware.js # Request validation
│   ├── modules/
│   │   ├── auth.module/        # Authentication logic
│   │   ├── user.module/        # User management
│   │   └── message.module/     # Message handling (incomplete)
│   └── utilities/
│       ├── bcrypt.js           # Password hashing
│       ├── crypto.js           # Data encryption/decryption
│       ├── error.handler.js    # Error handling
│       ├── exceptions.js       # Custom exceptions
│       ├── general.validation.js # General validations
│       ├── success.handler.js  # Success responses
│       ├── multer/             # File upload utilities
│       └── send.email/         # Email sending utilities
└── uploads/                    # Local file uploads directory
```

## Database Models

### User Model
- `firstName`, `lastName`: Required strings
- `email`: Unique, required
- `password`: Hashed, required for system auth
- `age`: Number (20-50)
- `gender`: Enum (male/female)
- `role`: Enum (admin/user)
- `phone`: Encrypted string
- `confirmed`: Boolean
- `provider`: Enum (system/google)
- `profileImage`, `coverImages`: Cloudinary URLs
- OTP fields for various confirmations
- Timestamps and virtuals

## Security Features

- Passwords are hashed using bcrypt
- Sensitive data like phone numbers are encrypted
- JWT tokens for authentication
- OTP-based email verifications with expiration and rate limiting
- Role-based permissions
- Input validation with Joi

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC</content>
<parameter name="filePath">e:\sama\Node js\sarahaApplication\README.md