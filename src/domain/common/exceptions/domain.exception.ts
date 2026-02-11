export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class UserNotFoundException extends DomainException {
  constructor(identifier: string) {
    super(`User with identifier ${identifier} not found`);
    this.name = 'UserNotFoundException';
  }
}

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('Invalid credentials provided');
    this.name = 'InvalidCredentialsException';
  }
}
