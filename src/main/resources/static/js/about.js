// Scroll reveal animation với hiệu ứng cuộn ngược nâng cao
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('visible');
    });

    // Các phần tử cần kích hoạt hiệu ứng khi cuộn tới
    const revealElements = document.querySelectorAll(
        ".reveal-on-scroll, .reveal-fade-up, .timeline-line, .timeline-item"
    );

    const observerOptions = {
        threshold: [0, 0.1, 0.25, 0.5],
        rootMargin: '0px 0px -80px 0px'
    };

    // Biến để track scroll direction
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';

    // Detect scroll direction
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = currentScrollY;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            const delay = index * 100; // Staggered animation delay

            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                // Element đang vào viewport - hiển thị animation
                setTimeout(() => {
                    entry.target.classList.add("revealed");

                    // Special handling cho timeline items
                    if (entry.target.classList.contains("timeline-item")) {
                        const dot = entry.target.querySelector(".timeline-dot");
                        const content = entry.target.querySelector(".timeline-content");

                        if (dot) {
                            setTimeout(() => {
                                dot.classList.add("revealed");
                            }, 150);
                        }

                        if (content) {
                            setTimeout(() => {
                                content.style.transform = 'translateX(0) scale(1)';
                                content.style.opacity = '1';
                            }, 200);
                        }
                    }

                    // Special handling cho timeline line
                    if (entry.target.classList.contains("timeline-line")) {
                        entry.target.style.height = '100%';
                    }
                }, delay);

            } else if (!entry.isIntersecting || entry.intersectionRatio <= 0.1) {
                // Element đang ra khỏi viewport - ẩn animation
                entry.target.classList.remove("revealed");

                // Special handling cho timeline items khi hide
                if (entry.target.classList.contains("timeline-item")) {
                    const dot = entry.target.querySelector(".timeline-dot");
                    const content = entry.target.querySelector(".timeline-content");

                    if (dot) {
                        dot.classList.remove("revealed");
                    }

                    if (content) {
                        if (scrollDirection === 'up') {
                            content.style.transform = 'translateX(-30px) scale(0.9)';
                        } else {
                            content.style.transform = 'translateX(30px) scale(0.9)';
                        }
                        content.style.opacity = '0.3';
                    }
                }

                // Special handling cho timeline line khi hide
                if (entry.target.classList.contains("timeline-line")) {
                    entry.target.style.height = '0%';
                }
            }
        });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));

    // Thêm smooth scroll behavior cho toàn trang
    document.documentElement.style.scrollBehavior = 'smooth';

    // Smooth scrolling cho nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});