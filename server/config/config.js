        //========================
        // Puerto
        //========================
        process.env.PORT = process.env.PORT || 3000;
        //========================
        // Entorno
        //========================
        process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
        //========================
        // Base de datos
        //========================
        let urlDb;

        if (process.env.NODE_ENV === 'dev') {
            urlDb = 'mongodb://localhost:27017/cafe';
        } else {
            urlDb = process.env.MONGO_URI;
        }
        process.env.URLDB = urlDb;
        //========================
        // Expiracion token
        //========================
        // 60 segundos
        // 60 minutos
        // 24 horas
        // 30 dias
        process.env.CADUCIDAD_TOKEN = '48h';
        //========================
        // SEED de autenticación
        //========================
        process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
        //========================
        // Google Client ID
        //========================
        process.env.CLIENT_ID = process.env.CLIENT_ID || '550724046532-5vnpfsgpkpbllee9gi01486raeh2r2kd.apps.googleusercontent.com';