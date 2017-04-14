let constants = require('constants');

let utils = {

    /**
     * @param {!String} role
     * @param {Boolean} budget
    **/
	createCreep: function(role, budget) {
	    let creepBody = [WORK,CARRY,MOVE];
	    let room = constants.room;
	    let avres = budget ? room.energyAvailable - 200 : room.energyCapacityAvailable - 200;
	    if (!budget && room.energyAvailable < room.energyCapacityAvailable) {
	        return;
	    }
	    let carrys = Math.min(avres/250, 4);
	    let weight = 3;
	    let max = 18;
	    if (role === 'upgrader') {
	        max = 50;
	    }
        for (carrys; carrys > 1; carrys--){
            avres -= 50
            weight += 1;
	        creepBody.push(CARRY);
        }
	    while (avres >= 100 && weight < max) {
	        avres -= 100;
	        weight += 1;
	        creepBody.push(WORK);
	        if (avres >= 50) {
	            avres -= 50;
	            weight += 1;
    	        creepBody.push(MOVE);
    	    }
	    }
        if (avres >= 50) {
	        creepBody.push(MOVE);
	    }

	    let newName = Game.spawns['Spawn1'].createCreep(creepBody, undefined, {role: role});
        console.log(`Spawning new ${role}: ${newName}`);
	}

};

module.exports = utils;