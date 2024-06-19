const { sequelize, DataTypes } = require('../db');

const Connection = sequelize.define('Connection', {
    sender: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'userId'
        }
    },
    receiver: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'userId'
        }
    },
    status: {
        type: DataTypes.ENUM('accepted', 'rejected', 'pending'),
        defaultValue: 'pending',
    }
}, {
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['sender', 'receiver']
        }
    ]
});

// Establish associations (defined later)
module.exports = { Connection };
