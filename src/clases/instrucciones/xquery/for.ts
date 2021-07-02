import { ast } from "src/clases/ast/ast";
import { entorno } from "src/clases/ast/entorno";
import primitivo from "src/clases/expresiones/primitivo";
import select from "src/clases/expresiones/select";
import { instruccion } from "src/clases/interfaces/instruccion";
import { InsertarError } from "src/reports/ReportController";
import Return from "./return";
import variable from "./variable";
import where from "./where";

export default class FOR implements instruccion{
    public id:Array<variable>;
    public idat:Array<string>;
    public condicion:any
    public at:Array<boolean>;
    public contenido:Array<any>
    public linea:Array<number>;
    public columna:Array<number>;

    constructor(id,idat,condicion,at,content,linea,columna){
        this.id = id;
        this.idat = idat;
        this.condicion = condicion;
        this.at = at;
        this.contenido = content;
        this.linea = linea;
        this.columna = columna;
    }

    ejecutar(ent: entorno, arbol: ast) {
        let result:any = ""; let entXml:any = null;
        if(Object.prototype.hasOwnProperty.call(ent.tabla,"xml")){
            entXml = ent.tabla["xml"].valor;
        }
        
        if(this.id.length === this.condicion.length){
            for(let i = 0; i < this.id.length; i++){
                result = [];
                if(Array.isArray(this.condicion[i])){
                    if(this.condicion[i][0] === ","){
                        for(let j = 1; j < this.condicion[i].length; j++){
                            result.push(this.condicion[i][j].getValor(ent,arbol));
                        }
                        this.id[i].valor = result;
                    }else if(this.condicion[i][0] === "to"){
                        if(this.condicion[i][1] instanceof primitivo && this.condicion[i][2] instanceof primitivo){
                            for(let j = Number(this.condicion[i][1].getValor(ent,arbol)); j <= Number(this.condicion[i][2].getValor(ent,arbol)); j++){
                                result.push(j);
                            }
                            this.id[i].valor = result;
                        }
                    }
                }else{
                    if(this.condicion[i] instanceof variable){
                        let entorno_temp;
                        result = new Array<Array<entorno>>()
                        for (let j = 0; j < this.condicion[i].xpath.length; j++) {
                            let slc: Array<select> = this.condicion[i].xpath[j]
                            entorno_temp = entXml
                            for (let slc_sub of slc) {
                                entorno_temp = slc_sub.getValor(entorno_temp, arbol)
                            }
                            result.push(entorno_temp)
                        }
                        this.id[i].valor = result;
                        result.push("xpath");
                    }
                }
            }
            for(let i = 0; i < this.contenido.length; i++){
                if(this.contenido[i] instanceof Return){
                    result = this.contenido[i].ejecutar(ent,arbol);
                }else if(this.contenido[i] instanceof where){
                    result = this.contenido[i].ejecutar(ent,arbol);
                }
            }
            return result;
        }else{
            InsertarError("Semantico",`Error, la cantidad de variables ${this.id.length} no es igual a la cantidad de condiciones ${this.condicion.length}`,"xquery",this.linea[this.linea.length - 1],this.columna[this.columna.length - 1]);
        }
    }
    
}