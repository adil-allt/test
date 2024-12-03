import { PrismaClient } from '@prisma/client';
import { createCipheriv, randomBytes } from 'crypto';
import { writeFile } from 'fs/promises';
import { format } from 'date-fns';
import dotenv from 'dotenv';
import cron from 'node-cron';
import winston from 'winston';

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/backup-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/backup.log' })
  ]
});

const prisma = new PrismaClient();

// Fonction pour chiffrer les données
function encryptData(data, encryptionKey) {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag: authTag.toString('hex')
  };
}

async function createBackup() {
  try {
    // Récupération des données
    const [patients, consultations, documents, paiements] = await Promise.all([
      prisma.patient.findMany({
        include: {
          antecedents: true,
          consultations: true,
          documents: true
        }
      }),
      prisma.consultation.findMany({
        include: {
          paiement: true
        }
      }),
      prisma.document.findMany(),
      prisma.paiement.findMany()
    ]);

    // Préparation des données pour la sauvegarde
    const backupData = {
      timestamp: new Date().toISOString(),
      data: {
        patients,
        consultations,
        documents,
        paiements
      }
    };

    // Chiffrement des données
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const encryptedBackup = encryptData(backupData, encryptionKey);

    // Création du nom de fichier avec la date
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const filename = `backup/backup-${dateStr}.enc`;

    // Sauvegarde du fichier chiffré
    await writeFile(filename, JSON.stringify(encryptedBackup));

    logger.info(`Backup created successfully: ${filename}`);
  } catch (error) {
    logger.error('Backup failed:', error);
    throw error;
  }
}

// Planification des sauvegardes quotidiennes à 23h00
cron.schedule('0 23 * * *', async () => {
  try {
    await createBackup();
  } catch (error) {
    logger.error('Scheduled backup failed:', error);
  }
});

// Export pour utilisation manuelle
export { createBackup };