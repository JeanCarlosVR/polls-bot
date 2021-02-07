export default (_MoyaiLib: any) => {
	Object.defineProperty(_MoyaiLib.Member.prototype, "highestRole", {
		get: function() {
			if(this.roles.length === 0) return this.guild.roles.get(this.guild.id);
			else return this.roleObjects.reduce((prev, role) => !prev || role.higherThan(prev) ? role : prev);
		}
	});
}