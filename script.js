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
        window.open("https://maps.app.goo.gl/TSRS8zQRdrEam9e6A", "_blank");
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

    // Función robusta para forzar autoplay
    function forceAutoPlay() {
        console.log('🎵 Intentando reproducción automática...');

        // Estrategia 1: Intento inmediato
        const attempt1 = audio.play();
        if (attempt1 !== undefined) {
            attempt1.then(() => {
                console.log('✅ Reproducción automática exitosa (intento 1)');
                isPlaying = true;
                updatePlayButton();
            }).catch(error => {
                console.log('❌ Intento 1 falló:', error.message);

                // Estrategia 2: Esperar interacción del usuario
                const enableAudioOnInteraction = () => {
                    console.log('👆 Interacción detectada, intentando reproducción...');
                    const attempt2 = audio.play();

                    if (attempt2 !== undefined) {
                        attempt2.then(() => {
                            console.log('✅ Reproducción exitosa después de interacción');
                            isPlaying = true;
                            updatePlayButton();
                        }).catch(error2 => {
                            console.log('❌ Intento 2 falló:', error2.message);

                            // Estrategia 3: Muted autoplay + unmute
                            console.log('🔇 Intentando muted autoplay...');
                            audio.muted = true;
                            const attempt3 = audio.play();

                            if (attempt3 !== undefined) {
                                attempt3.then(() => {
                                    console.log('✅ Muted autoplay exitoso, intentando unmute...');
                                    audio.muted = false;
                                    isPlaying = true;
                                    updatePlayButton();
                                    console.log('✅ Audio reproduciéndose (unmuted)');
                                }).catch(error3 => {
                                    console.log('❌ Muted autoplay falló:', error3.message);
                                    // Si todo falla, mantener estado inicial
                                    isPlaying = false;
                                    updatePlayButton();
                                });
                            }
                        });
                    }

                    // Remover listeners después del primer uso
                    document.removeEventListener('touchstart', enableAudioOnInteraction);
                    document.removeEventListener('click', enableAudioOnInteraction);
                    document.removeEventListener('scroll', enableAudioOnInteraction);
                };

                // Escuchar múltiples tipos de interacción
                document.addEventListener('touchstart', enableAudioOnInteraction, { once: true });
                document.addEventListener('click', enableAudioOnInteraction, { once: true });
                document.addEventListener('scroll', enableAudioOnInteraction, { once: true });

                // Estrategia 4: Reintentar después de un delay
                setTimeout(() => {
                    if (!isPlaying) {
                        console.log('⏰ Reintentando reproducción después de delay...');
                        const attempt4 = audio.play();
                        if (attempt4 !== undefined) {
                            attempt4.then(() => {
                                console.log('✅ Reproducción exitosa en reintento');
                                isPlaying = true;
                                updatePlayButton();
                            }).catch(error4 => {
                                console.log('❌ Reintento falló:', error4.message);
                            });
                        }
                    }
                }, 2000);
            });
        }
    }

    // Función para actualizar el estado visual del botón
    function updatePlayButton() {
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');

        if (isPlaying) {
            playIcon.classList.remove('active');
            pauseIcon.classList.add('active');
        } else {
            playIcon.classList.add('active');
            pauseIcon.classList.remove('active');
        }
    }

    // Configurar el audio para mejor compatibilidad
    audio.preload = 'auto';
    audio.volume = 0.7;

    // Intentar reproducción automática inmediatamente y después de un delay
    forceAutoPlay();
    setTimeout(forceAutoPlay, 500);
    setTimeout(forceAutoPlay, 1500);

    // Controlar reproducción manual
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

    // Inicializar estado visual
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

    // Password protection logic
    const passwordOverlay = document.getElementById('passwordOverlay');
    const passwordInput = document.getElementById('passwordInput');
    const passwordSubmit = document.getElementById('passwordSubmit');
    const passwordError = document.getElementById('passwordError');
    const correctPassword = '12345';

    function showError(message) {
        passwordError.textContent = message;
    }

    function clearError() {
        passwordError.textContent = '';
    }

    function unlockPage() {
        passwordOverlay.style.display = 'none';
    }

    passwordSubmit.addEventListener('click', () => {
        const enteredPassword = passwordInput.value.trim();
        if (enteredPassword === correctPassword) {
            clearError();
            unlockPage();
        } else {
            showError('La contraseña es incorrecta. Intenta de nuevo 😊');
        }
    });

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            passwordSubmit.click();
        }
    });


});
