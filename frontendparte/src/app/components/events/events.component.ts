import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'] ,
  imports: [CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  filters = { date: '', type: '', location: '' };
  newEvent = { name: '', date: '', type: '', location: '', slots: 0 };
  selectedEvent: any = null;
  filteredEvents: any[] = [];
  searchCriteria = { date: '', type: '', location: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.apiService.getEvents().subscribe((data) => {
      this.events = data;
      this.filteredEvents = data;
    });
  }

  filterEvents() {
    this.filteredEvents = this.events.filter((event) => {
      const matchesDate =
        this.searchCriteria.date === '' ||
        event.date.includes(this.searchCriteria.date);
      const matchesType =
        this.searchCriteria.type === '' ||
        event.type.toLowerCase().includes(this.searchCriteria.type.toLowerCase());
      const matchesLocation =
        this.searchCriteria.location === '' ||
        event.location.toLowerCase().includes(this.searchCriteria.location.toLowerCase());

      return matchesDate && matchesType && matchesLocation;
    });
  }

  createEvent() {
    this.apiService.createEvent(this.newEvent).subscribe(() => {
      this.loadEvents();
      this.newEvent = { name: '', date: '', type: '', location: '', slots: 0 };
    });
  }

  selectEvent(event: any) {
    this.selectedEvent = { ...event };
  }

  updateEvent() {
    if (this.selectedEvent) {
      this.apiService.updateEvent(this.selectedEvent.id, this.selectedEvent).subscribe(() => {
        this.loadEvents();
        this.selectedEvent = null;
      });
    }
  }

  deleteEvent(id: number) {
    this.apiService.deleteEvent(id).subscribe(() => {
      this.loadEvents();
      if (this.selectedEvent?.id === id) {
        this.selectedEvent = null;
      }
    });
  }
}