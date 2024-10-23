import { Sequelize } from 'sequelize';
const sequelize = new Sequelize("postgresql://postgres:zeotap@localhost:5432/zeotap_db", { dialect: 'postgres' });

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('Error: ', err));

export default sequelize;
