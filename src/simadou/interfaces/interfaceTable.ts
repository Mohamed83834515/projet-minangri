// ============================================================
// UTILITAIRES À NE PAS TOUCHER
// ============================================================

export interface OpenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface OpenPropsWithData<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: T | null;
}

//=============================================================
// user

// export  interface User{
//     id: number;
//     nom?: string;
// }

export type User = {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  status: 'active' | 'inactive' | 'invited' | 'suspended'
  role: 'superadmin' | 'admin' | 'cashier' | 'manager'
  createdAt: Date
  updatedAt: Date
}


