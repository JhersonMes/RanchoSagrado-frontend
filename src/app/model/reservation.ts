import { Client } from './client';
import { RestaurantTable } from './restauranttable';

export interface Reservation {
  idReservation?: number;
  reservationDate: string;   // LocalDateTime → string ISO
  numberOfPeople: number;
  specialOccasion: string;
  status: string;            // PENDIENTE | CONFIRMADA | CANCELADA
  notes?: string;
  client: Client;
  restaurantTable: RestaurantTable;
}