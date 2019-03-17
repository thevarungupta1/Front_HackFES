import { Associate } from './associate.model';
import { Event } from './event.model';

export class Enrollment{
    eventID: string;
    associateID: number;
    eventDate: string;
    volunteerHours: number;
    travelHours: number;
  status: string;
  BusinessUnit: string;
  BaseLocation: string;
    iiepCategory: string;
    createdBy: string;
    
    associates: Associate;
    events: Event;
    }
