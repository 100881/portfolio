// Blokkeer rechtsklik, kopiëren en plakken
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('copy', (e) => e.preventDefault());
document.addEventListener('paste', (e) => e.preventDefault());

 const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const progressBar = card.querySelector('.progress-bar');
                    const skillLevel = card.getAttribute('data-skill');
                    
                   
                    card.classList.add('animate');
                    
                   
                    setTimeout(() => {
                        progressBar.style.width = skillLevel + '%';
                    }, 200);
                }
            });
        }, observerOptions);

  
        document.querySelectorAll('.skill-card').forEach(card => {
            observer.observe(card);
        });

      
        document.querySelectorAll('.skill-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

window.addEventListener('load', () => {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    const adjustTimelineHeight = () => {
        const container = document.querySelector('.timeline-container');
        const lastProject = document.querySelector('.project-card:last-child');
        const timelineLine = document.querySelector('.timeline-line');
    
        if (lastProject && container && timelineLine) {
            const containerTop = container.offsetTop;
            const projectBottom = lastProject.offsetTop + lastProject.offsetHeight;
            const extraSpace = 2300; 
            const totalHeight = (projectBottom - containerTop) + extraSpace;
            timelineLine.style.height = `${totalHeight}px`;
        }
    };

    const animateOnScroll = () => {
        const projects = document.querySelectorAll('.project-card');
        const markers = document.querySelectorAll('.year-marker');

        const isInViewport = (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
                rect.bottom >= 0
            );
        };

        projects.forEach(project => {
            if (isInViewport(project)) {
                project.classList.add('visible');
            }
        });

        markers.forEach(marker => {
            if (isInViewport(marker)) {
                marker.classList.add('visible');
            }
        });
    };

    const adjustYearLabels = () => {
        const leftCards = document.querySelectorAll('.left-card');
        const rightCards = document.querySelectorAll('.right-card');

        leftCards.forEach(card => {
            const nextMarker = card.nextElementSibling;
            if (nextMarker?.classList.contains('year-marker')) {
                const label = nextMarker.querySelector('.year-label');
                if (label) {
                    label.style.left = 'auto';
                    label.style.right = '30px';
                }
            }
        });

        rightCards.forEach(card => {
            const nextMarker = card.nextElementSibling;
            if (nextMarker?.classList.contains('year-marker')) {
                const label = nextMarker.querySelector('.year-label');
                if (label) {
                    label.style.right = 'auto';
                    label.style.left = '30px';
                }
            }
        });
    };


    adjustTimelineHeight();
    adjustYearLabels();
    animateOnScroll();

 
    setTimeout(() => {
        adjustTimelineHeight();
        adjustYearLabels();
    }, 200);

   
    window.addEventListener('scroll', animateOnScroll);

   
    window.addEventListener('resize', () => {
        adjustTimelineHeight();
        adjustYearLabels();

        
        setTimeout(() => {
            adjustTimelineHeight();
            adjustYearLabels();
        }, 200);
    });
});

