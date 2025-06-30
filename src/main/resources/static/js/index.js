// load body
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
// menu mobile
function toggleMenu() {
    const nav = document.getElementById('navLinks');
    nav.classList.toggle('show');
}

// JavaScript cho Video Popup
const openVideoButtonFromCard = document.getElementById('openVideoPopupButtonFromCard');
const videoPopupOverlay = document.getElementById('videoPopupOverlay');
const closePopupButton = document.getElementById('closeVideoPopupButton');
const introVideoPlayer = document.getElementById('introVideoPlayer');

if (openVideoButtonFromCard) {
    openVideoButtonFromCard.addEventListener('click', () => {
        videoPopupOverlay.classList.add('active');
        introVideoPlayer.play();
    });
}

closePopupButton.addEventListener('click', () => {
    videoPopupOverlay.classList.remove('active');
    introVideoPlayer.pause();
    introVideoPlayer.currentTime = 0;
});

videoPopupOverlay.addEventListener('click', (event) => {
    if (event.target === videoPopupOverlay) {
        videoPopupOverlay.classList.remove('active');
        introVideoPlayer.pause();
        introVideoPlayer.currentTime = 0;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && videoPopupOverlay.classList.contains('active')) {
        videoPopupOverlay.classList.remove('active');
        introVideoPlayer.pause();
        introVideoPlayer.currentTime = 0;
    }
});
// JAVASCRIPT CHO HIỆU ỨNG ĐẾM SỐ KHI CUỘN ĐẾN SECTION
// =======================================================

const numbers = document.querySelectorAll('.stat-number'); // Lấy tất cả các phần tử có class stat-number
const mascotInfoSection = document.querySelector('.mascot-info-section'); // Lấy section chứa các số

let hasAnimated = false; // Biến cờ để đảm bảo animation chỉ chạy một lần

// Hàm để thực hiện animation đếm số cho một phần tử cụ thể
function animateNumber(element) {
    const target = +element.dataset.target; // Lấy giá trị target từ data-target attribute
    const duration = 2000; // Thời gian animation tính bằng milliseconds (2 giây)
    let current = 0;
    const increment = target / (duration / 10); // Tính bước nhảy nhỏ

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer); // Dừng animation khi đạt đến target
        }
        // Hiển thị số, thêm dấu "+" nếu số ban đầu có
        if (element.textContent.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 10); // Cập nhật mỗi 10ms
}

// Sử dụng Intersection Observer để phát hiện khi section hiển thị
const observerOptions = {
    root: null, // root là viewport
    rootMargin: '0px',
    threshold: 0.5 // Kích hoạt khi 50% của section hiển thị trong viewport
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) { // Nếu section hiển thị VÀ chưa chạy animation
            numbers.forEach(num => {
                // Đặt lại text về 0 (hoặc "0+") trước khi bắt đầu đếm
                if (num.textContent.includes('+')) {
                    num.textContent = '0+';
                } else {
                    num.textContent = '0';
                }
                animateNumber(num); // Chạy animation cho từng số
            });
            hasAnimated = true; // Đặt cờ là đã chạy
            observer.unobserve(entry.target); // Dừng quan sát sau khi animation chạy
        }
    });
}, observerOptions);

// Bắt đầu quan sát section chứa các số
if (mascotInfoSection) {
    observer.observe(mascotInfoSection);
}

// =======================================================
// JAVASCRIPT CHO CAROUSEL STACKING CARD (FIX CỐ ĐỊNH TẠI TÂM KHI KÉO)
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    const carouselWrapper = document.getElementById('carousel3dWrapper');
    if (!carouselWrapper) return;

    const items = carouselWrapper.querySelectorAll('.carousel-3d-item');
    const totalItems = items.length;

    const itemWidth = items[0] ? items[0].offsetWidth : 280; // Default width from CSS
    const overlapAmount = itemWidth * 0.6; // Khoảng cách chồng nhau giữa các thẻ

    let currentIndex = 0; // Index của thẻ đang ở giữa (tâm)
    let autoSlideInterval; // Biến cho chế độ tự động trượt
    let isDragging = false;
    let startX = 0;
    let currentDragDelta = 0; // Quãng đường kéo hiện tại từ điểm bắt đầu click
    let dragThreshold = itemWidth / 3; // Ngưỡng kéo để chuyển thẻ (1/3 chiều rộng thẻ)

    // Hàm cập nhật trạng thái của tất cả các thẻ
    // dragOffset là giá trị dịch chuyển tạm thời do kéo
    function updateCardPositions(dragOffset = 0) {
        items.forEach((item, index) => {
            let offset = index - currentIndex; // Vị trí tương đối so với thẻ giữa

            // Logic để xử lý hiệu ứng vòng lặp
            if (offset > totalItems / 2) {
                offset -= totalItems;
            } else if (offset < -totalItems / 2) {
                offset += totalItems;
            }

            const absOffset = Math.abs(offset);

            const scale = Math.max(0.8, 1 - absOffset * 0.1);
            const opacity = Math.max(0.2, 1 - absOffset * 0.3);
            const zIndex = totalItems - absOffset;

            let translateX;
            // Công thức translateX cho hiệu ứng xếp chồng như ảnh mẫu
            if (offset < 0) { // Thẻ bên trái thẻ giữa
                translateX = (offset * overlapAmount) - (itemWidth - overlapAmount) / 2;
            } else if (offset > 0) { // Thẻ bên phải thẻ giữa
                translateX = (offset * overlapAmount) + (itemWidth - overlapAmount) / 2;
            } else { // Thẻ ở giữa
                translateX = 0;
            }

            // Áp dụng transform cho từng item, bao gồm cả dragOffset
            item.style.transform = `translateX(${translateX + dragOffset}px) scale(${scale})`;
            item.style.opacity = opacity;
            item.style.zIndex = zIndex;
        });
    }

    // Hàm thực hiện chuyển động trượt mượt mà đến vị trí thẻ mới
    function animateToCurrentIndex() {
        // Chỉ gọi updateCardPositions với dragOffset = 0 để các thẻ snap về vị trí đúng
        updateCardPositions(0);
    }

    // Điều khiển carousel bằng nút Previous/Next (giữ nguyên)
    const prevButton = document.getElementById('carousel3dPrev');
    const nextButton = document.getElementById('carousel3dNext');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            animateToCurrentIndex();
            startAutoSlide();
        });

        nextButton.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = (currentIndex + 1) % totalItems;
            animateToCurrentIndex();
            startAutoSlide();
        });
    }

    // Chế độ tự động trượt (giữ nguyên)
    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            animateToCurrentIndex();
        }, 3000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Xử lý kéo để trượt (drag functionality)
    carouselWrapper.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Ngăn chặn hành vi kéo thả mặc định

        isDragging = true;
        startX = e.clientX;
        currentDragDelta = 0; // Reset quãng đường kéo
        stopAutoSlide(); // Dừng tự động trượt khi bắt đầu kéo

        // TẮT TRANSITION TRÊN ITEM KHI KÉO ĐỂ CHUYỂN ĐỘNG MƯỢT HƠN
        items.forEach(item => {
            item.style.transition = 'none';
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Ngăn chặn hành vi kéo thả mặc định

        currentDragDelta = e.clientX - startX; // Tính quãng đường kéo hiện tại
        updateCardPositions(currentDragDelta); // Cập nhật vị trí các thẻ với quãng đường kéo
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Ngăn chặn hành vi kéo thả mặc định

        isDragging = false;

        // BẬT LẠI TRANSITION TRÊN ITEM SAU KHI KÉO
        items.forEach(item => {
            item.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out, z-index 0.5s ease-out';
        });

        // Quyết định chuyển thẻ dựa trên quãng đường kéo
        if (Math.abs(currentDragDelta) > dragThreshold) {
            if (currentDragDelta < 0) { // Kéo sang trái (next)
                currentIndex = (currentIndex + 1) % totalItems;
            } else { // Kéo sang phải (prev)
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            }
        }

        animateToCurrentIndex(); // Luôn tự động "snap" về vị trí thẻ đúng

        // Khởi động lại tự động trượt sau một thời gian ngắn
        setTimeout(startAutoSlide, 1000);
    });

    // Ngăn chặn kéo ảnh mặc định (đặt lại trên các item và img)
    items.forEach(item => {
        item.ondragstart = () => false; // Ngăn kéo thả trên item
        const img = item.querySelector('img');
        if (img) img.ondragstart = () => false; // Ngăn kéo thả trên ảnh bên trong item
    });

    // Khởi tạo carousel
    updateCardPositions(); // Cập nhật lần đầu để hiển thị đúng
    startAutoSlide(); // Bắt đầu tự động trượt khi tải trang

    // Tạm dừng/tiếp tục tự động trượt khi chuột vào/ra carousel
    carouselWrapper.parentElement.addEventListener('mouseenter', stopAutoSlide);
    carouselWrapper.parentElement.addEventListener('mouseleave', startAutoSlide);
});
// JAVASCRIPT CHO NÚT "KHÁM PHÁ NGAY"
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const exploreButton = document.getElementById('exploreNowButton');
    const mascotSection = document.getElementById('mascotSection');

    if (exploreButton && mascotSection) {
        exploreButton.addEventListener('click', () => {
            // Cuộn đến giữa của mascot-info-section
            mascotSection.scrollIntoView({
                behavior: 'smooth', // Hiệu ứng cuộn mượt mà
                block: 'center'    // Cuộn để phần tử nằm ở giữa viewport
            });
        });
    }
});
