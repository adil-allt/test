export interface Appointment {
  id: string;
  patient: string;
  time: string;
  duration: string;
  type: string;
  source: string;
  status: string;
  contact?: string;
  location?: string;
  videoLink?: string;
  isNewPatient?: boolean;
  isGratuite?: boolean;
  isDelegue?: boolean;
  isCanceled?: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}