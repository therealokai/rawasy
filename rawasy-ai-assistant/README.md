# Rawasy AI Assistant

A modern, professional web application for automating investment data processing and reporting with real-time Google Sheets integration and workflow automation capabilities.

## Overview

Rawasy AI Assistant provides a clean, intuitive interface for managing automated investment data workflows. The application features real-time connection monitoring, workflow execution, and comprehensive automation history tracking with detailed error reporting.

## Features

- **Google Sheet Status Monitoring** — Real-time connection status indicator with visual feedback
- **Workflow Automation** — Trigger external generation tasks with a single click
- **Automation History** — Complete record of all batch processing runs with timestamps and item counts
- **Error Tracking** — Expandable error details for failed batches with descriptive error messages
- **Responsive Design** — Professional, modern interface that works seamlessly across all devices
- **Real-time Feedback** — Toast notifications for user actions and system events
- **Type-Safe** — Full TypeScript implementation for robust, maintainable code

## Tech Stack

- **Frontend Framework:** React 19 with TypeScript
- **Styling:** Tailwind CSS 4 with custom design tokens
- **UI Components:** shadcn/ui component library
- **Icons:** Lucide React
- **Routing:** Wouter (lightweight client-side router)
- **Notifications:** Sonner (toast notifications)
- **Build Tool:** Vite
- **Package Manager:** pnpm

## Project Structure

```
rawasy-ai-assistant/
├── client/
│   ├── public/
│   │   └── images/          # Static image assets
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/
│   │   │   ├── Home.tsx     # Main dashboard page
│   │   │   └── NotFound.tsx # 404 page
│   │   ├── App.tsx          # Root component with routing
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Global styles and design tokens
│   └── index.html           # HTML template
├── server/
│   └── index.ts             # Express server (static file serving)
├── shared/
│   └── const.ts             # Shared constants
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── tailwind.config.ts       # Tailwind CSS configuration
```

## Installation

### Prerequisites

- Node.js 18+ and pnpm 10+
- Git

### Setup

1. **Extract the project**
   ```bash
   unzip rawasy-ai-assistant.zip
   cd rawasy-ai-assistant
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Development

### Available Scripts

- `pnpm dev` — Start development server with hot module replacement
- `pnpm build` — Build for production
- `pnpm preview` — Preview production build locally
- `pnpm check` — Run TypeScript type checking
- `pnpm format` — Format code with Prettier

### Key Components

#### Home Page (`client/src/pages/Home.tsx`)

The main dashboard component featuring:

- **Status Card** — Displays Google Sheet connection status with visual indicator
- **Action Button** — Triggers external workflow via API endpoint
- **History Table** — Lists all automation records with expandable error details

#### Design System

The application uses a modern minimalist design with professional depth:

- **Color Palette:** Emerald green for success states, rose red for errors, slate gray for text
- **Typography:** Geist font for headers, Inter for body text
- **Spacing:** Generous whitespace and clear visual hierarchy
- **Animations:** Smooth transitions and loading states for interactive elements

## API Integration

### Workflow Trigger Endpoint

The "Run Generation Task" button sends a POST request to `/api/workflow/trigger`:

```typescript
POST /api/workflow/trigger
Content-Type: application/json

{
  "action": "run_generation_task"
}
```

**Expected Response:**

```json
{
  "batchId": "BATCH-005",
  "itemsProcessed": 15,
  "status": "Generated",
  "errorDetails": null
}
```

**Response Fields:**

- `batchId` (string) — Unique identifier for the batch run
- `itemsProcessed` (number) — Count of items processed in this run
- `status` (string) — One of: "Generated", "Error", "Processing"
- `errorDetails` (string, optional) — Error message if status is "Error"

### Connecting Your Endpoint

Update the API endpoint in `client/src/pages/Home.tsx` (line ~75):

```typescript
const response = await fetch("/api/workflow/trigger", {
  // Replace with your actual endpoint:
  // const response = await fetch("https://your-api.com/workflow/trigger", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    action: "run_generation_task",
  }),
});
```

## Customization

### Styling

Global styles and design tokens are defined in `client/src/index.css`. Modify CSS variables to customize:

- **Colors:** Primary, secondary, destructive, accent, and semantic colors
- **Spacing:** Border radius and other spacing values
- **Typography:** Font families and sizes

### Status Indicators

Modify status colors and icons in `Home.tsx`:

```typescript
const getStatusIcon = (status: string) => {
  // Customize status icons here
};

const getStatusBadgeVariant = (status: string) => {
  // Customize status badge colors here
};
```

## Deployment

### Build for Production

```bash
pnpm build
```

This creates an optimized production build in the `dist/` directory.

### Environment Variables

The application uses the following environment variables (automatically injected by Manus):

- `VITE_APP_TITLE` — Application title
- `VITE_APP_LOGO` — Application logo URL
- `VITE_ANALYTICS_ENDPOINT` — Analytics endpoint
- `VITE_ANALYTICS_WEBSITE_ID` — Analytics website ID

### Hosting

The project is configured for deployment on Manus hosting platform. To deploy:

1. Create a checkpoint in the Manus UI
2. Click the "Publish" button
3. Configure custom domain (optional)

For other hosting platforms (Vercel, Netlify, Railway), follow their deployment guides for Vite + React applications.

## Data Persistence

Currently, automation history is stored in component state and resets on page reload. To persist data:

### Option 1: Local Storage

```typescript
useEffect(() => {
  localStorage.setItem('automationHistory', JSON.stringify(automationHistory));
}, [automationHistory]);

useEffect(() => {
  const saved = localStorage.getItem('automationHistory');
  if (saved) setAutomationHistory(JSON.parse(saved));
}, []);
```

### Option 2: Backend Database

Upgrade to the `web-db-user` feature to add database support:

```bash
# In Manus UI: Settings → Features → Add "web-db-user"
```

This enables:
- PostgreSQL database integration
- Backend API routes
- User authentication
- Data persistence across sessions

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
pnpm dev -- --port 3001
```

### Build Errors

Clear cache and reinstall dependencies:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### TypeScript Errors

Run type checking:

```bash
pnpm check
```

## Performance Optimization

- **Code Splitting:** Vite automatically splits code for optimal loading
- **Image Optimization:** Place optimized images in `client/public/images/`
- **CSS Purging:** Tailwind automatically removes unused styles in production
- **Lazy Loading:** Implement React.lazy() for route-based code splitting

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android latest

## Security

- **XSS Protection:** React automatically escapes content
- **CSRF Protection:** Include CSRF tokens when connecting to backend APIs
- **Environment Variables:** Never commit sensitive data; use environment variables
- **API Validation:** Validate all API responses before using in the UI

## Contributing

When modifying the codebase:

1. Follow the existing code style and structure
2. Keep components modular and reusable
3. Add TypeScript types for all props and state
4. Test changes in the development server before building
5. Update this README if adding new features

## License

This project is proprietary software. All rights reserved.

## Support

For issues, feature requests, or questions:

1. Check existing documentation
2. Review component code and comments
3. Test in development environment
4. Contact support through Manus platform

## Version History

- **v1.0.0** (2025-12-25) — Initial release
  - Google Sheet status monitoring
  - Workflow automation trigger
  - Automation history table with error tracking
  - Modern minimalist design
  - Full TypeScript implementation

## Next Steps

1. **Connect Your Workflow Endpoint** — Update the API endpoint to point to your external workflow service
2. **Add Data Persistence** — Implement local storage or database backend for automation history
3. **Real-Time Updates** — Add polling or WebSocket connection for live status updates
4. **User Authentication** — Upgrade to `web-db-user` feature for user management
5. **Advanced Filtering** — Add date range filters and status filters to the history table
6. **Export Functionality** — Add CSV/PDF export for automation records
7. **Email Notifications** — Send email alerts for workflow completion or errors

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
