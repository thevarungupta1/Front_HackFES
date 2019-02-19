class Associate {
    id: number;
    name: string;
    designation: string;
    location: string;
    BU: string;
    createdBy: string;
    modifiedBy: string;
}

class Event {
    id: number;
    name: string;
    description: string;
    date?: Date;
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

class Location {
    id: number;
    baseLocation: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    createdBy: string;
    modifiedBy: string;
}

class Enrollment{
eventId: string;
associateId: number;
volunteerHours: number;
travelHours: number;
status: string;
iiepCategory: string;

}

export { Associate, Event, Enrollment };