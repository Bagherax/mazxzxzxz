# Add Ad Room Module

## 1. Purpose

The Add Ad Room module provides a streamlined, single-page user interface for creating new listings on the MAZDADY marketplace. It is designed as a full-screen overlay that slides up from the bottom, offering a focused and intuitive ad creation experience without navigating away from the main feed.

## 2. How It Works and Connects to Other Modules

### How It Works

-   **UI Logic**: The component's visibility is managed by the main `App.tsx` component. It uses `framer-motion` to handle the smooth slide-up and slide-down animations, ensuring a consistent feel with other overlays in the application.
-   **Internal State**: The component manages its own internal state for all form inputs, including text fields, selections, and checkboxes. It also handles the logic for the multi-image uploader, storing image previews in its state.
-   **Styling**: It is styled with Tailwind CSS and uses the application's theme variables (`maz-surface`, `maz-primary`, etc.) to ensure it is fully responsive and supports both light and dark modes.
-   **Layout**: The component features a fixed header and a sticky footer containing the main action buttons ("Preview" and "Publish"). The main content area is scrollable, allowing for an extensive form on a single page.

### How It Connects

-   **Trigger**: The `AddAdRoom` overlay is opened when a user clicks any of the "Add Ad" options from the central `FloatingNav` component.
-   **Integration**:
    -   `App.tsx` holds the state (`isAddAdVisible`) to control the component's visibility and renders it within an `<AnimatePresence>` tag for proper entry and exit animations.
    -   `FloatingNav.tsx` receives an `onAddAdClick` prop from `App.tsx`, which it calls to set the visibility state to true, thereby launching the overlay.
-   **Actions (Future)**: Currently, the "Publish Ad" button is a placeholder. In a future implementation, it will gather the state from all form fields, package it into a new ad object, and send it to the marketplace service (`src/api/listing.ts`) to be added to the user's on-device storage and the central discovery index.

## 3. Future Extension Notes

-   **Form Validation**: Implement client-side validation for all required fields (e.g., title, price) before allowing submission.
-   **API Integration**: Connect the "Publish Ad" button to the backend API to persist the new ad.
-   **Preview Functionality**: Implement the "Preview Ad" button to open a mock `AdDetailsOverlay` with the current form data, allowing users to see how their ad will look before publishing.
-   **Draft Saving**: Automatically save the form's state to `localStorage` so users don't lose their progress if they accidentally close the overlay.