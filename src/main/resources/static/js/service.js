// === SCRIPT MỚI CHO HIỆU ỨNG SINH ĐỘNG (ĐÃ SỬA LỖI) ===
document.addEventListener('DOMContentLoaded', () => {

    // 1. Hiệu ứng Parallax cho linh vật
    const solutionSection = document.querySelector('.solution-section');
    const mascotImage = document.querySelector('.solution-image img');
    if(solutionSection && mascotImage) {
        solutionSection.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = solutionSection.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) / 25;
            const y = (e.clientY - top - height / 2) / 25;
            mascotImage.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.05)`;
        });
        solutionSection.addEventListener('mouseleave', () => {
            mascotImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
        });
    }

    // 2. Hiệu ứng Spotlight cho thư viện ảnh (SỬA LỖI Ở ĐÂY)
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems) {
        galleryItems.forEach(item => {
            // Tính toán vị trí chuột so với từng item
            item.addEventListener('mousemove', e => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                item.style.setProperty('--mouse-x', `${x}px`);
                item.style.setProperty('--mouse-y', `${y}px`);
            });
            // Reset khi chuột rời khỏi item để hiệu ứng đẹp hơn
            item.addEventListener('mouseleave', () => {
                item.style.removeProperty('--mouse-x');
                item.style.removeProperty('--mouse-y');
            });
        });
    }
});