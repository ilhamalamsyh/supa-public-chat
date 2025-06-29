# Astro Chat App

A real-time chat application built with Astro.js, React, Tailwind CSS, and Supabase.

## Features

- 🔐 **Authentication**: Login and registration with Supabase Auth
- 💬 **Real-time Chat**: Live messaging with Supabase Realtime
- 👥 **Online Users**: See who's currently online
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- 🏗️ **Clean Architecture**: Well-organized code structure
- 🔒 **Route Protection**: JWT-based authentication guards

## Tech Stack

- **Frontend**: Astro.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: Zustand
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat-related components
│   └── ui/             # Reusable UI components
├── layouts/            # Astro layouts
├── lib/                # Library code
│   ├── auth/           # Authentication services
│   ├── chat/           # Chat services
│   └── supabase/       # Supabase configuration
├── pages/              # Astro pages
├── stores/             # Zustand stores
├── types/              # TypeScript types
├── utils/              # Utility functions
└── middleware.ts       # Route protection middleware
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd astro-island-chat
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
PUBLIC_SUPABASE_URL=your_supabase_url_here
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_jwt_secret_here
```

### 4. Enable Realtime

In your Supabase dashboard:

1. Go to Database > Replication
2. Enable realtime for the `messages` and `users` tables

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:4321`

## Usage

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Chat**: Start chatting in the public chat room at `/chat`

## Features in Detail

### Authentication

- Email and password registration/login
- Username validation
- Password strength requirements
- Automatic session management

### Real-time Chat

- Live message updates
- Online user status
- Message timestamps
- User avatars (initials)

### UI/UX

- Responsive design for all screen sizes
- Loading states and error handling
- Form validation with helpful error messages
- Smooth animations and transitions

### Security

- Route protection with middleware
- JWT-based authentication
- Row Level Security (RLS) in Supabase
- Input validation and sanitization

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app uses Astro's Node adapter, so it can be deployed to any Node.js hosting platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
