export interface Shift {
  idShift?: number;
  name: string;
  startTime: string;   // LocalTime -> string "HH:mm:ss"
  endTime: string;
  daysOfWeek: string;
}