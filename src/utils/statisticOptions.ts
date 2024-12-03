export const statisticOptions: {
  [key: string]: {
    label: string;
    description: string;
  };
} = {
  cityStats: {
    label: 'Par ville',
    description: 'Répartition des patients par ville et zone géographique'
  },
  ageStats: {
    label: 'Par âge',
    description: 'Distribution des patients par tranche d\'âge'
  },
  genderStats: {
    label: 'Par genre',
    description: 'Répartition des patients selon le genre'
  },
  paymentStats: {
    label: 'Paiements par période',
    description: 'Analyse des paiements par mois et années'
  },
  appointmentStatus: {
    label: 'Rendez-vous confirmés/annulés',
    description: 'Taux de confirmation et d\'annulation des rendez-vous'
  },
  appointmentSource: {
    label: 'Source des rendez-vous',
    description: 'Origine des prises de rendez-vous'
  },
  peakHours: {
    label: 'Heures de pointe',
    description: 'Analyse des horaires les plus fréquentés'
  },
  consultationDuration: {
    label: 'Durée des consultations',
    description: 'Durée moyenne des consultations par type'
  },
  insuranceStats: {
    label: 'Par mutuelle',
    description: 'Répartition des patients par mutuelle'
  },
  paymentType: {
    label: 'Par type de paiement',
    description: 'Analyse des modes de paiement utilisés'
  },
  averageAmount: {
    label: 'Montant moyen',
    description: 'Montant moyen par consultation et évolution'
  }
};