import type { DropdownInterface } from "./AtsCommonInterface";
export interface UserManagementInterface {
  user?: DropdownInterface;
  employeeName?: string;
  fullName?: string;
  employeeId?: number;
  emailId?: string;
  departmentId?: number;
  department?: DropdownInterface;
  roleIds?: number[];
  statusId?: number;
  userStatus?: DropdownInterface;
  roles?: DropdownInterface[];
  [key: string]: unknown;
}

export interface UserUpdatePayloadInterface {
  data: UserManagementInterface;
  message: string;
  success: boolean;
}
