import fs from "fs";

export const writingLogs = async(req,res) => {
    try{
        const obj = {...req.body};
        const dataToAppend = JSON.stringify(obj) + "\n";
        fs.appendFile("./logFile/dummyLog.txt", dataToAppend, (err) => {
            if(err) throw err;
            return;
        })
        return res.status(200).json({
            message: "Logs has been written"
        })
    }
    catch(err)
    {
        return res.status(400).json({
            message: "Something went wrong"
        })
    }
}