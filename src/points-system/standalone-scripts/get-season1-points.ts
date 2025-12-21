import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

async function getSeason1Points() {
  const uniqueTimestamps = await prisma.user_balances.findMany({
    distinct: ["timestamp"],
    where: {
    },
  });

  console.log(`Found ${uniqueTimestamps.length} unique timestamps`);

  // consolite date to one per day
  const _uniqueDates = uniqueTimestamps.map(timestamp => new Date(timestamp.timestamp * 1000).toISOString().split("T")[0]);
  const uniqueDatesSet = [...new Set(_uniqueDates)];
  console.log(`Found ${uniqueDatesSet.length} unique dates`);

  const directory = path.join(__dirname, "..", "..", "..", "season1-points");
  console.log(`Directory: ${directory}`);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // get already existing files
  const existingFiles = fs.readdirSync(directory);
  const existingDates = existingFiles.map(file => file.split(".")[0]);
  console.log(`Found ${existingDates.length} existing dates`);
  const datesToQuery = uniqueDatesSet.filter(_date => !existingDates.includes(_date));
  console.log(`Querying ${datesToQuery.length} dates`);

  // query points for each block number
  let count = 0;
  for (const date of datesToQuery) {
    console.log(`Querying points for date: ${date}, ${count + 1}/${datesToQuery.length}`);
    const _points = await prisma.user_balances.findMany({
      where: {
        timestamp: {
          gte: new Date(date).getTime() / 1000,
          lt: new Date(date).getTime() / 1000 + 86400,
        },
      },
    });

    const nonZeroPoints = _points.filter(point => Number(point.total_amount) > 0);
    console.log(`Found ${nonZeroPoints.length} non-zero points, all records: ${_points.length}`);

    const uniqueUsers = [...new Set(nonZeroPoints.map(point => point.user_address))];
    console.log(`Found ${uniqueUsers.length} unique users`);
    if (uniqueUsers.length != nonZeroPoints.length) {
      console.error(`Mismatch between unique users and points for date: ${date}, uniqueUsers: ${uniqueUsers.length}, pointsRecords: ${nonZeroPoints.length}`);
      // log sample users and timestamps (upto 5)
      let logCount = 0;
      for (const user of uniqueUsers) {
        const userPoints = nonZeroPoints.filter(point => point.user_address === user);
        if (userPoints.length > 1) {
          console.log(`User: ${user}, Points: ${userPoints.length}, Timestamps: ${userPoints.map(point => point.timestamp).join(", ")}`);
          logCount++;
        }
        if (logCount >= 5) {
          break;
        }
      }
      throw new Error(`Mismatch between unique users and points for date: ${date}`);
    }

    // save to json file
    fs.writeFileSync(path.join(directory, `${date}.json`), JSON.stringify(nonZeroPoints, null, 2));
    count++;
  }

  console.log(`Points queried for ${datesToQuery.length} dates saved to files`);
}

if (require.main === module) {
  getSeason1Points();
}