const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3100;

// Function to execute grpcurl command and get the status
function getGrpcStatus(grpcPort) {
  return new Promise((resolve, reject) => {
    const grpcurl = spawn("grpcurl", [
      "-plaintext",
      `0.0.0.0:${grpcPort}`,
      "apibara.sink.v1.Status.GetStatus",
    ]);

    let output = "";

    // Capture stdout data
    grpcurl.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Capture stderr data
    grpcurl.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    // Handle the process exit
    grpcurl.on("close", (code) => {
      if (code === 0) {
        try {
          const parsedOutput = JSON.parse(output); // Parse the output as JSON
          resolve(parsedOutput);
        } catch (error) {
          reject(new Error("Failed to parse grpcurl response"));
        }
      } else {
        reject(new Error(`grpcurl process exited with code ${code}`));
      }
    });
  });
}

function logFileContents(filePath) {
  const absolutePath = path.resolve(filePath);

  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      return;
    }

    const lines = data.split("\n"); // Split file contents into lines
    const last20Lines = lines.slice(-20); // Get the last 20 lines
    console.log(last20Lines.join("\n")); // Join them back into a string and log
  });
}

app.get('/status/relayer', async (req, res) => {
  const resp = await fetch('http://localhost:3000/');
  const resp2 = await resp.text();
  if (resp2.includes('Operational'))
    return res.status(200).json({ message: "Relayer is active" });

  return res.status(500).json({ message: "Relayer is not running" });
})

// Express GET endpoint `/status`
app.get("/status", async (req, res) => {
  const grpcPort = req.query.port;

  if (!grpcPort) {
    return res.status(400).json({ error: "port parameter is required" });
  }

  try {
    logFileContents("/var/log/supervisor/withdraw_queue.log");
    logFileContents("/var/log/supervisor/withdraw_queue_err.log");
    console.log("=====================");
    // logFileContents('/var/log/supervisor/dep-withdraw.log');
    // logFileContents('/var/log/supervisor/dep-withdraw_err.log');

    // Call the getGrpcStatus function with the provided port
    const status = await getGrpcStatus(grpcPort);
    console.log(`status: ${grpcPort}`, status);
    // Extract currentBlock and headBlock from the response
    const currentBlock = parseInt(status.currentBlock, 10);
    const headBlock = parseInt(status.headBlock, 10);

    // Check if the difference between currentBlock and headBlock is more than 10
    const isActive = Math.abs(headBlock - currentBlock) <= 10;
    const statusCode = isActive ? 200 : 500;

    // Return the status and block information
    return res.status(statusCode).json({
      isActive,
      currentBlock,
      headBlock,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.get(`/status/server`, async (req, res) => {
  return res.status(200).json({ message: "Server is running" });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
