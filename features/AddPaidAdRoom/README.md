# Add Paid Ad Room Module

## 1. Purpose

The Add Paid Ad Room module provides a dedicated user interface for creating and submitting paid/sponsored listings on the MAZDADY marketplace. It is designed as a full-screen overlay that slides up from the bottom, offering a focused workflow for users who want to promote their items.

## 2. How It Works and Connects to Other Modules

### How It Works

-   **UI Logic**: Similar to the free ad room, its visibility is managed by `App.tsx` and it uses `framer-motion` for smooth slide-up/down animations.
-   **Specialized Fields**: While sharing a base structure with the free ad room, this component includes specific sections for paid promotions, such as "Ad Duration" and "Payment Method".
-   **Styling**: It is styled with Tailwind CSS and uses the application's theme variables to maintain visual consistency, including support for light and dark modes. The primary action button has a unique glowing hover effect to signify a premium action.
-   **High Priority UI**: This component is set with a very high `z-index` (`z-[9999]`) to ensure it appears on top of all other interface elements, including the free ad room and the chat popup.

### How It Connects

-   **Trigger**: The `AddPaidAdRoom` overlay is opened when a user clicks the "Add Paid Ads" or "Social Booster" options from the central `FloatingNav` component.
-   **Integration**:
    -   `App.tsx` holds the state (`isAddPaidAdVisible`) to control the component's visibility.
    -   `FloatingNav.tsx` receives an `onAddPaidAdClick` prop from `App.tsx`. This prop is called specifically by the paid ad buttons to differentiate their action from the free ad button.
-   **Actions (Future)**: The "Submit Paid Ad" button will eventually integrate with a payment processing API. After a successful payment, it will gather the form data and send it to the marketplace service (`src/api/listing.ts`) to be posted as a sponsored ad.

## 3. Future Extension Notes

-   **Payment Integration**: Connect the payment method selection to a real payment gateway (e.g., Stripe, or a custom crypto payment handler).
-   **Dynamic Pricing**: The ad duration prices are currently static. This could be made dynamic based on category, demand, or user-selected boosting options.
-   **Live Preview**: Enhance the "Preview Ad" button to show how the ad will look with a "Sponsored" tag in the feed.
-   **Receipt/Confirmation**: After successful submission and payment, show a confirmation modal with transaction details.