// Define appropriate schemas for our various calendar requests.

interface Credentials {
  api_key: string;
}

export interface CreateEvent extends Credentials {
  event_name: string;
  start_date: string;
  end_date: string;
}

export interface EventRSVP extends Credentials {
  event_id: string;
  attendee_name: string;
}

export interface ParticipantList extends Credentials {
  event_id: string;
}
