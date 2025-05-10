export interface AdminUser {
    /** Kullanıcının benzersiz ID’si */
    id: number;
  
    /** Kullanıcının e-posta adresi */
    email: string;
  
    /** Ad ve soyad */
    firstName?: string;
    lastName?: string;
  
    /** Kullanıcının rolleri, örn: ["USER"], ["ADMIN"] */
    roles: string[];
  
    /** Banlı mı değil mi */
    isBanned: boolean;
  }
  