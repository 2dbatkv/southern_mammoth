# Southern Mammoth Project Area - Cave Waivers

A simple, professional website hosting cave access waivers for the Southern Mammoth Project Area.

## Live Site

Deployed on Cloudflare Pages: [Your site URL will appear here after deployment]

## About

This website provides access to liability waivers for two vertical cave entrances:

1. **Ferguson Entrance to Mammoth Cave System (FEMCS)** - Non-commercial vertical entrance with 350+ miles of cave passage
2. **Hatcher Pit Cave** - Non-commercial vertical pit entrance on private property

## Features

- **Online Waiver Submission** - Fill out and submit waivers electronically
- **Email Notifications** - Automatic emails sent to participants and property owners
- **Dark Theme Design** - Professional, modern interface matching gocaving.ai
- **Print-friendly** - Waivers optimized for printing
- **Mobile Responsive** - Works perfectly on all devices
- **Form Validation** - Client-side and server-side validation
- **Electronic Signatures** - Legally binding electronic signature capture

## Email Setup with Resend

The waiver forms send automatic email notifications using [Resend](https://resend.com). You need to set this up before deployment.

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Free tier includes 3,000 emails/month (more than enough for cave waivers)
3. Verify your email address

### 2. Add and Verify Your Domain (Recommended)

1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com` or `waivers.yourdomain.com`)
4. Add the DNS records to your domain (in Cloudflare or your DNS provider)
5. Wait for verification (usually a few minutes)

**Note:** You can skip domain verification and use Resend's test domain (`onboarding@resend.dev`) for testing, but verified domains are recommended for production.

### 3. Get Your API Key

1. In Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Name it "Southern Mammoth Waivers"
4. Select "Full Access" permission
5. Copy the API key (starts with `re_`) - you'll need this for Cloudflare

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

4. **Set Environment Variables** (IMPORTANT!)
   - Still in the project setup, scroll to "Environment variables"
   - Add the following variables:
     - `RESEND_API_KEY`: Your Resend API key from above (e.g., `re_xxxxx`)
     - `ADMIN_EMAIL`: Your email address to receive all waiver submissions
     - `PROPERTY_OWNER_EMAIL`: Email for Hatcher Pit owner approval (optional, defaults to ADMIN_EMAIL)

   See `.env.example` for reference.

5. **Deploy:**
   - Click "Save and Deploy"
   - Your site will be live at `https://southern-mammoth.pages.dev` (or your custom domain)

### Update From Email Address

After deployment, you should update the "from" email in `/functions/api/submit-waiver.js`:

```javascript
// Change this line (around line 77 and 93):
from: 'Southern Mammoth Waivers <noreply@yourdomain.com>',
// To use your verified domain:
from: 'Southern Mammoth Waivers <waivers@yourdomain.com>',
```

Then commit and push the change.

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
├── functions/
│   └── api/
│       └── submit-waiver.js    # Cloudflare Pages Function for waiver submission
├── index.html                  # Landing page with cave list
├── ferguson.html               # Ferguson Cave waiver form
├── hatcher.html                # Hatcher Pit waiver form
├── .env.example                # Environment variables template
└── README.md                   # This file

Note: All styling is done with Tailwind CSS (loaded via CDN in each HTML file)
```

## Local Development

To view the site locally, simply open `index.html` in a web browser. No build process or server required.

## Technology

**Frontend:**
- Pure HTML5 with form validation
- Tailwind CSS (via CDN)
- Vanilla JavaScript for form handling
- Dark theme with emerald green accents
- Glass morphism effects with backdrop blur
- Print-friendly CSS
- Responsive design (mobile-first)

**Backend:**
- Cloudflare Pages Functions (serverless)
- Resend API for email delivery
- JSON-based data handling
- No database required

## How Waiver Submission Works

1. **User fills out waiver** → Client-side validation checks all required fields
2. **User clicks submit** → Form data sent to Cloudflare Pages Function at `/api/submit-waiver`
3. **Server validates** → Function validates signature matches name, all fields present
4. **Emails sent** → Two emails via Resend API:
   - **To participant:** Confirmation email with waiver copy
   - **To property owner/admin:** Notification email with full waiver details
5. **Success message** → User sees confirmation on screen

For Hatcher Pit submissions, the property owner receives the waiver for approval before the participant can access the cave.

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
