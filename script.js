// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initAnimations();
    initReservationForm();
    initVideoControls();
    initProjectsGallery();
    initAccessibility();
    initHeroSlideshow();
    initProjectsCarousel();
    initChat();
    initLogoFallback();
    initLoginModal();
    
    // Check authentication status
    checkAuthStatus();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !hamburger.contains(e.target) && 
            !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Hamburger animation
    hamburger.addEventListener('click', () => {
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (hamburger.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bar.style.transform = '';
                bar.style.opacity = '';
            }
        });
    });
}

// Login modal behaviors
function initLoginModal() {
    const openLogin = document.getElementById('openLogin');
    const loginModal = document.getElementById('loginModal');
    const loginBackdrop = document.getElementById('loginBackdrop');
    const closeLogin = document.getElementById('closeLogin');
    const tabs = document.querySelectorAll('.login-tab');
    const panels = document.querySelectorAll('.login-panel');
    const guestForm = document.getElementById('guestLogin');
    const adminForm = document.getElementById('adminLogin');
    const registerForm = document.getElementById('adminRegister');
    const loginStatus = document.getElementById('loginStatus');

    if (!openLogin || !loginModal) return;

    // Open
    openLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('show');
        clearLoginStatus();
    });

    // Close
    const close = () => {
        loginModal.classList.remove('show');
        clearLoginStatus();
    };
    
    loginBackdrop?.addEventListener('click', close);
    closeLogin?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    // Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.querySelector(`.login-panel[data-panel="${target}"]`)?.classList.add('active');
            clearLoginStatus();
        });
    });

    // Guest login
    guestForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = (document.getElementById('guestName')?.value || '').trim();
        const phone = (document.getElementById('guestPhone')?.value || '').trim();
        
        if (!name || !phone) {
            showLoginStatus('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        try {
            showLoginStatus('Đang xử lý...', 'info');
            
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'guest',
                    guestName: name,
                    guestPhone: phone
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store token and user info
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                
                showLoginStatus('Đăng nhập khách thành công!', 'success');
                
                setTimeout(() => {
                    loginModal.classList.remove('show');
                    // Update UI to show user is logged in
                    updateLoginButton();
                    // Optionally open direct chat
                    document.getElementById('directChat')?.classList.add('show');
                }, 1500);
            } else {
                showLoginStatus(data.error || 'Đăng nhập thất bại', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showLoginStatus('Lỗi kết nối, vui lòng thử lại', 'error');
        }
    });

    // Admin login
    adminForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = (document.getElementById('adminUsername')?.value || '').trim();
        const password = (document.getElementById('adminPassword')?.value || '').trim();
        
        if (!username || !password) {
            showLoginStatus('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        try {
            showLoginStatus('Đang đăng nhập...', 'info');
            
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store token and user info
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                
                showLoginStatus('Đăng nhập admin thành công!', 'success');
                
                setTimeout(() => {
                    loginModal.classList.remove('show');
                    // Redirect to admin panel or update UI
                    updateLoginButton();
                    if (data.user.role === 'admin') {
                        window.location.href = '/admin/';
                    }
                }, 1500);
            } else {
                showLoginStatus(data.error || 'Đăng nhập thất bại', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showLoginStatus('Lỗi kết nối, vui lòng thử lại', 'error');
        }
    });

    // Admin registration
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = (document.getElementById('regUsername')?.value || '').trim();
        const password = (document.getElementById('regPassword')?.value || '').trim();
        const confirmPassword = (document.getElementById('regConfirmPassword')?.value || '').trim();
        
        if (!username || !password || !confirmPassword) {
            showLoginStatus('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showLoginStatus('Mật khẩu xác nhận không khớp', 'error');
            return;
        }

        if (password.length < 6) {
            showLoginStatus('Mật khẩu phải có ít nhất 6 ký tự', 'error');
            return;
        }

        try {
            showLoginStatus('Đang tạo tài khoản...', 'info');
            
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                showLoginStatus('Tạo tài khoản admin thành công! Bạn có thể đăng nhập.', 'success');
                
                // Clear form
                registerForm.reset();
                
                // Switch to admin login tab
                setTimeout(() => {
                    document.querySelector('[data-tab="admin"]').click();
                }, 2000);
            } else {
                showLoginStatus(data.error || 'Tạo tài khoản thất bại', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showLoginStatus('Lỗi kết nối, vui lòng thử lại', 'error');
        }
    });
}

// Helper functions for login
function showLoginStatus(message, type = 'info') {
    const loginStatus = document.getElementById('loginStatus');
    const statusMessage = loginStatus.querySelector('.status-message');
    
    if (loginStatus && statusMessage) {
        loginStatus.className = `login-status ${type}`;
        statusMessage.textContent = message;
        loginStatus.style.display = 'block';
    }
}

function clearLoginStatus() {
    const loginStatus = document.getElementById('loginStatus');
    if (loginStatus) {
        loginStatus.style.display = 'none';
        loginStatus.className = 'login-status';
    }
}

function updateLoginButton() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const openLogin = document.getElementById('openLogin');
    
    if (userInfo.id) {
        if (userInfo.role === 'admin') {
            openLogin.innerHTML = '<i class="fas fa-user-shield"></i> ADMIN';
            openLogin.href = '/admin/';
        } else {
            openLogin.innerHTML = `<i class="fas fa-user"></i> ${userInfo.name}`;
            openLogin.href = '#';
            openLogin.onclick = (e) => {
                e.preventDefault();
                // Show user profile or logout options
                showUserMenu();
            };
        }
    } else {
        openLogin.innerHTML = 'ĐĂNG NHẬP';
        openLogin.href = '#';
        openLogin.onclick = (e) => {
            e.preventDefault();
            document.getElementById('loginModal').classList.add('show');
        };
    }
}

function showUserMenu() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    // Create user menu popup
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-header">
            <i class="fas fa-user-circle"></i>
            <span>${userInfo.name}</span>
        </div>
        <div class="user-menu-body">
            <button class="user-menu-item" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
                Đăng xuất
            </button>
        </div>
    `;
    
    // Position and show menu
    const openLogin = document.getElementById('openLogin');
    const rect = openLogin.getBoundingClientRect();
    
    menu.style.cssText = `
        position: fixed;
        top: ${rect.bottom + 10}px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10001;
        min-width: 200px;
        border: 1px solid #e5e7eb;
    `;
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !openLogin.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    updateLoginButton();
    
    // Show notification
    showNotification('Đã đăng xuất thành công', 'success');
}

// Check authentication status on page load
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Verify token validity here if needed
        updateLoginButton();
    }
}

// Removed conflicting support panel function

// Replace missing logo.png with inline SVG fallback
function initLogoFallback() {
    const logoSvgs = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 40'>
  <defs>
    <linearGradient id='g' x1='0' x2='1' y1='0' y2='0'>
      <stop offset='0' stop-color='%23FDB813'/>
      <stop offset='1' stop-color='%230ea5e9'/>
    </linearGradient>
  </defs>
  <g transform='translate(0,2)'>
    <circle cx='22' cy='18' r='10' fill='%23FDB813'/>
    <g fill='%2325636e'>
      <rect x='40' y='16' width='14' height='8' rx='1'/>
      <rect x='56' y='16' width='14' height='8' rx='1'/>
      <rect x='72' y='16' width='14' height='8' rx='1'/>
      <rect x='48' y='26' width='14' height='8' rx='1'/>
      <rect x='64' y='26' width='14' height='8' rx='1'/>
    </g>
    <text x='90' y='23' font-family='Playfair Display, serif' font-weight='700' font-size='14' fill='url(%23g)'>Hồi Xuân Solar</text>
  </g>
</svg>`;

    document.querySelectorAll('.brand-logo').forEach(img => {
        const setFallback = () => {
            const dataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(logoSvgs);
            img.onerror = null;
            img.src = dataUri;
        };
        if (!img.complete || img.naturalWidth === 0) {
            img.addEventListener('error', setFallback);
            if (img.complete && img.naturalWidth === 0) setFallback();
        }
    });
}

// Replace missing logo.png with inline SVG fallback

// Initialize Chat Functionality
function initChat() {
    const floatChat = document.getElementById('floatChat');
    const chatPopup = document.getElementById('chatPopup');
    const directChat = document.getElementById('directChat');
    const directChatBtn = document.getElementById('directChatBtn');
    const closeChat = document.getElementById('closeChat');
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    let socket;

    // Toggle chat popup
    floatChat.addEventListener('click', () => {
        chatPopup.classList.toggle('show');
        // Close direct chat if popup is being opened
        if (chatPopup.classList.contains('show')) {
            directChat.classList.remove('show');
        }
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatPopup.contains(e.target) && !floatChat.contains(e.target)) {
            chatPopup.classList.remove('show');
        }
    });

    // Open direct chat
    directChatBtn.addEventListener('click', () => {
        directChat.classList.add('show');
        chatPopup.classList.remove('show');
    });

    // Close direct chat
    closeChat.addEventListener('click', () => {
        directChat.classList.remove('show');
    });

            // Initialize socket when direct chat opens first time
        function ensureSocket() {
            if (!socket) {
                try {
                    socket = io('/', { path: '/api/socket' });
                    socket.on('connect', () => {
                        console.log('Socket connected');
                    });
                    socket.on('disconnect', () => {
                        console.log('Socket disconnected');
                    });
                    // Receive admin reply
                    socket.on('server-message', (reply) => {
                        const replyMsg = document.createElement('div');
                        replyMsg.className = 'msg-reply';
                        replyMsg.textContent = reply.message;
                        chatMessages.appendChild(replyMsg);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    });
                } catch (error) {
                    console.log('Socket.io not available, using fallback');
                }
            }
        }

    // Handle chat form submission
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = chatForm.querySelector('input');
        const message = input.value.trim();
        
        if (message) {
            ensureSocket();
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'msg-user';
            userMsg.textContent = message;
            chatMessages.appendChild(userMsg);
            
            // Clear input
            input.value = '';

            // Emit to server
            try {
                socket.emit('client-message', message);
            } catch {}
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
}

// Scroll effects
function initScrollEffects() {
    const navbar = document.getElementById('navbar');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero slideshow
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (!slides.length) return;

    // Solar-themed background images
    const images = [
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1584270354949-1f9e1a0f8a6d?auto=format&fit=crop&w=1600&q=80'
    ];

    // Preload
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    let current = 0;
    function apply(idx) {
        slides.forEach((slide, i) => {
            slide.style.backgroundImage = `url(${images[idx]})`;
            slide.classList.toggle('active', i === 0);
        });
    }

    apply(current);

    setInterval(() => {
        current = (current + 1) % images.length;
        // Crossfade using the two layers
        const top = slides[0];
        const bottom = slides[1];
        // Swap images
        bottom.style.backgroundImage = `url(${images[current]})`;
        // Fade in bottom
        bottom.classList.add('active');
        top.classList.remove('active');
        // Swap node roles after transition
        setTimeout(() => {
            const parent = top.parentNode;
            if (!parent) return;
            parent.appendChild(top); // move to end so 'bottom' becomes new 'top'
        }, 1000);
    }, 5000);
}

// Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-item, .menu-item, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Hero letter hover effects
    const heroLetters = document.querySelectorAll('.hero-letter');
    heroLetters.forEach((letter, index) => {
        letter.addEventListener('mouseenter', () => {
            letter.style.transform = 'translateY(-10px)';
            letter.style.color = '#D4AF37';
        });
        
        letter.addEventListener('mouseleave', () => {
            letter.style.transform = '';
            letter.style.color = '';
        });
    });

    // Pasta image rotation on hover
    const pastaImage = document.querySelector('.pasta-image');
    if (pastaImage) {
        pastaImage.addEventListener('mouseenter', () => {
            pastaImage.style.transform = 'rotate(10deg) scale(1.1)';
        });
        
        pastaImage.addEventListener('mouseleave', () => {
            pastaImage.style.transform = '';
        });
    }
}

// Projects gallery population
function initProjectsGallery() {
    const track = document.getElementById('projects-track');
    if (!track) return;

    // Build list of local images in /images (anh1.jpg -> anh21.jpg)
    const projectImages = Array.from({ length: 21 }, (_, i) => `images/anh${i + 1}.jpg`);

    projectImages.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'projects-item';

        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        img.alt = `Dự án điện mặt trời #${index + 1}`;

        item.appendChild(img);
        track.appendChild(item);
    });
}

// Carousel controls for projects
function initProjectsCarousel() {
    const track = document.getElementById('projects-track');
    const prev = document.querySelector('.projects-prev');
    const next = document.querySelector('.projects-next');
    if (!track || !prev || !next) return;

    let scrollAmount = 0;
    const itemWidth = () => track.querySelector('.projects-item')?.clientWidth || 260;
    const gap = 20;

    function scrollTo(amount) {
        track.scrollTo({ left: amount, behavior: 'smooth' });
    }

    prev.addEventListener('click', () => {
        scrollAmount = Math.max(0, scrollAmount - (itemWidth() + gap));
        scrollTo(scrollAmount);
    });

    next.addEventListener('click', () => {
        scrollAmount = Math.min(track.scrollWidth, scrollAmount + (itemWidth() + gap));
        scrollTo(scrollAmount);
    });
}

// Reservation form functionality
function initReservationForm() {
    const reservationForm = document.getElementById('reservationForm');
    if (!reservationForm) return;

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    // Set default time
    const timeInput = document.getElementById('time');
    if (timeInput) {
        timeInput.value = '09:00';
    }

    // Form validation
    const inputs = reservationForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });

    reservationForm.addEventListener('submit', handleFormSubmit);

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');

        // Validation rules
        switch (field.type) {
            case 'text':
                if (!value) {
                    errorMessage = 'Trường này là bắt buộc';
                    isValid = false;
                }
                break;
            case 'tel':
                const phoneRegex = /^[0-9+\-\s()]{10,}$/;
                if (!value) {
                    errorMessage = 'Số điện thoại là bắt buộc';
                    isValid = false;
                } else if (!phoneRegex.test(value)) {
                    errorMessage = 'Số điện thoại không hợp lệ';
                    isValid = false;
                }
                break;
            case 'date':
                if (!value) {
                    errorMessage = 'Ngày đặt bàn là bắt buộc';
                    isValid = false;
                }
                break;
            case 'time':
                if (!value) {
                    errorMessage = 'Giờ đặt bàn là bắt buộc';
                    isValid = false;
                }
                break;
        }

        if (field.tagName === 'SELECT' && !value) {
            errorMessage = 'Vui lòng chọn quy mô hệ thống';
            isValid = false;
        }

        // Display error
        if (!isValid) {
            field.classList.add('error');
            field.style.borderColor = '#ff6b6b';
        } else {
            field.style.borderColor = '';
        }

        return isValid;
    }

    function clearError(e) {
        const field = e.target;
        field.classList.remove('error');
        field.style.borderColor = '';
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !validateField({ target: input })) {
                isValid = false;
            }
        });

        if (isValid) {
            // Get form data
            const formData = new FormData(reservationForm);
            const reservationData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                date: formData.get('date'),
                time: formData.get('time'),
                guests: formData.get('guests'),
                message: formData.get('message') || ''
            };

            // Show loading state
            const submitBtn = reservationForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Show success message
                showNotification('Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ trong vòng 30 phút.', 'success');
                
                // Reset form
                reservationForm.reset();
                
                // Set default values again
                if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
                if (timeInput) timeInput.value = '09:00';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Log data (in real app, this would be sent to server)
                console.log('Reservation Data:', reservationData);
                
            }, 2000);
        } else {
            showNotification('Vui lòng kiểm tra lại thông tin và thử lại.', 'error');
        }
    }
}

// Video controls
function initVideoControls() {
    const playButton = document.querySelector('.play-button');
    const controlBtns = document.querySelectorAll('.control-btn');
    
    if (playButton) {
        playButton.addEventListener('click', () => {
            // In a real application, this would control video playback
            showNotification('Video sẽ được phát trong phiên bản đầy đủ', 'info');
        });
    }
    
    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                showNotification('Đang phát video...', 'info');
            } else {
                showNotification('Đã tạm dừng video', 'info');
            }
        });
    });
}

// Navigation arrows
function initNavigationArrows() {
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            // In a real application, this would navigate to previous slide/content
            showNotification('Chuyển đến nội dung trước', 'info');
        });
        
        nextBtn.addEventListener('click', () => {
            // In a real application, this would navigate to next slide/content
            showNotification('Chuyển đến nội dung tiếp theo', 'info');
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#D4AF37';
            notification.style.color = '#1a1a1a';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#1a1a1a';
            break;
        default:
            notification.style.background = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Accessibility improvements
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Chuyển đến nội dung chính';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #D4AF37;
        color: #1a1a1a;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s ease;
        font-weight: 600;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('.menu-item, .nav-arrow, .control-btn, .play-button');
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
}

// Initialize navigation arrows
initNavigationArrows();

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate elements on page load
    const animateOnLoad = document.querySelectorAll('.section-title');
    animateOnLoad.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-in-up');
        }, index * 200);
    });
});

// Handle offline/online status
window.addEventListener('online', () => {
    showNotification('Kết nối internet đã được khôi phục', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Không có kết nối internet', 'warning');
});

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Menu item hover effects
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

// Social links functionality
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = link.querySelector('i').classList[1].split('-')[1];
        showNotification(`Chuyển đến trang ${platform.charAt(0).toUpperCase() + platform.slice(1)}`, 'info');
    });
});

// Form input enhancements
document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.02)';
        input.style.boxShadow = '0 0 0 2px rgba(212, 175, 55, 0.2)';
    });
    
    input.addEventListener('blur', () => {
        input.style.transform = '';
        input.style.boxShadow = '';
    });
});

// Performance optimizations
function initPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    const criticalImages = [
        'https://images.unsplash.com/photo-1509395176047-4a66953fd231?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
initPerformanceOptimizations();

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}