document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach((faq) => {
        faq.classList.remove('active');
        const question = faq.querySelector('.faq-question');
        if (question) question.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  }

  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 250);
    };

    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    const statusBox = document.getElementById('form-status');

    appointmentForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const fullName = appointmentForm.querySelector('input[name="fullName"]').value.trim();
      const phone = appointmentForm.querySelector('input[name="phone"]').value.trim();
      const age = appointmentForm.querySelector('input[name="age"]').value.trim();
      const date = appointmentForm.querySelector('input[name="preferredDate"]').value.trim();
      const time = appointmentForm.querySelector('select[name="preferredTime"]').value.trim();
      const concern = appointmentForm.querySelector('select[name="treatmentConcern"]').value.trim();
      const message = appointmentForm.querySelector('textarea[name="message"]').value.trim();

      if (!fullName || !phone) {
        showStatus('Please enter your full name and phone number.', 'error');
        return;
      }

      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        showStatus('Please enter a valid phone number with at least 10 digits.', 'error');
        return;
      }

      const mailBody = [
        'Hello, I would like to book a physiotherapy appointment at Shiv Physiotherapy and Wellness Centre.',
        '',
        `Full Name: ${fullName}`,
        `Phone Number: ${phone}`,
        age ? `Age: ${age}` : '',
        date ? `Preferred Date: ${date}` : '',
        time ? `Preferred Time: ${time}` : '',
        concern ? `Treatment / Concern: ${concern}` : '',
        message ? `Message: ${message}` : ''
      ].filter(Boolean).join('\n');

      const mailtoLink = `mailto:golukumar1242001@gmail.com?subject=${encodeURIComponent('New Physiotherapy Appointment Request')}&body=${encodeURIComponent(mailBody)}`;

      appointmentForm.reset();
      showStatus('Your request submitted.', 'success');
      window.location.href = mailtoLink;

      function showStatus(text, type) {
        if (!statusBox) return;
        statusBox.textContent = text;
        statusBox.className = `form-status ${type}`;
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const contactStatusBox = document.getElementById('contact-form-status');

    const showContactStatus = (text, type) => {
      if (!contactStatusBox) return;
      contactStatusBox.textContent = text;
      contactStatusBox.className = `form-status ${type}`;
    };

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = contactForm.querySelector('input[name="from_name"]').value.trim();
      const email = contactForm.querySelector('input[name="from_email"]').value.trim();
      const phone = contactForm.querySelector('input[name="phone"]').value.trim();
      const subject = contactForm.querySelector('input[name="subject"]').value.trim();
      const message = contactForm.querySelector('textarea[name="message"]').value.trim();

      if (!name || !email || !message) {
        showContactStatus('Please fill in your name, email, and message.', 'error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showContactStatus('Please enter a valid email address.', 'error');
        return;
      }

      const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone || 'Not provided',
        subject: subject || 'General enquiry',
        message: message
      };

      const serviceId = 'service_XXXXXX';
      const templateId = 'template_XXXXXX';

      if (window.emailjs && serviceId !== 'service_XXXXXX' && templateId !== 'template_XXXXXX') {
        try {
          await emailjs.send(serviceId, templateId, templateParams);
          contactForm.reset();
          showContactStatus('Your request submitted.', 'success');
          return;
        } catch (error) {
          console.error('EmailJS send failed:', error);
        }
      }

      const mailBody = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Subject: ${subject || 'General enquiry'}`,
        '',
        `Message: ${message}`
      ].join('\n');

      const mailtoLink = `mailto:golukumar1242001@gmail.com?subject=${encodeURIComponent(subject || 'New Contact Message')}&body=${encodeURIComponent(mailBody)}`;

      contactForm.reset();
      showContactStatus('Your request submitted.', 'success');
      window.location.href = mailtoLink;
    });
  }

  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
});
