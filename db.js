const Sequelize = require('sequelize');
const { STRING, TEXT } = Sequelize;
const faker = require('faker');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:JerryPine@localhost/acme_db');


const User = conn.define('user', {
    name: STRING,
    bio: TEXT
}, {
    hooks: {
        beforeCreate: function(user){
            if(!user.bio){
                user.bio = `${user.name}.  ${faker.lorem.paragraphs(3)}. ${user.name}.`;
            }
        }
    }
});

User.creatWithName = (name) => User.create({ name });

const syncAndSeed = async()=> {
    //does this just wipe it clean and let you know you are connected??
    await conn.sync({ force: true});
    const [moe, lucy, curly] = await Promise.all(
        //why don't you need to send the arguemnt??
        ['moe', 'lucy', 'curly'].map(User.creatWithName)
    );
    //console.log(lucy);

}

module.exports = {
    models:  {
        User
    },
    syncAndSeed
};
