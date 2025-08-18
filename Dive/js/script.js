document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navContainer = document.querySelector('.nav-container');
    const body = document.body;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navContainer.classList.toggle('active');
        body.classList.toggle('menu-active');
    });

   
    const navLinks = document.querySelectorAll('.nav-container a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navContainer.classList.remove('active');
            body.classList.remove('menu-active');
        });
    });

   
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return; 

         
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;

          
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

          
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

          
            if (navContainer.classList.contains('active')) {
                navContainer.classList.remove('active');
                hamburger.classList.remove('active');
                body.classList.remove('menu-active');
            }
        });
    });

  
    document.querySelectorAll('[data-scroll]').forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-scroll');
            const targetElement = document.querySelector(targetId);
            
            if (!targetElement) return;

            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;

            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.height = '0px';
                }
            });
            
           
            if (!isActive) {
                item.classList.add('active');
                answer.style.height = answer.scrollHeight + 'px';
            } else {
                item.classList.remove('active');
                answer.style.height = '0px';
            }
        });
    });
}); 