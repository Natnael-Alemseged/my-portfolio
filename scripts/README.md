# SuperMemory Context Management

This directory contains the script to manage your personal context in SuperMemory for the portfolio chatbot.

## Quick Start

1. **Install dependencies** (if not already installed):
   ```bash
   npm install supermemory dotenv
   ```

2. **Set up environment variables** in `.env`:
   ```env
   SUPERMEMORY_API_KEY=your_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Edit the context data** in `manage-context.js`:
   - Update the `CONTEXT_DATA` array with your personal information
   - Add your work experience, projects, skills, etc.

4. **Add context to SuperMemory**:
   ```bash
   node scripts/manage-context.js add
   ```

## Commands

### Add Context
```bash
node scripts/manage-context.js add
```
Adds all items from `CONTEXT_DATA` to SuperMemory with the unique container tag `natnael-portfolio-chatbot`.

### Search Context
```bash
node scripts/manage-context.js search "your search query"
```
Search for specific information in your knowledge base.

### List All Memories
```bash
node scripts/manage-context.js list
```
Lists all memories in the `natnael-portfolio-chatbot` container.

## Container Tag

The script uses a unique container tag: **`natnael-portfolio-chatbot`**

This ensures your portfolio chatbot only retrieves context specific to this project, keeping it separate from other SuperMemory data you might have.

## Updating Context

To update your context:
1. Edit the `CONTEXT_DATA` array in `manage-context.js`
2. Run `node scripts/manage-context.js add` again
3. SuperMemory will update existing entries or create new ones

## Tips

- **Be specific**: Add detailed information about your skills, projects, and experience
- **Use tags**: Organize your context with relevant tags for better retrieval
- **Update regularly**: Keep your context current as you gain new skills or complete new projects
- **Test searches**: Use the search command to verify your context is being retrieved correctly
