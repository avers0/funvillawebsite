# Restaurant Website Assignment

This project is a static, GitHub Pages-friendly restaurant website for your assignment.

## Project Structure

- `index.html`, `about.html`, `services.html`, `contact.html`: main website pages
- `assets/css/styles.css`: shared responsive styling
- `assets/js/site-data.js`: single source of truth for restaurant details, menu sections, links, and PDF content
- `assets/js/main.js`: shared rendering for navigation, cards, contact links, and form setup
- `assets/images/wireframe-board.svg`: digital wireframe for the PDF submission
- `docs/content-intake-template.md`: owner interview checklist
- `docs/submission-template.html`: single-file write-up template you can export to PDF

## What To Edit First

1. Open `assets/js/site-data.js`.
2. Update the made-up restaurant details if you want a different concept.
3. Change `links.githubRepo` and `links.githubPages` to the final repo you publish.
4. Add real screenshots before exporting the PDF.

## Local Preview

You can preview the site by opening `index.html` in a browser, or by serving the folder locally with a simple static server.

## GitHub Pages Deployment

1. Create a new GitHub repository.
2. Push this folder to the repository root.
3. In GitHub, open `Settings -> Pages`.
4. Set the source to `Deploy from a branch`.
5. Choose the `main` branch and `/ (root)` folder.
6. Save, wait for the site to publish, and copy the live URL into `assets/js/site-data.js`.

## Contact Form

The contact form currently opens the user's email app with the reservation details filled in. If you want true form submission later, you can connect a service such as Formspree.

## Single PDF Submission

1. Open `docs/submission-template.html` in a desktop browser.
2. Confirm the live link and GitHub repo link are correct and clickable.
3. Add your final desktop and mobile screenshots if needed.
4. Print the page to PDF so the write-up, live link, and repo link stay in one file.
