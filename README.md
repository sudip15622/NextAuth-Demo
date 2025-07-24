# NextAuth.js Demo - Complete Authentication Tutorial

A comprehensive tutorial project demonstrating authentication and authorization implementation using **NextAuth.js v5** with **Next.js 15**, **Prisma ORM**, and **PostgreSQL**.

## 🚀 Features

### Authentication Methods
- ✅ **Credentials Authentication** - Email/Password login with bcrypt hashing
- ✅ **OAuth Providers** - Google & GitHub social login
- ✅ **Session Management** - Secure session handling with NextAuth.js
- ✅ **Protected Routes** - Middleware-based route protection
- ✅ **Form Validation** - Client-side validation with React Hook Form + Zod

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js v5 (Beta)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4
- **Validation**: Zod + React Hook Form
- **UI Components**: React Icons, React Spinners
- **TypeScript**: Full type safety

## 📁 Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/     # NextAuth.js API routes
│   ├── login/                      # Login page
│   ├── signup/                     # Signup page
│   ├── profile/                    # Protected profile page
│   └── layout.tsx                  # Root layout with SessionProvider
├── components/
│   ├── Login.tsx                   # Login form component
│   ├── Signup.tsx                  # Signup form component
│   ├── Navbar.tsx                  # Navigation with auth state
│   └── FormField.tsx               # Reusable form field component
├── actions/
│   ├── handleLogin.ts              # Server action for login
│   └── handleSignup.ts             # Server action for signup
├── prisma/
│   └── schema.prisma               # Database schema
├── types/
│   ├── next-auth.d.ts              # NextAuth type extensions
│   └── types.ts                    # Custom type definitions
├── auth.config.ts                  # NextAuth configuration
├── auth.ts                         # NextAuth instance
└── middleware.ts                   # Route protection middleware
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd my-app
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/nextauth_demo"

# NextAuth.js
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Optional: Open Prisma Studio
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔐 Authentication Flow

### Sign Up Process
1. User fills out signup form (name, email, password)
2. Form validation using Zod schema
3. Password hashed with bcryptjs
4. User stored in PostgreSQL via Prisma
5. Auto-redirect to login page

### Login Process
1. **Credentials**: Email/password validated against database
2. **OAuth**: Google/GitHub redirect flow
3. Session created and stored
4. Redirect to protected profile page

### Session Management
- Sessions stored in database (Prisma adapter)
- Automatic session refresh
- Secure logout functionality

## 📋 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/signin` | GET/POST | Login page and authentication |
| `/api/auth/signout` | GET/POST | Logout functionality |
| `/api/auth/session` | GET | Get current session |
| `/api/auth/providers` | GET | Get configured providers |

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **CSRF Protection**: Built-in NextAuth.js protection
- **Secure Headers**: Configured via middleware
- **Route Protection**: Middleware-based authentication
- **Type Safety**: Full TypeScript implementation

## 🎨 UI Components

### Form Validation
- Real-time validation feedback
- Error state handling
- Loading states with spinners
- Responsive design

### Navigation
- Dynamic navbar based on auth state
- User profile information display
- Smooth logout functionality

## 📚 Learning Objectives

This tutorial demonstrates:

1. **NextAuth.js v5 Setup** - Latest beta features and configuration
2. **Multiple Auth Providers** - Credentials + OAuth integration
3. **Database Integration** - Prisma with PostgreSQL
4. **Form Handling** - React Hook Form with Zod validation
5. **Route Protection** - Middleware implementation
6. **Session Management** - Server-side session handling
7. **Error Handling** - Comprehensive error states
8. **TypeScript Integration** - Type-safe authentication

## 🚀 Deployment

### Environment Setup
1. Set up PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. Configure OAuth app credentials for production
3. Update `NEXTAUTH_URL` to production domain

### Deploy to Vercel
```bash
npm run build
vercel deploy
```

## 📖 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma ORM](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a tutorial project. Feel free to fork and experiment with different authentication strategies or UI improvements.

## 📄 License

This project is for educational purposes. Use as reference for your own implementations.
