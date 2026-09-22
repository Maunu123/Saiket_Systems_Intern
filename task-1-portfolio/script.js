const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = [...contactForm.querySelectorAll('input, textarea')];
  let isValid = true;

  fields.forEach((field) => {
    const valid = field.checkValidity();
    field.classList.toggle('is-invalid', !valid);
    field.classList.toggle('is-valid', valid);
    if (!valid) isValid = false;
  });

  if (!isValid) {
    formStatus.textContent = 'Please check the highlighted fields.';
    formStatus.className = 'form-status text-danger';
    return;
  }

  formStatus.textContent = 'Thanks — your message is ready to send.';
  formStatus.className = 'form-status success';
  contactForm.reset();
  fields.forEach((field) => field.classList.remove('is-valid'));
});
