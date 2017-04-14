let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.updateWorkState();

        if (creep.memory.work) {
            creep.carrierWork();
        } else {
            creep.harvestClosestSource();
        }
	}
};

module.exports = roleHarvester;