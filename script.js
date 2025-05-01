const cuentasMayor = {};
const cuentasBalanza = {};

function agregarDiario() {
    const fecha = document.getElementById('fecha').value;
    const cuentaDebe = document.getElementById('cuentaDebe').value;
    const montoDebe = parseFloat(document.getElementById('montoDebe').value);
    const cuentaHaber = document.getElementById('cuentaHaber').value;
    const montoHaber = parseFloat(document.getElementById('montoHaber').value);

    // Agregar a tabla del diario
    const tabla = document.getElementById('tabla-diario').getElementsByTagName('tbody')[0];
    const fila = tabla.insertRow();
    fila.innerHTML = `<td>${fecha}</td><td>${cuentaDebe}</td><td>$${montoDebe}</td><td>${cuentaHaber}</td><td>$${montoHaber}</td>`;

    // Actualizar Libro Mayor
    actualizarMayor(fecha, cuentaDebe, montoDebe, 'Debe');
    actualizarMayor(fecha, cuentaHaber, montoHaber, 'Haber');

    // Actualizar Balanza
    actualizarBalanza(cuentaDebe, montoDebe, 0);
    actualizarBalanza(cuentaHaber, 0, montoHaber);
}

function actualizarMayor(fecha, cuenta, monto, tipo) {
    if (!cuentasMayor[cuenta]) cuentasMayor[cuenta] = [];

    const saldoAnterior = cuentasMayor[cuenta].length > 0 ? cuentasMayor[cuenta].at(-1).saldo : 0;
    const nuevoSaldo = tipo === 'Debe' ? saldoAnterior + monto : saldoAnterior - monto;

    cuentasMayor[cuenta].push({
        fecha,
        debe: tipo === 'Debe' ? monto : 0,
        haber: tipo === 'Haber' ? monto : 0,
        saldo: nuevoSaldo
    });

    renderizarMayor();
}

function renderizarMayor() {
    const seccion = document.getElementById('mayor');
    seccion.innerHTML = '<h2>Libro Mayor</h2>';

    Object.entries(cuentasMayor).forEach(([cuenta, movimientos]) => {
        const html = `
      <p><strong>Cuenta: ${cuenta}</strong></p>
      <table>
        <thead>
          <tr><th>Fecha</th><th>Debe</th><th>Haber</th><th>Saldo</th></tr>
        </thead>
        <tbody>
          ${movimientos.map(m =>
            `<tr><td>${m.fecha}</td><td>$${m.debe}</td><td>$${m.haber}</td><td>$${m.saldo}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
        seccion.innerHTML += html;
    });
}

function actualizarBalanza(cuenta, debe, haber) {
    if (!cuentasBalanza[cuenta]) cuentasBalanza[cuenta] = { debe: 0, haber: 0 };

    cuentasBalanza[cuenta].debe += debe;
    cuentasBalanza[cuenta].haber += haber;

    renderizarBalanza();
}

function renderizarBalanza() {
    const seccion = document.getElementById('balanza');
    seccion.innerHTML = `
    <h2>Balanza de Comprobación</h2>
    <table>
      <thead>
        <tr><th>Cuenta</th><th>Debe</th><th>Haber</th></tr>
      </thead>
      <tbody>
        ${Object.entries(cuentasBalanza).map(([cuenta, montos]) =>
        `<tr><td>${cuenta}</td><td>$${montos.debe}</td><td>$${montos.haber}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}

// ----- Arqueo de Caja -----
function calcularDenominaciones() {
    // Denominaciones y sus ids en el HTML
    const denominaciones = [
        { value: 1000, id: "bill1000", subId: "sub1000" },
        { value: 500, id: "bill500", subId: "sub500" },
        { value: 200, id: "bill200", subId: "sub200" },
        { value: 100, id: "bill100", subId: "sub100" },
        { value: 50, id: "coin50", subId: "sub50" },
        { value: 20, id: "coin20", subId: "sub20" },
        { value: 10, id: "coin10", subId: "sub10" },
        { value: 5, id: "coin5", subId: "sub5" }
    ];

    let total = 0;

    denominaciones.forEach(({ value, id, subId }) => {
        // Leer cantidad ingresada (0 si está vacío)
        const qty = parseInt(document.getElementById(id).value) || 0;
        const subtotal = qty * value;
        // Actualizar subtotal en la tabla
        document.getElementById(subId).textContent = subtotal;
        // Acumular al total
        total += subtotal;
    });

    // Mostrar el total final
    document.getElementById("totalCaja").textContent = total;
}

// ----- Estado de Resultados -----
function calcularEstado() {
    // Leer valores (0 si está vacío)
    const ventas = parseFloat(document.getElementById("ventas").value) || 0;
    const devoluciones = parseFloat(document.getElementById("devoluciones").value) || 0;
    const compras = parseFloat(document.getElementById("compras").value) || 0;
    const invInicial = parseFloat(document.getElementById("invInicial").value) || 0;
    const invFinal = parseFloat(document.getElementById("invFinal").value) || 0;
    const gastosVenta = parseFloat(document.getElementById("gastosVenta").value) || 0;
    const gastosAdm = parseFloat(document.getElementById("gastosAdmin").value) || 0;
    const otrosIngresos = parseFloat(document.getElementById("otrosIngresos").value) || 0;

    // Cálculos intermedios
    const ventasNetas = ventas - devoluciones;
    const costoVentas = invInicial + compras - invFinal;
    const utilidadBruta = ventasNetas - costoVentas;
    const gastosOp = gastosVenta + gastosAdm;
    const utilidadOp = utilidadBruta - gastosOp;
    const antesImpuestos = utilidadOp + otrosIngresos;
    const isr = antesImpuestos * 0.30;
    const utilidadNeta = antesImpuestos - isr;

    // Mostrar resultados
    document.getElementById("resVentas").textContent = ventasNetas;
    document.getElementById("resCosto").textContent = costoVentas;
    document.getElementById("resBruta").textContent = utilidadBruta;
    document.getElementById("resGastosOp").textContent = gastosOp;
    document.getElementById("resOp").textContent = utilidadOp;
    document.getElementById("resOtros").textContent = otrosIngresos;
    document.getElementById("resAntesImp").textContent = antesImpuestos;
    document.getElementById("resISR").textContent = isr.toFixed(2);
    document.getElementById("resNeta").textContent = utilidadNeta.toFixed(2);
}

