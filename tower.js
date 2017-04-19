let con = require('constants');

module.exports = {

	towerLogic: function(room=con.room) {
	    let towers = room.find(FIND_STRUCTURES, {filter: st => st.structureType === STRUCTURE_TOWER});
	    for (let tower of towers) {
            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            } else{
                let dStructures = _.sortByOrder(tower.room.find(FIND_STRUCTURES, {
                    filter: structure => (structure.hits <= structure.hitsMax - 900) && structure.hits < 30000
                }), ['hits']);
                if (dStructures.length > 0 && tower.energy > 500) {
                    tower.repair(dStructures[0]);
                }
            }
        }
	}

};
