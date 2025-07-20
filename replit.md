# replit.md

## Overview

This is a full-stack web application built for a JSON Schema Builder, designed as part of an HROne Frontend Intern hiring task. The application allows users to create, edit, and manage JSON schemas through an interactive interface with real-time preview capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: ShadCN UI components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **Development**: Hot reloading with Vite integration in development mode

### Development Setup
- **Monorepo Structure**: Client, server, and shared code in separate directories
- **Shared Types**: Common schemas and types shared between frontend and backend
- **Development Server**: Vite proxy setup for seamless full-stack development

## Key Components

### Schema Builder Components
1. **FieldRow Component**: Handles individual schema field creation and editing
   - Supports String, Number, Float, Boolean, ObjectId, and Nested field types
   - Type-specific input controls (Boolean dropdowns, number inputs with step validation)
   - Color-coded visual indicators for different field types
   - Recursive nesting capability for complex schemas
   - Real-time validation and error handling

2. **JsonPreview Component**: Real-time JSON schema preview
   - Live updates as fields are modified
   - Copy to clipboard functionality
   - Download as JSON file
   - Formatted display with syntax highlighting

3. **SchemaBuilder Page**: Main application interface
   - Tabbed interface (Builder/JSON Preview)
   - Form management with React Hook Form
   - Add/remove field functionality
   - Import/export schema capabilities

### UI Components
- Comprehensive ShadCN UI component library
- Accessible design with ARIA compliance
- Dark/light theme support via CSS variables
- Responsive design for mobile and desktop

## Data Flow

### Schema Management Flow
1. User interacts with FieldRow components to create/edit fields
2. Form data is managed by React Hook Form with Zod validation
3. Changes trigger real-time JSON schema generation
4. Generated schema is displayed in JsonPreview component
5. User can export/save schemas or continue editing

### Validation Pipeline
1. Input validation at component level using Zod schemas
2. Form-level validation with React Hook Form integration
3. Real-time feedback for invalid field configurations
4. Prevention of invalid schema generation

### State Management
- Local component state for UI interactions
- React Hook Form for form state management
- TanStack Query for server state caching
- No global state management (intentionally simple)

## External Dependencies

### Core Dependencies
- **@radix-ui/react-***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **drizzle-orm**: Type-safe database queries
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **zod**: Runtime type validation
- **wouter**: Lightweight routing
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **tailwindcss**: Utility-first CSS framework
- **eslint/prettier**: Code quality and formatting

### Database Dependencies
- **PostgreSQL**: Primary database (via Neon serverless)
- **drizzle-kit**: Database migration management
- **connect-pg-simple**: PostgreSQL session storage

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Hot reloading with Vite middleware
- **Production**: Static file serving with Express
- **Database**: Environment-based connection via `DATABASE_URL`

### Hosting Considerations
- **Frontend**: Can be deployed to Vercel, Netlify, or similar platforms
- **Backend**: Node.js compatible hosting (Vercel, Railway, etc.)
- **Database**: Neon Database provides serverless PostgreSQL
- **Full-stack**: Single deployment with Express serving static files

### Scripts
- `npm run dev`: Development server with hot reloading
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server
- `npm run db:push`: Apply database schema changes

The application is designed to be easily deployable as a single unit while maintaining clear separation between frontend and backend concerns.