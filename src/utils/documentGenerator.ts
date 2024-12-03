import { Document, Paragraph, Packer, AlignmentType, HeadingLevel } from 'docx';

interface DocumentData {
  type: string;
  subType: string;
  patientName: string;
  date: string;
  doctorName: string;
}

const generateHeader = () => {
  return {
    children: [
      new Paragraph({
        text: "Dr. Martin",
        alignment: AlignmentType.RIGHT,
      }),
      new Paragraph({
        text: "Psychiatre",
        alignment: AlignmentType.RIGHT,
      }),
      new Paragraph({
        text: "1 rue de la Paix",
        alignment: AlignmentType.RIGHT,
      }),
      new Paragraph({
        text: "75001 Paris",
        alignment: AlignmentType.RIGHT,
      }),
      new Paragraph({
        text: `Paris, le ${new Date().toLocaleDateString('fr-FR')}`,
        alignment: AlignmentType.RIGHT,
        spacing: { after: 400 },
      }),
    ],
  };
};

const generateCertificate = async (data: DocumentData) => {
  const doc = new Document({
    sections: [
      generateHeader(),
      {
        children: [
          new Paragraph({
            text: "CERTIFICAT MÉDICAL",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: `Je soussigné, Dr. Martin, certifie avoir examiné ${data.patientName} ce jour.`,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Certificat établi à la demande de l'intéressé(e) et remis en main propre pour faire valoir ce que de droit.",
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Dr. Martin",
            alignment: AlignmentType.RIGHT,
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};

const generatePrescription = async (data: DocumentData) => {
  const doc = new Document({
    sections: [
      generateHeader(),
      {
        children: [
          new Paragraph({
            text: "ORDONNANCE",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: `Patient: ${data.patientName}`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Prescription:",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Dr. Martin",
            alignment: AlignmentType.RIGHT,
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};

const generateTest = async (data: DocumentData) => {
  const doc = new Document({
    sections: [
      generateHeader(),
      {
        children: [
          new Paragraph({
            text: "TEST PSYCHOLOGIQUE",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: `Patient: ${data.patientName}`,
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};

export const generateDocument = async (data: DocumentData) => {
  let blob;

  switch (data.type) {
    case 'certificat':
      blob = await generateCertificate(data);
      break;
    case 'ordonnance':
      blob = await generatePrescription(data);
      break;
    case 'test':
      blob = await generateTest(data);
      break;
    default:
      throw new Error('Type de document non supporté');
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.type}_${data.subType}_${data.patientName.replace(' ', '_')}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};