function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Script cho bộ lọc chuyên mục
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCardLinks = document.querySelectorAll('.blog-card-link'); // Lọc các thẻ <a>

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;

            blogCardLinks.forEach(link => {
                if (filter === 'all' || link.dataset.category === filter) {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
            });
        });
    });
});