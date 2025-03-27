export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  organizationId: number | null;
  organization?: Organization;
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  users?: User[];
}

export interface WealthboxUser {
  organizationId: any;
  id: number;
  email: string;
  name: string;
  account: number;
  excluded_from_assignments: boolean;
}

export interface IntegrationConfig {
  id: number;
  integrationType: string;
  apiToken: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  organizationId?: number;
}