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
  PENDING = 'Pending',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export enum TransactionTypeEnum {
  REFUND = 'Refund',
  BOOKING = 'Booking',
  PACKAGE = 'Package',
  ADD_COURT = 'Add Court'
}

export enum PaymentMethodEnum {
  LINKED_ACCOUNT = 'Linked Account',
  MANUAL_ENTRY = 'Manual Entry'
}

export enum BookingPaymentType {
  PARTIAL = 'partial',
  FULL = 'full'
}

export enum CourtReportStatus {
  AVAILABLE = 'Available',
  WARN = 'Warn',
  MAINTENANCE_NEEDED = 'Maintenance needed',
  PENDING = 'Pending',
  DENIED = 'Denied'
}

export enum BranchStatusEnum {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DENIED = 'Denied'
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
  FLEXIBLE_SCHEDULE = 'flexible_schedule',
  COMPETITION_SCHEDULE = 'competition_schedule'
}

export enum ScheduleStatusEnum {
  PENDING = 'Pending',
  AVAILABLE = 'Available',
  DONE = 'Done'
}

export enum ScheduleTypeEnum {
  MAINTENANCE = 'Maintenance',
  BOOKING = 'Booking'
}

export enum PackageCourtTypeEnum {
  CUSTOM = 'Custom',
  STANDARD = 'Standard'
}

export enum WeekDayEnum {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday'
}

export enum PackagePurchaseStatusEnum {
  PENDING = 'Pending',
  ACTIVE = 'Active'
}
export enum PackageCourtStatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}
