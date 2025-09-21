// Aviso temporal: "Página en construcción" solo la primera vez que se abre el index
// Fácil de eliminar: basta con borrar este archivo o la etiqueta <script> que lo incluye en index.html
(function () {
  try {
    var KEY = 'construccionAvisoMostrado';
    if (!sessionStorage.getItem(KEY)) {
      alert('Página en construcción...');
      sessionStorage.setItem(KEY, '1');
    }
  } catch (e) {
    // Si sessionStorage no está disponible, hacemos un alert de todos modos pero sin persistencia
    try { alert('Página en construcción...'); } catch(_) {}
  }
})();
