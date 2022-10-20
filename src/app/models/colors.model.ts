export interface Colors {
  kind: 'calendar#colors';
  updated: string; // RFC3339 timestamp
  calendar: {
    (key): {
      background: string;
      foreground: string;
    };
  };
  event: {
    (key): {
      background: string;
      foreground: string;
    };
  };
}
