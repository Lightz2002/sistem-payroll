import { FormDataConvertible } from '@inertiajs/core';

type DateTime = string;

export type Nullable<T> = T | null;

export interface Team {
  id: number;
  name: string;
  personal_team: boolean;
  created_at: DateTime;
  updated_at: DateTime;
}

export interface Menu {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  current_team_id: Nullable<number>;
  profile_photo_path: Nullable<string>;
  profile_photo_url: string;
  two_factor_enabled: boolean;
  email_verified_at: Nullable<DateTime>;
  created_at: DateTime;
  updated_at: DateTime;
  roles: string;
  menus: string[];
  // permissions: string[];
}

export interface Auth {
  user: Nullable<
    User & {
      all_teams?: Team[];
      current_team?: Team;
    }
  >;
}

export type InertiaSharedProps<T = {}> = T & {
  jetstream: {
    canCreateTeams: boolean;
    canManageTwoFactorAuthentication: boolean;
    canUpdatePassword: boolean;
    canUpdateProfileInformation: boolean;
    flash: any;
    hasAccountDeletionFeatures: boolean;
    hasApiFeatures: boolean;
    hasTeamFeatures: boolean;
    hasTermsAndPrivacyPolicyFeature: boolean;
    managesProfilePhotos: boolean;
    hasEmailVerification: boolean;
  };
  auth: Auth;
  errorBags: any;
  errors: any;
};

export interface Session {
  id: number;
  ip_address: string;
  is_current_device: boolean;
  agent: {
    is_desktop: boolean;
    platform: string;
    browser: string;
  };
  last_active: DateTime;
}

export interface ApiToken {
  id: number;
  name: string;
  abilities: string[];
  last_used_ago: Nullable<DateTime>;
  created_at: DateTime;
  updated_at: DateTime;
}

export interface JetstreamTeamPermissions {
  canAddTeamMembers: boolean;
  canDeleteTeam: boolean;
  canRemoveTeamMembers: boolean;
  canUpdateTeam: boolean;
}

export interface Role {
  id: string;
  name: string;
  // permissions: string[];
  // description: string;
}

export interface TeamInvitation {
  id: number;
  team_id: number;
  email: string;
  role: Nullable<string>;
  created_at: DateTime;
  updated_at: DateTime;
}

export interface ColumnType {
  key: string;
  label: string;
  component?: string;
}

export interface Collection {
  id: number;
  [key: string]: any; // This is an index signature
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationType<Data extends Collection> {
  current_page: number;
  data: Data[];
  first_page_url: string;
  from: number;
  last_page: 1;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface TableForm<Data = undefined> {
  search: string;
  sortBy: string;
  sortDirection: string;
  page: number;
  filters?: Data;
}

export interface Salary extends Collection {
  date: string;
  employee: string;
  total_amount: number;
  salary_per_day: number;
  total_salary_bonus: number;
  total_salary_deduction: number;
  salary_deductions: PaginationType<SalaryDeductionOrBonus>;
  salary_bonus: PaginationType<SalaryDeductionOrBonus>;
}
export interface SalaryDeductionOrBonus extends Collection {
  name: string;
  amount: number;
}

// export type OpenModalFormHandle = () => void;
