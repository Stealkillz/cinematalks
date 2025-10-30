# CinemaTalks

CinemaTalks is a lightweight community portal dedicated to Indian cinema superfans. It allows members of a private fan circle to share iconic stills and short clips from their favourite movies and short films, celebrate beloved actors and actresses, and discuss the context that makes each moment special.

## Features

- Upload JPEG/PNG/WEBP images and MP4/WEBM clips up to 30 MB.
- Capture context for each post with a title, description, focus (actor, actress, ensemble) and cinema region (Bollywood, Tollywood, Kollywood, Mollywood, Sandalwood or other).
- Browse a rich media feed that automatically categorises uploads and shows when they were shared.
- Filter the community feed by cinema region and focus to find content that matches your fandom mood.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm start
   ```
3. Open <http://localhost:3000> in your browser. The landing page includes the upload form and a feed of existing posts.

## Local testing checklist

Follow the steps below to test the end-to-end experience locally.

1. **Start the server** using `npm start`. The command logs `Server listening on http://localhost:3000` when the Express app is ready.
2. **Upload media** through the form on the home page. Select an image (JPEG/PNG/WEBP) or short video (MP4/WEBM), complete the title and description fields, and choose the focus and cinema region filters before submitting.
3. **Verify persistence** by confirming that your new entry appears in the feed immediately after upload. The post metadata is appended to `data/posts.json`, and the uploaded file is stored under `uploads/`.
4. **Filter the feed** using the cinema region and focus dropdowns to make sure posts are narrowed correctly.
5. **Restart the server** and refresh the page. Previously uploaded posts should continue to display, demonstrating that the JSON persistence works across restarts.

Uploaded files are stored inside the local `uploads/` directory. Metadata is saved inside `data/posts.json`. For production deployment you should connect the API to a persistent database and object storage service, and add authentication and moderation tooling to keep the community welcoming.
