let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.updateWorkState();

        if (creep.memory.work) {
            creep.carrierWork() || creep.builderWork() || creep.upgraderWork();
        } else {
            creep.harvestClosestSource();
        }
	}
};

module.exports = roleHarvester;