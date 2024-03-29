import { ast } from "../ast/ast";
import { entorno } from "../ast/entorno";
import { tipo } from "../ast/tipo";
import { nodo3d } from "../c3d/nodo3d";
import { expresion } from "../interfaces/expresion";

export default class primitivo implements expresion {
    public primitivo: any
    public linea: number
    public columna: number
    constructor(primitivo, linea, columna) {
        this.primitivo = primitivo
        this.linea = linea
        this.columna = columna
    }
    getTipo(ent: entorno, arbol: ast) {
        let valor = this.getValor(ent, arbol)
        if (typeof valor === 'number') {
            if (valor % 1 == 0) {
                return tipo.INT
            }
            return tipo.DOUBLE
        } else if (typeof valor === 'string') {
            return tipo.STRING
        } else if (typeof valor === 'boolean') {
            return tipo.BOOL
        }
        return null
    }
    getValor(ent: entorno, arbol: ast) {
        return this.primitivo
    }
    traducir(ent: entorno[], c3d: nodo3d) {
        let t = { "id": c3d.generateTemp(), "val": this.primitivo }
        c3d.temp[t.id] = t.val
        c3d.main += `\tt${t.id} = ${t.val};\n`
        return t.id
    }
}