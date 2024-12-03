import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';

const generateHeader = (doctorName: string = "Dr. Martin", speciality: string = "Psychiatre") => ({
  children: [
    new Paragraph({
      text: doctorName,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.RIGHT,
    }),
    new Paragraph({
      text: speciality,
      alignment: AlignmentType.RIGHT,
    }),
    new Paragraph({
      text: "1 rue de la Paix, 75001 Paris",
      alignment: AlignmentType.RIGHT,
    }),
    new Paragraph({
      text: `Paris, le ${new Date().toLocaleDateString('fr-FR')}`,
      alignment: AlignmentType.RIGHT,
      spacing: { after: 400 },
    }),
  ],
});

export const templates = {
  certificats: [
    {
      id: 'cert_conduite',
      name: 'Certificat d\'Aptitude Psychologique pour la Conduite',
      category: 'Aptitude',
      content: () => new Document({
        sections: [{
          properties: {},
          children: [
            ...generateHeader().children,
            new Paragraph({
              text: "CERTIFICAT D'APTITUDE PSYCHOLOGIQUE POUR LA CONDUITE",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "Je soussigné, Dr. Martin, Psychiatre, certifie avoir examiné ce jour:",
            }),
            new Paragraph({
              text: "M./Mme ______________________",
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              text: "Et n'avoir constaté aucune contre-indication d'ordre psychiatrique à la conduite de véhicules.",
              spacing: { before: 200, after: 400 },
            }),
          ],
        }],
      }),
    },
    {
      id: 'cert_fin_traitement',
      name: 'Certificat de Fin de Traitement en Addictologie',
      category: 'Addictologie',
      content: () => new Document({
        sections: [{
          properties: {},
          children: [
            ...generateHeader().children,
            new Paragraph({
              text: "CERTIFICAT DE FIN DE TRAITEMENT EN ADDICTOLOGIE",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "Je soussigné, Dr. Martin, Psychiatre, certifie que:",
            }),
            new Paragraph({
              text: "M./Mme ______________________",
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              text: "A suivi avec succès un programme de traitement en addictologie du ____________ au ____________",
              spacing: { before: 200, after: 200 },
            }),
          ],
        }],
      }),
    },
    {
      id: 'cert_aptitude_travail',
      name: 'Certificat d\'Aptitude au Travail après Suivi Thérapeutique',
      category: 'Travail',
      content: () => new Document({
        sections: [{
          properties: {},
          children: [
            ...generateHeader().children,
            new Paragraph({
              text: "CERTIFICAT D'APTITUDE AU TRAVAIL",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            // ... Contenu spécifique du certificat
          ],
        }],
      }),
    },
    {
      id: 'cert_suivi_psy',
      name: 'Certificat de Suivi Psychologique',
      category: 'Suivi',
      content: () => new Document({
        sections: [{
          properties: {},
          children: [
            ...generateHeader().children,
            new Paragraph({
              text: "CERTIFICAT DE SUIVI PSYCHOLOGIQUE",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            // ... Contenu spécifique du certificat
          ],
        }],
      }),
    },
    // ... Ajout des autres certificats
    {
      id: 'cert_incapacite',
      name: 'Certificat d\'Incapacité Temporaire de Travail pour Traitement en Santé Mentale',
      category: 'Travail',
      content: () => new Document({
        sections: [{
          properties: {},
          children: [
            ...generateHeader().children,
            new Paragraph({
              text: "CERTIFICAT D'INCAPACITÉ TEMPORAIRE DE TRAVAIL",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            // ... Contenu spécifique du certificat
          ],
        }],
      }),
    },
    // ... Ajout des autres certificats selon la liste fournie
  ],
  tests: [
    {
      id: 'test_mmse',
      name: 'Mini Mental State Examination (MMSE)',
      category: 'Évaluation cognitive',
      content: () => new Document({
        sections: [{
          properties: {},
          children: [
            ...generateHeader().children,
            new Paragraph({
              text: "MINI MENTAL STATE EXAMINATION (MMSE)",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "Patient(e): ______________________",
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              text: "Date: ______________________",
              spacing: { before: 200, after: 400 },
            }),
            ...[
              "1. Orientation temporelle __ /5",
              "2. Orientation spatiale __ /5",
              "3. Apprentissage __ /3",
              "4. Attention et calcul __ /5",
              "5. Rappel __ /3",
              "6. Langage __ /8",
              "7. Praxies constructives __ /1",
            ].map(item => new Paragraph({
              text: item,
              spacing: { before: 200 },
            })),
          ],
        }],
      }),
    },
    {
      id: 'test_beck',
      name: 'Inventaire de Dépression de Beck (BDI)',
      category: 'Évaluation psychologique',
      content: () => new Document({
        sections: [{
          properties: {},
          children: [
            ...generateHeader().children,
            new Paragraph({
              text: "INVENTAIRE DE DÉPRESSION DE BECK (BDI)",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "Patient(e): ______________________",
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              text: "Date: ______________________",
              spacing: { before: 200, after: 400 },
            }),
          ],
        }],
      }),
    },
    {
      id: 'test_hamilton',
      name: 'Échelle d\'Anxiété de Hamilton (HAMA)',
      category: 'Évaluation psychologique',
      content: () => new Document({
        sections: [{
          properties: {},
          children: [
            ...generateHeader().children,
            new Paragraph({
              text: "ÉCHELLE D'ANXIÉTÉ DE HAMILTON (HAMA)",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            // ... Contenu spécifique du test
          ],
        }],
      }),
    },
    // ... Ajout des autres tests selon la liste fournie
  ],
  autre: [
    {
      id: 'autre_prescription',
      name: 'Prescription médicale',
      category: 'Prescription',
      content: () => new Document({
        sections: [{
          properties: {},
          children: [
            ...generateHeader().children,
            new Paragraph({
              text: "PRESCRIPTION MÉDICALE",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "M./Mme ______________________",
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "• ", bold: true }),
                new TextRun("Médicament: ________________"),
              ],
              spacing: { before: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "• ", bold: true }),
                new TextRun("Posologie: ________________"),
              ],
              spacing: { before: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "• ", bold: true }),
                new TextRun("Durée du traitement: ________________"),
              ],
              spacing: { before: 100, after: 400 },
            }),
          ],
        }],
      }),
    },
  ],
};

export const generateDocument = async (templateId: string, type: 'certificats' | 'tests' | 'autre') => {
  const template = templates[type].find(t => t.id === templateId);
  if (!template) throw new Error('Template not found');

  const doc = template.content();
  const blob = await Packer.toBlob(doc);
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${template.name}.docx`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};