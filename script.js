document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Handle smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        const placePicker = document.getElementById('placePicker');
        
        placePicker.addEventListener('gmpx-placechange', function(event) {
            const place = event.detail;
            if (place) {
                const address = place.formattedAddress;
                const encodedAddress = encodeURIComponent(address);
                window.location.href = `features.html?address=${encodedAddress}`;
            }
        });
    });
    // Handle active section highlighting
    const sections = ['home', 'how-it-works', 'features', 'contact'];
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.7
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeSection = entry.target.id;
                updateActiveLink(activeSection);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            observer.observe(element);
        }
    });

    function updateActiveLink(activeSection) {
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('href').substring(1);
            if (linkSection === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Handle form submission (you can customize this part)
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted');
    });
});


function handleSubmit(event) { 
    event.preventDefault();

    const placePicker = document.getElementById('placePicker');
    const selectedPlace = placePicker.value;

    if(selectedPlance) { 

        const encodedAddress = encodeURIComponent(selectedPlace);

        window.location.href = 'results.html?address=${encodedAddress}';

    } else  {
        alert('Please select a place');
    }


    
}