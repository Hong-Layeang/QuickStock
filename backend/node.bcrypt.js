import bcrypt from 'bcrypt';

const hashPassword = async (plainPassword) => {
    try {
        /* potential to generate a password hash,
           the higher the better typical range: 10-12 */
        const saltRounds = 10;
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        console.log('Hashed Password:', hash);
        return hash;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
};

export default hashPassword;