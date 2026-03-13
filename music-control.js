// ============================================================
// music-control.js — Control global de música de fondo
// ============================================================

// ── Variables globales ───────────────────────────────────────
let bgMusic = null;
let isMixMode = false;
let currentTrackIndex = 0;
const musicTracks = ['audio/chuchu.mp3', 'audio/antonimo.mp3', 'audio/bebita.mp3', 'audio/chiqui.mp3'];
const musicToggleBtn = document.getElementById('musicToggleBtn');

// ── Leer preferencia guardada ──────────────────────────────────
const musicMuted = localStorage.getItem('musicMuted') === 'true';
const musicWasPlaying = localStorage.getItem('musicPlaying') === 'true';
const currentMusicSrc = localStorage.getItem('currentMusicSrc');

// ── Crear audio global si no existe ───────────────────────────
function ensureBgMusic() {
    if (bgMusic) return;
    
    // Si ya existe un audio (creado por juegos.js), usarlo
    if (typeof window.bgMusic !== 'undefined' && window.bgMusic) {
        bgMusic = window.bgMusic;
        return;
    }
    
    bgMusic = document.createElement('audio');
    
    // Usar la fuente de música actual si existe, sino aplicar preferencia
    let musicSrc;
    if (currentMusicSrc) {
        musicSrc = currentMusicSrc;
    } else {
        // Aplicar preferencia de música guardada
        const musicChoice = localStorage.getItem('musicChoice') || 'chuchu';
        switch (musicChoice) {
            case 'chuchu':
                musicSrc = 'audio/chuchu.mp3';
                break;
            case 'antonimo':
                musicSrc = 'audio/antonimo.mp3';
                break;
            case 'bebita':
                musicSrc = 'audio/bebita.mp3';
                break;
            case 'chiqui':
                musicSrc = 'audio/chiqui.mp3';
                break;
            case 'mix':
                // Elegir aleatoriamente solo si no hay música actual
                const choices = ['chuchu', 'antonimo', 'bebita', 'chiqui'];
                const randomChoice = choices[Math.floor(Math.random() * choices.length)];
                switch (randomChoice) {
                    case 'chuchu': musicSrc = 'audio/chuchu.mp3'; break;
                    case 'antonimo': musicSrc = 'audio/antonimo.mp3'; break;
                    case 'bebita': musicSrc = 'audio/bebita.mp3'; break;
                    case 'chiqui': musicSrc = 'audio/chiqui.mp3'; break;
                }
                break;
            default:
                musicSrc = 'audio/chuchu.mp3';
        }
        localStorage.setItem('currentMusicSrc', musicSrc);
    }
    
    bgMusic.src = musicSrc;
    
    // Configurar bucle según el modo
    const musicChoice = localStorage.getItem('musicChoice') || 'chuchu';
    isMixMode = musicChoice === 'mix';
    
    if (isMixMode) {
        bgMusic.loop = false;
        // Añadir event listener para cambiar de canción cuando termine
        bgMusic.addEventListener('ended', playNextRandomTrack);
    } else {
        bgMusic.loop = true;
        // Remover event listener si existe
        bgMusic.removeEventListener('ended', playNextRandomTrack);
    }
    
    // Aplicar volumen guardado
    const savedVolume = localStorage.getItem('musicVolume') || '5';
    bgMusic.volume = savedVolume / 100;
    
    document.body.appendChild(bgMusic);
}

// ── Inicializar estado del botón y audio ───────────────────────
function initMusicState() {
    ensureBgMusic();
    if (musicMuted) {
        bgMusic.muted = true;
        musicToggleBtn.textContent = '🔇';
        musicToggleBtn.classList.add('muted');
    } else {
        bgMusic.muted = false;
        // Si la música estaba reproduciéndose antes, continuar reproduciendo
        if (musicWasPlaying) {
            bgMusic.play().catch(() => {});
        }
        musicToggleBtn.textContent = '🔊';
        musicToggleBtn.classList.remove('muted');
    }
}

// ── Función para reproducir la siguiente canción aleatoria (modo mix) ──
function playNextRandomTrack() {
    if (!isMixMode || !bgMusic) return;
    
    // Elegir una canción diferente a la actual
    const availableTracks = musicTracks.filter(track => track !== bgMusic.src);
    const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
    
    bgMusic.src = randomTrack;
    localStorage.setItem('currentMusicSrc', randomTrack);
    
    // Reproducir si no está silenciado
    if (!bgMusic.muted) {
        bgMusic.play().catch(() => {});
    }
}

// ── Toggle música ───────────────────────────────────────────────
function toggleMusic() {
    if (!bgMusic) initMusicState();
    const nowMuted = !bgMusic.muted;
    bgMusic.muted = nowMuted;
    localStorage.setItem('musicMuted', nowMuted);
    
    if (nowMuted) {
        // Si se silencia, guardar que no está reproduciendo
        localStorage.setItem('musicPlaying', 'false');
        musicToggleBtn.textContent = '🔇';
        musicToggleBtn.classList.add('muted');
    } else {
        // Si se activa, guardar que está reproduciendo
        localStorage.setItem('musicPlaying', 'true');
        bgMusic.play().catch(() => {});
        musicToggleBtn.textContent = '🔊';
        musicToggleBtn.classList.remove('muted');
    }
}

// ── Función para actualizar el modo de música ───────────────────────
function updateMusicMode() {
    if (!bgMusic) return;
    
    const musicChoice = localStorage.getItem('musicChoice') || 'chuchu';
    isMixMode = musicChoice === 'mix';
    
    // Guardar estado actual de reproducción
    const wasPlaying = !bgMusic.paused && !bgMusic.muted;
    const currentSrc = bgMusic.src;
    
    if (isMixMode) {
        bgMusic.loop = false;
        bgMusic.addEventListener('ended', playNextRandomTrack);
    } else {
        bgMusic.loop = true;
        bgMusic.removeEventListener('ended', playNextRandomTrack);
    }
    
    // Si estamos en modo mix y no hay canción actual, elegir una aleatoria
    if (isMixMode && !currentSrc) {
        playNextRandomTrack();
    }
}

// ── Inicializar al cargar ───────────────────────────────────────
if (musicToggleBtn) {
    musicToggleBtn.onclick = toggleMusic;
    initMusicState();
    updateMusicMode();
} else {
    // Si el botón no existe, esperar a que el DOM esté listo
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('musicToggleBtn');
        if (btn) {
            btn.onclick = toggleMusic;
            initMusicState();
            updateMusicMode();
        }
    });
}
