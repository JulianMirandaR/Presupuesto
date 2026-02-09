class Ingreso extends Dato {
    static contadorIngresos = 0;
    constructor(descripcion, valor, id) {
        super(descripcion, valor);
        this._id = id || ++Ingreso.contadorIngresos;
    }

    get id() {
        return this._id;
    }
}