document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const openInvitationBtn = document.getElementById('open-invitation-btn');
    const mainContent = document.getElementById('main-content');
    const backgroundMusic = document.getElementById('background-music');
    const navbar = document.getElementById('navbar');

    // --- Loading Screen & Audio Play ---
    // Hide loading screen after a short delay
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); // Wait for fade out to complete
    }, 1500); // Adjust delay as needed

    // Play music when "Buka Undangan" button is clicked
    openInvitationBtn.addEventListener('click', () => {
        loadingScreen.style.display = 'none'; // Ensure loading screen is gone
        mainContent.style.display = 'block'; // Show main content
        // Scroll to the top of the main content
        mainContent.scrollIntoView({ behavior: 'smooth' });

        // Try to play music. If it fails (e.g., due to browser autoplay policy),
        // we'll provide a play/pause button later.
        backgroundMusic.volume = 0.5; // Set a default volume
        const playPromise = backgroundMusic.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Autoplay started!
            }).catch(error => {
                // Autoplay was prevented. Show a "play music" button.
                console.log("Autoplay prevented:", error);
                // You might want to add a visible play/pause button here
                // For simplicity, we'll just log it.
            });
        }
    });

    // --- Navbar Active State on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', navHighlighter);

    function navHighlighter() {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navbar.offsetHeight - 50; // Offset for fixed navbar

            let sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('#navbar ul li a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('#navbar ul li a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }
    // Call on load to set initial active state
    navHighlighter();

    // --- Smooth Scrolling for Navbar Links ---
    document.querySelectorAll('#navbar ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Countdown Timer ---
    const countDownDate = new Date('Sep 28, 2024 08:00:00').getTime(); // Set your wedding date and time

    const x = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerHTML = String(days).padStart(2, '0');
        document.getElementById('hours').innerHTML = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerHTML = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerHTML = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(x);
            document.getElementById('countdown').innerHTML = "<h3>Acara Telah Dimulai!</h3>";
        }
    }, 1000);

    // --- Image Slideshow ---
    let slideIndex = 1;
    showSlides(slideIndex);

    // Next/previous controls
    window.plusSlides = function (n) {
        showSlides(slideIndex += n);
    }

    // Thumbnail image controls
    window.currentSlide = function (n) {
        showSlides(slideIndex = n);
    }

    function showSlides(n) {
        let i;
        let slides = document.getElementsByClassName('mySlides');
        let dots = document.getElementsByClassName('dot');
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(' active-dot', '');
        }
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].className += ' active-dot';
    }

    // Automatic slideshow (optional, you can remove this if you only want manual)
    let slideTimer = setInterval(() => {
        plusSlides(1);
    }, 5000); // Change image every 5 seconds

    // Pause slideshow on hover
    document.querySelector('.slideshow-container').addEventListener('mouseover', () => {
        clearInterval(slideTimer);
    });
    document.querySelector('.slideshow-container').addEventListener('mouseout', () => {
        slideTimer = setInterval(() => {
            plusSlides(1);
        }, 5000);
    });

    // --- Scroll Animations (Intersection Observer) ---
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                // Add specific animation classes if needed (e.g., entry.target.classList.add('animate-slide-up'))
                if (entry.target.classList.contains('left-delay')) {
                    entry.target.style.transform = 'translateX(0)';
                } else if (entry.target.classList.contains('right-delay')) {
                    entry.target.style.transform = 'translateX(0)';
                } else if (entry.target.classList.contains('bottom-delay')) {
                    entry.target.style.transform = 'translateY(0)';
                }
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        observer.observe(el);
        // Initial state for elements that will animate on scroll
        if (el.classList.contains('left-delay')) {
            el.style.transform = 'translateX(-50px)';
        } else if (el.classList.contains('right-delay')) {
            el.style.transform = 'translateX(50px)';
        } else if (el.classList.contains('bottom-delay')) {
            el.style.transform = 'translateY(50px)';
        }
        el.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';
    });

    // --- Copy Bank Account Number ---
    const copyButton = document.querySelector('.btn-copy');
    if (copyButton) {
        copyButton.addEventListener('click', async () => {
            const accountNumber = copyButton.dataset.clipboardText;
            try {
                await navigator.clipboard.writeText(accountNumber);
                copyButton.textContent = 'Disalin!';
                setTimeout(() => {
                    copyButton.textContent = 'Salin Nomor Rekening';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
                alert('Gagal menyalin nomor rekening. Silakan salin manual: ' + accountNumber);
            }
        });
    }

    // --- Guestbook Form Submission (Frontend only for now) ---
    const rsvpForm = document.getElementById('rsvp-form');
    const guestbookEntries = document.getElementById('guestbook-entries');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('message').value;

        if (name && attendance && message) {
            const newEntry = document.createElement('div');
            newEntry.classList.add('entry');
            newEntry.innerHTML = `
                <p class="entry-name"><strong>${name}</strong> <span style="font-size:0.9em; color: ${attendance === 'hadir' ? 'green' : 'red'};">(${attendance === 'hadir' ? 'Insya Allah Hadir' : 'Berhalangan Hadir'})</span></p>
                <p class="entry-message">${message}</p>
            `;
            guestbookEntries.prepend(newEntry); // Add new entry to the top

            rsvpForm.reset(); // Clear the form

            alert('Terima kasih atas ucapan dan konfirmasi kehadiran Anda!');
            // In a real application, you would send this data to a backend server here.
        } else {
            alert('Mohon lengkapi semua kolom.');
        }
    });

    // --- Initial check for main content display (if page is reloaded) ---
    // If the user navigates back, main content might already be shown.
    // This is a simple check; more robust solutions might involve localStorage.
    if (window.location.hash) {
        mainContent.style.display = 'block';
        loadingScreen.style.display = 'none';
        backgroundMusic.play().catch(e => console.log("Music play on hash load failed:", e));
    }
});