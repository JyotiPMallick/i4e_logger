import express from "express";
import fs from "fs";

const app = express();

app.use(express.json());

app.post("/writeLog", (req,res) => {
    try{
        const obj = {...req.body};
        const dataToAppend = JSON.stringify(obj) + "\n";
        fs.appendFile("dummyLog.txt", dataToAppend, (err) => {
            if(err) throw err;
            console.log("data appended", obj);
            return;
        })
        return res.status(200).json({
            message: "Logs has been written"
        })
    }
    catch(err)
    {
        return res.status(400).json({
            message: "api failed"
        })
    }
})

app.listen(3000, () => console.log("server running on port 3000"));