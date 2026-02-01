
var c = {
  // SHEET NAMES
  RAW_INPUT_SHEET: 'Data',
  RAW_CORRECTIONS_SHEET: 'Corrections',
  SESSIONS_SHEET: 'Sessions',
  TEAM_SHEET: 'Team',
  PROCESS_SHEET: 'Process',

  ERROR_EMAIL: 'mackensiesemail@gmail.com',
  EMAIL_SENDER: 'ASL Robotics',

  // enums 
  SessionStatus: {
    Pending: "pending",
    Confirmed: "confirmed",
    Incomplete: "email sent",
    NoCorrection: "no correction",
  },

  SessionType: {
    Preseason: "preseason",
    KickoffWeekend: "kickoff weekend",
    BuildSeason: "build season",
    FebBreak: "feb break",
    Postseason: "postseason",
  },

  // specific cells and columns in sheets 
  PROCESS_LAST_ROW_CELL: [1, 12],
  PROCESS_LAST_CONFIRMED_CELL: [1, 10],
  PROCESS_NAME_COL: 1,
  PROCESS_DATE_COL: 2,
  PROCESS_START_COL: 3,
  PROCESS_END_COL: 4,
  PROCESS_LEN_COL: 5,
  PROCESS_STATUS_COL: 6, 
  PROCESS_EMAIL_TIME_COL: 7,
  PROCESS_SESSION_TYPE_COL: 8,
  PROCESS_EXTRA_COL_ONE: 9,
  PROCESS_EXTRA_COL_TWO: 10,

  TEAM_NAME_COL: 1,
  TEAM_EMAIL_COL: 3,

  // date formatting
  TIMEZONE: 'Europe/London',
  DATE_FORMAT: 'MM/dd/yy',
  DURATION_FORMAT: 'HH:mm',
  DATE_TIME_FORMAT: 'MM/dd HH:mm',
  DATE_WEEKDAY_FORMAT: 'EEEEE, MMM d',
  DATE_GOOGLE_FORM_FORMAT: 'yyyy-MM-dd',

  TIMEOUT_VALUE: 1000*60*60*23 // 23 hours
}
