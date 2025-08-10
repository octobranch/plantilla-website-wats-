// ===== CONFIGURACIÓN - CAMBIAR AQUÍ PARA PERSONALIZAR =====
const CONFIG = {
    // Número de WhatsApp (incluir código de país sin +)
    whatsappNumber: '5215512345678', // CAMBIAR POR TU NÚMERO
    
    // Mensaje predeterminado para WhatsApp
    whatsappMessage: '¡Hola! Me interesa obtener más información sobre sus productos/servicios.',
    
    // Configuración del tooltip
    tooltipShowDelay: 3000, // Mostrar tooltip después de 3 segundos
    tooltipHideDelay: 5000, // Ocultar tooltip después de 5 segundos
    
    // Configuración del menú
    scrollThreshold: 100 // Cambiar navbar al hacer scroll
};

// ===== VARIABLES GLOBALES =====
let tooltipTimeout;
let hideTooltipTimeout;
let isMenuOpen = false;

// ===== INICIALIZACIÓN AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    initializeWhatsApp();
    initializeScrollEffects();
    initializePDFHandling();
    initializeResponsiveHandling();
    
    console.log('✅ Plantilla PDF inicializada correctamente');
});

// ===== FUNCIONES DEL MENÚ DE NAVEGACIÓN =====
function initializeMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle del menú móvil
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            toggleMenu();
        });
    }

    // Cerrar menú al hacer click en un link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && isMenuOpen) {
                closeMenu();
            }
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !e.target.closest('.navbar')) {
            closeMenu();
        }
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
}

function toggleMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (isMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    mobileMenu.classList.add('active');
    navMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    isMenuOpen = true;
}

function closeMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    mobileMenu.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll del body
    isMenuOpen = false;
}

// ===== FUNCIONES DE WHATSAPP =====
function initializeWhatsApp() {
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const tooltip = document.getElementById('whatsapp-tooltip');

    if (whatsappBtn) {
        // Click en el botón de WhatsApp
        whatsappBtn.addEventListener('click', function() {
            openWhatsApp();
        });

        // Mostrar tooltip al pasar el mouse
        whatsappBtn.addEventListener('mouseenter', function() {
            showTooltip();
        });

        // Ocultar tooltip al salir el mouse
        whatsappBtn.addEventListener('mouseleave', function() {
            hideTooltip();
        });

        // Mostrar tooltip automáticamente después de un tiempo
        setTimeout(() => {
            showTooltip();
            // Ocultarlo automáticamente después de un tiempo
            hideTooltipTimeout = setTimeout(() => {
                hideTooltip();
            }, CONFIG.tooltipHideDelay);
        }, CONFIG.tooltipShowDelay);
    }
}

function openWhatsApp() {
    const message = encodeURIComponent(CONFIG.whatsappMessage);
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
    
    // Abrir en nueva ventana/pestaña
    window.open(url, '_blank');
    
    // Analytics o tracking (opcional)
    trackWhatsAppClick();
}

function showTooltip() {
    const tooltip = document.getElementById('whatsapp-tooltip');
    if (tooltip) {
        clearTimeout(tooltipTimeout);
        clearTimeout(hideTooltipTimeout);
        tooltip.classList.add('show');
    }
}

function hideTooltip() {
    const tooltip = document.getElementById('whatsapp-tooltip');
    if (tooltip) {
        tooltipTimeout = setTimeout(() => {
            tooltip.classList.remove('show');
        }, 300);
    }
}

function trackWhatsAppClick() {
    // Aquí puedes agregar código de tracking/analytics
    console.log('📱 WhatsApp button clicked');
    
    // Ejemplo para Google Analytics (descomenta si lo usas)
    // gtag('event', 'whatsapp_click', {
    //     event_category: 'engagement',
    //     event_label: 'whatsapp_contact'
    // });
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Agregar sombra al navbar al hacer scroll
        if (scrollTop > CONFIG.scrollThreshold) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        // Ocultar/mostrar navbar en scroll (opcional)
        // if (scrollTop > lastScrollTop && scrollTop > CONFIG.scrollThreshold) {
        //     navbar.style.transform = 'translateY(-100%)';
        // } else {
        //     navbar.style.transform = 'translateY(0)';
        // }
        
        lastScrollTop = scrollTop;
    });
}

// ===== MANEJO DEL PDF =====
function initializePDFHandling() {
    const iframe = document.querySelector('.pdf-container iframe');
    const fallback = document.querySelector('.pdf-fallback');

    if (iframe && fallback) {
        // Ocultar fallback inicialmente
        fallback.style.display = 'none';

        // Mostrar fallback si hay error cargando el PDF
        iframe.addEventListener('error', function() {
            fallback.style.display = 'block';
            console.warn('⚠️ No se pudo cargar el PDF, mostrando fallback');
        });

        // Verificar si el PDF se cargó correctamente
        iframe.addEventListener('load', function() {
            try {
                // Si se carga correctamente, asegurar que el fallback esté oculto
                fallback.style.display = 'none';
                console.log('✅ PDF cargado correctamente');
            } catch (error) {
                fallback.style.display = 'block';
                console.warn('⚠️ Error verificando la carga del PDF:', error);
            }
        });

        // Timeout para mostrar fallback si tarda mucho en cargar
        setTimeout(() => {
            if (!iframe.contentDocument && !iframe.contentWindow) {
                fallback.style.display = 'block';
                console.warn('⚠️ Timeout cargando PDF, mostrando fallback');
            }
        }, 10000); // 10 segundos
    }
}

// ===== MANEJO RESPONSIVE =====
function initializeResponsiveHandling() {
    let resizeTimeout;

    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResize();
        }, 250);
    });

    // Manejar cambio de orientación en móviles
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            handleResize();
            // Cerrar menú si está abierto
            if (isMenuOpen) {
                closeMenu();
            }
        }, 100);
    });
}

function handleResize() {
    // Cerrar menú si se cambia a desktop
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
    }

    // Ajustar altura del contenedor PDF
    adjustPDFContainer();
    
    console.log('📱 Ventana redimensionada:', window.innerWidth + 'x' + window.innerHeight);
}

function adjustPDFContainer() {
    const container = document.querySelector('.pdf-container');
    const navbar = document.querySelector('.navbar');
    
    if (container && navbar) {
        const navbarHeight = navbar.offsetHeight;
        const windowHeight = window.innerHeight;
        const padding = window.innerWidth <= 480 ? 20 : 40; // Padding responsivo
        
        container.style.height = `${windowHeight - navbarHeight - padding}px`;
    }
}

// ===== FUNCIONES DE UTILIDAD =====

// Función para cambiar el número de WhatsApp (útil para personalización)
function setWhatsAppNumber(number) {
    CONFIG.whatsappNumber = number;
    console.log('📱 Número de WhatsApp actualizado:', number);
}

// Función para cambiar el mensaje de WhatsApp
function setWhatsAppMessage(message) {
    CONFIG.whatsappMessage = message;
    console.log('💬 Mensaje de WhatsApp actualizado');
}

// Función para cambiar colores dinámicamente
function setThemeColors(primaryColor, accentColor) {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    console.log('🎨 Colores del tema actualizados');
}

// Función para cambiar el PDF
function setPDFSource(pdfUrl) {
    const iframe = document.querySelector('.pdf-container iframe');
    const fallbackLink = document.querySelector('.pdf-fallback a');
    
    if (iframe) {
        iframe.src = pdfUrl;
    }
    
    if (fallbackLink) {
        fallbackLink.href = pdfUrl;
    }
    
    console.log('📄 Fuente del PDF actualizada:', pdfUrl);
}

// ===== EVENTOS GLOBALES =====

// Prevenir errores de consola
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IFRAME') {
        console.warn('⚠️ Error en iframe (probablemente PDF):', e);
    }
});

// Mostrar información de carga en consola
console.log(`
🚀 Plantilla PDF Web Responsive
📱 Dispositivo: ${window.innerWidth}x${window.innerHeight}
🌐 Navegador: ${navigator.userAgent.includes('Mobile') ? 'Móvil' : 'Desktop'}
📄 PDF configurado para: catalogo.pdf
💬 WhatsApp: ${CONFIG.whatsappNumber}

Para personalizar:
- Cambiar número: setWhatsAppNumber('5215512345678')
- Cambiar mensaje: setWhatsAppMessage('Tu mensaje')
- Cambiar colores: setThemeColors('#tu-color', '#tu-acento')
- Cambiar PDF: setPDFSource('tu-archivo.pdf')
`);

// ===== EXPORTAR FUNCIONES PARA USO GLOBAL =====
window.templateUtils = {
    setWhatsAppNumber,
    setWhatsAppMessage,
    setThemeColors,
    setPDFSource,
    openWhatsApp,
    toggleMenu,
    showTooltip,
    hideTooltip
};