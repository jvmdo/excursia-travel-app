# Excursia Travel App

## TODO

- PDF features?
  - Are X different PDF libraries needed?

- Form
  - Lagging?
  - Button lagging for sure

- Performance
  - Supabase client increases page load time by 160ms

- CSS
  - Use theme tokens instead of hardcoded styles in itineraries
    - Fonts, colors, custom gradients, what else?
  - Theme button

- Photos
  - New album button: display toast with instructions
  - Add photos in already created albums
  - Edit album name
  - Delete photo from album leads to a screen trap
  - Error handling with toasts1
  
- Rename routes
  - criar-roteiro -> roteiros
  - fotos -> albuns

- OnProfit Webhook API
  - Supabase invite links?

- Itinerary list
  - Feat: database
  
- Auth
  - Remember me
  - Forgot password
  - No need for email verification if webhook is working

- Vercel host
  - excursia-travel.vercel.app
  - excursia-roteiros-de-viagem.vercel.app
  - excursia-itinerary-maker.vercel.app

## Learnings

- `PDFViewer` from `react-pdf` inserts a blank page between routes navigation because of iframes or some shit, which broke the "go back button".
