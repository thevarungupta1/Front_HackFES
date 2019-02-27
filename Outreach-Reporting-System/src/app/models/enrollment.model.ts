import { Associate } from './associate.model';
import { Event } from './event.model';

export class Enrollment{
    eventId: string;
    associateId: number;
    volunteerHours: number;
    travelHours: number;
    status: string;
    iiepCategory: string;
    createdBy: string;
    
    associate: Associate;
    event: Event;
    }