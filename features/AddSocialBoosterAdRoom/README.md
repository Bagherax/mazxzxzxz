# Add Social Media Booster Ad Room Module

## 1. Purpose

The Add Social Media Booster Ad Room module provides a specialized user interface for requesting social media promotion services through the MAZDADY marketplace. It is designed as a full-screen overlay that slides up from the bottom, offering a focused and intuitive workflow for users looking to boost their social media presence.

## 2. How It Works and Connects to Other Modules

### How It Works

-   **UI Logic**: The component's visibility is managed by `App.tsx` and it uses `framer-motion` for the same smooth slide-up/down animations as the other ad creation rooms.
-   **Specialized Fields**: This component is tailored specifically for social media services. It features:
    -   A custom, icon-based radio button group for selecting the type of service (e.g., Likes, Views, Followers).
    -   Input fields for platform selection (Instagram, TikTok, etc.), the target URL, the desired quantity, and optional notes for the provider.
-   **Styling**: It is styled with Tailwind CSS and uses the application's theme variables to maintain visual consistency, supporting both light and dark modes. The submit button features a glowing hover effect to match the premium nature of the service.
-   **Top-Level UI**: This component is set with the highest `z-index` (`z-[10000]`) to ensure it appears on top of all other interface elements.

### How It Connects

-   **Trigger**: The `AddSocialBoosterAdRoom` overlay is opened when a user clicks the "Social Booster" option from the central `FloatingNav` component.
-   **Integration**:
    -   `App.tsx` holds the state (`isAddSocialBoosterAdVisible`) to control the component's visibility and passes the appropriate open/close handlers.
    -   `FloatingNav.tsx` receives an `onAddSocialBoosterAdClick` prop from `App.tsx`. The click handler for the ad creation buttons is updated to differentiate between free, paid, and social booster ads, calling the correct function for the "Social Booster" button.
-   **Actions (Future)**: The "Submit Booster Request" button will eventually gather the form data and send it to a dedicated service or create a special type of listing in the marketplace. This would likely involve an API call to a `socialBooster` service endpoint.

## 3. Future Extension Notes

-   **Dynamic Pricing**: The form could be updated to show a price estimate in real-time based on the selected service, platform, and quantity.
-   **API Integration**: Connect the submit button to a backend service to process the booster request, potentially integrating with third-party social media APIs.
-   **Order Tracking**: Add a new section to the user's profile where they can track the status of their active booster requests.
-   **Provider Matching**: The backend could match the request to a provider in the P2P network who specializes in the requested service.