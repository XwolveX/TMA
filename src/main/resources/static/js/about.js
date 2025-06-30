// Scroll reveal animation với hiệu ứng cuộn ngược nâng cao
document.addEventListener("DOMContentLoaded", () => {
    // Hiển thị section ngay lập tức
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('visible');
    });

    // Các phần tử cần kích hoạt hiệu ứng khi cuộn tới
    const revealElements = document.querySelectorAll(
        ".reveal-on-scroll, .reveal-fade-up, .timeline-line, .timeline-item"
    );

    const observerOptions = {
        threshold: [0, 0.1, 0.25, 0.5], // Multiple thresholds cho hiệu ứng mượt hơn
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
// Gemini API integration script
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generatePlanBtn');
    const destinationInput = document.getElementById('destinationInput');
    const planResult = document.getElementById('planResult');
    const loader = document.getElementById('loader');

    // Modal elements
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeButton = document.querySelector('.close-button');

    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'block';
    }

    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    function markdownToHtml(md) {
        // A simple parser for demonstration
        return md
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/(\r\n|\n|\r)/gm, '<br>')
            .replace(/<br><li>/g, '<li>') // fix extra br before li
            .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>') // Wrap li in ul
            .replace(/<\/ul><br><ul>/g, ''); // Join consecutive lists
    }

    generateBtn.addEventListener('click', async () => {
        const destination = destinationInput.value.trim();
        if (!destination) {
            showModal('Vui lòng nhập một địa điểm để chúng tôi có thể gợi ý.');
            return;
        }

        planResult.innerHTML = '';
        loader.style.display = 'block';
        generateBtn.disabled = true;
        generateBtn.textContent = 'Đang xử lý...';

        try {
            const prompt = `Bạn là một chuyên gia tư vấn du lịch tại Việt Nam. Hãy tạo một lịch trình du lịch chi tiết và hấp dẫn cho 3 ngày 2 đêm tại "${destination}". Gợi ý bao gồm các địa điểm tham quan nổi bật, những món ăn đặc sản không thể bỏ lỡ, và các hoạt động vui chơi giải trí. Trình bày câu trả lời bằng tiếng Việt, sử dụng định dạng markdown với các tiêu đề rõ ràng cho mỗi ngày.`;
            let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; // API key is handled by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                planResult.innerHTML = markdownToHtml(text);
            } else {
                throw new Error("Không nhận được phản hồi hợp lệ từ AI. Vui lòng thử lại.");
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            showModal(`Đã có lỗi xảy ra: ${error.message}. Vui lòng thử lại sau.`);
        } finally {
            loader.style.display = 'none';
            generateBtn.disabled = false;
            generateBtn.textContent = 'Tạo Lịch Trình';
        }
    });
});