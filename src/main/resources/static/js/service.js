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

    // 2. Hiệu ứng Spotlight cho thư viện ảnh
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
// === SCRIPT XỬ LÝ LIGHTBOX GALLERY ===
// === SCRIPT MỚI: XỬ LÝ LIGHTBOX 2 LỚP ===
document.addEventListener('DOMContentLoaded', () => {

    // --- NƠI ĐỂ DỮ LIỆU CÁC BỘ SƯU TẬP ẢNH ---
    const galleries = {
        'Big 8': ['/images/ServicesPage/Big_8_images/1.webp', '/images/ServicesPage/Big_8_images/2.webp', '/images/ServicesPage/Big_8_images/3.webp','/images/ServicesPage/Big_8_images/5.webp',
                    '/images/ServicesPage/Big_8_images/6.webp','/images/ServicesPage/Big_8_images/7.webp','/images/ServicesPage/Big_8_images/8.webp','/images/ServicesPage/Big_8_images/9.webp','/images/ServicesPage/Big_8_images/10.webp',
                    '/images/ServicesPage/Big_8_images/11.webp', '/images/ServicesPage/Big_8_images/12.webp','/images/ServicesPage/Big_8_images/13.webp','/images/ServicesPage/Big_8_images/14.webp' ],
        'PEPSICO': ['https://placehold.co/1200x800/e67e22/ffffff?text=Boehringer+Ảnh+1', 'https://placehold.co/1200x800/e67e22/ffffff?text=Boehringer+Ảnh+2'],
        'sony': ['https://placehold.co/1200x800/2ecc71/ffffff?text=Sony+Ảnh+1'],
        'tetrapak': ['https://placehold.co/1200x800/9b59b6/ffffff?text=Tetra+Pak+Ảnh+1', 'https://placehold.co/1200x800/9b59b6/ffffff?text=Tetra+Pak+Ảnh+2', 'https://placehold.co/1200x800/9b59b6/ffffff?text=Tetra+Pak+Ảnh+3', 'https://placehold.co/1200x800/9b59b6/ffffff?text=Tetra+Pak+Ảnh+4'],
        'agribank': ['https://placehold.co/1200x800/e74c3c/ffffff?text=Agribank+Ảnh+1'],
        'vus': ['https://placehold.co/1200x800/1abc9c/ffffff?text=VUS+Ảnh+1', 'https://placehold.co/1200x800/1abc9c/ffffff?text=VUS+Ảnh+2']
    };

    // Các thành phần của Lightbox Lớp 1 (Lưới ảnh)
    const gridLightbox = document.getElementById('grid-lightbox');
    const gridContainer = document.getElementById('lightbox-grid-container');
    const gridTitle = document.getElementById('lightbox-grid-title');
    const gridCloseBtn = gridLightbox.querySelector('.lightbox-close');

    // Các thành phần của Lightbox Lớp 2 (Xem ảnh)
    const imageViewer = document.getElementById('image-viewer');
    const viewerImage = document.querySelector('.image-viewer-image');
    const viewerCloseBtn = document.querySelector('.image-viewer-close');
    const viewerPrevBtn = document.querySelector('.image-viewer-prev');
    const viewerNextBtn = document.querySelector('.image-viewer-next');

    let currentGallery = [];
    let currentIndex = 0;

    // --- LOGIC CHO LIGHTBOX LỚP 1 ---
    function openGridLightbox(galleryId, title) {
        currentGallery = galleries[galleryId] || [];
        if (currentGallery.length === 0) return;

        gridTitle.textContent = title;
        gridContainer.innerHTML = ''; // Xóa ảnh cũ

        // Tạo và chèn các ảnh thumbnail vào lưới
        currentGallery.forEach((imgSrc, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'lightbox-thumbnail';
            thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}">`;
            thumb.addEventListener('click', () => {
                openImageViewer(index);
            });
            gridContainer.appendChild(thumb);
        });

        gridLightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeGridLightbox() {
        gridLightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // --- LOGIC CHO LIGHTBOX LỚP 2 ---
    function openImageViewer(index) {
        currentIndex = index;
        updateImageViewer();
        imageViewer.style.display = 'flex';
    }

    function closeImageViewer() {
        imageViewer.style.display = 'none';
    }

    function updateImageViewer() {
        if(currentGallery.length > 0) {
            viewerImage.src = currentGallery[currentIndex];
        }
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateImageViewer();
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateImageViewer();
    }

    // --- GÁN SỰ KIỆN ---
    // Mở lightbox lưới khi click vào item trong gallery chính
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const galleryId = item.dataset.gallery;
            const title = item.dataset.title;
            openGridLightbox(galleryId, title);
        });
    });

    // Các sự kiện đóng
    gridCloseBtn.addEventListener('click', closeGridLightbox);
    viewerCloseBtn.addEventListener('click', closeImageViewer);
    gridLightbox.addEventListener('click', (e) => {
        if (e.target === gridLightbox) closeGridLightbox();
    });
    imageViewer.addEventListener('click', (e) => {
        if (e.target === imageViewer) closeImageViewer();
    });

    // Các sự kiện điều hướng của trình xem ảnh
    viewerNextBtn.addEventListener('click', showNextImage);
    viewerPrevBtn.addEventListener('click', showPrevImage);

    // Điều khiển bằng bàn phím
    document.addEventListener('keydown', (e) => {
        if (imageViewer.style.display === 'flex') {
            if (e.key === 'Escape') closeImageViewer();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        } else if (gridLightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeGridLightbox();
        }
    });

});