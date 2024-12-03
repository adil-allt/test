import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAppointments } from '../contexts/AppointmentContext';
import { format, parseISO, differenceInYears, isWithinInterval } from 'date-fns';

export const useStatistics = (dateRange?: { startDate: string; endDate: string }) => {
  const { patients } = useData();
  const { appointments } = useAppointments();
  const [stats, setStats] = useState<{ [key: string]: any }>(() => {
    // Récupérer les statistiques sauvegardées du localStorage
    const savedStats = localStorage.getItem('selectedStats');
    return savedStats ? JSON.parse(savedStats) : {};
  });
  const updateInterval = 30000; // 30 secondes

  const filterByDateRange = (date: string) => {
    if (!dateRange?.startDate || !dateRange?.endDate) return true;
    const itemDate = parseISO(date);
    const start = parseISO(dateRange.startDate);
    const end = parseISO(dateRange.endDate);
    return isWithinInterval(itemDate, { start, end });
  };

  const calculateStats = () => {
    // Vérifier si nous avons des données
    if (patients.length === 0 && appointments.length === 0) {
      return;
    }

    // Filtrer les rendez-vous par plage de dates
    const filteredAppointments = appointments.filter(apt => filterByDateRange(apt.time));

    // Statistiques par ville
    const cityStats = patients.reduce((acc: { [key: string]: number }, patient) => {
      const city = patient.ville || 'Non spécifié';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    // Statistiques par âge
    const ageStats = patients.reduce((acc: { [key: string]: number }, patient) => {
      if (patient.dateNaissance) {
        const age = differenceInYears(new Date(), new Date(patient.dateNaissance));
        const ageGroup = `${Math.floor(age / 10) * 10}-${Math.floor(age / 10) * 10 + 9}`;
        acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      }
      return acc;
    }, {});

    // Statistiques de paiement par mois
    const paymentStats = filteredAppointments.reduce((acc: { [key: string]: number }, apt) => {
      if (apt.amount) {
        const month = format(parseISO(apt.time), 'MMMM yyyy');
        const amount = parseFloat(apt.amount.replace(',', '.'));
        acc[month] = (acc[month] || 0) + amount;
      }
      return acc;
    }, {});

    // Statistiques des rendez-vous
    const appointmentStats = filteredAppointments.reduce((acc: any, apt) => {
      // Status
      const status = apt.status || '-';
      acc.status = acc.status || {};
      acc.status[status] = (acc.status[status] || 0) + 1;

      // Source
      const source = apt.source || 'Non spécifié';
      acc.source = acc.source || {};
      acc.source[source] = (acc.source[source] || 0) + 1;

      // Durée moyenne
      const duration = parseInt(apt.duration) || 30;
      acc.duration = acc.duration || { total: 0, count: 0 };
      acc.duration.total += duration;
      acc.duration.count += 1;

      // Heures
      const hour = format(parseISO(apt.time), 'HH:00');
      acc.hours = acc.hours || {};
      acc.hours[hour] = (acc.hours[hour] || 0) + 1;

      return acc;
    }, { status: {}, source: {}, duration: { total: 0, count: 0 }, hours: {} });

    // Calculer la durée moyenne
    const averageDuration = appointmentStats.duration.count > 0
      ? Math.round(appointmentStats.duration.total / appointmentStats.duration.count)
      : 0;

    // Statistiques des mutuelles
    const mutuelleStats = patients.reduce((acc: { [key: string]: number }, patient) => {
      const mutuelle = patient.mutuelle?.nom || 'Sans mutuelle';
      acc[mutuelle] = (acc[mutuelle] || 0) + 1;
      return acc;
    }, {});

    // Statistiques des types de paiement
    const paymentTypeStats = filteredAppointments.reduce((acc: { [key: string]: number }, apt) => {
      const paymentMethod = apt.paymentMethod || 'Non spécifié';
      if (apt.amount && parseFloat(apt.amount.replace(',', '.')) > 0) {
        acc[paymentMethod] = (acc[paymentMethod] || 0) + 1;
      }
      return acc;
    }, {});

    const newStats = {
      cityStats,
      ageStats,
      paymentStats,
      appointmentStats: {
        ...appointmentStats,
        averageDuration
      },
      mutuelleStats,
      paymentTypeStats
    };

    setStats(newStats);
  };

  // Mise à jour initiale et périodique
  useEffect(() => {
    calculateStats();
    const interval = setInterval(calculateStats, updateInterval);
    return () => clearInterval(interval);
  }, [patients, appointments, dateRange]);

  return stats;
};