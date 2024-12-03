import React, { useState, useMemo } from 'react';
import { CreditCard, Clock, Users, Calendar } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ConsultationStats from '../components/dashboard/ConsultationStats';
import ConsultationTimeStats from '../components/dashboard/ConsultationTimeStats';
import ConsultationTable from '../components/dashboard/ConsultationTable';
import MiniCalendar from '../components/calendar/MiniCalendar';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../contexts/AppointmentContext';
import { format, isSameDay, parseISO, startOfDay, isAfter, endOfDay, isWithinInterval, subDays, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Dashboard() {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({ 
    start: startOfDay(new Date()), 
    end: endOfDay(new Date()) 
  });

  // Filtrer les rendez-vous pour la plage de dates sélectionnée
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(apt => {
        const aptDate = parseISO(apt.time);
        return isWithinInterval(aptDate, {
          start: startOfDay(dateRange.start),
          end: endOfDay(dateRange.end)
        });
      })
      .map(apt => ({
        ...apt,
        status: apt.status || '–' // Initialiser le statut à '–' si non défini
      }))
      .sort((a, b) => parseISO(a.time).getTime() - parseISO(b.time).getTime());
  }, [appointments, dateRange]);

  // Calculs des statistiques
  const stats = useMemo(() => {
    const rdvConfirmes = filteredAppointments.filter(p => 
      p.patientId && !p.isCanceled
    );

    const nouveauxPatients = rdvConfirmes.filter(p => 
      p.isNewPatient && !p.isGratuite && !p.isDelegue
    ).length;
    
    const anciensPatients = rdvConfirmes.filter(p => 
      !p.isNewPatient && !p.isGratuite && !p.isDelegue
    ).length;
    
    const consultationsPayantes = rdvConfirmes.filter(p => 
      !p.isGratuite && !p.isDelegue &&
      parseFloat((p.amount || '0,00').replace(',', '.')) > 0
    ).length;
    
    const consultationsGratuites = rdvConfirmes.filter(p => 
      (p.isGratuite || p.isDelegue)
    ).length;

    const consultationsAnnulees = filteredAppointments.filter(p => 
      p.isCanceled
    ).length;

    const consultationsEnAttente = filteredAppointments.filter(p =>
      !p.paid && !p.isCanceled && !p.isGratuite && !p.isDelegue
    ).length;

    const revenueJour = rdvConfirmes
      .filter(p => !p.isGratuite && !p.isDelegue)
      .reduce((sum, p) => sum + parseFloat((p.amount || '0,00').replace(',', '.')), 0);

    // Calcul du revenu d'hier
    const hier = subDays(selectedDate, 1);
    const revenueHier = appointments
      .filter(p => {
        const aptDate = parseISO(p.time);
        return isSameDay(aptDate, hier) && !p.isGratuite && !p.isDelegue;
      })
      .reduce((sum, p) => sum + parseFloat((p.amount || '0,00').replace(',', '.')), 0);

    // Calcul de la variation
    const variation = revenueHier === 0 ? 100 : ((revenueJour - revenueHier) / revenueHier) * 100;

    // Calcul des statistiques de temps de consultation
    const durations = rdvConfirmes.map(p => parseInt(p.duration || '30'));
    const averageTime = durations.length > 0 
      ? Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length)
      : 30;
    const shortestTime = durations.length > 0 
      ? Math.min(...durations)
      : 30;
    const longestTime = durations.length > 0 
      ? Math.max(...durations)
      : 30;

    // Calcul de la variation hebdomadaire du temps moyen
    const lastWeek = subWeeks(selectedDate, 1);
    const lastWeekAppointments = appointments.filter(p => {
      const aptDate = parseISO(p.time);
      return isWithinInterval(aptDate, {
        start: startOfDay(lastWeek),
        end: endOfDay(lastWeek)
      }) && !p.isCanceled;
    });
    const lastWeekDurations = lastWeekAppointments.map(p => parseInt(p.duration || '30'));
    const lastWeekAverage = lastWeekDurations.length > 0
      ? lastWeekDurations.reduce((sum, d) => sum + d, 0) / lastWeekDurations.length
      : averageTime;
    const weeklyChange = lastWeekAverage === 0 
      ? 0 
      : Math.round(((averageTime - lastWeekAverage) / lastWeekAverage) * 100);

    return {
      consultations: {
        total: filteredAppointments.length,
        nouveauxPatients,
        anciensPatients,
        payantes: consultationsPayantes,
        gratuites: consultationsGratuites,
        annulees: consultationsAnnulees,
        enAttente: consultationsEnAttente
      },
      revenue: {
        total: revenueJour.toFixed(2).replace('.', ','),
        variation
      },
      temps: {
        averageTime,
        shortestTime,
        longestTime,
        weeklyChange
      }
    };
  }, [filteredAppointments, appointments, selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDateRange({ 
      start: startOfDay(date), 
      end: endOfDay(date) 
    });
  };

  const handleRangeSelect = (range: { start: Date; end: Date } | null) => {
    if (range) {
      setDateRange({ 
        start: startOfDay(range.start), 
        end: endOfDay(range.end) 
      });
      setSelectedDate(range.start);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <span>Tableau de bord</span>
          <span className="text-gray-400">-</span>
          <span className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-400" />
            {format(selectedDate, 'd MMMM yyyy', { locale: fr })}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<CreditCard className="h-6 w-6 text-white" />}
          iconBgColor="bg-green-500"
          title="Facturation"
          mainValue={`${stats.revenue.total} Dhs`}
          subValue={`Dernier paiement: ${stats.revenue.total} Dhs`}
          trend={{
            value: `${Math.abs(stats.revenue.variation).toFixed(1)}%`,
            label: "vs. hier",
            isPositive: stats.revenue.variation >= 0
          }}
        />

        <StatCard
          icon={<Clock className="h-6 w-6 text-white" />}
          iconBgColor="bg-blue-500"
          title="Consultations payantes"
          mainValue={stats.consultations.payantes.toString()}
          subValue={`${Math.round((stats.consultations.payantes / stats.consultations.total) * 100)}% du total`}
          trend={{
            value: `${stats.consultations.payantes} sur ${stats.consultations.total}`,
            label: "consultations",
            isPositive: true
          }}
        />

        <ConsultationTimeStats stats={stats.temps} />

        <StatCard
          icon={<Users className="h-6 w-6 text-white" />}
          iconBgColor="bg-purple-500"
          title="Statistiques de Consultation"
        >
          <ConsultationStats
            stats={{
              total: stats.consultations.total,
              nouveauxPatients: stats.consultations.nouveauxPatients,
              anciensPatients: stats.consultations.anciensPatients,
              gratuites: stats.consultations.gratuites,
              annulees: stats.consultations.annulees,
              enAttente: stats.consultations.enAttente
            }}
          />
        </StatCard>
      </div>

      <div className="flex space-x-4">
        <div className="w-64 flex-shrink-0">
          <MiniCalendar
            currentDate={selectedDate}
            selectedDate={selectedDate}
            selectionRange={dateRange}
            onDateSelect={handleDateSelect}
            onRangeSelect={handleRangeSelect}
            appointments={appointments}
          />
        </div>
        
        <div className="flex-1">
          <ConsultationTable 
            visits={filteredAppointments}
            selectedDate={selectedDate}
            dateRange={dateRange}
            onDateSelect={handleDateSelect}
            onRangeSelect={handleRangeSelect}
          />
        </div>
      </div>
    </div>
  );
}