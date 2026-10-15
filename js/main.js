/**
 * MVZ Dr. Wolfgang Koch GmbH - Karriereportal
 * main.js: Zentrales Skript für interaktive Komponenten,
 * E-Mail-Spam-Schutz & dynamische Betreffzeilen-Generierung
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Mobile Navigation & Header-Scroll
  // ==========================================================================
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const siteHeader = document.querySelector('.site-header');

  if (mobileNavToggle && mainNav) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('is-open');
    });

    // Menü schließen bei Klick auf einen Navigations-Link
    const navLinks = mainNav.querySelectorAll('.nav-link, .nav-btn-contact');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header-Schatten bei Scrollen aktivieren
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

  // ==========================================================================
  // 2. E-Mail-Spam-Schutz & dynamische Betreffzeilen-Generierung (.btn-apply)
  // ==========================================================================
  const applyButtons = document.querySelectorAll('.btn-apply');

  applyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Benutzer und Domain aus den data-Attributen auslesen (Default: karriere@praxis-dr-koch.de)
      const user = btn.getAttribute('data-user') || 'karriere';
      const domain = btn.getAttribute('data-domain') || 'praxis-dr-koch.de';
      const email = `${user}@${domain}`;

      // Jobtitel ermitteln: entweder aus dem Attribut, aus dem H1 der Detailseite oder aus der nächsten Card
      let jobTitle = btn.getAttribute('data-job-title');
      if (!jobTitle) {
        const pageH1 = document.querySelector('h1.job-hero-title, h1');
        const cardTitle = btn.closest('.job-card')?.querySelector('.job-card-title, h2, h3');
        jobTitle = cardTitle?.textContent?.trim() || pageH1?.textContent?.trim() || '';
      }

      // Prüfen, ob es sich um eine Kontaktanfrage (z. B. Frau-Köhler-Widget) oder eine Bewerbung handelt
      const isContactInquiry = btn.closest('.contact-widget') !== null || 
                               btn.textContent.toLowerCase().includes('kontakt');

      // Dynamische Betreffzeile bestimmen
      let subject = btn.getAttribute('data-subject');
      if (!subject) {
        if (isContactInquiry) {
          subject = jobTitle 
            ? `Karriereanfrage / Kontakt bezüglich: ${jobTitle}` 
            : 'Karriereanfrage / Kontakt – MVZ Dr. Wolfgang Koch GmbH';
        } else {
          subject = jobTitle 
            ? `Bewerbung als ${jobTitle}` 
            : 'Bewerbung via Karriereportal – MVZ Dr. Wolfgang Koch GmbH';
        }
      }

      // Passenden vorbereiteten E-Mail-Textkörper generieren
      let body = '';
      if (isContactInquiry) {
        body = `Hallo Frau Köhler,\n\nich interessiere mich für die Karrieremöglichkeiten bei der MVZ Dr. Wolfgang Koch GmbH und habe eine kurze Frage${jobTitle ? ` zur Position „${jobTitle}“` : ''}:\n\n[Ihre Nachricht]\n\nIch freue mich über Ihre Rückmeldung!\n\nMit freundlichen Grüßen\n`;
      } else {
        body = `Hallo Frau Köhler,\n\nanbei sende ich Ihnen meine Bewerbungsunterlagen${jobTitle ? ` für die Position „${jobTitle}“` : ''}.\n\nIch freue mich auf Ihre Rückmeldung!\n\nMit freundlichen Grüßen\n`;
      }

      // E-Mail-Client des Nutzers öffnen
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  });
});
