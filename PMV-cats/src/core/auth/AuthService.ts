export class AuthService {
    /**
     * Valida las credenciales estáticas para el MVP.
     */
    static async login(username: string, password: string): Promise<boolean> {
        const cleanUser = username.trim().toLowerCase();
        const cleanPass = password.trim().toUpperCase();
        
        // Aceptamos tanto la versión antigua como la nueva para evitar bloqueos
        const isOldAuth = cleanUser === 'admin' && cleanPass === '1234';
        const isNewAuth = cleanUser === 'admin@puce.edu.ec' && cleanPass === 'MVP';
        
        return isOldAuth || isNewAuth;
    }
}
