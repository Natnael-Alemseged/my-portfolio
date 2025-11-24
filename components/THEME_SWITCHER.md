# Component Theme Switcher

This directory contains both **Modern** and **Terminal** themed versions of key components.

## Available Versions

### Work Experience Component
- **`WorkExperience.tsx`** - Currently active (Terminal theme)
- **`WorkExperience.modern.tsx`** - Modern gradient design with rounded cards
- **`WorkExperience.terminal.tsx`** - Fallout 4 terminal theme with scanlines

### Technologies Component
- **`Technologies.tsx`** - Currently active (Terminal theme)
- **`Technologies.modern.tsx`** - Modern gradient cards with rounded corners
- **`Technologies.terminal.tsx`** - Fallout 4 terminal theme with command-style tabs

## How to Switch Themes

### Option 1: Replace Files (Recommended)

To switch to **Modern** theme:
```bash
# Backup current version
Copy-Item components\WorkExperience.tsx components\WorkExperience.backup.tsx
Copy-Item components\Technologies.tsx components\Technologies.backup.tsx

# Switch to modern
Copy-Item components\WorkExperience.modern.tsx components\WorkExperience.tsx -Force
Copy-Item components\Technologies.modern.tsx components\Technologies.tsx -Force
```

To switch back to **Terminal** theme:
```bash
# Switch to terminal
Copy-Item components\WorkExperience.terminal.tsx components\WorkExperience.tsx -Force
Copy-Item components\Technologies.terminal.tsx components\Technologies.tsx -Force
```

### Option 2: Comment/Uncomment in Code

You can also import both versions and conditionally render:

```tsx
// In your page/layout file
import WorkExperienceModern from '@/components/WorkExperience.modern';
import WorkExperienceTerminal from '@/components/WorkExperience.terminal';

// Use environment variable or config
const USE_TERMINAL_THEME = true;

export default function Page() {
  return (
    <>
      {USE_TERMINAL_THEME ? (
        <WorkExperienceTerminal />
      ) : (
        <WorkExperienceModern />
      )}
    </>
  );
}
```

## Theme Comparison

| Feature | Modern | Terminal |
|---------|--------|----------|
| **Font** | Sans-serif | Monospace |
| **Colors** | Multi-color gradient | Green monochrome |
| **Borders** | Rounded corners | Sharp edges |
| **Effects** | Blur, shadows | Scanlines, CRT glow |
| **Style** | Contemporary | Fallout-inspired |
| **Best For** | Professional polish | Tech/retro aesthetic |

## Notes

- Both versions maintain the same functionality
- Terminal theme requires the utility classes in `app/globals.css`
- Modern theme works standalone without additional CSS
- The terminal scrollbar styling in `globals.css` applies globally

## Current Active Theme

✅ **Terminal Theme** (Fallout 4 style)

To verify which theme is active, check the component files:
- Look for `font-mono` and `terminal-` classes = Terminal theme
- Look for `rounded-` and gradient colors = Modern theme
