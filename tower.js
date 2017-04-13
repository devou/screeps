module.exports = {

	towerLogic: function() {
        let tower = Game.getObjectById('58e8f3653e5e406873fab189');
        if(tower) {
            let dStructures = _.sortByOrder(tower.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.hits <= structure.hitsMax - 900) && structure.hits < 60000
            }), ['hits']);
            if(dStructures.length > 0 && tower.energy > 500) {
                tower.repair(dStructures[0]);
            }

            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
	}

};
