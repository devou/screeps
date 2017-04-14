let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.updateWorkState();

        if (creep.memory.work) {
            creep.carrierWork() || creep.builderWork();
        } else {
            creep.harvestClosestSource();
        }
	}
};

module.exports = roleHarvester;