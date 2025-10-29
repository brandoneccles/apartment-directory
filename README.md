# Apartment Directory

An interactive web application for mapping and managing household information in an apartment complex. Features visual floor plans with pan/zoom, detailed household profiles, and powerful filtering capabilities.

## Features

### Interactive Floor Plan Viewer
- **Pan & Zoom**: Smooth mouse/touch controls for navigating floor plans
- **Multiple Buildings & Floors**: Switch between buildings (A, B) and floors (1-4)
- **Clickable Units**: Select any apartment unit to view or edit details
- **Visual Highlighting**: Units are color-coded by status and highlighted based on filters

### Household Management
- **Adults & Children**: Track residents with names, roles, birthdays, and Instagram handles
- **Pets**: Document pets with type, name, and notes
- **Status Tracking**: Mark units as vacant, occupied, friendly, acquaintance, friend, or avoid
- **Badges**: Tag units with attributes (dog-friendly, has-kids, quiet, etc.)
- **Notes**: Add freeform notes about each household

### Filtering & Search
- **Met vs Not Met**: Filter units based on whether you have any stored information
- **Quick Filters**: Has pets, has kids, by status, by badges
- **Search**: Find units by number, resident names, or pet names
- **Real-time Highlighting**: Matching units are highlighted on the map

### Data Management
- **Auto-Save**: Changes are automatically saved to browser localStorage
- **Export**: Download your data as JSON for backup
- **Import**: (Placeholder in V1) Future support for importing data

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Modern utility-first styling
- **Lucide React**: Beautiful icon set
- **localStorage**: Client-side data persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd apartment-directory
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
apartment-directory/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles and theme
├── components/
│   ├── MapViewer.tsx       # SVG floor plan with pan/zoom
│   ├── BuildingSelector.tsx # Building/floor switcher
│   ├── UnitDrawer.tsx      # Side panel for unit details
│   ├── PersonCard.tsx      # Person display/edit component
│   ├── PetCard.tsx         # Pet display/edit component
│   ├── StatusBadgePicker.tsx # Status and badge selector
│   └── FilterBar.tsx       # Search and filter controls
├── lib/
│   ├── storage.ts          # localStorage utilities
│   ├── utils.ts            # Helper functions
│   └── usePanZoom.ts       # Custom hook for pan/zoom
├── types/
│   └── index.ts            # TypeScript type definitions
├── data/
│   └── households.json     # Seed data
└── public/
    └── buildings/          # SVG floor plan files
        ├── building-a-floor-1.svg
        ├── building-a-floor-2.svg
        ├── building-b-floor-1.svg
        └── building-b-floor-2.svg
```

## Data Management

### Adding/Editing Households

1. Click on any unit in the floor plan
2. Click "Edit" in the side drawer
3. Add or modify people, pets, status, badges, and notes
4. Click "Save" to persist changes

Changes are automatically saved to localStorage.

### Seed Data Format

The seed data is located in `/data/households.json`. Here's the structure:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-10-29T00:00:00.000Z",
  "units": [
    {
      "id": "unit-a101",
      "unitNumber": "101",
      "building": "A",
      "floor": 1,
      "adults": [...],
      "children": [...],
      "pets": [...],
      "notes": "...",
      "status": "friend",
      "badges": ["dog-friendly", "helpful"],
      "svgId": "a-101"
    }
  ]
}
```

### Adding Your Own Floor Plans

1. Create SVG files for your floor plans
2. Name them: `building-{A|B}-floor-{1-4}.svg`
3. Place them in `/public/buildings/`
4. Ensure unit shapes have:
   - Class: `unit`
   - ID: matching the `svgId` in your data (e.g., `a-101`)
   - Data attribute: `data-unit="101"` (optional)

Example SVG unit:
```xml
<rect class="unit" id="a-101" data-unit="101" x="70" y="170" width="150" height="120" />
```

### Exporting & Importing Data

**Export:**
- Click the "Export" button in the filter bar
- Downloads a JSON file with all your data

**Import (V1 Placeholder):**
- The Import button is currently disabled
- To import data manually:
  1. Export your data
  2. Edit the JSON file
  3. Clear localStorage (browser dev tools)
  4. Refresh the page to load from seed data
  5. Or paste into localStorage manually

## Customization

### Status Options

Edit `/types/index.ts` to customize status options:

```typescript
export const STATUS_OPTIONS = [
  { value: 'vacant', label: 'Vacant', color: '#6b7280' },
  // Add your own statuses...
];
```

### Badge Types

Add new badge types in `/types/index.ts`:

```typescript
export const AVAILABLE_BADGES: Badge[] = [
  { type: 'dog-friendly', label: 'Dog Friendly', icon: 'dog' },
  // Add your own badges...
];
```

### Theme Colors

Modify colors in `/app/globals.css`:

```css
:root {
  --background: #0a0a0a;
  --foreground: #ededed;
  --primary: #3b82f6;
  /* Customize colors... */
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy with one click

Vercel will automatically detect the Next.js configuration.

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Docker
- Any Node.js hosting

## How It Works

### Pan/Zoom Implementation

The map viewer uses a custom React hook (`usePanZoom`) that:
- Tracks mouse/touch events for panning
- Handles wheel events for zooming
- Applies CSS transforms for smooth interaction
- Prevents zooming beyond min/max bounds

### Filter Logic

Units are filtered using the `unitMatchesFilters` utility:
- "Met" = has any adults, children, pets, or notes
- "Not Met" = completely empty unit
- Multiple filters are AND-ed together
- Search query matches unit number, names, or notes

### Data Persistence

- On first load: fetches `/data/households.json`
- On change: saves to `localStorage`
- On subsequent loads: loads from `localStorage`
- Export: downloads current state as JSON

## Keyboard Navigation

- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons
- **Escape**: Close side drawer (future enhancement)

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+
- Mobile browsers with touch support

## Known Limitations

- Import functionality is stubbed for V1
- No multi-user sync (localStorage is per-browser)
- SVG files must be manually replaced
- No undo/redo for edits

## Future Enhancements

- File upload for custom floor plans
- Real-time import from JSON files
- Database backend for multi-device sync
- Undo/redo functionality
- Keyboard shortcuts
- Print-friendly views
- Timeline of interactions

## Contributing

Feel free to fork and customize this project for your needs!

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Built with Next.js, TypeScript, and Tailwind CSS. Designed for apartment dwellers who want to remember their neighbors.
