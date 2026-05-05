export class AuthService {
    /**
     * Valida las credenciales estáticas para el MVP.
     */
    static async login(username: string, password: string): Promise<boolean> {
        // En una arquitectura hexagonal real, esto llamaría a un IAuthRepository.
        // Por ahora simulamos la validación con datos quemados (hardcodeados) que no parezcan un "hack".
        // Usuario: admin, Clave: 1234
        return username === 'admin@puce.edu.ec' && password === 'MVP';
    }
}
