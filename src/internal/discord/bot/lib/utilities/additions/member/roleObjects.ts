export default (_MoyaiLib: any) => {
	Object.defineProperty(_MoyaiLib.Member.prototype, "roleObjects", {
		get: function() {
			return this.roles.map(roleID => this.guild.roles.get(roleID));
		}
	});
}
