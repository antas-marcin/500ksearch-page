# Weaviate Image Search Application

A simple React + TypeScript web application for searching images in Weaviate using natural language queries.

## Features

- Connect to any Weaviate instance (local or cloud)
- Natural language search for images
- Image grid display with hover details
- Configurable collection/class name
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A running Weaviate instance with image data

## Setup and Installation

1. Clone this repository:

```bash
git clone <repository-url>
cd 500ksearch_page
```

2. Install dependencies:

```bash
npm install
```

3. Start the application (choose one of these options):

```bash
# Development server with hot reloading
npm start

# OR: Build and serve the production version
npm run build
npm run serve-build
```

The application will be available at http://localhost:3000

Note: The build has already been created for you, so you can run `npm run serve-build` directly.

## Configuration

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_WEAVIATE_HOST=localhost:8080
REACT_APP_WEAVIATE_API_KEY=apiKey
REACT_APP_WEAVIATE_SCHEME=http
```

The application uses these environment variables to connect to:
- Weaviate endpoint using the host and scheme from environment variables
- API key from the environment variable
- Collection: "DiffusionPrompt" (searches using the `prompt` target vector)

The application supports two search modes:

1. Text Search: Enter natural language queries like:
   - "space station"
   - "beautiful landscape"
   - "futuristic city"

2. Image Search: Upload an image to find visually similar images
   - Drag and drop an image file
   - Or click to browse and select an image file
   - The application will search using visual similarity with the image targetVector

**Interacting with results:**
- Hover over any image to see a quick preview of the prompt
- Click on any image to open a detailed view showing the full prompt, dimensions, source site, and URL
- Use the "Find Similar" button on each image to find visually similar images using nearObject search

## Building for Production

To create a production build:

```bash
npm run build
```

The build will be in the `dist` directory.

## Customization

- Modify the `weaviateClient.ts` file to change the fields queried from Weaviate
- Update the styling in `styles.css`
- Customize the image card tooltip in `ImageCard.tsx`

## Troubleshooting

- If no images are loading, check that your Weaviate instance is running and accessible
- Verify that the class/collection name matches your Weaviate schema
- Check the browser console for any errors
- Make sure your Weaviate collection has the expected properties (prompt, image)
- This application is compatible with Weaviate client version 2.x and works with the GraphQL API