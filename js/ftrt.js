document.addEventListener('DOMContentLoaded', () => {
    // Configuración de los tabs de casos de estudio
    const tabButtons = document.querySelectorAll('.tab-button');
    const caseContents = document.querySelectorAll('.case-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetCase = button.getAttribute('data-case');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            caseContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(targetCase).classList.add('active');
        });
    });

    // Animación de las barras de correlación al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const barFills = entry.target.querySelectorAll('.bar-fill');
                barFills.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => { bar.style.width = width; }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const correlationSection = document.querySelector('.correlation-grid');
    if (correlationSection) observer.observe(correlationSection);
});
