# Tasks Completed (Sept 1, 2025)

- Removed the external link to the competitor site (prices.osrs.cloud) from the item cards and replaced it with a link to the official RuneScape wiki for each item.
- Implemented colour-coded styling for the "Instant Sell (you receive)" values using the existing margin classes. Profitable values appear green; losses red.
- Reduced the font size for card text to ensure all information fits better on the parchment cards.
- Added "wikiHref" logic in `index.js` to construct OSRS wiki URLs based on item ID or name.

# Next Steps / To-Do

- Use the provided parchment image (blank parchment with FlipTips logo) as the background for item cards. Ensure that all card content (item image, name, buy/sell, yield, ROI, etc.) fits within the blue square portion of the parchment when displayed on an iPhone 16 Pro Max.
- Display item images correctly in each card. Confirm that images are loading from the appropriate source and are scaled properly.
- Apply conditional colouring to the "Instant Sell" value and "Yield after tax" based on profitability (green for profit, red for loss).
- Implement dropdown filter functionality for categories such as "High Volume", "High Cost", "Most Traded", etc., and ensure the filter logic is tested.
- Begin exploring graphing solutions for price history. Prefer to use official sources like the OSRS Wiki real-time price API. If necessary, temporarily pull data from trusted third-party sources but aim to render graphs directly within our application.
- Plan to run automated tests (unit, integration, and E2E) concurrently with development to catch regressions. For now, lean on smoke tests while design iterations continue.
- After each development session, update this TASKS.md file to record completed tasks and new action items.
