document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');

            const spans = menuToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.querySelectorAll('span').forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            });
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    const otherAnswer = other.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                }
            });

            item.classList.toggle('active');

            if (!isActive && answer) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else if (answer) {
                answer.style.maxHeight = null;
            }
        });
    });

    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    const galleryImages = [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80',
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80',
        'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=1200&q=80'
    ];

    let currentImageIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = galleryImages[index];
        lightboxImage.alt = `Gallery image ${index + 1}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.style.transition = 'opacity 0.3s ease';
            lightboxImage.style.opacity = '1';
        }, 10);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.src = galleryImages[currentImageIndex];
            lightboxImage.alt = `Gallery image ${currentImageIndex + 1}`;
            lightboxImage.style.opacity = '1';
        }, 150);
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNextImage();
            } else {
                showPrevImage();
            }
        }
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            openLightbox(index);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });

    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        fadeElements.forEach(element => {
            element.classList.add('visible');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || !targetId) return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            navbar.style.boxShadow = '';
        }

        if (scrollY > lastScrollY && scrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    navbar.style.transition = 'all 0.3s ease';

    const featureCards = document.querySelectorAll('.feature-card');
    const branchCards = document.querySelectorAll('.branch-card');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const pricingCards = document.querySelectorAll('.pricing-card');

    function addStaggeredAnimation(elements, baseDelay = 0) {
        elements.forEach((el, index) => {
            el.style.animationDelay = `${baseDelay + (index * 0.1)}s`;
        });
    }

    addStaggeredAnimation(featureCards);
    addStaggeredAnimation(branchCards);
    addStaggeredAnimation(testimonialCards);
    addStaggeredAnimation(pricingCards);

    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });
});
