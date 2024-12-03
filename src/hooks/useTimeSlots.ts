import { format, isSunday, isSaturday, addHours } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export const useTimeSlots = (timezone: string = 'GMT') => {
  const getTimezoneOffset = (tz: string) => {
    if (tz === 'GMT') return 0;
    return parseInt(tz.replace('GMT+', ''), 10);
  };

  const convertToTimezone = (hour: number, minutes: number) => {
    const localDate = new Date();
    localDate.setHours(hour, minutes, 0, 0);
    const offset = getTimezoneOffset(timezone);
    const tzDate = addHours(localDate, offset);
    return format(tzDate, 'HH:mm');
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minutes = i % 2 === 0 ? 0 : 30;
    return convertToTimezone(hour, minutes);
  });

  const isBreakTime = (time: string, date: Date) => {
    const [hours, minutes] = time.split(':').map(Number);
    const localDate = new Date(date);
    localDate.setHours(hours, minutes, 0, 0);
    const offset = getTimezoneOffset(timezone);
    const tzDate = addHours(localDate, -offset);
    
    const tzHours = tzDate.getHours();
    const tzMinutes = tzDate.getMinutes();
    
    if ((tzHours === 14 && tzMinutes === 0) || 
        (tzHours === 17 && tzMinutes === 30) || 
        tzHours >= 18) {
      return true;
    }

    if (isSunday(tzDate)) {
      return true;
    }

    if (isSaturday(tzDate) && tzHours >= 13) {
      return true;
    }

    return false;
  };

  const getBreakTimeReason = (time: string, date: Date) => {
    const [hours, minutes] = time.split(':').map(Number);
    const localDate = new Date(date);
    localDate.setHours(hours, minutes, 0, 0);
    const offset = getTimezoneOffset(timezone);
    const tzDate = addHours(localDate, -offset);

    if (format(tzDate, 'HH:mm') === '14:00') return 'Pause déjeuner';
    if (format(tzDate, 'HH:mm') === '17:30' || tzDate.getHours() >= 18) return 'Fin des consultations';
    if (isSunday(tzDate)) return 'Dimanche';
    if (isSaturday(tzDate) && tzDate.getHours() >= 13) return 'Samedi après-midi';
    return '';
  };

  const getTimeSlotLabel = (time: string, date: Date) => {
    const reason = getBreakTimeReason(time, date);
    return reason ? `${time} ${timezone} (${reason})` : `${time} ${timezone}`;
  };

  return {
    timeSlots,
    isBreakTime,
    getTimeSlotLabel,
    getBreakTimeReason,
    convertToTimezone
  };
};