class Egreso extends Dato {
    static contadorEgresos = 0;
    constructor(descripcion, valor, id) {
        super(descripcion, valor);
        this._id = id || ++Egreso.contadorEgresos;
    }

    get id() {
        return this._id;
    }
}

