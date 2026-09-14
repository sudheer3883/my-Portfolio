# Sudheer Kumar - Professional Portfolio Website

A modern, responsive, and recruiter-friendly personal portfolio website built with semantic HTML5, CSS3 (Custom Design System with CSS Variables), and vanilla JavaScript.

Designed for **Sudheer Kumar**, B.Tech Computer Science student at AKTU and MERN Stack Developer at SoftPro India, to showcase live projects, technical proficiencies, education, internship experience, and resume.

---

## 🌟 Live Demo & Portfolio Highlights

- **Live Demo Link**: [Sudheer Kumar Portfolio]([https://sudheer3883.github.io/my-Portfolio/](https://sudheer3883.github.io/my-Portfolio/))
- **Live Projects Showcased**:
  - **Amazon Clone**: [Live Demo](https://sudheer3883.github.io/amazon-clone/)
  - **Music Player**: [Live Demo](https://sudheer3883.github.io/music-players/)
  - **Weather App**: [Live Demo](https://sudheer3883.github.io/Whether-App/)
  - **LimeJungeFirst**: [Live Demo](https://sudheer3883.github.io/Limejungefirst/)
  - **Softproinnovation.in (E-commerce)**: React, Node.js, Express.js, MongoDB
  - **Oberoi Hostel**: Hostel management web platform

---

## 🚀 Key Features

1. **Modern Dark Theme Aesthetic**:
   - Deep slate and charcoal background with subtle cyan, blue, and purple ambient glows.
   - Glassmorphic sticky navigation with scroll blur.
   - Micro-interactions, hover card elevations, and clean button transitions.

2. **Full Mobile, Tablet & Desktop Responsiveness**:
   - Custom responsive CSS using Flexbox and Grid.
   - Smooth animated mobile drawer menu with touch-friendly controls.
   - Tested across resolutions: 320px, 375px, 425px, 768px, 1024px, 1440px.

3. **Interactive Project Showcase**:
   - Filter tabs: _All Projects_, _Live Deployments_, and _Full Stack / MERN_.
   - Direct buttons for Live Demos and GitHub repositories.
   - High-quality dark-mode mockups without copyrighted logos.

4. **Integrated Resume Viewer & Download**:
   - Embedded PDF viewer via iframe (`resume/Sudheer-Kumar-Resume.pdf`).
   - Graceful fallback for mobile browsers with one-click direct view/download buttons.
   - Quick "Resume Highlights" summary card.

5. **Client-Side Form Validation**:
   - Real-time client validation for Name, Email format, Subject, and Message length.
   - Clear feedback notification upon submission.
   - Easily connectable to Formspree, EmailJS, or custom Node.js/Express backend.

6. **Accessibility & Performance**:
   - Semantic HTML5 structure with proper heading hierarchies (`h1` through `h4`).
   - Accessible ARIA labels and focus states.
   - Honors `prefers-reduced-motion` for reduced motion accessibility.
   - Zero heavy framework dependencies for lightning-fast page loading.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags, Open Graph meta tags, structured layout.
- **CSS3**: CSS Variables (`:root`), Flexbox, CSS Grid, Glassmorphism, animations.
- **JavaScript (ES6+)**: Vanilla DOM manipulation, IntersectionObserver for scroll spy, event listeners.
- **Google Fonts**: _Plus Jakarta Sans_ (body typography) & _Outfit_ (headings).
- **Font Awesome 6.5.1**: Modern iconography via CDN.

---

## 📁 Project Structure

```text
portfolio website/
│
├── index.html              # Main HTML5 semantic page
├── style.css               # Design system, CSS variables & responsive rules
├── script.js               # Clean vanilla JavaScript interactions & validation
├── README.md               # Project documentation & setup instructions
│
├── images/                 # Professional visual assets & mockups
│   ├── profile.svg         # Developer avatar visual card
│   ├── amazon-clone.jpg    # E-commerce interface preview
│   ├── music-player.jpg    # Audio player preview
│   ├── weather-app.jpg     # Weather forecast dashboard preview
│   ├── limejungefirst.jpg  # Creative frontend layout preview
│   ├── softproinnovation.jpg # Full stack MERN e-commerce preview
│   └── oberoi-hostel.jpg   # Hostel management portal preview
│
└── resume/
    └── Sudheer-Kumar-Resume.pdf # Printable A4 resume document
```

---

## 💻 How to Run Locally

### Option 1: Direct File Opening

Double click `index.html` or right-click `index.html` and select **Open with Chrome / Edge / Firefox**.

### Option 2: VS Code Live Server (Recommended)

1. Open the folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right click on `index.html` and click **Open with Live Server**.
4. The portfolio will launch automatically at `http://127.0.0.1:5500`.

### Option 3: Node.js / Python Local Server

Run with Python:

```bash
python -m http.server 3000
```

Or run with npx:

```bash
npx serve .
```

Then visit `http://localhost:3000` in your browser.

---

## 🌐 How to Deploy to GitHub Pages

1. Initialize git and commit your files:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Sudheer Kumar Portfolio"
   ```

2. Create a repository on GitHub named `portfolio` or `<your-username>.github.io`:

   ```bash
   git branch -M main
   git remote add origin https://github.com/sudheer3883/portfolio.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select Branch: `main` and Folder: `/ (root)`.
   - Click **Save**.
   - Within 1-2 minutes, your website will be live at `https://sudheer3883.github.io/my-Portfolio/`!

---

## ✏️ How to Customize

### 1. Updating Personal Information

Open `index.html` and search for:

- Phone: `+91 8299403883`
- Email: `rsk203096@gmail.com`
- Location: `Hardoi / Lucknow, Uttar Pradesh`
- Links: GitHub and LinkedIn URLs in the header, hero, and contact sections.

### 2. Replacing the Resume PDF

Replace `resume/Sudheer-Kumar-Resume.pdf` with your updated PDF file while keeping the same filename, or update the filename inside `index.html`.

### 3. Connecting the Contact Form to Send Real Emails

To receive form submissions straight to your email without a custom backend:

1. Sign up for free at [Formspree](https://formspree.io/) or [Web3Forms](https://web3forms.com/).
2. Change `<form id="contact-form" class="contact-form">` in `index.html` to:
   ```html
   <form
     id="contact-form"
     action="https://formspree.io/f/YOUR_FORM_ID"
     method="POST"
     class="contact-form"
   ></form>
   ```

---

## 📄 License

Created for personal portfolio use by **Sudheer Kumar**. Free to customize and adapt.
