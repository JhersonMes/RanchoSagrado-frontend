import { Client } from './client';// Importa las entidades relacionadas con clientes y mesas del restaurante.
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
