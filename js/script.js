// Blokkeer rechtsklik, kopiëren en plakken
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('copy', (e) => e.preventDefault());
document.addEventListener('paste', (e) => e.preventDefault());

 const observerOptions = {
            threshold: 0.1, 
            rootMargin: '0px 0px -50px 0px' 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                   
                    if (element.matches('.about h1')) {
                        element.classList.add('animate-in');
                    } else if (element.matches('.about p')) {
                        element.classList.add('animate-in');
                    } else if (element.classList.contains('about-text')) {
                        element.classList.add('animate-left');
                    } else if (element.classList.contains('about-image')) {
                        element.classList.add('animate-right');
                    }
                    
                   
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        
        document.addEventListener('DOMContentLoaded', () => {
            const elementsToAnimate = [
                '.about-title',
                '.about-subtitle', 
                '.about-text',
                '.about-image'
            ];

            elementsToAnimate.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.observe(element);
                }
            });
        });

        
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    
                    if (targetId === 'about') {
                        setTimeout(() => {
                            
                            const title = document.querySelector('.about h1');
                            const subtitle = document.querySelector('.about p');
                            const text = document.querySelector('.about-text');
                            const image = document.querySelector('.about-image');
                            
                            if (title) title.classList.add('animate-in');
                            if (subtitle) subtitle.classList.add('animate-in');
                            if (text) text.classList.add('animate-left');
                            if (image) image.classList.add('animate-right');
                        }, 100);
                    }
                }
            });
        });

        
        const resetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
                    const element = entry.target;
                    
                    
                    element.classList.remove('animate-in', 'animate-left', 'animate-right');
                    
                   
                    observer.observe(element);
                }
            });
        }, { 
            threshold: 0,
            rootMargin: '0px 0px 100px 0px' 
        });

        
        document.addEventListener('DOMContentLoaded', () => {
            const elementsToAnimate = [
                '.about h1',
                '.about p', 
                '.about-text',
                '.about-image'
            ];

            elementsToAnimate.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    
                    observer.observe(element);
                    
                    resetObserver.observe(element);
                }
            });
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

