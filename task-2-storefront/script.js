const cartCount = document.querySelector('#cartCount');
let cartItems = 0;

document.querySelectorAll('.add-button').forEach((button) => {
  button.addEventListener('click', () => {
    cartItems += 1;
    cartCount.textContent = cartItems;
    button.textContent = 'Added to bag ✓';
    setTimeout(() => { button.textContent = 'Add to bag +'; }, 1200);
  });
});

document.querySelectorAll('.filter').forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((button) => button.classList.remove('active'));
    filterButton.classList.add('active');
    const category = filterButton.dataset.filter;
    document.querySelectorAll('.product-card').forEach((card) => {
      card.classList.toggle('d-none', category !== 'all' && card.dataset.category !== category);
    });
  });
});

document.querySelector('#newsletterForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#newsletterEmail');
  const status = document.querySelector('#newsletterStatus');
  if (!input.checkValidity()) {
    status.textContent = 'Please enter a valid email address.';
    status.className = 'text-danger';
    return;
  }
  status.textContent = 'You are on the list.';
  status.className = 'text-success';
  input.value = '';
});
