// Fecha objetivo (6 Diciembre 2025 16:45 local)
const targetDate = new Date("2025-12-06T16:45:00");

const elDays = document.getElementById("days");
const elHours = document.getElementById("hours");
const elMinutes = document.getElementById("minutes");
const elSeconds = document.getElementById("seconds");

function updateCountdown() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    if (diff <= 0) {
        elDays.textContent = "0";
        elHours.textContent = "0";
        elMinutes.textContent = "0";
        elSeconds.textContent = "0";
        clearInterval(timerId);
        return;
    }
    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    elDays.textContent = days;
    elHours.textContent = String(hours).padStart(2, "0");
    elMinutes.textContent = String(minutes).padStart(2, "0");
    elSeconds.textContent = String(seconds).padStart(2, "0");
}
const timerId = setInterval(updateCountdown, 1000);
updateCountdown();

// Guarda la fecha (genera .ics)
const saveBtn = document.querySelector(".save-date-btn");
if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        const dtStart = targetDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        const dtEnd = new Date(targetDate.getTime() + 2 * 60 * 60 * 1000)
            .toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Boda Anngi y Jeim//ES\nBEGIN:VEVENT\nUID:${Date.now()}@boda\nDTSTAMP:${dtStart}\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:Boda de Anngi y Jeim\nDESCRIPTION:¡Nos casamos!\nEND:VEVENT\nEND:VCALENDAR`;
        const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = "boda-anngi-jeim.ics";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
    });
}

// Botón de ver ubicación
const viewLocationBtn = document.querySelector(".view-location-btn");
if (viewLocationBtn) {
    viewLocationBtn.addEventListener("click", () => {
        // Aquí puedes agregar la URL del mapa real del Hotel Venetur
        window.open("https://maps.google.com", "_blank");
    });
}

// RSVP dinámico con validaciones mejoradas
const attendeesInput = document.getElementById("attendees");
const checkbox = document.getElementById("addCompanions");
const companionsSection = document.getElementById("companionsSection");

function renderCompanions() {
    const n = Math.max(0, (parseInt(attendeesInput.value, 10) || 1) - 1);
    companionsSection.innerHTML = "";
    for (let i = 0; i < n; i++) {
        const wrap = document.createElement("div");
        wrap.className = "companion-input";
        const label = document.createElement("label");
        label.textContent = `Invitado #${i + 1}`;
        const input = document.createElement("input");
        input.type = "text";
        input.name = `companion${i + 1}`;
        input.placeholder = "Nombre completo";
        input.required = checkbox.checked;
        wrap.appendChild(label);
        wrap.appendChild(input);
        companionsSection.appendChild(wrap);
    }
}

if (attendeesInput && checkbox && companionsSection) {
    const toggle = () => {
        companionsSection.style.display = checkbox.checked ? "grid" : "none";
        // Actualizar campos requeridos
        const inputs = companionsSection.querySelectorAll("input");
        inputs.forEach(input => {
            input.required = checkbox.checked;
        });
    };
    attendeesInput.addEventListener("input", renderCompanions);
    checkbox.addEventListener("change", toggle);
    renderCompanions();
    toggle();
}

// Validación mejorada del formulario
function validateForm(formData) {
    const attendees = parseInt(formData.get("attendees"));
    const addCompanions = formData.get("addCompanions");
    
    if (attendees < 1 || attendees > 10) {
        alert("Por favor, ingresa un número válido de asistentes (1-10)");
        return false;
    }
    
    if (addCompanions) {
        const companions = [];
        for (let i = 1; i < attendees; i++) {
            const companion = formData.get(`companion${i}`);
            if (companion && companion.trim() === "") {
                alert(`Por favor, ingresa el nombre del invitado #${i}`);
                return false;
            }
            if (companion) companions.push(companion);
        }
    }
    
    return true;
}

// Manejo mejorado del envío del formulario
const form = document.getElementById("rsvpForm");
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        
        if (!validateForm(data)) {
            return;
        }
        
        // Mostrar loading
        const submitBtn = form.querySelector(".submit-btn");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Enviando...";
        submitBtn.disabled = true;
        
        // Simular envío (aquí puedes agregar la lógica real de envío)
        setTimeout(() => {
            const entries = [...data.entries()]
                .filter(([k, v]) => v && v.trim() !== "")
                .map(([k, v]) => `${k}: ${v}`)
                .join("\n");
            
            alert("¡Gracias por confirmar tu asistencia!\n\n" + entries);
            form.reset();
            renderCompanions();
            
            // Restaurar botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Animaciones suaves al hacer scroll
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplicar animaciones a las secciones
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Audio Player Controls
let audio = null;
let isPlaying = false;
let currentTime = 0;
let duration = 0;

function initAudioPlayer() {
    audio = document.getElementById('weddingAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    const progressContainer = document.getElementById('progressBar');
    
    if (!audio || !playPauseBtn) return;
    
    // Configurar duración cuando se carga el audio
    audio.addEventListener('loadedmetadata', () => {
        duration = audio.duration;
        totalTimeEl.textContent = formatTime(duration);
    });
    
    // Actualizar tiempo actual
    audio.addEventListener('timeupdate', () => {
        currentTime = audio.currentTime;
        currentTimeEl.textContent = formatTime(currentTime);
        
        if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            progressFill.style.width = progress + '%';
            progressHandle.style.left = progress + '%';
        }
    });
    
    // Controlar reproducción
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playPauseBtn.querySelector('.play-icon').classList.add('active');
            playPauseBtn.querySelector('.pause-icon').classList.remove('active');
        } else {
            audio.play().catch(e => {
                console.log('Error al reproducir audio:', e);
                // Si no se puede reproducir, simular reproducción
                simulatePlayback();
            });
            isPlaying = true;
            playPauseBtn.querySelector('.play-icon').classList.remove('active');
            playPauseBtn.querySelector('.pause-icon').classList.add('active');
        }
    });
    
    // Controlar progreso al hacer clic
    progressContainer.addEventListener('click', (e) => {
        if (duration > 0) {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / rect.width) * duration;
            audio.currentTime = newTime;
        }
    });
    
    // Inicializar estado
    playPauseBtn.querySelector('.play-icon').classList.add('active');
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function simulatePlayback() {
    // Simular reproducción si no se puede cargar el audio real
    isPlaying = true;
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.querySelector('.play-icon').classList.remove('active');
        playPauseBtn.querySelector('.pause-icon').classList.add('active');
    }
    
    // Simular progreso
    let simulatedTime = 0;
    const totalDuration = 225; // 3:45 en segundos
    const totalTimeEl = document.getElementById('totalTime');
    const currentTimeEl = document.getElementById('currentTime');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    
    if (totalTimeEl) totalTimeEl.textContent = formatTime(totalDuration);
    
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }
        
        simulatedTime += 1;
        if (simulatedTime >= totalDuration) {
            simulatedTime = 0;
        }
        
        if (currentTimeEl) currentTimeEl.textContent = formatTime(simulatedTime);
        
        const progress = (simulatedTime / totalDuration) * 100;
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressHandle) progressHandle.style.left = progress + '%';
    }, 1000);
}

// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    addScrollAnimations();
    initAudioPlayer();
});