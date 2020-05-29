//========================
// Puerto
//========================
process.env.PORT = process.env.PORT || 3000
    //========================
    // Entorno
    //========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
    //========================
    // Base de datos
    //========================
let urlDb
let password = process.env.password || 'PMv1QrmroHDBb2yr';
if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = `mongodb+srv://cesar:${ password }@cluster0-tpv5o.mongodb.net/cafe`;
}

process.env.URLDB = urlDb;