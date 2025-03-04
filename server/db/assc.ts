import { ChatsModel } from './chats.db';
import { messagesModel } from './messages.db';

export function setupAssociations() {
    ChatsModel.hasMany(messagesModel, { foreignKey: 'chatKey' });
    messagesModel.belongsTo(ChatsModel, { foreignKey: 'chatKey' });
}