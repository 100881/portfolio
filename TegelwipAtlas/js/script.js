        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        
        function animateCounter(element) {
            const target = parseFloat(element.getAttribute('data-target'));
            const increment = target / 60;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    element.textContent = current < 10 ? current.toFixed(1) : Math.round(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target < 10 ? target.toFixed(1) : target;
                }
            };
            
            updateCounter();
        }

       
        const observerOptions = {
            threshold: 0.6,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number[data-target]');
                    counters.forEach(counter => {
                        if (counter.textContent === '0' || counter.textContent === '0.0') {
                            animateCounter(counter);
                        }
                    });
                }
            });
        }, observerOptions);

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }

       
        function launchAtlas() {
           
            alert('Atlas interface wordt geladen...\n\nDit zou doorverwijzen naar de hoofdapplicatie met de interactieve kaart van Nederland.');
        }
        
