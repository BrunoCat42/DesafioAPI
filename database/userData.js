const RocksDB = require('rocksdb');
const path = require('path');

class Database{
    constructor(dbName){
        this.dbPath = path.join(__dirname, '../db_data', dbName)
        this.db = null
        this.open((err) =>{
            if (err){
                console.error("Erro ao abrir o banco de dados: ", err)
            }
        })
    }

    //Método para abrir o banco de dados
    open(callback) {
        this.db = new RocksDB(this.dbPath);
        this.db.open(callback)
    }

    //Método para fechar o banco de dados
    close(callback) {
        if (this.db) {
            this.db.close(callback);
        }
    }

    //Método para salvar no banco de dados
    put(key, value, callback){
        if (!this.db) {
            return callback(new Error('O banco de dados não está aberto'))
        }
        this.db.put(key,JSON.stringify(value), callback);
    }
    
    //Método para buscar no banco de dados
    get(key, callback) {
        if (!this.db) {
            return callback(new Error("O banco de dados não está aberto"));
        }
    
        this.db.get(key, (err, value) => {
            if (err) {
                if (err.message.includes("NotFound")) { // 🔹 Verifica se o erro contém "NotFound"
                    return callback(null, null); // 🔹 Retorna `null`, sem erro
                }
                console.error("Erro real ao buscar chave no banco de dados:", err); // 🔹 Log apenas para erros reais
                return callback(err); // 🔹 Passa outros erros reais
            }
    
            try {
                const parsedValue = JSON.parse(value); // 🔹 Converte para JSON antes de retornar
                callback(null, parsedValue);
            } catch (parseErr) {
                console.error("Erro ao parsear JSON do banco de dados:", parseErr);
                callback(parseErr);
            }
        });
    }
    
    
    del(key, callback) {
        if (!this.db) {
            return callback(new Error('O banco de dados não está aberto'))
        }
        this.db.del(key,callback);
    }

    //Método para ler todos os dados 
    readAllData(callback) {
        if (!this.db) {
            return callback(new Error("O banco de dados não está aberto"))
        }

        const data = [];
        const iterator = this.db.iterator({});

        const loop = () => {
            iterator.next((err,key,value) => {
                if (err) {
                    iterator.end(() =>{
                        callback(err);
                    })                
                    return;
                }

                if (!key && !value) {
                    iterator.end(()=>{
                        callback(null,data);
                    })
                    return
                }
                data.push({key: key.toString(), value: value.toString()})
                loop();
            })
        }

        loop();
    }
}

const userDB = new Database('usuarios')
const activityDB = new Database('atividades')

module.exports = {userDB, activityDB}