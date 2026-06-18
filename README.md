# Maras Solutions — Corporate Website

> **Technology × Management × Field Experience**  
> Real experience. Practical solutions. Tangible results.

Maras Solutions combines technology and management consulting into one integrated system, led by practitioners from the field — not just theory. This repository contains the static website for [maras-solutions.com](https://maras-solutions.com), served via Nginx inside Docker and deployed on a GCP Ubuntu VM.

---

## 📁 Project Structure

```
maras-website-test/
├── .github/
│   └── workflows/          # CI/CD: build Docker image & deploy to GCP
├── index.html              # Home page
├── about.html              # About Maras Solutions
├── why-maras.html          # What sets us apart
├── services.html           # Services overview
├── services-consulting.html    # Technical & administrative consulting
├── services-financial.html     # Financial consulting
├── services-it.html            # IT & software solutions
├── contact.html            # Contact page
├── styles.css              # Global stylesheet
├── script.js               # Frontend JavaScript
├── default.conf            # Nginx server configuration
└── Dockerfile              # Nginx-based Docker image
```

---

## 🚀 Deployment Pipeline

### Overview

```
Push to main
    │
    ▼
GitHub Actions
    │  ├── Build Docker image (Nginx + static files)
    │  └── Push image to registry
    │
    ▼
GCP Ubuntu VM
    └── docker compose pull & up
```

### GitHub Actions

The workflow (`.github/workflows/`) triggers on every push to `main` and:

1. Builds the Docker image from the `Dockerfile`
2. Pushes the image to the container registry
3. SSHs into the GCP VM and runs `docker compose pull && docker compose up -d`

### Environment Variables / Secrets Required

Set these in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `GCP_SSH_KEY` | Private SSH key for the GCP VM |
| `GCP_HOST` | Public IP or hostname of the GCP VM |
| `GCP_USER` | SSH username (e.g. `ubuntu`) |
| `REGISTRY_USERNAME` | Container registry username |
| `REGISTRY_PASSWORD` | Container registry password/token |

> Adjust names to match what's already defined in your workflow YAML.

---

## 🐳 Docker & Local Development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/skienlabs/maras-website-test.git
cd maras-website-test

# Build and run
docker build -t maras-website .
docker run -p 8080:80 maras-website
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

### With Docker Compose (mirrors production)

```bash
docker compose up --build
```

---

## 🌐 Pages

| Page | URL path | Description |
|------|----------|-------------|
| Home | `/` | Hero, services overview, CTA |
| About | `/about.html` | Company background and team |
| Why Maras | `/why-maras.html` | Field experience differentiators |
| Services | `/services.html` | All three service pillars |
| Consulting | `/services-consulting.html` | Technical & administrative consulting |
| Financial | `/services-financial.html` | Financial consulting & accounting |
| IT Services | `/services-it.html` | Custom software, IoT, fleet & production systems |
| Contact | `/contact.html` | Contact form and info |

---

## 🛠️ Services Offered

### Technical & Administrative Consulting
- Improving manufacturing processes
- Retail and distribution efficiency
- Human resources and logistics support

### Financial Consulting
- Auditing and financial control
- External accounting (subscription-based)
- On-demand accounting teams
- Feasibility studies

### Information Technology Services
- Custom software and e-commerce stores
- Fleet management systems
- Production and OEE applications
- Salon cashier system and IoT solutions *(no recurring subscription)*

---

## 🏭 Sectors Served

Manufacturing · Food & Beverages · Retail & Distribution · Salons & Beauty Centers · SMEs

---

## 📞 Contact

| | |
|---|---|
| 📧 Email | info@maras-solutions.com |
| 📞 Phone | +966 00 000 0000 |
| 📍 Location | Kingdom of Saudi Arabia |

---

## 📄 License

Private repository — © Maras Solutions. All rights reserved.
