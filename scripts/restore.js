import { PrismaClient } from '@prisma/client';
import { createDecipheriv } from 'crypto';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/restore-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/restore.log' })
  ]
});

const prisma = new PrismaClient();

// Fonction pour déchiffrer les données
function decryptData(encryptedData, encryptionKey) {
  const decipher = createDecipheriv(
    'aes-256-gcm',
    Buffer.from(encryptionKey, 'hex'),
    Buffer.from(encryptedData.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

  let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

async function restoreBackup(backupPath) {
  try {
    // Lecture du fichier de sauvegarde
    const encryptedBackup = JSON.parse(await readFile(backupPath, 'utf8'));
    
    // Déchiffrement des données
    const decryptedData = decryptData(encryptedBackup, process.env.ENCRYPTION_KEY);
    const { patients, consultations, documents, paiements } = decryptedData.data;

    // Restauration des données dans la base de données
    await prisma.$transaction(async (prisma) => {
      // Suppression des données existantes
      await prisma.paiement.deleteMany();
      await prisma.document.deleteMany();
      await prisma.consultation.deleteMany();
      await prisma.antecedent.deleteMany();
      await prisma.patient.deleteMany();

      // Restauration des patients et leurs relations
      for (const patient of patients) {
        const { antecedents, consultations, documents, ...patientData } = patient;
        await prisma.patient.create({
          data: {
            ...patientData,
            antecedents: {
              create: antecedents
            }
          }
        });
      }

      // Restauration des consultations
      for (const consultation of consultations) {
        const { paiement, ...consultationData } = consultation;
        await prisma.consultation.create({
          data: {
            ...consultationData,
            paiement: paiement ? {
              create: paiement
            } : undefined
          }
        });
      }

      // Restauration des documents
      await prisma.document.createMany({
        data: documents
      });
    });

    logger.info(`Backup restored successfully from: ${backupPath}`);
  } catch (error) {
    logger.error('Restore failed:', error);
    throw error;
  }
}

// Export pour utilisation manuelle
export { restoreBackup };