# Prof. (Col.) Dr. Shekhar Kashyap - Official Medical Web Portal
**Senior Interventional Cardiologist • Former Colonel, Army Medical Corps • AIIMS New Delhi & AFMC Alumnus**

A web application designed for senior interventional cardiologist **Prof. (Col.) Dr. Shekhar Kashyap**. Built with modern Vanilla HTML5, CSS3, and JavaScript, following clinical luxury aesthetics, glassmorphism, responsive architecture, and interactive motion graphics.

---

## 🌟 Key Features & Information Architecture

### 1. Hero Section & Living ECG Motion Graphic
- **Real-Time Canvas ECG Vectorcardiogram**: Renders rhythmic P-Q-R-S-T waveforms with live BPM telemetry and switchable cardiac rhythms:
  - Normal Sinus Rhythm (72 BPM)
  - Athletic Bradycardia (52 BPM)
  - Tachycardia (118 BPM)
- **Synchronized Telemetry Sound (Web Audio API)**: Toggleable cardiac beep synthesized on R-wave peaks (muted by default for accessibility).
- **3D Magnetic Tilt Portrait Card**: Dr. Kashyap's official portrait (`images/photo.png`) framed in an aerospace-grade glass card with live floating vitals (`BP 120/80 mmHg`, `AIIMS Certified`, `Col. (Retd.) AFMC`).
- **Dynamic Counter Badges**: 35+ Years of Leadership, 25,000+ Interventions, 99.2% Procedural Success Rate, 4,500+ Verified Patient Ratings.

### 2. Heritage & Military Pedigree
- Honors Dr. Kashyap’s background as former **Colonel and Head of Cardiology** in the Indian Armed Forces (Army Medical Corps), AFMC Pune gold standard graduation, and AIIMS New Delhi MD & DM Cardiology super-specialty training.
- Features Dr. Kashyap addressing an academic keynote symposium (`images/image2.png`).

### 3. Comprehensive Clinical Specialties Matrix
- Filterable cards across:
  - **Complex Coronary Angioplasty (PCI)**: Left Main (LMCA), Bifurcations, CTO, and Drug-Eluting Stents.
  - **Rotablation & Shockwave IVL**: High-speed rotational atherectomy and intravascular lithotripsy for heavily calcified vessels.
  - **Electrophysiology & Rhythm**: Single/dual chamber pacemakers, AICDs, and CRT-D heart failure resynchronization.
  - **Structural Heart & Valves**: TAVR/TAVI and Balloon Mitral Valvotomy (BMV).
  - **Precision Diagnostics**: Optical Coherence Tomography (OCT), Intravascular Ultrasound (IVUS), and Fractional Flow Reserve (FFR).
  - **Preventive Cardiology & Cardio-Metabolic Care**.

### 4. CardioCheck™ - 10-Year Heart Health Risk Analyzer
- Interactive clinical risk assessment tool with real-time sliders (Age, Systolic BP, Cholesterol) and lifestyle triggers (Smoking, Diabetes, Chest Discomfort).
- **Dynamic SVG Gauge**: Real-time animated needle and risk classification (Low, Moderate, High/Urgent).
- **One-Click Integration**:
  - Automatically autofills the appointment form with the patient's assessment score.
  - Generates a pre-formatted WhatsApp summary message to send directly to Dr. Kashyap's clinical team.

### 5. High-Tech Cath Lab Showcase & STEMI "Golden Hour" Protocol
- Highlights next-gen 10-micron optical intravascular optics (OCT/IVUS).
- Actionable 3-step emergency cardiac protocol for patients and families facing acute chest discomfort, with 24/7 emergency hotline activation.

### 6. Multi-Step Appointment Booking Engine & Calendar Export
- **Step 1**: Select Consultation Format (Apex Heart Institute, Metro Hospital, or Video Tele-Consultation).
- **Step 2**: Pick Consultation Date & morning/evening time slot buttons.
- **Step 3**: Patient Information and medical history.
- **Confirmation Preview**: Generates unique Booking Reference (`SKC-XXXXXX`) and provides a **"Save to Calendar (.ics)"** export for Google Calendar, Apple Calendar, and Outlook.

### 7. Dual Themes & Quick Communication
- Dark Luxe and Light Clinical theme switcher with automatic preference persistence.
- Floating **WhatsApp Consultation** action button (+91 98110 99888).
- Frequently Asked Questions (FAQ) accordion covering stent longevity, pacemaker care, MRI safety, and CGHS/ECHS cashless insurance coverage.

---

## 📁 Project Structure

```
f:\Shekhar-sir\
├── index.html          # Semantic HTML5 markup, meta tags, and accessibility structure
├── styles.css          # Design system tokens, typography, glassmorphism, and responsive grids
├── app.js              # ECG Canvas engine, Web Audio API, CardioCheck™ logic, and booking wizard
├── README.md           # Documentation and user guide
└── images/
    ├── photo.png       # Official executive portrait of Prof. (Col.) Dr. Shekhar Kashyap
    └── image2.png      # Keynote academic symposium address photo
```

---

## 🚀 Running & Deploying

### Option 1: Direct Local Preview
Double-click `index.html` in file explorer or open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server
Using Python:
```bash
python -m http.server 8000
```
Or using Node `serve` / `npx`:
```bash
npx serve .
```

### Option 3: Production Hosting
This application is completely static (no backend database required for client-side rendering) and can be deployed directly to:
- **Vercel**: Import directory or run `vercel`
- **Netlify**: Drag & drop folder or connect Git repository
- **GitHub Pages**: Push to repository and enable GitHub Pages on `main` branch.
