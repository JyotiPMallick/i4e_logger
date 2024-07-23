import cluster from "cluster";
import os from "os";
import express from "express";
import router from "./routes/writeLog.js";

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);
  
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker process ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
      const app = express();
      
      app.use(express.json());
      
      const writeLogController = router
      
      app.use("/api/v1/", writeLogController)
      
      const server = app.listen(3000, () => console.log("server running on port 3000"));
  }

  // Why to use master cluster refer below link for refrence 

  //https://medium.com/@mjdrehman/implementing-node-js-cluster-for-improved-performance-f800146e58e1
