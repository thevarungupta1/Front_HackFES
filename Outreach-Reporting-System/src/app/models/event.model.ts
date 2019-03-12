
export class Event {
    id: string;
    name: string;
    description: string;
    date: string;
    totalVolunteers: number;
    totalVolunteerHours: number;
    totalTravelHours: number;
    baseLocation: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    beneficiary: string;
    councilName: string;
    project: string;
    category: string;
    livesImpacted?: number;
    activityType?: number;
    status: string;
    createdBy: string;
    modifiedBy: string;
}