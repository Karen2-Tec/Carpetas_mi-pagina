// 1. Array de objetos que simula los registros del Inventario (Colección base)
let baseDrops = [
    { id: 1, nombre: "Air Jordan 1 High 'Chicago'", categoria: "Sneakers", stock: 5, descripcion: "Piel premium combinada en bloques blancos, rojos y negros clásicos." },
    { id: 2, nombre: "Baggy Cargo Denim Desgastado", categoria: "Streetwear", stock: 0, descripcion: "Mezclilla pesada de corte ancho con bolsillos utilitarios laterales." },
    { id: 3, nombre: "Cangurera Leather Cherry Red", categoria: "Accesorios", stock: 14, descripcion: "Herrajes pesados con correa ajustable y cuero texturizado." }
];

// 2. Enrutador de secciones del lado del cliente
function navegar(seccionId) {
    const secciones = document.querySelectorAll('.content-section');
    secciones.forEach(sec => sec.classList.add('d-none'));

    const seccionActiva = document.getElementById(`view-${seccionId}`);
    if (seccionActiva) {
        seccionActiva.classList.remove('d-none');
    }

    // Actualiza el link seleccionado en el navbar
    const enlaces = document.querySelectorAll('.navbar-nav .nav-link');
    enlaces.forEach(enlace => {
        enlace.classList.remove('active');
        if (enlace.getAttribute('onclick') && enlace.getAttribute('onclick').includes(seccionId)) {
            enlace.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const formDrop = document.getElementById('form-drop');
    const inputNombre = document.getElementById('drop-nombre');
    const selectCategoria = document.getElementById('drop-categoria');
    const inputStock = document.getElementById('drop-stock');
    const txtDescripcion = document.getElementById('drop-descripcion');

    const alertContainer = document.getElementById('alert-container');
    const listaDropsCards = document.getElementById('lista-drops-cards');
    const totalDropsBadge = document.getElementById('total-drops-badge');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    const spinner = document.getElementById('loading-spinner');

    // Inicializar visualización del catálogo
    renderizarInventarioCompleto();

    // --- LÓGICA DE VALIDACIÓN ---
    function validarNombre() {
        const valor = inputNombre.value.trim();
        if (valor === '' || valor.length < 5) { marcarInvalido(inputNombre); return false; }
        marcarValido(inputNombre); return true;
    }

    function validarCategoria() {
        if (!selectCategoria.value) { marcarInvalido(selectCategoria); return false; }
        marcarValido(selectCategoria); return true;
    }

    function validarStock() {
        const valor = inputStock.value.trim();
        if (valor === '' || parseInt(valor) < 0 || isNaN(parseInt(valor))) { marcarInvalido(inputStock); return false; }
        marcarValido(inputStock); return true;
    }

    function validarDescripcion() {
        const valor = txtDescripcion.value.trim();
        if (valor === '' || valor.length < 15) { marcarInvalido(txtDescripcion); return false; }
        marcarValido(txtDescripcion); return true;
    }

    function marcarInvalido(el) { el.classList.remove('is-valid'); el.classList.add('is-invalid'); }
    function marcarValido(el) { el.classList.remove('is-invalid'); el.classList.add('is-valid'); }

    if (inputNombre) inputNombre.addEventListener('input', validarNombre);
    if (selectCategoria) selectCategoria.addEventListener('change', validarCategoria);
    if (inputStock) inputStock.addEventListener('input', validarStock);
    if (txtDescripcion) txtDescripcion.addEventListener('input', validarDescripcion);

    // --- ESTRUCTURA REPETITIVA Y CONDICIONALES ---
    function renderizarInventarioCompleto() {
        if (!listaDropsCards) return;
        
        listaDropsCards.innerHTML = '';

        if (baseDrops.length === 0) {
            if (mensajeVacio) mensajeVacio.classList.remove('d-none');
            if (totalDropsBadge) totalDropsBadge.innerText = "Total: 0";
            return;
        } else {
            if (mensajeVacio) mensajeVacio.classList.add('d-none');
        }

        baseDrops.forEach((item) => {
            const stockStyle = item.stock > 0 ? 'background: rgba(34, 197, 94, 0.1); color: #22c55e;' : 'background: rgba(239, 68, 68, 0.1); color: #ef4444;';
            const stockLabel = item.stock > 0 ? `En Stock: ${item.stock} uds` : 'Out of Stock';

            const colCard = document.createElement('div');
            colCard.className = 'col-12 col-md-6 col-lg-4';
            colCard.innerHTML = `
                <div class="card product-inventory-card h-100 d-flex flex-column justify-content-between p-3">
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="tag-cat">${item.categoria}</span>
                            <small class="text-secondary">ID: ${item.id.toString().slice(-4)}</small>
                        </div>
                        <h4 class="h5 text-white fw-bold card-title">${item.nombre}</h4>
                        <p class="text-muted-urban small card-text text-truncate">${item.descripcion}</p>
                    </div>
                    <div class="mt-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge-stock-dinamico" style="${stockStyle}">${stockLabel}</span>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-light btn-sm w-50 fw-bold text-uppercase btn-ver-detalle" data-id="${item.id}">Detalles</button>
                            <button class="btn btn-outline-danger btn-sm w-50 fw-bold text-uppercase btn-eliminar-drop" data-id="${item.id}">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;

            // Configuración del botón Ver Detalles
            colCard.querySelector('.btn-ver-detalle').addEventListener('click', () => {
                verDetallesModal(item);
            });

            // Configuración del botón Eliminar
            colCard.querySelector('.btn-eliminar-drop').addEventListener('click', () => {
                ejecutarAccionConSpinner(() => {
                    eliminarDrop(item.id);
                });
            });

            listaDropsCards.appendChild(colCard);
        });

        if (totalDropsBadge) totalDropsBadge.innerText = `Total: ${baseDrops.length}`;
    }

    // Proceso simulado usando el SPINNER
    function ejecutarAccionConSpinner(callback) {
        if (spinner) {
            spinner.classList.remove('d-none');
            spinner.classList.add('d-flex');

            setTimeout(() => {
                spinner.classList.remove('d-flex');
                spinner.classList.add('d-none');
                callback();
            }, 1200);
        } else {
            callback();
        }
    }

    // Lanzamiento y renderizado dinámico del MODAL
    function verDetallesModal(item) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBodyContent = document.getElementById('modalBodyContent');

        if (modalTitle) modalTitle.innerText = `🔎 Catálogo: ${item.nombre}`;
        if (modalBodyContent) {
            modalBodyContent.innerHTML = `
                <p><strong>Categoría de Lanzamiento:</strong> <span class="text-danger fw-bold">${item.categoria}</span></p>
                <p><strong>Unidades en Inventario:</strong> ${item.stock > 0 ? `<span class="text-success fw-bold">${item.stock} unidades</span>` : '<span class="text-danger fw-bold">Agotado</span>'}</p>
                <p><strong>Especificación Estilística:</strong></p>
                <div class="p-3 bg-secondary bg-opacity-10 border border-secondary rounded text-white-50 fs-7">
                    ${item.descripcion}
                </div>
            `;
        }

        // Instancia nativa de Bootstrap Modal
        const detalleModal = new bootstrap.Modal(document.getElementById('dropDetailModal'));
        detalleModal.show();
    }

    // Registrar nuevo drop con validaciones
    if (formDrop) {
        formDrop.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validarNombre() && validarCategoria() && validarStock() && validarDescripcion()) {

                ejecutarAccionConSpinner(() => {
                    const nuevoObj = {
                        id: Date.now(),
                        nombre: inputNombre.value.trim(),
                        categoria: selectCategoria.value,
                        stock: parseInt(inputStock.value),
                        descripcion: txtDescripcion.value.trim()
                    };

                    baseDrops.push(nuevoObj);
                    renderizarInventarioCompleto();

                    formDrop.reset();
                    document.querySelectorAll('.form-urban-input').forEach(i => i.classList.remove('is-valid'));

                    // Redirección e inyección automática al Inventario
                    navegar('inventario');
                });

            } else {
                mostrarAlerta('Error en el envío: Valida que los datos sigan los parámetros indicados.', 'danger');
            }
        });
    }

    function eliminarDrop(id) {
        baseDrops = baseDrops.filter(item => item.id !== id);
        renderizarInventarioCompleto();
    }

    function mostrarAlerta(msg, tipo) {
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-${tipo} alert-dismissible fade show fw-bold text-center small text-uppercase mb-3" role="alert">
                    <span>⚠️ ${msg}</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }
    }
});