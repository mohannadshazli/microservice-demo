export const MSG = {
  // Users
  USERS_CREATE: "users.create",
  USERS_FIND_ALL: "users.findAll",
  USERS_FIND_ONE: "users.findOne",
  USERS_UPDATE: "users.update",
  USERS_DEACTIVATE: "users.deactivate",

  // Orders
  ORDERS_CREATE: "orders.create",
  ORDERS_FIND_USER: "orders.findByUser",
  ORDERS_FIND_ONE: "orders.findOne",
  ORDERS_CANCEL: "orders.cancel",

  // Payments
  PAYMENTS_PROCESS: "payments.process",
  PAYMENTS_REFUND: "payments.refund",
} as const;
