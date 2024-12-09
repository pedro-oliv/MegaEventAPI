import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.css'],
  imports: [FormsModule,
    CommonModule,
    RouterLink
  ]
})
export class RegistrationsComponent implements OnInit {
  registrations: any[] = [];
  users: any[] = [];
  events: any[] = [];
  newRegistration = { userId: '', eventId: '' };
  selectedRegistration: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEvents();
    this.loadRegistrations();
  }

    // Carregar Inscrições
    loadRegistrations() {
      this.apiService.getRegistrations().subscribe((data) => {
        this.registrations = data;
      });
    }
  
    // Carregar Usuários para seleção
    loadUsers() {
      this.apiService.getUsers().subscribe((data) => {
        this.users = data;
      });
    }
  
    // Carregar Eventos para seleção
    loadEvents() {
      this.apiService.getEvents().subscribe((data) => {
        this.events = data;
      });
    }
  
    // Criar nova inscrição
    createRegistration() {
      this.apiService.createRegistration(this.newRegistration).subscribe(
      () => {
        this.loadRegistrations();
          this.newRegistration = { userId: '', eventId: '' };
    },
        (error) => {
          alert(error.error.error || 'Erro ao criar inscrição.');
    }
  );
}
  
    // Selecionar inscrição para edição
    selectRegistration(registration: any) {
      this.selectedRegistration = { ...registration }; // Cria uma cópia para edição
    }
  
    // Atualizar inscrição
    updateRegistration() {
      if (this.selectedRegistration) {
        this.apiService
          .updateRegistration(this.selectedRegistration.id, this.selectedRegistration)
          .subscribe(() => {
            this.loadRegistrations();
            this.selectedRegistration = null;
          });
      }
    }
  
    // Deletar inscrição
    deleteRegistration(id: number) {
      this.apiService.deleteRegistration(id).subscribe(() => {
        this.loadRegistrations();
        if (this.selectedRegistration?.id === id) {
          this.selectedRegistration = null;
        }
      });
    }
  }