
const READ_ALL = "readAll";

/**
 * Authentication Service
 */
const AUTHENTICATE = "authenticate/";
const Authentication = {
  AUTHENTICATE
}

/**
 * Donation Service
 */
const DONATION = "donation/";
const Donation = {
  DONATION
}

/**
 * Registration Service
 */
const REGISTRATION = "register/";
const Registration = {
  REGISTRATION
}

/**
 * User Service
 */
const USER = "user/";
const User = {
  USER
}

/**
 * Tag Service
 */
const TAG = "tags/";
const Tag = {
  TAG,
  READ_ALL
}

/**
 * User Tag Service
 */
const USER_TAG = "usertags/";
const UserTag = {
  USER_TAG,
  READ_ALL
}

const Services = {
  Authentication,
  Donation,
  Registration,
  User,
  Tag,
  UserTag
}

export const RequestRouting = {
  READ_ALL,
  Services
}
