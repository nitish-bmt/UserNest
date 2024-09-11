export enum dbFailure{
  DB_FAILURE = "COULD NOT CONNECT TO DB",
  DB_WRITE_FAILURE = "COULD NOT WRITE TO DB",
  DB_READ_FAILURE = "COULD NOT READ FROM DB",
  DB_SEARCH_FAILURE = "COULD NOT FIND DB",
  DB_ITEM_NOT_FOUND = "ITEM NOT FOUND IN DB",
  EMPTY_DB_STRING = "RECEIVED EMPTY DB STRING ",
}

export enum userCreationFailure{
  FAILURE = "Could not register new user.",
  EMAIL_ALREADY_REGISTERED = "Email already registered. Try with another email.",
  USERNAME_ALREADY_TAKEN = "Username already taken. Try with another username.",
}

export enum userFailure{
  USER_NOT_FOUND = "User does not exist",
}

export enum authFailure{
  FAILURE = "Could not login",
  INVALID_CREDENTIALS = "username and password do not match",
}

export enum authSuccess{
  SUCCESS = "Logged in successfully"
}