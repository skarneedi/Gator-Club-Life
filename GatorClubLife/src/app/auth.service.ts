import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class AuthService {
  // Dummy "database" to store registered users
  private registeredUsers: { name: string; email: string; username: string; password: string; role: string }[] = [];

  constructor() {}

  // Method to register a new user
  register(name: string, email: string, username: string, password: string, role: string): boolean {
    // Check if the username is already taken
    const userExists = this.registeredUsers.some((user) => user.username === username);
    if (userExists) {
      return false; // Username is already taken
    }

    // Add the new user to the "database"
    this.registeredUsers.push({ name, email, username, password, role });
    console.log('Registered Users:', this.registeredUsers);
    return true; // Registration successful
  }

  // Method to validate login credentials
  login(username: string, password: string): boolean {
    // Check if the username and password match a registered user
    const user = this.registeredUsers.find(
      (user) => user.username === username && user.password === password
    );
    return !!user; // Return true if user exists, false otherwise
  }
}