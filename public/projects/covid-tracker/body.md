## Overview

Built during the COVID-19 pandemic, this dashboard aggregates live global statistics from the disease.sh API and presents them across four interactive views. The goal was to make a dense data set legible at a glance while still supporting drill-down into individual countries.

## Highlights

- Leaflet dark-map with proportional circle markers scaled to case counts
- Chart.js daily-delta line chart showing new cases, recoveries, and deaths over time
- Per-100k population normalization for fair country-to-country comparison
- Auto-refresh every 5 minutes to keep stats current without a page reload
- Stack modernized to React 19 and Vite 7 with code-split lazy loading and a Vitest test suite
