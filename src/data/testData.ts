import { format, addDays, subDays, addHours, setHours, setMinutes } from 'date-fns';

// Patients de test
export const testPatients = [
  {
    id: '1',
    numeroPatient: 'P001',
    nom: 'Durant',
    prenom: 'Marie',
    telephone: '0612345678',
    email: 'marie.durant@email.com',
    ville: 'Marrakech',
    secteur: 'Guéliz',
    cin: 'AB123456',
    dateNaissance: '1985-06-15',
    age: '38',
    mutuelle: {
      active: true,
      nom: 'CNOPS'
    },
    antecedents: ['Anxiété', 'Insomnie', 'Hypertension'],
    derniereConsultation: format(new Date(), 'dd/MM/yyyy'),
    prochainRdv: format(addDays(new Date(), 7), 'dd/MM/yyyy HH:mm'),
    nombreConsultations: 5
  },
  {
    id: '2',
    numeroPatient: 'P002',
    nom: 'Martin',
    prenom: 'Pierre',
    telephone: '0623456789',
    email: 'pierre.martin@email.com',
    ville: 'Marrakech',
    secteur: 'Hivernage',
    cin: 'CD789012',
    dateNaissance: '1990-03-22',
    age: '33',
    mutuelle: {
      active: false,
      nom: ''
    },
    antecedents: ['Dépression', 'Diabète type 2'],
    derniereConsultation: format(new Date(), 'dd/MM/yyyy'),
    prochainRdv: format(addDays(new Date(), 1), 'dd/MM/yyyy HH:mm'),
    nombreConsultations: 3
  },
  {
    id: '3',
    numeroPatient: 'P003',
    nom: 'Bernard',
    prenom: 'Sophie',
    telephone: '0634567890',
    email: 'sophie.bernard@email.com',
    ville: 'Marrakech',
    secteur: 'Targa',
    cin: 'EF345678',
    dateNaissance: '1988-11-30',
    age: '35',
    mutuelle: {
      active: true,
      nom: 'CNSS'
    },
    antecedents: ['Trouble bipolaire', 'Hypertension', 'Allergie aux pénicillines'],
    derniereConsultation: format(new Date(), 'dd/MM/yyyy'),
    prochainRdv: format(addDays(new Date(), 14), 'dd/MM/yyyy HH:mm'),
    nombreConsultations: 8
  },
  {
    id: '4',
    numeroPatient: 'P004',
    nom: 'Dubois',
    prenom: 'Thomas',
    telephone: '0645678901',
    email: 'thomas.dubois@email.com',
    ville: 'Marrakech',
    secteur: 'M\'hamid',
    cin: 'GH901234',
    dateNaissance: '1995-08-10',
    age: '28',
    mutuelle: {
      active: true,
      nom: 'RMA'
    },
    antecedents: ['TDAH', 'Migraines chroniques'],
    derniereConsultation: format(new Date(), 'dd/MM/yyyy'),
    prochainRdv: format(addDays(new Date(), 30), 'dd/MM/yyyy HH:mm'),
    nombreConsultations: 2
  },
  {
    id: '5',
    numeroPatient: 'P005',
    nom: 'Petit',
    prenom: 'Emma',
    telephone: '0656789012',
    email: 'emma.petit@email.com',
    ville: 'Marrakech',
    secteur: 'Massira',
    cin: 'IJ567890',
    dateNaissance: '1992-12-05',
    age: '31',
    mutuelle: {
      active: true,
      nom: 'SAHAM'
    },
    antecedents: ['Trouble anxieux généralisé', 'Fibromyalgie'],
    derniereConsultation: format(new Date(), 'dd/MM/yyyy'),
    prochainRdv: format(addDays(new Date(), 2), 'dd/MM/yyyy HH:mm'),
    nombreConsultations: 6
  }
];

// Rendez-vous de test
const today = new Date();
const startHour = 9;

export const testAppointments = [
  // Nouveaux patients (2)
  {
    id: '1',
    patientId: '1',
    patient: 'Marie Durant',
    time: setMinutes(setHours(today, 9), 0).toISOString(),
    duration: '30 min',
    type: 'Nouvelle consultation',
    source: 'phone',
    status: 'confirmé',
    contact: '0612345678',
    amount: '85,00',
    paid: true,
    paymentMethod: 'Carte Bancaire',
    isDelegue: false,
    isGratuite: false,
    isNewPatient: true,
    isControl: false,
    isCanceled: false,
    lastConsultAmount: '0,00'
  },
  {
    id: '2',
    patientId: '2',
    patient: 'Lucas Petit',
    time: setMinutes(setHours(today, 10), 0).toISOString(),
    duration: '30 min',
    type: 'Nouvelle consultation',
    source: 'website_satli',
    status: 'confirmé',
    contact: '0623456789',
    amount: '85,00',
    paid: true,
    paymentMethod: 'Espèces',
    isDelegue: false,
    isGratuite: false,
    isNewPatient: true,
    isControl: false,
    isCanceled: false,
    lastConsultAmount: '0,00'
  },
  // Anciens patients (2)
  {
    id: '3',
    patientId: '3',
    patient: 'Jean Dupont',
    time: setMinutes(setHours(today, 11), 0).toISOString(),
    duration: '30 min',
    type: 'Suivi',
    source: 'phone',
    status: 'confirmé',
    contact: '0634567890',
    amount: '65,00',
    paid: true,
    paymentMethod: 'Carte Bancaire',
    isDelegue: false,
    isGratuite: false,
    isNewPatient: false,
    isControl: false,
    isCanceled: false,
    lastConsultAmount: '65,00'
  },
  {
    id: '4',
    patientId: '4',
    patient: 'Sophie Bernard',
    time: setMinutes(setHours(today, 14), 0).toISOString(),
    duration: '30 min',
    type: 'Suivi',
    source: 'email',
    status: 'confirmé',
    contact: '0645678901',
    amount: '65,00',
    paid: true,
    paymentMethod: 'Espèces',
    isDelegue: false,
    isGratuite: false,
    isNewPatient: false,
    isControl: false,
    isCanceled: false,
    lastConsultAmount: '65,00'
  },
  // Délégué (1)
  {
    id: '5',
    patientId: '5',
    patient: 'Pierre Martin',
    time: setMinutes(setHours(today, 15), 0).toISOString(),
    duration: '30 min',
    type: 'Délégué',
    source: 'direct_visit',
    status: 'confirmé',
    contact: '0656789012',
    amount: '0,00',
    paid: true,
    paymentMethod: '-',
    isDelegue: true,
    isGratuite: false,
    isNewPatient: false,
    isControl: false,
    isCanceled: false,
    lastConsultAmount: '65,00'
  },
  // Gratuités (2)
  {
    id: '6',
    patientId: '6',
    patient: 'Paul Durant',
    time: setMinutes(setHours(today, 16), 0).toISOString(),
    duration: '30 min',
    type: 'Gratuit',
    source: 'phone',
    status: 'confirmé',
    contact: '0667890123',
    amount: '0,00',
    paid: true,
    paymentMethod: '-',
    isDelegue: false,
    isGratuite: true,
    isNewPatient: false,
    isControl: false,
    isCanceled: false,
    lastConsultAmount: '65,00'
  },
  {
    id: '7',
    patientId: '7',
    patient: 'Alice Martin',
    time: setMinutes(setHours(today, 16), 30).toISOString(),
    duration: '30 min',
    type: 'Gratuit',
    source: 'phone',
    status: 'confirmé',
    contact: '0678901234',
    amount: '0,00',
    paid: true,
    paymentMethod: '-',
    isDelegue: false,
    isGratuite: true,
    isNewPatient: false,
    isControl: false,
    isCanceled: false,
    lastConsultAmount: '85,00'
  },
  // Rendez-vous annulé (1)
  {
    id: '8',
    patientId: '8',
    patient: 'Marie Lambert',
    time: setMinutes(setHours(today, 17), 0).toISOString(),
    duration: '30 min',
    type: 'Suivi',
    source: 'phone',
    status: 'annulé',
    contact: '0689012345',
    amount: '0,00',
    paid: false,
    paymentMethod: '-',
    isDelegue: false,
    isGratuite: false,
    isNewPatient: false,
    isControl: false,
    isCanceled: true,
    lastConsultAmount: '65,00'
  }
];

// Fournitures de test
export const testSupplies = [
  {
    id: '1',
    item: 'Papier d\'impression A4',
    dateAchat: format(subDays(new Date(), 5), 'dd/MM/yyyy'),
    facture: true,
    prix: '45,00',
    typePaiement: 'Carte Bancaire',
    taxe: 'TTC'
  },
  {
    id: '2',
    item: 'Cartouches d\'encre HP',
    dateAchat: format(subDays(new Date(), 3), 'dd/MM/yyyy'),
    facture: true,
    prix: '85,00',
    typePaiement: 'Carte Bancaire',
    taxe: 'TTC'
  },
  {
    id: '3',
    item: 'Stylos (lot de 10)',
    dateAchat: format(new Date(), 'dd/MM/yyyy'),
    facture: false,
    prix: '12,50',
    typePaiement: 'Espèces',
    taxe: 'HT'
  },
  {
    id: '4',
    item: 'Classeurs A4',
    dateAchat: format(subDays(new Date(), 10), 'dd/MM/yyyy'),
    facture: true,
    prix: '25,00',
    typePaiement: 'Carte Bancaire',
    taxe: 'TTC'
  },
  {
    id: '5',
    item: 'Post-it (pack de 12)',
    dateAchat: format(subDays(new Date(), 2), 'dd/MM/yyyy'),
    facture: false,
    prix: '8,50',
    typePaiement: 'Espèces',
    taxe: 'HT'
  }
];

// Absences de test
export const testAbsences = [
  {
    id: '1',
    employee: 'Dr. Martin',
    startDate: format(addDays(new Date(), 10), 'dd/MM/yyyy'),
    endDate: format(addDays(new Date(), 15), 'dd/MM/yyyy'),
    reason: 'Congé',
    status: 'Approuvé'
  },
  {
    id: '2',
    employee: 'Marie Secrétaire',
    startDate: format(addDays(new Date(), 5), 'dd/MM/yyyy'),
    endDate: format(addDays(new Date(), 7), 'dd/MM/yyyy'),
    reason: 'Formation',
    status: 'En attente'
  },
  {
    id: '3',
    employee: 'Dr. Martin',
    startDate: format(addDays(new Date(), 20), 'dd/MM/yyyy'),
    endDate: format(addDays(new Date(), 22), 'dd/MM/yyyy'),
    reason: 'Congrès médical',
    status: 'En attente'
  },
  {
    id: '4',
    employee: 'Marie Secrétaire',
    startDate: format(subDays(new Date(), 5), 'dd/MM/yyyy'),
    endDate: format(subDays(new Date(), 3), 'dd/MM/yyyy'),
    reason: 'Maladie',
    status: 'Approuvé'
  }
];

// Utilisateurs de test
export const testUsers = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    name: 'Administrateur',
    dateCreation: format(subDays(new Date(), 30), 'dd/MM/yyyy'),
    failedAttempts: 0,
    isBlocked: false
  },
  {
    id: '2',
    username: 'docteur',
    role: 'docteur',
    name: 'Dr. Martin',
    specialite: 'Psychiatre',
    dateCreation: format(subDays(new Date(), 30), 'dd/MM/yyyy'),
    failedAttempts: 0,
    isBlocked: false
  },
  {
    id: '3',
    username: 'secretaire',
    role: 'secretaire',
    name: 'Marie Secrétaire',
    dateCreation: format(subDays(new Date(), 30), 'dd/MM/yyyy'),
    failedAttempts: 2,
    isBlocked: false
  },
  {
    id: '4',
    username: 'assistant',
    role: 'secretaire',
    name: 'Pierre Assistant',
    dateCreation: format(subDays(new Date(), 15), 'dd/MM/yyyy'),
    failedAttempts: 0,
    isBlocked: false
  },
  {
    id: '5',
    username: 'stagiaire',
    role: 'secretaire',
    name: 'Sophie Stagiaire',
    dateCreation: format(subDays(new Date(), 5), 'dd/MM/yyyy'),
    failedAttempts: 5,
    isBlocked: true
  }
];