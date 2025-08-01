document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        const desktopSrc = '/videos/videoHero.webm';
        const mobileSrc = '/videos/videoMobile.webm';

        function setVideoSource() {
            const currentSrc = window.innerWidth <= 768 ? mobileSrc : desktopSrc;
            if (heroVideo.getAttribute('src') !== currentSrc) {
                heroVideo.setAttribute('src', currentSrc);
                heroVideo.load();
            }
        }
        setVideoSource();
        window.addEventListener('resize', setVideoSource);
    }
    // --- LOGIC TẢI MASCOT THEO ĐỊNH DẠNG VÀ KÍCH CỠ MÀN HÌNH ---
    const mascotContainer = document.getElementById('mascot-container');
    if (mascotContainer) {
        const desktopVideoSrc = '/videos/mascot.webm';
        const mobileImageSrc = '/images/mascotMobile.webp';

        let lastLoadedType = '';

        function loadMascot() {
            const screenWidth = window.innerWidth;
            const currentType = screenWidth > 768 ? 'video' : 'image';

            if (currentType === lastLoadedType) {
                return;
            }

            mascotContainer.innerHTML = '';

            if (currentType === 'video') {
                const video = document.createElement('video');
                video.className = 'main-mascot-video';
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.src = desktopVideoSrc;
                mascotContainer.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.className = 'main-mascot-image';
                img.src = mobileImageSrc;
                img.alt = 'Mascot TMA Tourist';
                mascotContainer.appendChild(img);
            }
            lastLoadedType = currentType;
        }

        loadMascot();
        window.addEventListener('resize', loadMascot);
    }
    // --- LOGIC CHO HAMBURGER & DROPDOWN MENU ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');
    const servicesMenuToggle = document.getElementById('services-menu-toggle');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    if (servicesMenuToggle) {
        servicesMenuToggle.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                event.preventDefault(); // Ngăn chuyển trang trên mobile
                const dropdown = this.closest('.nav-item.dropdown');
                dropdown.classList.toggle('open');
            }
        });
    }

    // --- LOGIC CHO VIDEO POPUP ---
    const openVideoButton = document.getElementById('openVideoPopupButtonFromCard');
    const videoPopup = document.getElementById('videoPopupOverlay');
    const closePopupButton = document.getElementById('closeVideoPopupButton');
    const introVideoPlayer = document.getElementById('introVideoPlayer');

    function closeVideo() {
        if (videoPopup && introVideoPlayer) {
            videoPopup.classList.remove('active');
            introVideoPlayer.pause();
            introVideoPlayer.currentTime = 0;
        }
    }

    if (openVideoButton) {
        openVideoButton.addEventListener('click', () => {
            if (videoPopup && introVideoPlayer) {
                videoPopup.classList.add('active');
                introVideoPlayer.play();
            }
        });
    }
    if (closePopupButton) {
        closePopupButton.addEventListener('click', closeVideo);
    }
    if (videoPopup) {
        videoPopup.addEventListener('click', (event) => {
            if (event.target === videoPopup) {
                closeVideo();
            }
        });
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && videoPopup && videoPopup.classList.contains('active')) {
            closeVideo();
        }
    });

    // --- LOGIC ĐẾM SỐ (ĐÃ SỬA LỖI) ---
    const numberElements = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.mascot-info-section');
    let hasAnimated = false;

    function animateNumber(element) {
        const target = +element.dataset.target;
        const duration = 2000;
        let current = 0;
        const increment = target / (duration / 10);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }, 10);
    }

    if (statsSection && numberElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    numberElements.forEach(num => {
                        num.textContent = num.textContent.includes('+') ? '0+' : '0';
                        animateNumber(num);
                    });
                    hasAnimated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        observer.observe(statsSection);
    }

    // --- LOGIC CHO 3D CAROUSEL ---
    const carouselWrapper = document.getElementById('carousel3dWrapper');
    if (carouselWrapper) {
        const items = carouselWrapper.querySelectorAll('.carousel-3d-item');
        const totalItems = items.length;
        let currentIndex = 0;
        let autoSlideInterval;

        function updateCardPositions() {
            const itemWidth = items[0] ? items[0].offsetWidth : 280;
            const overlapAmount = itemWidth * 0.6;
            items.forEach((item, index) => {
                let offset = index - currentIndex;
                if (offset > totalItems / 2) offset -= totalItems;
                if (offset < -totalItems / 2) offset += totalItems;

                const absOffset = Math.abs(offset);
                const scale = Math.max(0.8, 1 - absOffset * 0.1);
                const opacity = Math.max(0.2, 1 - absOffset * 0.3);
                const zIndex = totalItems - absOffset;
                let translateX = 0;

                if (offset < 0) {
                    translateX = (offset * overlapAmount) - (itemWidth - overlapAmount) / 2;
                } else if (offset > 0) {
                    translateX = (offset * overlapAmount) + (itemWidth - overlapAmount) / 2;
                }

                item.style.transform = `translateX(${translateX}px) scale(${scale})`;
                item.style.opacity = opacity;
                item.style.zIndex = zIndex;
            });
        }

        function stopAutoSlide() { clearInterval(autoSlideInterval); }
        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCardPositions();
            }, 3000);
        }

        const prevButton = document.getElementById('carousel3dPrev');
        const nextButton = document.getElementById('carousel3dNext');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                stopAutoSlide();
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                updateCardPositions();
                startAutoSlide();
            });
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                stopAutoSlide();
                currentIndex = (currentIndex + 1) % totalItems;
                updateCardPositions();
                startAutoSlide();
            });
        }

        updateCardPositions();
        startAutoSlide();
    }

    // --- LOGIC CHO FLOWING CONTENT ĐỂ LẶP VÔ HẠN ---
    const flowingWrappers = document.querySelectorAll('.flowing-content-wrapper');
    if (flowingWrappers.length > 0) {
        flowingWrappers.forEach(wrapper => {
            const originalContent = wrapper.innerHTML;
            wrapper.innerHTML += originalContent;
        });
    }

    // --- LOGIC NÚT "KHÁM PHÁ NGAY" ---
    const exploreButton = document.getElementById('exploreNowButton');
    const mascotSection = document.getElementById('mascotSection');

    if (exploreButton && mascotSection) {
        exploreButton.addEventListener('click', () => {
            mascotSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
});
