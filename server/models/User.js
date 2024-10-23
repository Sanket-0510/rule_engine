import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../conn.js';
import bcrypt from 'bcrypt';
import { createJwtToken } from '../utils/auth.js';

class User extends Model {

    static async matchPassword(email, password){
        const user = await User.findOne({ where: { email } });
        console.log(user)
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("the result is " + isMatch)    
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = await createJwtToken(user);
        console.log(token)
        return token;
    }

}

function hashPassword(password){
    return bcrypt.hashSync(password, 10);
}

User.init({
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    //user name
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    //user email
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    //user password hash
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
    
}, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    hooks: {
        beforeCreate: (user) => {
            user.password = hashPassword(user.password);
        },
        beforeUpdate: (user, options) => {
            if (user.changed('password')) {
                user.password = hashPassword(user.password);
            }
        }
    }
});



export default User;