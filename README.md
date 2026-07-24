# Developer Portfolio

A modern, high-performance developer portfolio built with Next.js 15, React 19, and Tailwind CSS v4. Features rich animations and a fully functional backend for dynamic content management.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Base UI](https://base-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/), [Lenis](https://lenis.darkroom.engineering/) (Smooth Scrolling)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js (v5 beta)](https://authjs.dev/)
- **Content**: [Next MDX Remote](https://github.com/hashicorp/next-mdx-remote)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Media**: [Cloudinary](https://cloudinary.com/)

## Getting Started

### Prerequisites

- Node.js
- MongoDB instance (local or Atlas)
- Cloudinary account (for media storage)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy the `.env.example` file to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to catch errors.
- `npm run seed`: Seeds the database with initial data.

## Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable React components (UI elements, layout components, etc.).
- `/lib`: Utility functions and configuration files.
- `/models`: Mongoose database schemas.
- `/actions`: Next.js Server Actions for handling form submissions and data mutations.
- `/features`: Domain-specific components and logic.
- `/public`: Static assets like images and fonts.

## License

This project is licensed under the MIT License.
