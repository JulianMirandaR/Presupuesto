// Arrays locales (se llenarán desde Firebase)
let ingresos = [];
let egresos = [];

let cargarApp = () => {
    if (typeof db === 'undefined' || !db) {
        console.warn("Base de datos no inicializada. Verifique firebase-config.js");
        return;
    }

    // Escuchar cambios en Ingresos
    db.collection('ingresos').onSnapshot(snapshot => {
        ingresos = snapshot.docs.map(doc => {
            const data = doc.data();
            return new Ingreso(data.descripcion, data.valor, doc.id);
        });
        cargarCabecero();
        cargarIngresos();
    });

    // Escuchar cambios en Egresos
    db.collection('egresos').onSnapshot(snapshot => {
        egresos = snapshot.docs.map(doc => {
            const data = doc.data();
            return new Egreso(data.descripcion, data.valor, doc.id);
        });
        cargarCabecero();
        cargarEgresos();
    });
}

let totalIngresos = () => {
    let totalIngreso = 0;
    for (let ingreso of ingresos) {
        totalIngreso += ingreso.valor;
    }
    return totalIngreso;
}

let totalEgresos = () => {
    let totalEgreso = 0;
    for (let egreso of egresos) {
        totalEgreso += egreso.valor;
    }
    return totalEgreso;
}

let cargarCabecero = () => {
    let presupuesto = totalIngresos() - totalEgresos();
    let porcentajeEgreso = totalIngresos() > 0 ? totalEgresos() / totalIngresos() : 0;
    document.getElementById('presupuesto').innerHTML = formatoMoneda(presupuesto);
    document.getElementById('porcentaje').innerHTML = formatoPorcentaje(porcentajeEgreso);
    document.getElementById('ingresos').innerHTML = formatoMoneda(totalIngresos());
    document.getElementById('egresos').innerHTML = formatoMoneda(totalEgresos());
}

const formatoMoneda = (valor) => {
    return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARG', minimumFractionDigits: 2 });
}

const formatoPorcentaje = (valor) => {
    return valor.toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 });
}

const cargarIngresos = () => {
    let ingresosHTML = '';
    for (let ingreso of ingresos) {
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML = ingresosHTML;
}

const crearIngresoHTML = (ingreso) => {
    let ingresoHTML = `
    <div class="elemento limpiarEstilos">
    <div class="elemento_descripcion">${ingreso.descripcion}</div>
    <div class="derecha limpiarEstilos">
        <div class="elemento_valor">+ ${formatoMoneda(ingreso.valor)}</div>
        <div class="elemento_eliminar">
            <button class='elemento_eliminar--btn'>
                <ion-icon name="close-circle-outline"
                onclick="eliminarIngreso('${ingreso.id}')"></ion-icon>
            </button>
        </div>
    </div>
</div>
    `;
    return ingresoHTML;
}

const eliminarIngreso = (id) => {
    // Eliminar de Firestore (la UI se actualiza sola gracias al onSnapshot)
    db.collection('ingresos').doc(id).delete()
        .then(() => console.log("Ingreso eliminado"))
        .catch(error => console.error("Error eliminando ingreso: ", error));
}

const cargarEgresos = () => {
    let egresosHTML = '';
    for (let egreso of egresos) {
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML = egresosHTML;
}

const crearEgresoHTML = (egreso) => {
    let egresoHTML = `
    <div class="elemento limpiarEstilos">
    <div class="elemento_descripcion">${egreso.descripcion}</div>
    <div class="derecha limpiarEstilos">
        <div class="elemento_valor">- ${formatoMoneda(egreso.valor)}</div>
        <div class="elemento_porcentaje">${formatoPorcentaje(totalEgresos() > 0 ? egreso.valor / totalEgresos() : 0)}</div>
        <div class="elemento_eliminar">
            <button class='elemento_eliminar--btn'>
                <ion-icon name="close-circle-outline"
                onclick="eliminarEgreso('${egreso.id}')"></ion-icon>
            </button>
        </div>
    </div>
</div>
    `;
    return egresoHTML;
}

const eliminarEgreso = (id) => {
    // Eliminar de Firestore
    db.collection('egresos').doc(id).delete()
        .then(() => console.log("Egreso eliminado"))
        .catch(error => console.error("Error eliminando egreso: ", error));
}

let agregarDato = () => {
    let forma = document.forms['forma'];
    let tipo = forma['tipo'];
    let descripcion = forma['descripcion'];
    let valor = forma['valor'];
    if (descripcion.value !== '' && valor.value !== '') {
        const nuevoDato = {
            descripcion: descripcion.value,
            valor: +valor.value
        };

        if (tipo.value === 'ingreso') {
            db.collection('ingresos').add(nuevoDato)
                .then(() => {
                    console.log("Ingreso agregado");
                    forma.reset();
                })
                .catch(error => console.error("Error al agregar ingreso: ", error));
        }
        else if (tipo.value === 'egreso') {
            db.collection('egresos').add(nuevoDato)
                .then(() => {
                    console.log("Egreso agregado");
                    forma.reset();
                })
                .catch(error => console.error("Error al agregar egreso: ", error));
        }
    }
}
