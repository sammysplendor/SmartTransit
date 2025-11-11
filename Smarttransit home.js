// Fade-up animation 
const fadeElements = document.querySelectorAll(".fade-up");

const appearOnScroll = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    },
    {threshold: 0.1}
);

fadeElements.forEach(el => appearOnScroll.observe(el));

// Button interacton
document.getElementById("getStartedBtn").addEventListener("click", () => {
    alert("Welcome to Smart Transit!");
});