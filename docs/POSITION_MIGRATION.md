# Project Position Migration

This document explains how the project ordering system works and how to migrate existing projects.

## Overview

Projects now have a `position` field that determines their display order on the homepage and in the admin panel. Lower position numbers appear first.

## Automatic Migration

The admin panel (`/admin`) automatically initializes missing `position` fields when you first load it. Projects without a position will be assigned one based on their creation date (newest first).

## Manual Migration (Optional)

If you prefer to run the migration manually, you can use the migration script:

```bash
pnpm migrate:positions
```

This script will:
1. Connect to your MongoDB database
2. Find all projects without a `position` field
3. Assign positions based on creation date (newest = 0, oldest = N)
4. Save the changes to the database

## How to Use

### Reordering Projects

1. Go to `/admin` (requires authentication)
2. Click and hold the grip icon (⋮⋮) on any project
3. Drag it to the desired position
4. Release to drop
5. The new order is automatically saved

### Display Order

Projects are displayed in ascending order by `position`:
- Position 0 appears first
- Position 1 appears second
- And so on...

If multiple projects have the same position, they're sorted by creation date (newest first).

## Technical Details

- **Field**: `position: Number` (default: 0)
- **API Endpoint**: `PATCH /api/projects/reorder`
- **Sorting**: `{ position: 1, createdAt: -1 }`
- **Library**: [@dnd-kit](https://dndkit.com/) for drag-and-drop

## Troubleshooting

### Projects appear in wrong order
- Check that all projects have a `position` field
- Run the migration script: `pnpm migrate:positions`
- Or simply visit `/admin` to auto-initialize positions

### Drag-and-drop not working
- Ensure you're clicking the grip icon (⋮⋮)
- Check browser console for errors
- Verify you're authenticated as admin

### Position not saving
- Check network tab for failed API requests
- Verify MongoDB connection
- Check server logs for errors
