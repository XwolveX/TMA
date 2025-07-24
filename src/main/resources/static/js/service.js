document.addEventListener('DOMContentLoaded', () => {

    // --- HIỆU ỨNG CHO TRANG DỊCH VỤ ---

    // 1. Hiệu ứng Parallax cho linh vật
    const solutionSection = document.querySelector('.solution-section');
    const mascotImage = document.querySelector('.solution-image img');
    if (solutionSection && mascotImage) {
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
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', e => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
        item.addEventListener('mouseleave', () => {
            item.style.removeProperty('--mouse-x');
            item.style.removeProperty('--mouse-y');
        });
    });

    // --- LOGIC XỬ LÝ LIGHTBOX GALLERY 2 LỚP ---

    // Dữ liệu các bộ sưu tập ảnh
    const galleries = {
        'Big 8': ['/images/ServicesPage/Big_8_images/1.webp', '/images/ServicesPage/Big_8_images/2.webp', '/images/ServicesPage/Big_8_images/3.webp','/images/ServicesPage/Big_8_images/1.webp', '/images/ServicesPage/Big_8_images/6.webp','/images/ServicesPage/Big_8_images/7.webp','/images/ServicesPage/Big_8_images/8.webp','/images/ServicesPage/Big_8_images/9.webp','/images/ServicesPage/Big_8_images/10.webp', '/images/ServicesPage/Big_8_images/11.webp', '/images/ServicesPage/Big_8_images/12.webp','/images/ServicesPage/Big_8_images/13.webp','/images/ServicesPage/Big_8_images/14.webp' ],
        'PEPSICO': ['/images/ServicesPage.PEPSICO/1.webp', '/images/ServicesPage.PEPSICO/2.webp', '/images/ServicesPage.PEPSICO/3.webp', '/images/ServicesPage.PEPSICO/4.webp', '/images/ServicesPage.PEPSICO/1.webp', '/images/ServicesPage.PEPSICO/6.webp', '/images/ServicesPage.PEPSICO/7.webp', '/images/ServicesPage.PEPSICO/8.webp', '/images/ServicesPage.PEPSICO/9.webp', '/images/ServicesPage.PEPSICO/10.webp', '/images/ServicesPage.PEPSICO/11.webp', '/images/ServicesPage.PEPSICO/12.webp', '/images/ServicesPage.PEPSICO/13.webp', '/images/ServicesPage.PEPSICO/14.webp', '/images/ServicesPage.PEPSICO/16.webp', '/images/ServicesPage.PEPSICO/17.webp', '/images/ServicesPage.PEPSICO/18.webp', '/images/ServicesPage.PEPSICO/19.webp', '/images/ServicesPage.PEPSICO/20.webp', '/images/ServicesPage.PEPSICO/21.webp', '/images/ServicesPage.PEPSICO/22.webp', '/images/ServicesPage.PEPSICO/23.webp', '/images/ServicesPage.PEPSICO/24.webp', '/images/ServicesPage.PEPSICO/25.webp', '/images/ServicesPage.PEPSICO/26.webp', '/images/ServicesPage.PEPSICO/27.webp', '/images/ServicesPage.PEPSICO/28.webp', '/images/ServicesPage.PEPSICO/29.webp', '/images/ServicesPage.PEPSICO/30.webp', '/images/ServicesPage.PEPSICO/31.webp', '/images/ServicesPage.PEPSICO/32.webp', '/images/ServicesPage.PEPSICO/33.webp', '/images/ServicesPage.PEPSICO/34.webp'],
        'PEPSICOControl': ['/images/ServicesPage.PEPSICOControl/1.webp', '/images/ServicesPage.PEPSICOControl/2.webp', '/images/ServicesPage.PEPSICOControl/3.webp', '/images/ServicesPage.PEPSICOControl/4.webp', '/images/ServicesPage.PEPSICOControl/1.webp', '/images/ServicesPage.PEPSICOControl/6.webp', '/images/ServicesPage.PEPSICOControl/7.webp', '/images/ServicesPage.PEPSICOControl/8.webp', '/images/ServicesPage.PEPSICOControl/9.webp', '/images/ServicesPage.PEPSICOControl/10.webp', '/images/ServicesPage.PEPSICOControl/11.webp', '/images/ServicesPage.PEPSICOControl/12.webp', '/images/ServicesPage.PEPSICOControl/13.webp', '/images/ServicesPage.PEPSICOControl/14.webp', '/images/ServicesPage.PEPSICOControl/15.webp', '/images/ServicesPage.PEPSICOControl/16.webp', '/images/ServicesPage.PEPSICOControl/18.webp', '/images/ServicesPage.PEPSICOControl/19.webp', '/images/ServicesPage.PEPSICOControl/20.webp'],
        'The Best Vape': ['/images/ServicesPage.TheBestVape/1.webp', '/images/ServicesPage.TheBestVape/2.webp', '/images/ServicesPage.TheBestVape/3.webp', '/images/ServicesPage.TheBestVape/4.webp', '/images/ServicesPage.TheBestVape/1.webp', '/images/ServicesPage.TheBestVape/6.webp', '/images/ServicesPage.TheBestVape/7.webp', '/images/ServicesPage.TheBestVape/8.webp', '/images/ServicesPage.TheBestVape/9.webp', '/images/ServicesPage.TheBestVape/10.webp', '/images/ServicesPage.TheBestVape/11.webp', '/images/ServicesPage.TheBestVape/12.webp', '/images/ServicesPage.TheBestVape/13.webp', '/images/ServicesPage.TheBestVape/14.webp', '/images/ServicesPage.TheBestVape/15.webp', '/images/ServicesPage.TheBestVape/16.webp', '/images/ServicesPage.TheBestVape/17.webp', '/images/ServicesPage.TheBestVape/18.webp', '/images/ServicesPage.TheBestVape/19.webp'],
        'HENIKEN': ['/images/ServicesPage.HENIKEN/1.webp', '/images/ServicesPage.HENIKEN/2.webp', '/images/ServicesPage.HENIKEN/3.webp', '/images/ServicesPage.HENIKEN/4.webp', '/images/ServicesPage.HENIKEN/1.webp', '/images/ServicesPage.HENIKEN/6.webp', '/images/ServicesPage.HENIKEN/7.webp', '/images/ServicesPage.HENIKEN/8.webp', '/images/ServicesPage.HENIKEN/9.webp', '/images/ServicesPage.HENIKEN/10.webp', '/images/ServicesPage.HENIKEN/11.webp', '/images/ServicesPage.HENIKEN/12.webp', '/images/ServicesPage.HENIKEN/13.webp', '/images/ServicesPage.HENIKEN/14.webp', '/images/ServicesPage.HENIKEN/15.webp', '/images/ServicesPage.HENIKEN/16.webp', '/images/ServicesPage.HENIKEN/17.webp', '/images/ServicesPage.HENIKEN/18.webp', '/images/ServicesPage.HENIKEN/19.webp'],
        'BNIEvent': ['/images/ServicesPage.BNIEvent/1.webp', '/images/ServicesPage.BNIEvent/2.webp', '/images/ServicesPage.BNIEvent/3.webp', '/images/ServicesPage.BNIEvent/4.webp', '/images/ServicesPage.BNIEvent/1.webp', '/images/ServicesPage.BNIEvent/6.webp', '/images/ServicesPage.BNIEvent/7.webp', '/images/ServicesPage.BNIEvent/8.webp', '/images/ServicesPage.BNIEvent/9.webp', '/images/ServicesPage.BNIEvent/10.webp', '/images/ServicesPage.BNIEvent/11.webp', '/images/ServicesPage.BNIEvent/12.webp', '/images/ServicesPage.BNIEvent/13.webp', '/images/ServicesPage.BNIEvent/14.webp', '/images/ServicesPage.BNIEvent/15.webp', '/images/ServicesPage.BNIEvent/16.webp', '/images/ServicesPage.BNIEvent/17.webp', '/images/ServicesPage.BNIEvent/18.webp', '/images/ServicesPage.BNIEvent/19.webp'],
        'CEOTD21Event': ['/images/ServicesPage.CEOTD21Event/1.webp', '/images/ServicesPage.CEOTD21Event/2.webp', '/images/ServicesPage.CEOTD21Event/3.webp', '/images/ServicesPage.CEOTD21Event/4.webp', '/images/ServicesPage.CEOTD21Event/1.webp', '/images/ServicesPage.CEOTD21Event/6.webp', '/images/ServicesPage.CEOTD21Event/7.webp', '/images/ServicesPage.CEOTD21Event/8.webp', '/images/ServicesPage.CEOTD21Event/9.webp', '/images/ServicesPage.CEOTD21Event/10.webp', '/images/ServicesPage.CEOTD21Event/11.webp', '/images/ServicesPage.CEOTD21Event/12.webp', '/images/ServicesPage.CEOTD21Event/13.webp', '/images/ServicesPage.CEOTD21Event/14.webp', '/images/ServicesPage.CEOTD21Event/15.webp', '/images/ServicesPage.CEOTD21Event/16.webp', '/images/ServicesPage.CEOTD21Event/17.webp', '/images/ServicesPage.CEOTD21Event/18.webp'],
        'ThangLoiGroup': ['/images/ServicesPage.ThangLoiGroup/1.webp', '/images/ServicesPage.ThangLoiGroup/2.webp', '/images/ServicesPage.ThangLoiGroup/3.webp', '/images/ServicesPage.ThangLoiGroup/4.webp', '/images/ServicesPage.ThangLoiGroup/1.webp', '/images/ServicesPage.ThangLoiGroup/6.webp', '/images/ServicesPage.ThangLoiGroup/7.webp', '/images/ServicesPage.ThangLoiGroup/8.webp', '/images/ServicesPage.ThangLoiGroup/9.webp', '/images/ServicesPage.ThangLoiGroup/10.webp', '/images/ServicesPage.ThangLoiGroup/11.webp', '/images/ServicesPage.ThangLoiGroup/12.webp', '/images/ServicesPage.ThangLoiGroup/13.webp'],
        'TAX': ['/images/ServicesPage.TAX/1.webp', '/images/ServicesPage.TAX/2.webp', '/images/ServicesPage.TAX/3.webp', '/images/ServicesPage.TAX/4.webp', '/images/ServicesPage.TAX/1.webp', '/images/ServicesPage.TAX/6.webp'],
        'DAICHI': ['/images/ServicesPage.DAICHI/1.webp', '/images/ServicesPage.DAICHI/2.webp', '/images/ServicesPage.DAICHI/3.webp', '/images/ServicesPage.DAICHI/4.webp', '/images/ServicesPage.DAICHI/1.webp'],
        'PEPSICOMarketing': ['/images/ServicesPage.PEPSICOMarketing/1.webp', '/images/ServicesPage.PEPSICOMarketing/2.webp', '/images/ServicesPage.PEPSICOMarketing/3.webp', '/images/ServicesPage.PEPSICOMarketing/4.webp', '/images/ServicesPage.PEPSICOMarketing/1.webp', '/images/ServicesPage.PEPSICOMarketing/6.webp', '/images/ServicesPage.PEPSICOMarketing/7.webp', '/images/ServicesPage.PEPSICOMarketing/8.webp', '/images/ServicesPage.PEPSICOMarketing/9.webp', '/images/ServicesPage.PEPSICOMarketing/10.webp', '/images/ServicesPage.PEPSICOMarketing/11.webp', '/images/ServicesPage.PEPSICOMarketing/12.webp'],
        'CPC1Hanoi': ['/images/ServicesPage.CPC1Hanoi/1.webp', '/images/ServicesPage.CPC1Hanoi/2.webp', '/images/ServicesPage.CPC1Hanoi/3.webp', '/images/ServicesPage.CPC1Hanoi/4.webp', '/images/ServicesPage.CPC1Hanoi/1.webp', '/images/ServicesPage.CPC1Hanoi/6.webp', '/images/ServicesPage.CPC1Hanoi/7.webp'],
        'ChienBinhThep': ['/images/ServicesPage.ChienBinhThep/1.webp', '/images/ServicesPage.ChienBinhThep/2.webp', '/images/ServicesPage.ChienBinhThep/3.webp', '/images/ServicesPage.ChienBinhThep/4.webp', '/images/ServicesPage.ChienBinhThep/1.webp', '/images/ServicesPage.ChienBinhThep/6.webp', '/images/ServicesPage.ChienBinhThep/7.webp', '/images/ServicesPage.ChienBinhThep/8.webp', '/images/ServicesPage.ChienBinhThep/9.webp', '/images/ServicesPage.ChienBinhThep/10.webp', '/images/ServicesPage.ChienBinhThep/11.webp', '/images/ServicesPage.ChienBinhThep/12.webp', '/images/ServicesPage.ChienBinhThep/13.webp', '/images/ServicesPage.ChienBinhThep/14.webp'],
        'GD3TheHe': ['/images/ServicesPage.GD3TheHe/1.webp', '/images/ServicesPage.GD3TheHe/2.webp', '/images/ServicesPage.GD3TheHe/3.webp', '/images/ServicesPage.GD3TheHe/4.webp', '/images/ServicesPage.GD3TheHe/1.webp', '/images/ServicesPage.GD3TheHe/6.webp', '/images/ServicesPage.GD3TheHe/7.webp', '/images/ServicesPage.GD3TheHe/8.webp'],
        'HS12': ['/images/ServicesPage.HS12/1.webp', '/images/ServicesPage.HS12/2.webp', '/images/ServicesPage.HS12/3.webp', '/images/ServicesPage.HS12/4.webp', '/images/ServicesPage.HS12/1.webp', '/images/ServicesPage.HS12/6.webp'],
        'HaiAnhCompany': ['/images/ServicesPage.HaiAnhCompany/1.webp', '/images/ServicesPage.HaiAnhCompany/2.webp', '/images/ServicesPage.HaiAnhCompany/3.webp', '/images/ServicesPage.HaiAnhCompany/4.webp', '/images/ServicesPage.HaiAnhCompany/1.webp', '/images/ServicesPage.HaiAnhCompany/6.webp', '/images/ServicesPage.HaiAnhCompany/7.webp', '/images/ServicesPage.HaiAnhCompany/8.webp', '/images/ServicesPage.HaiAnhCompany/9.webp', '/images/ServicesPage.HaiAnhCompany/10.webp', '/images/ServicesPage.HaiAnhCompany/11.webp', '/images/ServicesPage.HaiAnhCompany/12.webp', '/images/ServicesPage.HaiAnhCompany/13.webp', '/images/ServicesPage.HaiAnhCompany/14.webp'],
        'BNI': ['/images/ServicesPage.BNI/1.webp', '/images/ServicesPage.BNI/2.webp', '/images/ServicesPage.BNI/3.webp', '/images/ServicesPage.BNI/4.webp', '/images/ServicesPage.BNI/6.webp', '/images/ServicesPage.BNI/7.webp', '/images/ServicesPage.BNI/8.webp', '/images/ServicesPage.BNI/9.webp', '/images/ServicesPage.BNI/10.webp', '/images/ServicesPage.BNI/11.webp', '/images/ServicesPage.BNI/12.webp', '/images/ServicesPage.BNI/13.webp', '/images/ServicesPage.BNI/14.webp', '/images/ServicesPage.BNI/15.webp', '/images/ServicesPage.BNI/16.webp', '/images/ServicesPage.BNI/17.webp']
    };

    // Lấy các thành phần DOM
    const gridLightbox = document.getElementById('grid-lightbox');
    const gridContainer = document.getElementById('lightbox-grid-container');
    const gridTitle = document.getElementById('lightbox-grid-title');
    const gridCloseBtn = gridLightbox.querySelector('.lightbox-close');

    const imageViewer = document.getElementById('image-viewer');
    const viewerImage = document.querySelector('.image-viewer-image');
    const viewerCloseBtn = document.querySelector('.image-viewer-close');
    const viewerPrevBtn = document.querySelector('.image-viewer-prev');
    const viewerNextBtn = document.querySelector('.image-viewer-next');

    let currentGallery = [];
    let currentIndex = 0;

    // Mở Lightbox Lớp 1 (Lưới ảnh)
    function openGridLightbox(galleryId, title) {
        currentGallery = galleries[galleryId] || [];
        if (currentGallery.length === 0) return;

        gridTitle.textContent = title;
        gridContainer.innerHTML = ''; // Xóa ảnh cũ

        currentGallery.forEach((imgSrc, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'lightbox-thumbnail';
            thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}" loading="lazy">`;
            thumb.addEventListener('click', () => openImageViewer(index));
            gridContainer.appendChild(thumb);
        });

        gridLightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Đóng Lightbox Lớp 1
    function closeGridLightbox() {
        gridLightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Mở Lightbox Lớp 2 (Xem ảnh)
    function openImageViewer(index) {
        currentIndex = index;
        updateImageViewer();
        imageViewer.style.display = 'flex';
    }

    // Đóng Lightbox Lớp 2
    function closeImageViewer() {
        imageViewer.style.display = 'none';
    }

    // Cập nhật ảnh trong trình xem
    function updateImageViewer() {
        if (currentGallery.length > 0) {
            viewerImage.src = currentGallery[currentIndex];
        }
    }

    // Chuyển ảnh tiếp theo
    function showNextImage() {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateImageViewer();
    }

    // Chuyển ảnh trước đó
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateImageViewer();
    }

    // Gán sự kiện click cho các gallery item
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const galleryId = item.dataset.gallery;
            const title = item.dataset.title;
            openGridLightbox(galleryId, title);
        });
    });

    // Gán sự kiện đóng
    gridCloseBtn.addEventListener('click', closeGridLightbox);
    viewerCloseBtn.addEventListener('click', closeImageViewer);
    gridLightbox.addEventListener('click', (e) => {
        if (e.target === gridLightbox) closeGridLightbox();
    });
    imageViewer.addEventListener('click', (e) => {
        if (e.target === imageViewer) closeImageViewer();
    });

    // Gán sự kiện điều hướng
    viewerNextBtn.addEventListener('click', showNextImage);
    viewerPrevBtn.addEventListener('click', showPrevImage);

    // Gán sự kiện bàn phím
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
