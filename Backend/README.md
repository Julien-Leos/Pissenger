# Pissenger Backend

## How to run

### Setup Algolia

Go to `https://www.algolia.com/`.

In `functions` folder:
`firebase functions:config:set algolia.api_key="<ALGOLIA ADMIN_KEY>"`
`firebase functions:config:set algolia.app_id="<ALGOLIA APP_ID>"`
`firebase functions:config:get > .runtimeconfig.json`

### Emulator mode

In `functions` folder:
`npm run build-watch`

Open a new terminal in `Backend` folder:
`firebase emulators:start`
