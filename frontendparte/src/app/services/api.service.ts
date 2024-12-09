import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // CRUD para Eventos
  getEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/events`);
  }

  createEvent(event: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/events`, event);
  }

  updateEvent(id: number, event: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/events/${id}`, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/events/${id}`);
  }

  // CRUD para Usuários
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  getUserHistory(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}/history`);
  }
  

  // CRUD para Inscrições
  getRegistrations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/registrations`);
  }

  createRegistration(registration: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrations`, registration);
  }

  deleteRegistration(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/registrations/${id}`);
  }
  updateRegistration(id: number, registration: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/registrations/${id}`, registration);
  }
  // Busca eventos de um usuário
getUserRegistrations(userId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/users/${userId}/registrations`);
}

// Filtrar eventos
filterEvents(query: any): Observable<any> {
  const params = new URLSearchParams(query).toString();
  return this.http.get(`${this.baseUrl}/events?${params}`);
}

}
