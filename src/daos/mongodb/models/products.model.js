import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
	title: { 
        type : String, 
        required : [true, "El nombre es obligatorio"]
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio"],
        min: [0, "El stock debe ser mayor o igual a 0"]
    },
    description : {
        type : String,
    },
    status:{
        type: Boolean,
        required: [true,"El estado es obligatorio"]
    },
    availability:{
        type: Boolean,
        default: false
    },
    category:{
        type: String,
        required: [true, "La categoria es obligatoria"]
    },
    price:{
        type: Number,
        required: [true, "El precio es obligatorio"]
    },
    code:{ 
        type: Number,
        required: [true, "El codigo es obligatorio"],
        unique: true,
    },
},{
    timestamps : true,
    versionKey : false,
});

//Actualiza el availability en base al stock
productSchema.pre('save', function(next) {

    //si el stock es mayor que cero pasa a ser true y si es 0 se queda en false
    this.availability = this.stock > 0;
    next(); 
});

productSchema.plugin(paginate);


const ProductModel = model("products" , productSchema);

export default ProductModel;