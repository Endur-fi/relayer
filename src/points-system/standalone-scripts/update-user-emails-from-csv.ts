import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { logger, standariseAddress } from '../../common/utils';
import { prisma } from '../../../prisma/client';

/**
 * Standalone script to update user emails from CSV data
 * Usage: node update-user-emails-from-csv.js <csv-file-path> [--dry-run]
 * --dry-run: Run in dry mode, no changes will be made to the database
 *
 * CSV Format: EMAIL,FIRSTNAME,EXT_ID,ADDED_TIME,MODIFIED_TIME
 * The script matches EXT_ID with user_address in the users table
 */

interface CsvRow {
  EMAIL: string;
  FIRSTNAME: string;
  EXT_ID: string;
  ADDED_TIME: string;
  MODIFIED_TIME: string;
}

async function main() {
  const args = process.argv.slice(2);
  console.log('Arguments:', args);
  const csvFilePath = args[0];
  const isDryRun = args.includes('--dry-run');

  if (!csvFilePath) {
    logger.error('❌ Please provide the CSV file path as the first argument');
    logger.info('Usage: node update-user-emails-from-csv.js <csv-file-path> [--dry-run]');
    process.exit(1);
  }

  if (!fs.existsSync(csvFilePath)) {
    logger.error(`❌ CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  try {
    logger.info('='.repeat(80));
    logger.info('UPDATE USER EMAILS FROM CSV SCRIPT');
    logger.info('='.repeat(80));
    logger.info(`📁 CSV File: ${csvFilePath}`);

    if (isDryRun) {
      logger.info('🔍 DRY RUN MODE - No changes will be made to the database');
    }

    // Read and parse CSV file
    logger.info('📖 Reading CSV file...');
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records: CsvRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    logger.info(`📊 Found ${records.length} records in CSV`);

    // Get all existing users from database
    logger.info('🔍 Fetching existing users from database...');
    const existingUsers = await prisma.users.findMany({
      select: {
        user_address: true,
        email: true,
      },
    });

    logger.info(`👥 Found ${existingUsers.length} users in database`);

    // Create a map for quick lookup
    const existingUsersMap = new Map(
      existingUsers.map((user) => [standariseAddress(user.user_address.toLowerCase()), user]),
    );

    // Process CSV records
    const updates: Array<{ user_address: string; old_email: string | null; new_email: string }> =
      [];
    const notFound: string[] = [];
    const skipped: Array<{ user_address: string; reason: string }> = [];

    for (const record of records) {
      const extId = record.EXT_ID.toLowerCase();
      const email = record.EMAIL.trim();

      // Skip invalid records
      if (!extId || !email) {
        skipped.push({
          user_address: extId || 'MISSING_EXT_ID',
          reason: 'Missing EXT_ID or EMAIL',
        });
        continue;
      }

      // Check if user exists
      const existingUser = existingUsersMap.get(standariseAddress(extId));
      if (!existingUser) {
        notFound.push(extId);
        continue;
      }

      // Skip if email is already set and matches
      if (existingUser.email === email) {
        skipped.push({
          user_address: extId,
          reason: 'Email already matches',
        });
        continue;
      }

      updates.push({
        user_address: extId,
        old_email: existingUser.email,
        new_email: email,
      });
    }

    // Display summary
    logger.info('📈 PROCESSING SUMMARY');
    logger.info('-'.repeat(50));
    logger.info(`Total CSV records: ${records.length}`);
    logger.info(`Users to update: ${updates.length}`);
    logger.info(`Users not found: ${notFound.length}`);
    logger.info(`Records skipped: ${skipped.length}`);
    logger.info('-'.repeat(50));

    if (notFound.length > 0) {
      logger.warn(`⚠️  Users not found in database (showing first 10):`);
      notFound.slice(0, 10).forEach((addr) => logger.warn(`  ${addr}`));
      if (notFound.length > 10) {
        logger.warn(`  ... and ${notFound.length - 10} more`);
      }
    }

    if (skipped.length > 0) {
      logger.info(`ℹ️  Skipped records (showing first 10):`);
      skipped.slice(0, 10).forEach((item) => logger.info(`  ${item.user_address}: ${item.reason}`));
      if (skipped.length > 10) {
        logger.info(`  ... and ${skipped.length - 10} more`);
      }
    }

    if (updates.length > 0) {
      logger.info(`📝 Email updates to be processed (showing first 10):`);
      updates.slice(0, 10).forEach((update) => {
        logger.info(`  ${update.user_address}: "${update.old_email}" -> "${update.new_email}"`);
      });
      if (updates.length > 10) {
        logger.info(`  ... and ${updates.length - 10} more`);
      }
    }

    if (updates.length === 0) {
      logger.info('✅ No updates needed. Script completed.');
      return;
    }

    if (!isDryRun) {
      logger.info('⚠️  WARNING: This will permanently modify the database!');
      logger.info('Are you sure you want to proceed? (This script will continue in 10 seconds...)');

      // Wait 10 seconds for manual intervention
      await new Promise((resolve) => setTimeout(resolve, 10000));

      logger.info('🚀 Proceeding with email updates...');

      // Perform updates in batches
      const batchSize = 100;
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        logger.info(
          `📝 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(updates.length / batchSize)} (${batch.length} records)`,
        );

        for (const update of batch) {
          try {
            await prisma.users.update({
              where: {
                user_address: update.user_address,
              },
              data: {
                email: update.new_email,
              },
            });
            successCount++;
          } catch (error) {
            logger.error(`❌ Failed to update ${update.user_address}: ${error}`);
            errorCount++;
          }
        }
      }

      logger.info('📊 UPDATE RESULTS');
      logger.info('-'.repeat(50));
      logger.info(`✅ Successfully updated: ${successCount}`);
      logger.info(`❌ Failed updates: ${errorCount}`);
      logger.info('-'.repeat(50));
    } else {
      logger.info('🔍 DRY RUN: Would update emails for the above users');
    }

    logger.info('='.repeat(80));
    logger.info('✅ Script completed successfully!');
    logger.info('='.repeat(80));
  } catch (error) {
    logger.error('❌ Script failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

process.on('SIGINT', () => {
  logger.info('\n⚠️  Script interrupted by user. Exiting...');
  prisma.$disconnect().then(() => process.exit(0));
});

process.on('SIGTERM', () => {
  logger.info('\n⚠️  Script terminated. Exiting...');
  prisma.$disconnect().then(() => process.exit(0));
});

main().catch((error) => {
  logger.error('Unhandled error:', error);
  prisma.$disconnect().then(() => process.exit(1));
});
