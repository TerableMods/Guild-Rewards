module.exports = function GuildRewards(mod) {

    mod.game.initialize("inventory")

    let Check = false;
    let GuildId;
    let loc;
    let w;

    mod.command.add(['gbox', 'rewards'], () => {
        Check = true;

        // Request the Guild quests page
        mod.send('C_REQUEST_GUILD_INFO', 1, {
            guildId: GuildId,
            type: 6
        });
        
    })

    mod.hook('S_GUILD_INFO', 1, (event) => {
        GuildId = event.id;
    })

    mod.hook('S_GUILD_QUEST_LIST', 2, (event) => {
        loc = event.loc;
        w = event.w;
    })

    mod.hook('S_GUILD_QUEST_LIST', 2, (event) => {
        if (Check) {

            event.valderonRewards.forEach(reward => {
                if (reward.completed && !reward.received) {
                    RequestReward(reward.index);
                }
            })
            Check = false;
        }
    })

    function RequestReward(index) {
        mod.send('C_GET_GUILD_QUEST_WEEKLY_REWARD', 1, {
            index: index
        });
        mod.send('C_REQUEST_GUILD_INFO', 1, {
            guildId: GuildId,
            type: 6
        });
    }
}