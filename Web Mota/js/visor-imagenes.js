function abrirImagen(img) {
    const visor = document.getElementById('visor-imagen');
    const imagen = document.getElementById('imagen-ampliada');

    imagen.src = img.src;
    visor.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Estado de zoom y pan
    let scale = 1;
    let translateX = 0, translateY = 0;

    // Estado de arrastre
    let isDragging = false;
    let startX = 0, startY = 0;
    let lastX = 0, lastY = 0;

    // Aplica transform y cursor
    function applyTransform() {
        imagen.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        imagen.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in';
    }

    // Reinicia transform/cursor al abrir
    imagen.style.transform = '';
    imagen.style.cursor = 'zoom-in';
    applyTransform();

    // Evita que el clic en la imagen cierre el visor
    imagen.onclick = function (e) { e.stopPropagation(); };

    // Zoom con rueda del ratón (ahora más rápido)
    imagen.onwheel = function (e) {
        e.preventDefault();
        const zoomSpeed = 0.25; // Aumentado para más velocidad
        if (e.deltaY < 0) {
            // Hacia arriba → aumentar zoom
            scale += zoomSpeed;
        } else {
            // Hacia abajo → reducir zoom (sin bajar de 1)
            scale = Math.max(1, scale - zoomSpeed);
            if (scale === 1) {
                translateX = 0;
                translateY = 0;
            }
        }
        applyTransform();
    };

    // Inicia arrastre con botón izquierdo cuando hay zoom
    imagen.onmousedown = function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        startX = e.clientX;
        startY = e.clientY;
        lastX = translateX;
        lastY = translateY;

        isDragging = (scale > 1);
        if (isDragging) imagen.style.cursor = 'grabbing';
    };

    // Arrastre
    document.onmousemove = function (e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        translateX = lastX + dx;
        translateY = lastY + dy;
        applyTransform();
    };

    // Fin del arrastre
    document.onmouseup = function () {
        if (isDragging) {
            isDragging = false;
            imagen.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
        }
    };
}

function cerrarImagen(e) {
    if (e) e.stopPropagation();
    const visor = document.getElementById('visor-imagen');
    const imagen = document.getElementById('imagen-ampliada');

    visor.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Limpia transform/cursor y handlers
    if (imagen) {
        imagen.style.transform = '';
        imagen.style.cursor = '';
        imagen.onclick = null;
        imagen.onmousedown = null;
        imagen.onwheel = null;
    }
    document.onmousemove = null;
    document.onmouseup = null;
}
