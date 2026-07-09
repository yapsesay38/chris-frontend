# CHRIS web app

Contains a blog-like home page introducing what the Cordillera Heirloom Rice Information System (CHRIS) is.

The Main web-app contains Tables of Heirloom Rice Landraces within the various provinces in CAR including a Masterlist that encompases all the tables into one; each table has a dashboard for single pane viewing. The data represented here are live data pulled from the dedicated server.

The more important part of the web-app is the Input App. The input app allows data to be ingested in the first place. It is what the researchers use in order to record the characterizations of the various Heirloom Rice Landraces. Unlike the Main app, the Input app can be downloaded and used as an offline app.

The data collected by the Input app is stored in a Pocketbase server. The server is individually deployed with a simple Go script.

## Dev Notes

Rewritten XAMPP app into HTML, CSS, JS (AstroJS and some Vue components); Astro is very HTML focused and uses minimal JS, but said JS used here is mostly VanillaJS.

### Dev Test

`pnpm dev`

This is just to test and view the frontend, using the whole app as one full-stack app requires the backend deployed along with it.

## Build and Deploy

To build and deploy, use the Docker Compose script in the above repository.
