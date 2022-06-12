const express = require("express")
const cassandra = require('cassandra-driver'); 
client = new cassandra.Client({
    contactPoints: ["cassandra-node1"],
    localDataCenter: "datacenter1",
    credentials: { username: "cassandra", password: "pass123" },
});

const port = 3000

const app = express()
app.get('/',(req,res) => {
    res.send("hola mundo")
})

app.get('/recetas',async(req,res) => {
    const query = "SELECT * FROM ks2.recetas;";
    const data = await client.execute(query);
    res.send(data)
})



app.listen(port, async() => {
    console.log(`Example app listening at http://localhost:${port}`);
});