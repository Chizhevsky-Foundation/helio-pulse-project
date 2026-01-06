// js/utils.js - UTILIDADES PARA DATOS REALES
const HelioPulseUtils = {
    // Formatear fecha
    formatDate: (date) => {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        }) + ' UTC';
    },

    // Formatear número científico
    formatScientific: (num, decimals = 2) => {
        if (num === null || num === undefined) return '--';
        return parseFloat(num).toFixed(decimals);
    },

    // Obtener color según valor Kp
    getKpColor: (kp) => {
        if (kp >= 7) return '#c53030'; // Rojo - Tormenta fuerte
        if (kp >= 5) return '#d69e2e'; // Naranja - Tormenta menor
        if (kp >= 4) return '#38a169'; // Verde - Inestable
        return '#3182ce'; // Azul - Tranquilo
    },

    // Parsear datos NOAA
    parseNOAAData: (data) => {
        // Esta función se implementará según el formato específico de la API NOAA
        return data;
    },

    // Calcular FTRT (placeholder - se implementará con datos JPL reales)
    calculateFTRT: (planetaryData) => {
        // Fórmula: FTRT = Σ [M_p * R_sol / d_p³]
        // Se implementará con datos reales del JPL
        return {
            value: null,
            components: [],
            timestamp: new Date().toISOString()
        };
    },

    // Manejo de errores de API
    handleAPIError: (error, context) => {
        console.error(`Error en ${context}:`, error);
        return {
            error: true,
            message: `No se pudieron cargar los datos de ${context}`,
            timestamp: new Date().toISOString()
        };
    },

    // Verificar si estamos en línea
    isOnline: () => {
        return navigator.onLine;
    },

    // Debounce para evitar demasiadas llamadas a API
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para limitar llamadas
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Almacenamiento local (cache)
    setCache: (key, data, ttl = 300000) => { // 5 minutos por defecto
        const item = {
            data: data,
            timestamp: Date.now(),
            ttl: ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    getCache: (key) => {
        const item = localStorage.getItem(key);
        if (!item) return null;
        
        const parsed = JSON.parse(item);
        const now = Date.now();
        
        if (now - parsed.timestamp > parsed.ttl) {
            localStorage.removeItem(key);
            return null;
        }
        
        return parsed.data;
    },

    // Validación de datos
    isValidNumber: (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    // Conversión de unidades
    convertUnits: (value, from, to) => {
        const conversions = {
            'km_to_au': value => value / 149597870.7,
            'au_to_km': value => value * 149597870.7
        };
        
        const key = `${from}_to_${to}`;
        return conversions[key] ? conversions[key](value) : value;
    }
};

// Hacer disponible globalmente
window.HelioPulseUtils = HelioPulseUtils;
