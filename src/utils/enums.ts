export enum RoleEnum {
  CUSTOMER = 'Customer',
  ADMIN = 'Admin',
  OPERATOR = 'Operator',
  MANAGER = 'Manager',
  STAFF = 'Staff'
}

export enum GenderEnum {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum UserStatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending'
}

export enum TransactionTypeEnum {
  REFUND = 'Refund',
  BOOKING = 'Booking',
  PACKAGE = 'Package',
  ADD_COURT = 'Add Court'
}

export enum CourtReportStatus {
  AVAILABLE = 'Available',
  WARN = 'Warn',
  MAINTENANCE_NEEDED = 'Maintenance needed'
}

export enum BranchStatusEnum {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export enum CourtStatusEnum {
  PENDING = 'Pending',
  INUSE = 'Inuse',
  TERMINATION = 'Termination'
}

export enum BookingStatusEnum {
  PENDING = 'Pending',
  BOOKED = 'Booked',
  CANCELLED = 'Cancelled',
  DONE = 'Done'
}

export enum BookingTypeEnum {
  SINGLE_SCHEDULE = 'single_schedule',
  PERMANENT_SCHEDULE = 'permanent_schedule',
  FLEXIBLE_SCHEDULE = 'flexible_schedule'
}

export enum ScheduleStatusEnum {
  AVAILABLE = 'Available',
  DONE = 'Done',
  CANCELLED = 'Cancelled'
}

export enum PackageCourtTypeEnum {
  CUSTOM = 'Custom',
  STANDARD = 'Standard'
}
