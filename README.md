# Southern Mammoth Project Area - Cave Waivers

A simple, professional website hosting cave access waivers for the Southern Mammoth Project Area.

## Live Site

Deployed on Cloudflare Pages: [Your site URL will appear here after deployment]

## About

This website provides access to liability waivers for two vertical cave entrances:

1. **Ferguson Entrance to Mammoth Cave System (FEMCS)** - Non-commercial vertical entrance with 350+ miles of cave passage
2. **Hatcher Pit Cave** - Non-commercial vertical pit entrance on private property

## Features

- Clean, professional design
- Print-friendly waiver pages
- Mobile responsive
- Easy navigation
- Direct links to individual waivers

## Deployment to Cloudflare Pages

### Initial Setup

1. **Push to GitHub** (already done if you're reading this!)

2. **Connect to Cloudflare Pages:**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Go to "Pages" in the sidebar
   - Click "Create a project"
   - Select "Connect to Git"
   - Choose GitHub and authorize Cloudflare
   - Select the `southern_mammoth` repository

3. **Configure Build Settings:**
   - **Project name:** `southern-mammoth` (or your preferred name)
   - **Production branch:** `main`
   - **Build command:** Leave empty (static site, no build needed)
   - **Build output directory:** `/` (root directory)

4. **Deploy:**
   - Click "Save and Deploy"
   - Your site will be live at `https://southern-mammoth.pages.dev` (or your custom domain)

### Updates

After the initial setup, any push to the `main` branch will automatically trigger a new deployment. Changes go live in ~1 minute.

### Custom Domain (Optional)

To use a custom domain:
1. In Cloudflare Pages project settings, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain (e.g., `southernmammoth.com`)
4. Follow the DNS configuration instructions

## Project Structure

```
southern_mammoth/
├── index.html          # Landing page with cave list
├── ferguson.html       # Ferguson Cave waiver
├── hatcher.html        # Hatcher Pit waiver
└── README.md          # This file

Note: All styling is done with Tailwind CSS (loaded via CDN in each HTML file)
```

## Local Development

To view the site locally, simply open `index.html` in a web browser. No build process or server required.

## Technology

- Pure HTML5
- Tailwind CSS (via CDN)
- Dark theme with emerald green accents
- Glass morphism effects with backdrop blur
- Print-friendly CSS
- 100% static site (no build process required)

## Maintenance

### Updating Waiver Content

1. Edit the respective HTML file (`ferguson.html` or `hatcher.html`)
2. Commit changes: `git add . && git commit -m "Update waiver content"`
3. Push to GitHub: `git push`
4. Cloudflare will automatically deploy within ~1 minute

### Adding New Caves

1. Create a new HTML file (e.g., `newcave.html`) using `ferguson.html` as a template
2. Add a new cave card to `index.html` in the `.cave-list` section
3. Update this README
4. Commit and push

## License

These waivers are legal documents. Do not modify without consulting the property owners and legal counsel.

## Contact

For access permission or questions about the caves, contact the respective property owners listed in the waivers.

---

**Last Updated:** January 2026
