const express = require("express")
const cors = require("cors");
const cassandra = require('cassandra-driver'); 
client = new cassandra.Client({
    contactPoints: ["cass1"],
    localDataCenter: "datacenter1",
    credentials: { username: "cassandra", password: "pass123" },
});

const port = 3000

const app = express()

app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.send("Ir a https://github.com/Benja-Suprinha/Tarea3 para mas informacion.")
});

app.get('/recetas',async(req,res) => {
    const data = await client.execute("SELECT * FROM ks2.recetas;");
    res.send(data)
});

app.get('/pacientes',async(req,res) => {
    const data = await client.execute("SELECT * FROM ks1.paciente;");
    res.send(data)
});

app.post("/create", async(req,res) =>{
    console.log(req.body);
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const rut = req.body.rut;
    const mail = req.body.mail;
    const fe_nac = req.body.fecha_nacimiento;
    const coment = req.body.comentario;
    const farm = req.body.farmacos;
    const doc = req.body.doctor;

    const isCreated = await client.execute(`SELECT id FROM ks1.paciente WHERE rut = '${rut}' ALLOW FILTERING; `);

    if(isCreated.rowLength == 0){ //se verifica si el paciente ya esta creado
        const idMaxPas = await client.execute(`SELECT MAX(id) AS max_id FROM ks1.paciente;`);
        const newIdMaxPas = idMaxPas.rows[0].max_id + 1;
        await client.execute(`INSERT INTO ks1.paciente(id,nombre, apellido, rut, email, fecha_nacimiento) VALUES (${newIdMaxPas},'${nombre}','${apellido}','${rut}','${mail}','${fe_nac}');`);
        // se creo el paciente
        const idMaxRec = await client.execute(`SELECT MAX(id) AS max_id FROM ks2.recetas;`);
        const newIdMaxRec = idMaxRec.rows[0].max_id + 1;
        await client.execute(`INSERT INTO ks2.recetas(id, id_paciente, comentario, farmacos, doctor) VALUES (${newIdMaxRec}, ${newIdMaxPas}, '${coment}','${farm}','${doc}');`);
        // se creo la receta
        res.send(`paciente ${rut} y su receta creados correctamente`)
    } else{ // si el paciente exite se crea solo la receta
        const idMaxPas = await client.execute(`SELECT MAX(id) AS max_id FROM ks1.paciente;`);
        const newIdMaxPas = idMaxPas.rows[0].max_id + 1;
        const idMaxRec = await client.execute(`SELECT MAX(id) AS max_id FROM ks2.recetas;`);
        const newIdMaxRec = idMaxRec.rows[0].max_id + 1;
        await client.execute(`INSERT INTO ks2.recetas(id, id_paciente, comentario, farmacos, doctor) VALUES (${newIdMaxRec}, ${newIdMaxPas}, '${coment}','${farm}','${doc}');`);
        // se creo la receta
        res.send(`paciente ${rut}: se creo su receta correctamente`)
    }
});

app.post("/edit", async(req,res) => {
    const id = req.body.id;
    const coment = req.body.comentario;
    const farm = req.body.farmacos;
    const doc = req.body.doctor;

    const isCreated = await client.execute(`SELECT id FROM ks2.recetas WHERE id = ${id};`);
    if(isCreated.rowLength == 0){ //entonces no existe la receta
        res.send("La receta a editar no existe, porfavor revisar los datos entregados");
    }else{ //si existe se edita
        await client.execute(`UPDATE ks2.recetas SET comentario = '${coment}', farmacos = '${farm}', doctor = '${doc}' WHERE id = ${id}`)
        res.send("Receta editada con exito")
    }
});

app.post("/delete", async(req,res) =>{
    const id = req.body.id;

    const isCreated = await client.execute(`SELECT id FROM ks2.recetas WHERE id= ${id};`);
    if(isCreated.rowLength == 0){ //entonces no existe la receta
        res.send("La receta a eliminar no existe, porfavor revisar los datos entregados");
    } else{ //si existe se elimina
        await client.execute(`DELETE FROM ks2.recetas WHERE id = ${id}`);
        res.send("Receta borrada con exito")
    }
})

app.listen(port, async() => {
    console.log(`Example app listening at http://localhost:${port}`);
});