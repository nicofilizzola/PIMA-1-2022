export interface GcalEvent {
  kind?: 'calendar#event';
  etag?: string; // type etag
  id?: string;
  status?: string;
  htmlLink?: string;
  created?: string; // RFC3339 timestamp
  updated?: string; // RFC3339 timestamp
  summary?: string;
  description?: string;
  location?: string;
  colorId?: string;
  creator?: {
    id?: string;
    email?: string;
    displayName?: string;
    self?: boolean;
  };
  organizer?: {
    id?: string;
    email?: string;
    displayName?: string;
    self?: boolean;
  };
  start: {
    date?: string; // "yyyy-mm-dd" format
    dateTime?: string; // RFC3339 timestamp
    timeZone?: string;
  };
  end: {
    date?: string; // "yyyy-mm-dd" format
    dateTime?: string; // RFC3339 timestamp
    timeZone?: string;
  };
  endTimeUnspecified?: boolean;
  recurrence?: [string];
  recurringEventId?: string;
  originalStartTime?: {
    date?: string; // "yyyy-mm-dd" format
    dateTime?: string; // RFC3339 timestamp
    timeZone?: string;
  };
  transparency?: string;
  visibility?: string;
  iCalUID?: string;
  sequence?: number; // type integer
  attendees?: [
    {
      id?: string;
      email?: string;
      displayName?: string;
      organizer?: boolean;
      self?: boolean;
      resource?: boolean;
      optional?: boolean;
      responseStatus?: string;
      comment?: string;
      additionalGuests?: number; // type integer
    }
  ];
  attendeesOmitted?: boolean;
  extendedProperties?: {
    private?: {
      (key): string;
    };
    shared?: {
      (key): string;
    };
  };
  hangoutLink?: string;
  conferenceData?: {
    createRequest?: {
      requestId?: string;
      conferenceSolutionKey?: {
        type?: string;
      };
      status?: {
        statusCode?: string;
      };
    };
    entryPoints?: [
      {
        entryPointType?: string;
        uri?: string;
        label?: string;
        pin?: string;
        accessCode?: string;
        meetingCode?: string;
        passcode?: string;
        password?: string;
      }
    ];
    conferenceSolution?: {
      key?: {
        type?: string;
      };
      name?: string;
      iconUri?: string;
    };
    conferenceId?: string;
    signature?: string;
    notes?: string;
  };
  gadget?: {
    type?: string;
    title?: string;
    link?: string;
    iconLink?: string;
    width?: number; // type integer
    height?: number; // type integer
    display?: string;
    preferences?: {
      (key): string;
    };
  };
  anyoneCanAddSelf?: boolean;
  guestsCanInviteOthers?: boolean;
  guestsCanModify?: boolean;
  guestsCanSeeOtherGuests?: boolean;
  privateCopy?: boolean;
  locked?: boolean;
  reminders?: {
    useDefault?: boolean;
    overrides?: [
      {
        method?: string;
        minutes?: number; // type integer
      }
    ];
  };
  source?: {
    url?: string;
    title?: string;
  };
  attachments?: [
    {
      fileUrl?: string;
      title?: string;
      mimeType?: string;
      iconLink?: string;
      fileId?: string;
    }
  ];
  eventType?: string;
}

/**
 * @brief Not provided by the API, this interface allows to easily categorize events by calendar
 */
export interface GcalEventList {
  (calendarId): GcalEvent[];
}

/**
 * @note Not provided by the API, this interface allows to easily categorize recurring event instances
 */
export interface GcalEventInstances {
  (calendarId): {
    (eventId): GcalEvent[];
  };
}

/**
 * @note This type may be used if eventList accessed via Object.entries
 */
export type GcalEventListEntry = [
  string, // calendarId
  GcalEvent[]
];
