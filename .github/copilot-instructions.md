# GitHub Copilot Instructions for Pixel Art Editor

## Project Overview

This is a pixel art drawing application built with Next.js 16, React 19, TypeScript, and SCSS Modules. The app provides a canvas-based drawing experience with tools for creating, editing, and saving pixel art.

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **React**: Version 19.2.0 (latest)
- **TypeScript**: Version 5
- **Styling**: SCSS Modules with custom variables and mixins
- **Icons**: React Icons (react-icons/ri, react-icons/md)
- **Code Quality**: ESLint + Prettier

## Code Style and Conventions

### TypeScript

- Use **strict TypeScript** with explicit types
- Define interfaces for all props and complex data structures
- Use enums for fixed sets of values (e.g., `Mode.DRAW`, `Mode.ERASE`)
- Prefer named exports over default exports for components (except in app router pages)
- Use TypeScript type inference where obvious, explicit types where clarity is needed

### React Components

- Use **functional components** with hooks exclusively
- Mark client components with `'use client'` directive when using hooks or browser APIs
- Component file structure:
  ```
  ComponentName/
  ├── index.tsx (barrel export)
  ├── ComponentName.tsx (component implementation)
  └── component-name.module.scss (styles)
  ```
- Import styles as: `import styles from './component-name.module.scss'`
- Apply className using: `className={styles.className}`

### Props and Interfaces

- Define props interfaces explicitly (e.g., `interface ButtonProps`)
- Use descriptive prop names
- Optional props should use the `?` syntax
- Include JSDoc comments for complex functions and props

### State Management

- Use `useState` for local component state
- Use `useRef` for DOM references and non-reactive values
- Use `useContext` with custom hooks (e.g., `useGlobalContext()`)
- Context is located in `context/GlobalContext.tsx`
- Current context provides: `toast` and `addToast` for notifications

### Styling

- Use **SCSS Modules** exclusively (no inline styles except for dynamic values)
- Import variables from `styles/_variables.scss`:
  - Colors: `$grey`, `$grey-ish`, `$grey-light`, `$smoke`, `$white`, `$black`, `$green`, `$yellow`, `$blue`, `$red`, `$red-light`
  - Font sizes: `$default-font-size` (20px), `$medium-font-size` (28px), `$big-font-size` (39.5px)
  - Spacing: `$default-spacing` (27px), `$medium-spacing` (15px), `$small-spacing` (10px)
  - Z-indexes: `$z-index-behind`, `$z-index-surface`, `$z-index-bottom`, `$z-index-middle`, `$z-index-top`
- Import mixins from `styles/_mixins.scss` when needed
- Class naming: use kebab-case (e.g., `button-primary`, `icon-container`)

### Import Patterns

- Use path aliases with `@/` prefix:
  - `@/components/ComponentName` for components
  - `@/context` for context providers and hooks
  - `@/styles` for global styles
- Group imports by type:
  1. SCSS modules (first)
  2. External libraries
  3. React and Next.js
  4. Internal components and utilities
  5. Data/JSON files

Example:
```typescript
import styles from './component.module.scss';

import { IconName } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import NextImage from 'next/image';

import { useGlobalContext } from '@/context';
import { Button } from '@/components/Button';

import data from './data.json';
```

### Event Handlers

- Prefix handler functions with `handle` (e.g., `handleClick`, `handleColorChange`)
- For start/stop actions, use descriptive names (e.g., `startDrawing`, `stopDrawing`)
- Type event handlers properly using React types (e.g., `MouseEventHandler`, `ChangeEvent<HTMLInputElement>`)

### Canvas Operations

- The main canvas is 600x600px with 20px squares (30x30 grid)
- Canvas operations use the Canvas API via `useRef<HTMLCanvasElement>`
- Canvas context is stored in state as `CanvasRenderingContext2D | null`
- Grid colors: `GRID_COLOR: '#EEEEEE'`, `GRID_STROKE: '#DDDDDD'`

### State History Pattern

- Implement undo/redo using history array and step counter
- Serialize state as JSON string for history tracking
- Deep clone objects before mutations: `JSON.parse(JSON.stringify(object))`

### Form Validation

- Use controlled components with `value` and `onChange`
- Enable validation with state flags (e.g., `validationEnabled`)
- Display error messages conditionally based on validation state
- Disable submit buttons until form is valid

### Icons

- Import from `react-icons/ri` (Remix Icons) and `react-icons/md` (Material Design)
- Common icons in use:
  - `RiPencilFill` (draw)
  - `RiEraserFill` (erase)
  - `RiPaintFill` (fill)
  - `RiPaletteLine` (color picker)
  - `RiArrowGoBackFill` (undo)
  - `RiArrowGoForwardFill` (redo)
  - `RiSave3Fill` (save)
  - `RiDeleteBinLine` (clear)
  - `MdKeyboardArrowLeft` (collapse/expand)

### File Naming

- Components: PascalCase (e.g., `Button.tsx`, `FormField.tsx`)
- Styles: kebab-case with `.module.scss` (e.g., `button.module.scss`)
- Utils/helpers: camelCase (e.g., `utils.ts`)
- Types/interfaces: Define inline or in component files
- Constants: UPPER_SNAKE_CASE within functions/files

### Code Formatting (Prettier)

- Print width: 100 characters
- Tab width: 2 spaces
- Semicolons: required
- Quotes: single quotes
- Trailing commas: always
- Bracket spacing: true

### Comments and Documentation

- Add JSDoc comments for complex functions
- Include inline comments for non-obvious logic
- Document interfaces with property descriptions where helpful
- Explain canvas operations and drawing algorithms

## Component Patterns

### Button Component

```jsx
<Button
  type="primary" // "primary" | "secondary" | "tertiary" | "icon"
  onClick={handleClick}
  disabled={false}
  highlighted={false}
  inForm={false}
  bgColor="#000000" // optional, for color preview
>
  {children}
</Button>
```

### Toast Notifications

```typescript
const { addToast } = useGlobalContext();

addToast({
  type: 'success', // 'success' | 'error' | 'info' | 'warning'
  message: 'Your message here'
});
```

### Form Field

```jsx
<FormField
  type="text"
  value={value}
  onChange={handleChange}
  placeholder="Enter text"
  validationEnabled={true}
  errorMessage="Error text"
/>
```

## Best Practices

1. **Client Components**: Always use `'use client'` for components using hooks, browser APIs, or canvas
2. **Type Safety**: Leverage TypeScript fully - avoid `any` types
3. **Accessibility**: Include appropriate ARIA labels and semantic HTML
4. **Performance**: Use `useRef` for values that don't need to trigger re-renders
5. **State Updates**: Batch related state updates together
6. **Error Handling**: Show user-friendly messages via toast notifications
7. **JSON Data**: Use JSON files for initial state and sample data
8. **Exports**: Use barrel exports (index.tsx) for cleaner imports
9. **Naming**: Be descriptive and consistent with naming conventions
10. **Component Size**: Keep components focused and split into smaller pieces when needed

## Common Tasks

### Adding a New Component

1. Create folder in `components/` with PascalCase name
2. Create three files: `index.tsx`, `ComponentName.tsx`, `component-name.module.scss`
3. Define props interface in component file
4. Export from index.tsx: `export { ComponentName } from './ComponentName';`
5. Use SCSS modules for styling

### Adding New Canvas Features

1. Define mode in `Mode` enum if applicable
2. Add icon and button to toolbar
3. Implement drawing logic with canvas context
4. Update history on changes
5. Test with undo/redo functionality

### Styling Guidelines

- Use existing color variables from `_variables.scss`
- Maintain consistent spacing using spacing variables
- Use mixins for reusable style patterns
- Keep specificity low by using modules
- Mobile-first responsive design approach

## Don't Do

- ❌ Don't use default exports (except in app router pages)
- ❌ Don't use inline styles (except for dynamic colors from state)
- ❌ Don't use `any` type
- ❌ Don't use class components
- ❌ Don't forget `'use client'` when using hooks
- ❌ Don't use global CSS classes (use SCSS modules)
- ❌ Don't mutate state directly (always create new objects/arrays)
- ❌ Don't forget to update history for undo/redo functionality

## Always Do

- ✅ Use functional components with hooks
- ✅ Use TypeScript interfaces for props
- ✅ Use SCSS modules for styling
- ✅ Use path aliases (`@/`)
- ✅ Add JSDoc comments for complex logic
- ✅ Follow the established folder structure
- ✅ Test canvas operations in browser
- ✅ Validate forms before submission
- ✅ Provide user feedback via toast notifications
- ✅ Make components reusable and composable

## Testing Considerations

When writing code, consider:
- Canvas API compatibility across browsers
- Mobile touch events vs mouse events
- State persistence and history management
- File download functionality (JSON and PNG)
- Color picker browser support
- Responsive design for different screen sizes

## Future Enhancements to Consider

- Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
- Grid size customization
- Additional drawing tools (line, rectangle, circle)
- Color palette presets
- Export formats (SVG, GIF)
- Layers support
- Animation frames
- Collaborative editing

