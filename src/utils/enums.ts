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
  INACTIVE = 'Inactive'
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

export enum BookingStatusEnum {
  PENDING = 'Pending',
  BOOKED = 'Booked',
  CANCELLED = 'Cancelled',
  DONE = 'Done'
}
export enum ScheduleStatusEnum {
  AVAILABLE = 'Available',
  UNAVAILABLE = 'Unavailable'
}
