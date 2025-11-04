# Category Folder Module

## 1. Purpose

The Category Folder module provides a centralized, interactive, and visually appealing way for users to browse the marketplace's category hierarchy. It is designed as a slide-up panel that is accessible from the main header, offering a quick and intuitive navigation experience without leaving the main feed.

## 2. How It Works and Connects to Other Modules

### How It Works

- **UI Logic**: The component's visibility is controlled by the main `App.tsx` component, ensuring consistent overlay management across the application. It uses `framer-motion` for the smooth slide-up and slide-down animations.
- **Internal State**: The component manages its own internal state to track which category folders are currently expanded or collapsed. Each top-level category is an independently controlled accordion.
- **Styling**: It is styled with Tailwind CSS and uses the application's theme variables (`maz-primary`, `maz-surface`, etc.) for a consistent look and feel that supports both light and dark modes.
- **Data**: The category data is currently hard-coded within the component for simplicity but can be easily refactored to accept data from props or a global context in the future.

### How It Connects

- **Trigger**: The `CategoryFolder` is opened by a new folder icon added to the `AiChat.tsx` component in the main application header.
- **Integration**: The `App.tsx` component holds the state (`isCategoryFolderVisible`) that determines whether the overlay is shown. It renders the component conditionally within an `<AnimatePresence>` tag to enable exit animations.
- **Actions (Future)**: Clicking on a subcategory (`FileItem`) currently performs no action. In a future implementation, clicking a category will trigger a filter action on the main feed, updating the `FeedContainer` to show only items from the selected category. This would likely involve updating a shared `SearchContext` or `FilterContext`.

## 3. Future Extension Notes

- **Dynamic Data**: Move the hard-coded `categories` array out of the component. Fetch it from a static JSON file or an API endpoint, and pass it down as props.
- **Filter Integration**: Connect the `FileItem` click event to the main feed's filtering logic. This will require a mechanism to pass the selected category back up to `App.tsx` or a shared state context.
- **Searchable Categories**: Add a search input at the top of the panel to allow users to quickly filter the list of categories.
- **Recently Used**: Store the user's most recently viewed categories in `localStorage` and display them in a "Recent" section at the top for faster access.