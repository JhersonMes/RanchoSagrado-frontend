import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../model/client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  protected clients: Client[] = [];
  private readonly clientService = inject(ClientService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.clientService.findAll().subscribe((data) => {
      this.clients = data;
      console.log('Datos recibidos:', data);
      this.cdr.detectChanges();
    });
  }
}
