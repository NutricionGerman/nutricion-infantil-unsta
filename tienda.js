// tienda.js - Lógica de la Tienda XP

(function() {
    // 1. Inicializar base de datos de la tienda si no existe
    async function initTiendaDB() {
        try {
            const db = firebase.firestore();
            const doc = await db.collection('app_state').doc('tienda_items').get();
            if (!doc.exists) {
                // Crear el primer ítem por defecto solicitado por el profesor
                await db.collection('app_state').doc('tienda_items').set({
                    items: [
                        {
                            id: 'item_' + Date.now(),
                            name: 'Modelo de Parcial',
                            desc: 'Desbloquea un PDF con un modelo de parcial de práctica para estudiar.',
                            cost: 3,
                            icon: 'fas fa-file-pdf',
                            type: 'direct' // 'direct' o 'lootbox'
                        }
                    ]
                });
            }
        } catch (error) {
            console.error("Error inicializando la tienda:", error);
        }
    }

    // 2. Cargar ítems de la tienda
    async function loadTiendaItems() {
        try {
            const db = firebase.firestore();
            const doc = await db.collection('app_state').doc('tienda_items').get();
            if (doc.exists && doc.data().items) {
                return doc.data().items;
            }
            return [];
        } catch (error) {
            console.error("Error cargando ítems de la tienda:", error);
            return [];
        }
    }

    // 3. Lógica del Alumno (Tienda Tab)
    window.renderTiendaTab = async () => {
        const container = document.getElementById('tienda-tab-content');
        if (!container) return;
        
        let targetUP = window.loggedInStudentUP || sessionStorage.getItem('aw_authenticated_up');
        let isTeacherSimulating = false;
        
        if (window.currentTeacherData && window.currentStudentUP) {
            targetUP = window.currentStudentUP;
            isTeacherSimulating = true;
        }

        if (!targetUP) {
            container.innerHTML = `
                <div style="text-align:center; padding: 40px; background: rgba(0,0,0,0.3); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); max-width: 600px; margin: 0 auto;">
                    <i class="fas fa-lock" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                    <h3 style="color: #fff;">Inicia Sesión</h3>
                    <p style="color: #ccc;">Debes iniciar sesión en la pestaña <strong>Mi Perfil</strong> para ver tu saldo y acceder a la Tienda.</p>
                    <button class="nav-button" onclick="document.querySelector('[data-tab-target=\\'#panel-perfil\\']').click();" style="background: var(--success-color); color: white; border: none; padding: 10px 20px; border-radius: 8px; margin-top: 15px; cursor: pointer; font-weight: bold; font-size: 1.1rem;"><i class="fas fa-user-circle"></i> Ir a Mi Perfil</button>
                </div>
            `;
            return;
        }

        container.innerHTML = '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin fa-2x" style="color: #FFA500;"></i><p style="color:#aaa; margin-top:15px;">Cargando inventario y ofertas...</p></div>';

        const studentData = typeof fullData !== 'undefined' ? fullData.students.find(s => String(s.up).trim() === String(targetUP).trim()) : null;

        if (!studentData) {
            container.innerHTML = '<p style="text-align:center; color:var(--danger-color);">Error: No se pudo cargar tu información.</p>';
            return;
        }

        const items = await loadTiendaItems();
        const currentXP = studentData.xp || 0;
        const now = new Date();
        const activeItems = items.filter(i => !i.expiresAt || new Date(i.expiresAt) > now);

        let legendaryHTML = '';
        let regularHTML = '';
        let hasLegendary = false;

        if (activeItems.length === 0) {
            regularHTML = '<p style="text-align:center; width:100%; color:#aaa; font-size: 1.2rem; padding: 40px;">La tienda está vacía en este momento. ¡Vuelve pronto!</p>';
        } else {
            activeItems.forEach(item => {
                let timeIndicator = '';
                if (item.expiresAt) {
                    timeIndicator = `<div class="tienda-countdown timer" data-expires="${item.expiresAt}" style="justify-content: center; margin-bottom: 15px;"><i class="fa-solid fa-bolt"></i> Calculando...</div>`;
                }

                const imageUrl = item.image || (item.downloadUrl && item.downloadUrl.match(/\.(jpeg|jpg|gif|png|svg)(\?.*)?$/i) ? item.downloadUrl : null);

                if (item.type === 'auction') {
                    hasLegendary = true;
                    const canAffordBid = currentXP > (item.currentBid || item.cost);
                    const currentBid = item.currentBid || item.cost;
                    const bidderInfo = item.highestBidderName ? `Ganando: ${item.highestBidderName}` : `Sé el primero en pujar`;
                    
                    const mediaHTML = imageUrl 
                        ? `<div class="legendary-icon"><img src="${imageUrl}" alt="Item Image"/></div>`
                        : `<div class="legendary-icon"><i class="${item.icon || 'fas fa-gavel'}"></i></div>`;

                    legendaryHTML += `
                        <div class="legendary-card">
                            <div class="legendary-inner">
                                <div class="badge-legendary">SUBASTA</div>
                                ${mediaHTML}
                                <div class="legendary-title">${item.name}</div>
                                <div class="legendary-desc">${item.desc} <br><br><span style="color:#FFA500; font-size:12px; font-weight:bold;">${bidderInfo}</span></div>
                                ${timeIndicator}
                                <button class="btn-legendary" onclick="placeTiendaBid('${item.id}')">
                                    <i class="fas fa-gavel"></i> Pujar (Mín. ${currentBid + 1} XP)
                                </button>
                            </div>
                        </div>
                    `;
                } else {
                    const canAfford = currentXP >= item.cost;
                    const isGold = item.cost >= 20;
                    
                    const mediaHTML = imageUrl 
                        ? `<div class="item-icon"><img src="${imageUrl}" alt="Item Image"/></div>`
                        : `<div class="item-icon ${!isGold ? 'item-icon-normal' : ''}"><i class="${item.icon || 'fas fa-box'}"></i></div>`;

                    regularHTML += `
                        <div class="item-card ${isGold ? 'gold' : ''}">
                            ${mediaHTML}
                            <div class="item-title">${item.name}</div>
                            <div class="item-desc">${item.desc}</div>
                            ${timeIndicator}
                            <div class="item-footer">
                                <div class="item-price">${item.cost} <span>XP</span></div>
                                <button class="btn-buy" onclick="buyTiendaItem('${item.id}')">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }
            });
        }

        let inventorySlotsHTML = '';
        const TOTAL_SLOTS = Math.max(8, studentData.inventory ? Math.ceil(studentData.inventory.length / 4) * 4 : 8);
        
        for (let i = 0; i < TOTAL_SLOTS; i++) {
            if (studentData.inventory && studentData.inventory[i]) {
                const invItem = studentData.inventory[i];
                // Intentar obtener la imagen actualizada del catálogo si existe
                const catalogItem = items.find(cat => cat.id === invItem.id);
                let itemImage = (catalogItem && catalogItem.image) ? catalogItem.image : invItem.image;
                if (!itemImage && catalogItem && catalogItem.downloadUrl && catalogItem.downloadUrl.match(/\.(jpeg|jpg|gif|png|svg)(\?.*)?$/i)) {
                    itemImage = catalogItem.downloadUrl;
                } else if (!itemImage && invItem.downloadUrl && invItem.downloadUrl.match(/\.(jpeg|jpg|gif|png|svg)(\?.*)?$/i)) {
                    itemImage = invItem.downloadUrl;
                }
                const itemIcon = (catalogItem && catalogItem.icon) ? catalogItem.icon : invItem.icon;
                
                const mediaHTML = itemImage 
                    ? `<img src="${itemImage}" alt="Icon"/>`
                    : `<i class="${itemIcon || 'fas fa-check-circle'}"></i>`;
                inventorySlotsHTML += `
                    <div class="inventory-slot filled" title="${invItem.name}">
                        ${mediaHTML}
                    </div>
                `;
            } else {
                inventorySlotsHTML += `<div class="inventory-slot"></div>`;
            }
        }

        const adminBadge = isTeacherSimulating ? `<div style="background:#9c27b0; color:white; padding:5px 12px; border-radius:5px; font-size:0.85rem; font-weight:bold; display:inline-block; margin-bottom:10px;"><i class="fas fa-shield-alt"></i> MODO DOCENTE (Simulando a ${targetUP})</div><br>` : '';

        container.innerHTML = `
            <style>
                .inventory-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 15px; width: 100%; }
                .inventory-slot { background: rgba(255,255,255,0.05); border: 2px dashed rgba(255,255,255,0.2); border-radius: 12px; aspect-ratio: 1/1; display: flex; justify-content: center; align-items: center; transition: all 0.3s ease; position: relative; overflow: hidden; }
                .inventory-slot.filled { border-style: solid; border-color: #D4AF37; background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(30,41,59,1) 70%); cursor: pointer; }
                .inventory-slot.filled::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(transparent, transparent, transparent, #FFDF00); animation: slot-rotate 4s linear infinite; opacity: 0; transition: opacity 0.3s; }
                .inventory-slot.filled:hover::before { opacity: 1; }
                .inventory-slot.filled::after { content: ''; position: absolute; inset: 3px; background: #1a1a2e; border-radius: 10px; z-index: 1; }
                .inventory-slot img, .inventory-slot i { width: 70%; height: 70%; object-fit: contain; z-index: 2; transition: transform 0.3s; color: #D4AF37; font-size: 3rem; }
                .inventory-slot.filled:hover img, .inventory-slot.filled:hover i { transform: scale(1.15); }
                @keyframes slot-rotate { 100% { transform: rotate(360deg); } }

                .achievement-toast { position: fixed; bottom: -150px; left: 50%; transform: translateX(-50%); background: linear-gradient(to right, #111, #222); border: 2px solid #D4AF37; border-radius: 50px; display: flex; align-items: center; padding: 10px 30px 10px 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(255, 223, 0, 0.3) inset; transition: bottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 999999; }
                .achievement-toast.show { bottom: 50px; }
                .toast-icon { width: 70px; height: 70px; background: white; border-radius: 50%; margin-right: 20px; display: flex; justify-content: center; align-items: center; overflow: hidden; animation: spin-pulse 2s infinite linear; }
                .toast-icon img { width: 130%; }
                .toast-icon i { font-size: 2.5rem; color: #D4AF37; }
                .toast-text h4 { color: #FFDF00; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; margin-top: 0; }
                .toast-text p { font-size: 1.1rem; font-weight: bold; margin: 0; color: #fff; }
                @keyframes spin-pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 223, 0, 0.7); } 50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(255, 223, 0, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 223, 0, 0); } }
            </style>

            <div class="tienda-wrapper">
                ${adminBadge}
                
                <!-- BILLETERA HERO -->
                <div class="wallet-hero">
                    <div class="wallet-label">Poder Adquisitivo</div>
                    <div class="wallet-balance">
                        <span class="amount">${currentXP}</span>
                        <span class="currency">XP</span>
                    </div>
                </div>

                <!-- OFERTAS ESPECIALES / SUBASTAS -->
                ${hasLegendary ? `
                <div class="section-header">
                    <div class="section-title">Oferta Limitada / Subastas</div>
                </div>
                <div class="legendaries-grid">
                    ${legendaryHTML}
                </div>
                ` : ''}

                <!-- CATÁLOGO REGULAR -->
                <div class="section-header">
                    <div class="section-title">Catálogo Regular</div>
                </div>
                <div class="store-grid">
                    ${regularHTML}
                </div>

                <!-- INVENTARIO -->
                <div class="section-header" style="margin-top: 40px;">
                    <div class="section-title">Mi Inventario</div>
                </div>
                <p style="color: #8a8d99; font-size: 13px; margin-bottom: 20px;">Aquí se guardan tus recompensas adquiridas.</p>
                <div class="inventory-grid">
                    ${inventorySlotsHTML}
                </div>
            </div>
            
            <div class="achievement-toast" id="tienda-toast">
                <div class="toast-icon" id="tienda-toast-icon"></div>
                <div class="toast-text">
                    <h4>Logro Desbloqueado</h4>
                    <p id="tienda-toast-name"></p>
                </div>
            </div>
        `;

        // No 3D JS needed anymore, using pure CSS holographic swipe

        // Global function for Toast (can be called from buy/bid success)
        window.showTiendaToast = (itemName, itemImage, itemIcon) => {
            const toast = document.getElementById('tienda-toast');
            const toastIcon = document.getElementById('tienda-toast-icon');
            const toastName = document.getElementById('tienda-toast-name');
            if (!toast) return;
            
            toastName.textContent = itemName;
            if (itemImage) {
                toastIcon.innerHTML = `<img src="${itemImage}" alt="Icon"/>`;
            } else {
                toastIcon.innerHTML = `<i class="${itemIcon || 'fas fa-check-circle'}"></i>`;
            }
            
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        };

        // Iniciar cuenta regresiva en vivo
        if (window.tiendaCountdownInterval) clearInterval(window.tiendaCountdownInterval);
        window.tiendaCountdownInterval = setInterval(() => {
            const elements = document.querySelectorAll('.tienda-countdown');
            if (elements.length === 0) {
                clearInterval(window.tiendaCountdownInterval);
                return;
            }
            elements.forEach(el => {
                const expires = el.getAttribute('data-expires');
                if (!expires) return;
                const diffMs = new Date(expires) - new Date();
                if (diffMs <= 0) {
                    el.innerHTML = '<i class="fas fa-stopwatch"></i> ¡Terminó!';
                    return;
                }
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
                
                let timeStr = '';
                if (diffDays > 0) timeStr = `${diffDays}d ${diffHrs}h`;
                else if (diffHrs > 0) timeStr = `${diffHrs}h ${diffMins}m`;
                else timeStr = `${diffMins}m ${diffSecs}s`;
                
                el.innerHTML = `<i class="fas fa-stopwatch"></i> Expira en: ${timeStr}`;
            });
        }, 1000);
    };

    // 4. Lógica de Compra
    window.buyTiendaItem = async (itemId) => {
        try {
            const items = await loadTiendaItems();
            const item = items.find(i => i.id === itemId);
            if (!item) {
                Swal.fire('Error', 'Ítem no encontrado en la base de datos.', 'error');
                return;
            }

            let targetUP = window.loggedInStudentUP || sessionStorage.getItem('aw_authenticated_up') || localStorage.getItem('userUP');
            const loggedUserUP = targetUP;
            if (window.currentTeacherData && window.currentStudentUP) {
                targetUP = window.currentStudentUP;
            }

            if (String(loggedUserUP || '').trim() !== String(targetUP || '').trim() && !window.currentTeacherData) {
                Swal.fire({
                    icon: 'error',
                    title: 'Acción no permitida',
                    text: 'Solo puedes comprar ítems para tu propia cuenta.',
                    background: '#1a1a2e',
                    color: '#fff'
                });
                return;
            }

            const studentData = window.currentStudentData || (window.fullData && window.fullData.students ? window.fullData.students.find(s => String(s.up) === String(targetUP)) : null);
            
            if (!studentData) {
                Swal.fire('Error', 'No se encontraron tus datos de estudiante.', 'error');
                return;
            }

            if ((studentData.xp || 0) < item.cost) {
            Swal.fire({
                icon: 'error',
                title: 'Puntos Insuficientes',
                text: '¡Gana más XP participando en clase, aportando en los foros de Discord, respondiendo preguntas, calificando los videos de tus compañeros, completando tu perfil o ganando torneos!',
                background: '#1a1a2e',
                color: '#fff',
                confirmButtonColor: '#FFA500'
            });
            return;
        }

        Swal.fire({
            title: `¿Comprar "${item.name}"?`,
            text: `Vas a gastar ${item.cost} XP. ¡Esta acción no se puede deshacer!`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#a855f7',
            cancelButtonColor: '#d33',
            confirmButtonText: '<i class="fas fa-shopping-cart"></i> Sí, comprar',
            cancelButtonText: 'Cancelar',
            background: '#1a1a2e',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Mostrar loading
                    Swal.fire({
                        title: 'Procesando compra...',
                        background: '#1a1a2e',
                        color: '#fff',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    const db = firebase.firestore();
                    
                    // Actualizar localmente primero
                    studentData.xp -= item.cost;
                    if (!studentData.inventory) studentData.inventory = [];
                    studentData.inventory.push({
                        id: item.id,
                        name: item.name,
                        image: item.image || null,
                        icon: item.icon || null,
                        downloadUrl: item.downloadUrl || null,
                        purchasedAt: new Date().toISOString()
                    });

                    if (!studentData.xpHistory) studentData.xpHistory = [];
                    studentData.xpHistory.push({
                        timestamp: new Date().toISOString(),
                        reason: `Compra en tienda: ${item.name}`,
                        amount: -item.cost,
                        newXP: studentData.xp
                    });

                    // Actualizar en Firebase
                    await db.collection('students').doc(String(targetUP).trim()).update({
                        xp: studentData.xp,
                        inventory: studentData.inventory,
                        xpHistory: studentData.xpHistory
                    });

                    // Refrescar UI (cerrar loading)
                    Swal.close();
                    
                    window.showTiendaToast(item.name, item.image, item.icon);
                    if (typeof confetti === 'function') {
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#FFA500', '#FF4500', '#9c27b0', '#ffffff']
                        });
                    }
                    
                    // Recargar el modal para reflejar cambios
                    window.renderTiendaTab();

                    // Intentar refrescar la página principal si las funciones existen
                    if (typeof generateRanking === 'function') generateRanking();
                    if (typeof displayStudentPortalView === 'function' && document.getElementById('portal-photo')) {
                        displayStudentPortalView(studentData);
                    }

                } catch (error) {
                    console.error("Error al procesar la compra:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error al procesar tu compra. Intenta de nuevo.',
                        background: '#1a1a2e',
                        color: '#fff'
                    });
                }
            }
        });
        } catch (globalError) {
            console.error("Error global en buyTiendaItem:", globalError);
            Swal.fire('Error', 'Hubo un problema al inicializar la compra. Contacta al profesor.', 'error');
        }
    };

    window.placeTiendaBid = async (itemId) => {
        try {
            let targetUP = window.loggedInStudentUP || sessionStorage.getItem('aw_authenticated_up') || localStorage.getItem('userUP');
            const loggedUserUP = targetUP;
            if (window.currentTeacherData && window.currentStudentUP) {
                targetUP = window.currentStudentUP;
            }

            if (String(loggedUserUP || '').trim() !== String(targetUP || '').trim() && !window.currentTeacherData) {
                Swal.fire({
                    icon: 'error',
                    title: 'Acción no permitida',
                    text: 'Solo puedes pujar ítems para tu propia cuenta.',
                    background: '#1a1a2e',
                    color: '#fff'
                });
                return;
            }

            const items = await loadTiendaItems();
            const item = items.find(i => i.id === itemId);
            if (!item || item.type !== 'auction') {
                Swal.fire('Error', 'Ítem de subasta no encontrado.', 'error');
                return;
            }

            const now = new Date();
            if (item.expiresAt && new Date(item.expiresAt) <= now) {
                Swal.fire('Subasta finalizada', 'Esta subasta ya ha expirado.', 'warning');
                return;
            }

            const minBid = (item.currentBid || item.cost) + 1;
            const studentData = window.currentStudentData || (window.fullData && window.fullData.students ? window.fullData.students.find(s => String(s.up).trim() === String(targetUP).trim()) : null);
            if (!studentData) {
                Swal.fire('Error', 'No se encontraron tus datos de estudiante.', 'error');
                return;
            }

        const currentXP = studentData.xp || 0;

        if (currentXP < minBid) {
            Swal.fire({
                icon: 'error',
                title: 'Puntos Insuficientes',
                text: '¡Gana más XP participando en clase, aportando en los foros de Discord, respondiendo preguntas, calificando los videos de tus compañeros, completando tu perfil o ganando torneos!',
                background: '#1a1a2e',
                color: '#fff',
                confirmButtonColor: '#FFA500'
            });
            return;
        }

        Swal.fire({
            title: 'Hacer una Puja',
            html: `
                <p>Estás pujando por: <strong>${item.name}</strong></p>
                <p style="font-size:0.9rem; color:#aaa;">Puja actual: ${item.currentBid || item.cost} XP</p>
                <p style="font-size:0.9rem; color:#aaa;">Tu XP disponible: ${currentXP} XP</p>
                <label style="font-size:0.9rem; color:#ccc;">Monto a pujar (Min: ${minBid}):</label>
                <input id="bid-amount" type="number" class="swal2-input" value="${minBid}" min="${minBid}" max="${currentXP}">
            `,
            background: '#1a1a2e',
            color: '#fff',
            showCancelButton: true,
            confirmButtonText: 'Pujar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const amount = parseInt(document.getElementById('bid-amount').value);
                if (isNaN(amount) || amount < minBid) {
                    Swal.showValidationMessage(`Debes pujar al menos ${minBid} XP`);
                    return false;
                }
                if (amount > currentXP) {
                    Swal.showValidationMessage(`No tienes suficiente XP`);
                    return false;
                }
                return amount;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const bidAmount = result.value;
                const studentName = `${studentData.firstName || studentData.nombre || studentData.name || ''} ${studentData.lastName || studentData.apellido || ''}`.trim() || 'Alumno';

                Swal.fire({
                    title: 'Procesando puja...',
                    text: 'Asegurando transacción...',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                try {
                    const db = firebase.firestore();
                    const tiendaRef = db.collection('app_state').doc('tienda_items');
                    const studentRef = db.collection('students').doc(String(targetUP).trim());
                    
                    let prevBidderRef = null;
                    if (item.highestBidderUP) {
                        prevBidderRef = db.collection('students').doc(String(item.highestBidderUP).trim());
                    }

                    await db.runTransaction(async (transaction) => {
                        // 1. Reads
                        const tiendaDoc = await transaction.get(tiendaRef);
                        const stuDoc = await transaction.get(studentRef);
                        let prevStuDoc = null;
                        if (prevBidderRef) {
                            prevStuDoc = await transaction.get(prevBidderRef);
                        }

                        if (!tiendaDoc.exists || !stuDoc.exists) throw "Docs no encontrados";
                        
                        let currentItems = tiendaDoc.data().items || [];
                        const itemIndex = currentItems.findIndex(i => i.id === itemId);
                        if (itemIndex === -1) throw "Item no encontrado";
                        
                        const tItem = currentItems[itemIndex];
                        const tMinBid = (tItem.currentBid || tItem.cost) + 1;
                        if (bidAmount < tMinBid) throw `Alguien más ya pujó. Mínimo ahora es ${tMinBid} XP`;
                        
                        const stuCurrentXP = stuDoc.data().xp || 0;
                        if (stuCurrentXP < bidAmount) throw "XP insuficiente al procesar";

                        if (tItem.expiresAt && new Date(tItem.expiresAt) <= new Date()) throw "La subasta ya finalizó";

                        // 2. Writes
                        // Deduct XP from current student
                        const newStuXP = stuCurrentXP - bidAmount;
                        let stuHistory = stuDoc.data().xpHistory || [];
                        stuHistory.unshift({
                            amount: -bidAmount,
                            reason: `Puja por subasta: ${tItem.name}`,
                            date: new Date().toISOString()
                        });
                        transaction.update(studentRef, { xp: newStuXP, xpHistory: stuHistory });

                        // Refund previous bidder if exists
                        if (prevBidderRef && prevStuDoc && prevStuDoc.exists) {
                            const refundAmount = tItem.currentBid;
                            const prevXP = prevStuDoc.data().xp || 0;
                            let prevHistory = prevStuDoc.data().xpHistory || [];
                            prevHistory.unshift({
                                amount: refundAmount,
                                reason: `Reembolso por subasta superada: ${tItem.name}`,
                                date: new Date().toISOString()
                            });
                            transaction.update(prevBidderRef, { xp: prevXP + refundAmount, xpHistory: prevHistory });
                        }

                        // Update Tienda Item
                        tItem.currentBid = bidAmount;
                        tItem.highestBidderUP = targetUP;
                        tItem.highestBidderName = studentName;
                        currentItems[itemIndex] = tItem;
                        transaction.update(tiendaRef, { items: currentItems });
                    });

                    // Update local state temporarily so UI is fast
                    studentData.xp -= bidAmount;
                    
                    Swal.close();
                    window.showTiendaToast(item.name, item.image, item.icon);
                    
                    if (typeof confetti === 'function') {
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#FFA500', '#FF4500', '#9c27b0', '#ffffff']
                        });
                    }
                    
                    window.renderTiendaTab();
                    if (typeof generateRanking === 'function') generateRanking();
                    if (typeof displayStudentPortalView === 'function' && document.getElementById('portal-photo')) {
                        displayStudentPortalView(studentData);
                    }

                } catch (error) {
                    console.error("Error al procesar la puja:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo pujar',
                        text: error.toString() || 'Error de conexión',
                        background: '#1a1a2e',
                        color: '#fff'
                    });
                }
            }
        });
        } catch (globalError) {
            console.error("Error global en placeTiendaBid:", globalError);
            Swal.fire('Error', 'Hubo un problema al inicializar la puja.', 'error');
        }
    };

    // 5. Lógica del Administrador de la Tienda
    window.loadAdminTienda = async () => {
        const container = document.getElementById('admin-tienda-list');
        if (!container) return;
        
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#aaa;"><i class="fas fa-spinner fa-spin"></i> Cargando ítems...</div>';
        
        const items = await loadTiendaItems();
        
        let html = '';
        if (items.length === 0) {
            html = '<p style="color:#aaa;">No hay ítems en la tienda. Crea uno nuevo.</p>';
        } else {
            const now = new Date();
            items.forEach((item, index) => {
                let statusBadge = '';
                if (item.expiresAt) {
                    const expDate = new Date(item.expiresAt);
                    if (now > expDate) {
                        statusBadge = `<span style="background:var(--danger-color); color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem; margin-left:10px;">Expirado</span>`;
                    } else {
                        statusBadge = `<span style="background:var(--success-color); color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem; margin-left:10px;">Activo hasta ${expDate.toLocaleDateString()} ${expDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
                    }
                }

                let auctionInfo = '';
                let resolveButton = '';
                if (item.type === 'auction') {
                    auctionInfo = `<p style="margin:5px 0 0 0; font-size:0.85rem; color:#FFA500;"><i class="fas fa-gavel"></i> Puja Actual: ${item.currentBid || item.cost} XP | Ganando: ${item.highestBidderName || 'Nadie'}</p>`;
                    if (item.expiresAt && now > new Date(item.expiresAt) && item.highestBidderUP) {
                        resolveButton = `<button onclick="resolveAuction('${item.id}')" style="background:var(--success-color); color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; margin-right: 5px;"><i class="fas fa-gift"></i> Entregar</button>`;
                    }
                } else {
                    auctionInfo = `<p style="margin:5px 0 0 0; font-size:0.85rem; color:#ccc;">Costo: ${item.cost} XP | Tipo: Venta Directa</p>`;
                }

                html += `
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin:0; color:#FFA500;"><i class="${item.icon}"></i> ${item.name} ${statusBadge}</h4>
                            ${auctionInfo}
                            ${item.downloadUrl ? `<a href="${item.downloadUrl}" target="_blank" style="color:var(--accent-teal); font-size:0.8rem;">Ver Link🔗</a>` : ''}
                        </div>
                        <div style="display: flex;">
                            ${resolveButton}
                            <button onclick="editTiendaItem(${index})" style="background:var(--accent-teal); color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; margin-right: 5px;"><i class="fas fa-edit"></i></button>
                            <button onclick="deleteTiendaItem(${index})" style="background:var(--danger-color); color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });
        }
        container.innerHTML = html;
    };

    window.openCreateTiendaItemModal = () => {
        Swal.fire({
            title: 'Crear Nuevo Ítem',
            html: `
                <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">Tipo de Ítem:</label>
                <select id="tienda-type" class="swal2-select" style="width: 100%; margin: 0;">
                    <option value="direct">Venta Directa</option>
                    <option value="auction">Subasta</option>
                </select>
                <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">Nombre:</label>
                <input id="tienda-name" class="swal2-input" placeholder="Nombre (ej. Puntos Extra)" style="margin-top:0;">
                <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">Descripción:</label>
                <input id="tienda-desc" class="swal2-input" placeholder="Descripción breve" style="margin-top:0;">
                <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">Costo / Puja Inicial:</label>
                <input id="tienda-cost" type="number" class="swal2-input" placeholder="Costo" style="margin-top:0;">
                <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">URL de Imagen (.svg, .png) (Opcional):</label>
                <input id="tienda-image" class="swal2-input" placeholder="Link a la imagen" style="margin-top:0;">
                <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">URL de Descarga (Premio) (Opcional):</label>
                <input id="tienda-url" class="swal2-input" placeholder="Link al premio descargable" style="margin-top:0;">
                <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">Icono (FontAwesome):</label>
                <input id="tienda-icon" class="swal2-input" placeholder="ej. fas fa-box" value="fas fa-box" style="margin-top:0;">
                <div style="margin-top: 15px; text-align: left;">
                    <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-bottom: 3px;">Fecha límite (Subasta):</label>
                    <input id="tienda-expires" type="datetime-local" class="swal2-input" style="margin-top:0;">
                </div>
            `,
            background: '#1a1a2e',
            color: '#fff',
            confirmButtonText: 'Crear',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const type = document.getElementById('tienda-type').value;
                const cost = parseInt(document.getElementById('tienda-cost').value);
                const expiresAt = document.getElementById('tienda-expires').value || null;
                
                let itemObj = {
                    name: document.getElementById('tienda-name').value,
                    desc: document.getElementById('tienda-desc').value,
                    cost: cost,
                    image: document.getElementById('tienda-image').value || null,
                    downloadUrl: document.getElementById('tienda-url').value,
                    icon: document.getElementById('tienda-icon').value,
                    expiresAt: expiresAt,
                    type: type,
                    id: 'item_' + Date.now()
                };

                if (type === 'auction') {
                    itemObj.currentBid = cost;
                    itemObj.highestBidderUP = null;
                    itemObj.highestBidderName = null;
                }
                
                return itemObj;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const newItem = result.value;
                if (!newItem.name || isNaN(newItem.cost)) {
                    Swal.fire('Error', 'Nombre y Costo son obligatorios.', 'error');
                    return;
                }
                
                try {
                    const db = firebase.firestore();
                    const docRef = db.collection('app_state').doc('tienda_items');
                    const doc = await docRef.get();
                    let items = [];
                    if (doc.exists && doc.data().items) items = doc.data().items;
                    
                    items.push(newItem);
                    await docRef.set({ items: items });
                    
                    Swal.fire('¡Creado!', 'El ítem ha sido añadido a la tienda.', 'success');
                    loadAdminTienda();
                } catch (e) {
                    console.error(e);
                    Swal.fire('Error', 'No se pudo crear el ítem.', 'error');
                }
            }
        });
    };

    window.editTiendaItem = async (index) => {
        try {
            const db = firebase.firestore();
            const docRef = db.collection('app_state').doc('tienda_items');
            const doc = await docRef.get();
            if (!doc.exists || !doc.data().items) return;
            
            let items = doc.data().items;
            const itemToEdit = items[index];

            Swal.fire({
                title: 'Editar Ítem',
                html: `
                    <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-bottom: 3px;">Nombre:</label>
                    <input id="tienda-name" class="swal2-input" placeholder="Nombre" value="${itemToEdit.name}">
                    <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">Descripción:</label>
                    <input id="tienda-desc" class="swal2-input" placeholder="Descripción" value="${itemToEdit.desc}">
                    <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">Costo / Puja Inicial:</label>
                    <input id="tienda-cost" type="number" class="swal2-input" placeholder="Costo" value="${itemToEdit.cost}">
                    <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">URL de Imagen (.svg, .png) (Opcional):</label>
                    <input id="tienda-image" class="swal2-input" placeholder="URL Imagen" value="${itemToEdit.image || ''}">
                    <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">URL de Descarga (Opcional):</label>
                    <input id="tienda-url" class="swal2-input" placeholder="URL Descarga" value="${itemToEdit.downloadUrl || ''}">
                    <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-top: 10px; margin-bottom: 3px;">Icono (FontAwesome):</label>
                    <input id="tienda-icon" class="swal2-input" placeholder="Icono" value="${itemToEdit.icon || 'fas fa-box'}">
                    <div style="margin-top: 15px; text-align: left;">
                        <label style="font-size: 0.9rem; color: #ccc; text-align: left; display: block; margin-bottom: 3px;">Fecha límite:</label>
                        <input id="tienda-expires" type="datetime-local" class="swal2-input" value="${itemToEdit.expiresAt || ''}">
                    </div>
                `,
                background: '#1a1a2e',
                color: '#fff',
                confirmButtonText: 'Guardar Cambios',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const cost = parseInt(document.getElementById('tienda-cost').value);
                    let updatedItem = {
                        name: document.getElementById('tienda-name').value,
                        desc: document.getElementById('tienda-desc').value,
                        cost: cost,
                        image: document.getElementById('tienda-image').value || null,
                        downloadUrl: document.getElementById('tienda-url').value,
                        icon: document.getElementById('tienda-icon').value,
                        expiresAt: document.getElementById('tienda-expires').value || null,
                        type: itemToEdit.type,
                        id: itemToEdit.id
                    };
                    
                    if (itemToEdit.type === 'auction') {
                        updatedItem.currentBid = itemToEdit.currentBid;
                        updatedItem.highestBidderUP = itemToEdit.highestBidderUP;
                        updatedItem.highestBidderName = itemToEdit.highestBidderName;
                        // Si cambiaron la puja inicial y nadie ha pujado, actualizar currentBid
                        if (cost > itemToEdit.currentBid && !itemToEdit.highestBidderUP) {
                            updatedItem.currentBid = cost;
                        }
                    }
                    return updatedItem;
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const updatedItem = result.value;
                    if (!updatedItem.name || isNaN(updatedItem.cost)) {
                        Swal.fire('Error', 'Nombre y Costo son obligatorios.', 'error');
                        return;
                    }
                    
                    items[index] = updatedItem;
                    await docRef.set({ items: items });
                    
                    Swal.fire('¡Actualizado!', 'El ítem ha sido modificado.', 'success');
                    loadAdminTienda();
                }
            });
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'No se pudo editar el ítem.', 'error');
        }
    };

    window.resolveAuction = async (itemId) => {
        const items = await loadTiendaItems();
        const item = items.find(i => i.id === itemId);
        if (!item || item.type !== 'auction' || !item.highestBidderUP) return;

        Swal.fire({
            title: '¿Entregar Premio?',
            text: `¿Seguro que quieres entregar ${item.name} a ${item.highestBidderName}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, entregar',
            cancelButtonText: 'Cancelar',
            background: '#1a1a2e',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const db = firebase.firestore();
                    const tiendaRef = db.collection('app_state').doc('tienda_items');
                    const studentRef = db.collection('students').doc(String(item.highestBidderUP).trim());
                    
                    await db.runTransaction(async (transaction) => {
                        const tiendaDoc = await transaction.get(tiendaRef);
                        const stuDoc = await transaction.get(studentRef);
                        
                        if (!tiendaDoc.exists || !stuDoc.exists) throw "Docs no encontrados";
                        
                        let currentItems = tiendaDoc.data().items || [];
                        const itemIndex = currentItems.findIndex(i => i.id === itemId);
                        if (itemIndex === -1) throw "Ítem ya no existe";
                        
                        const itemToGive = currentItems[itemIndex];
                        
                        // Add to student inventory
                        let inventory = stuDoc.data().inventory || [];
                        inventory.push({
                            id: itemToGive.id,
                            name: itemToGive.name,
                            desc: itemToGive.desc,
                            icon: itemToGive.icon,
                            type: itemToGive.type,
                            downloadUrl: itemToGive.downloadUrl,
                            purchasedAt: new Date().toISOString()
                        });
                        
                        transaction.update(studentRef, { inventory: inventory });
                        
                        // Remove from tienda
                        currentItems.splice(itemIndex, 1);
                        transaction.update(tiendaRef, { items: currentItems });
                    });
                    
                    Swal.fire('¡Entregado!', 'El premio ha sido añadido al inventario del alumno.', 'success');
                    loadAdminTienda();
                } catch(e) {
                    console.error(e);
                    Swal.fire('Error', 'No se pudo entregar el premio', 'error');
                }
            }
        });
    };

    window.deleteTiendaItem = async (index) => {
        if (confirm("¿Seguro que quieres eliminar este ítem de la tienda?")) {
            try {
                const db = firebase.firestore();
                const docRef = db.collection('app_state').doc('tienda_items');
                const doc = await docRef.get();
                if (doc.exists && doc.data().items) {
                    let items = doc.data().items;
                    items.splice(index, 1);
                    await docRef.set({ items: items });
                    loadAdminTienda();
                }
            } catch (e) {
                console.error(e);
                alert("Error al eliminar.");
            }
        }
    };

    window.downloadTiendaCSV = () => {
        if (!window.fullData || !window.fullData.students) {
            Swal.fire('Error', 'Los datos de alumnos aún no están cargados.', 'error');
            return;
        }
        
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Añadir BOM para acentos en Excel
        csvContent += "Legajo (UP);Nombre;Grupo;Ítem Comprado;Fecha de Compra\r\n";

        let comprasEncontradas = false;

        window.fullData.students.forEach(student => {
            if (student.inventory && student.inventory.length > 0) {
                student.inventory.forEach(invItem => {
                    comprasEncontradas = true;
                    // Formatear fecha
                    let fecha = '';
                    if (invItem.purchasedAt) {
                        const d = new Date(invItem.purchasedAt);
                        fecha = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    }
                    
                    const up = student.up || '';
                    const nombre = (student.name || '').replace(/;/g, ',');
                    const grupo = student.group || '';
                    const itemNombre = (invItem.name || '').replace(/;/g, ',');
                    
                    csvContent += `"${up}";"${nombre}";"${grupo}";"${itemNombre}";"${fecha}"\r\n`;
                });
            }
        });

        if (!comprasEncontradas) {
            Swal.fire('Atención', 'No hay ninguna compra registrada todavía.', 'info');
            return;
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `compras_tienda_xp_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Inicializar al cargar el script
    initTiendaDB();

})();
