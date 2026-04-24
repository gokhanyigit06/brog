document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');

            if (mobileMenu.classList.contains('flex')) {
                menuBtn.textContent = 'Close';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                menuBtn.textContent = 'Menu';
                document.body.style.overflow = '';
            }
        });
    }
});